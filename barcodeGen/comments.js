// Firebase SDK v10 (CDN) 기반 자체 비회원 댓글 시스템 (스팸/폭탄댓글 방어 + 비밀번호 해싱 + 운영자 전용 대댓글)
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * -------------------------------------------------------------
 * Firebase 설정 (구글 무료 DB)
 * Firebase 콘솔(https://console.firebase.google.com/)에서 프로젝트 생성 후
 * 웹 앱 추가 시 발급되는 config 값을 아래에 넣으시면 됩니다.
 * -------------------------------------------------------------
 */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD0Gtv43CVBXjff5NVUR4FLp4621GHsRQ0",
  authDomain: "mini-toolkit.firebaseapp.com",
  projectId: "mini-toolkit",
  storageBucket: "mini-toolkit.firebasestorage.app",
  messagingSenderId: "805511448383",
  appId: "1:805511448383:web:11be15650c3beefbcbf58a"
};

// 도구 식별자 (나중에 다른 도구가 추가되어도 댓글이 섞이지 않도록 구분)
let TOOL_ID = "barcodeGen";

/**
 * 운영자(관리자) 구글 이메일 목록
 * - 아래 배열에 본인 구글 이메일을 입력하고,
 *   Firebase 콘솔 > Authentication > Sign-in method 에서 Google 로그인을 활성화하세요.
 * - 로그인한 운영자만 댓글에 답글(대댓글)을 달 수 있습니다.
 */
const ADMIN_EMAILS = [
  "jk424485@gmail.com"
];

// 스팸 / 연속·폭탄 댓글 방어 설정
const GUARD_CONFIG = {
  cooldownMs: 30 * 1000,         // 댓글 등록 후 30초 쿨다운
  burstWindowMs: 5 * 60 * 1000,  // 5분 
  burstMaxCount: 3,              // 최대 3개까지 허용
  dailyWindowMs: 24 * 60 * 60 * 1000, // 24시간 내
  dailyMaxCount: 15,             // 최대 15개까지 허용
  minFillTimeMs: 2000,           // 폼 로드 후 최소 2초 경과 필요 (봇 방어)
  minContentLen: 2,
  maxContentLen: 500,
  minPasswordLen: 4,
  maxPasswordLen: 20,
  maxAuthorLen: 20,
  maxUrlCount: 2,                // 링크 3개 이상 포함 시 스팸 차단
  storageKey: `comment_guard_${TOOL_ID}_v1`
};

// 메모리 폴백 (시크릿 모드 등에서 localStorage 차단 시)
let memoryGuardState = { timestamps: [], lastNormalizedContent: "" };

let commentsContainer = document.getElementById("comments");
let setupNotice = document.getElementById("comments-setup");
let activeCleanup = null;

// 설정 누락 여부 확인
const isConfigured = Boolean(FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.apiKey);

const COMMENT_I18N = {
  en: {
    nick: "Nickname (required)",
    pw: "Password 4~20 chars (for delete)",
    submit: "Post Comment",
    body: "Leave a comment without signing in. (Spam/flooding is automatically blocked)",
    loading: "Loading comments...",
    count: (n) => `${n} Comment${n === 1 ? "" : "s"}`,
    empty: "Be the first to leave a comment! ✨",
    admin: "🔐 Admin",
    adminActive: "🛡️ Admin Mode (Logout)",
    adminTitle: "Admin Login",
    adminLogoutTitle: "Click to logout",
    loadErr: "Failed to load comments: "
  },
  zh: {
    nick: "昵称（必填）",
    pw: "密码 4~20位（用于删除）",
    submit: "发布评论",
    body: "无需登录即可自由发表评论。（连续刷屏将被自动拦截）",
    loading: "正在加载评论...",
    count: (n) => `${n} 条评论`,
    empty: "成为第一个发表评论的人吧！✨",
    admin: "🔐 管理员",
    adminActive: "🛡️ 管理员模式（退出）",
    adminTitle: "管理员登录",
    adminLogoutTitle: "点击退出管理员",
    loadErr: "加载评论失败："
  },
  hi: {
    nick: "उपनाम (आवश्यक)",
    pw: "पासवर्ड 4~20 अक्षर (हटाने हेतु)",
    submit: "टिप्पणी पोस्ट करें",
    body: "बिना लॉगिन किए स्वतंत्र रूप से टिप्पणी लिखें। (स्पैम अपने-आप ब्लॉक होता है)",
    loading: "टिप्पणियाँ लोड हो रही हैं...",
    count: (n) => `${n} टिप्पणियाँ`,
    empty: "पहली टिप्पणी करने वाले बनें! ✨",
    admin: "🔐 एडमिन",
    adminActive: "🛡️ एडमिन मोड (लॉगआउट)",
    adminTitle: "एडमिन लॉगिन",
    adminLogoutTitle: "लॉगआउट करने के लिए क्लिक करें",
    loadErr: "टिप्पणियाँ लोड नहीं हो सकीं: "
  },
  es: {
    nick: "Apodo (obligatorio)",
    pw: "Contraseña 4~20 car. (para borrar)",
    submit: "Publicar",
    body: "Deja un comentario sin iniciar sesión. (El spam se bloquea automáticamente)",
    loading: "Cargando comentarios...",
    count: (n) => `${n} Comentario${n === 1 ? "" : "s"}`,
    empty: "¡Sé el primero en comentar! ✨",
    admin: "🔐 Admin",
    adminActive: "🛡️ Modo Admin (Salir)",
    adminTitle: "Acceso de administrador",
    adminLogoutTitle: "Clic para cerrar sesión",
    loadErr: "Error al cargar comentarios: "
  },
  fr: {
    nick: "Pseudo (requis)",
    pw: "Mot de passe 4~20 car. (suppression)",
    submit: "Publier",
    body: "Laissez un commentaire sans connexion. (Le spam est bloqué automatiquement)",
    loading: "Chargement des commentaires...",
    count: (n) => `${n} Commentaire${n > 1 ? "s" : ""}`,
    empty: "Soyez le premier à commenter ! ✨",
    admin: "🔐 Admin",
    adminActive: "🛡️ Mode Admin (Déconnexion)",
    adminTitle: "Connexion administrateur",
    adminLogoutTitle: "Cliquer pour se déconnecter",
    loadErr: "Échec du chargement : "
  },
  ja: {
    nick: "ニックネーム（必須）",
    pw: "パスワード 4~20文字（削除用）",
    submit: "コメント投稿",
    body: "ログイン不要でコメントできます。（スパムは自動ブロックされます）",
    loading: "コメントを読み込み中...",
    count: (n) => `${n} 件のコメント`,
    empty: "最初のコメントを投稿してみましょう！✨",
    admin: "🔐 管理者",
    adminActive: "🛡️ 管理者モード（ログアウト）",
    adminTitle: "管理者ログイン",
    adminLogoutTitle: "クリックしてログアウト",
    loadErr: "読み込みに失敗しました: "
  },
  pt: {
    nick: "Apelido (obrigatório)",
    pw: "Senha 4~20 car. (para excluir)",
    submit: "Enviar Comentário",
    body: "Comente sem precisar fazer login. (Spam é bloqueado automaticamente)",
    loading: "Carregando comentários...",
    count: (n) => `${n} Comentário${n === 1 ? "" : "s"}`,
    empty: "Seja o primeiro a comentar! ✨",
    admin: "🔐 Admin",
    adminActive: "🛡️ Modo Admin (Sair)",
    adminTitle: "Login de Administrador",
    adminLogoutTitle: "Clique para sair",
    loadErr: "Falha ao carregar: "
  },
  de: {
    nick: "Spitzname (erforderlich)",
    pw: "Passwort 4~20 Zeichen (zum Löschen)",
    submit: "Kommentar senden",
    body: "Kommentieren Sie ohne Anmeldung. (Spam wird automatisch blockiert)",
    loading: "Kommentare werden geladen...",
    count: (n) => `${n} Kommentar${n === 1 ? "" : "e"}`,
    empty: "Schreiben Sie den ersten Kommentar! ✨",
    admin: "🔐 Admin",
    adminActive: "🛡️ Admin-Modus (Abmelden)",
    adminTitle: "Admin-Anmeldung",
    adminLogoutTitle: "Zum Abmelden klicken",
    loadErr: "Laden fehlgeschlagen: "
  },
  ko: {
    nick: "닉네임 (필수)",
    pw: "비밀번호 4~20자 (삭제용)",
    submit: "댓글 등록",
    body: "로그인 없이 자유롭게 댓글을 남겨보세요. (연속·도배성 댓글은 자동 차단됩니다)",
    loading: "댓글을 불러오는 중...",
    count: (n) => `댓글 ${n}개`,
    empty: "첫 번째 댓글을 남겨보세요! ✨",
    admin: "🔐 관리자",
    adminActive: "🛡️ 운영자 모드 (로그아웃)",
    adminTitle: "운영자 로그인",
    adminLogoutTitle: "클릭하면 운영자 로그아웃",
    loadErr: "댓글을 불러오지 못했습니다: "
  }
};

function getCommentDict() {
  const lang = window.MiniToolkitI18n ? window.MiniToolkitI18n.getLang() : "ko";
  return COMMENT_I18N[lang] || COMMENT_I18N.en;
}


function mountMiniToolkitComments(targetContainer, targetSetupNotice = null, toolId = "barcodeGen") {
  if (typeof activeCleanup === "function") {
    activeCleanup();
    activeCleanup = null;
  }

  commentsContainer = targetContainer;
  setupNotice = targetSetupNotice;
  TOOL_ID = toolId || "barcodeGen";
  GUARD_CONFIG.storageKey = `comment_guard_${TOOL_ID}_v1`;

  if (!commentsContainer) return;

  if (!isConfigured) {
    if (setupNotice) {
      setupNotice.hidden = false;
      setupNotice.innerHTML = `
        <strong>💡 비회원 댓글을 위한 Firebase 설정이 필요합니다.</strong>
        <span style="margin-top:6px; line-height:1.6;">
          1. <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" style="color:var(--primary); font-weight:600;">Firebase 콘솔</a>에 구글 로그인 후 <b>[프로젝트 만들기]</b> (이름: mini-toolkit)<br>
          2. 좌측 메뉴 <b>[빌드] > [Firestore Database]</b> 클릭 후 <b>[데이터베이스 만들기]</b> (테스트 모드로 시작)<br>
          3. 프로젝트 개요(톱니바퀴) > <b>[프로젝트 설정] > [내 앱] > 웹(&lt;/&gt;)</b> 추가 후 나오는 <code>firebaseConfig</code> 값을 <code>comments.js</code> 상단에 입력하면 끝납니다!
        </span>
      `;
    }
    return;
  }

  activeCleanup = initGuestComments();
}

window.mountMiniToolkitComments = mountMiniToolkitComments;
window.dispatchEvent(new CustomEvent("mini-toolkit-comments-ready"));

if (commentsContainer) {
  const initialToolId = commentsContainer.dataset.toolId || "barcodeGen";
  mountMiniToolkitComments(commentsContainer, setupNotice, initialToolId);
}

function isAllowedAdminEmail(email) {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((item) => item.trim().toLowerCase() === normalized);
}

function initGuestComments() {
  if (setupNotice) setupNotice.hidden = true;

  const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const formInitAt = Date.now();
  let latestDocs = [];
  let hasLoadedSnapshot = false;
  let cooldownTimerId = null;
  let activeReplyParentId = null;
  let isAdmin = false;

  const d0 = getCommentDict();
  // UI 생성 (허니팟 필드 포함)
  commentsContainer.innerHTML = `
    <div class="guest-comment-box">
      <form id="commentForm" class="comment-form" novalidate>
        <div class="comment-hp-field" aria-hidden="true">
          <label for="websiteHp">Website</label>
          <input type="text" id="websiteHp" name="website" tabindex="-1" autocomplete="off" />
        </div>
        <div class="form-row">
          <input type="text" id="authorInput" class="text-input" placeholder="${d0.nick}" maxlength="${GUARD_CONFIG.maxAuthorLen}" required />
          <input type="password" id="pwInput" class="text-input" placeholder="${d0.pw}" minlength="${GUARD_CONFIG.minPasswordLen}" maxlength="${GUARD_CONFIG.maxPasswordLen}" required />
          <button type="submit" id="submitCommentBtn" class="btn btn-primary">${d0.submit}</button>
        </div>
        <div class="form-row" style="margin-top:8px;">
          <textarea id="contentInput" class="text-input comment-textarea" rows="3" placeholder="${d0.body}" maxlength="${GUARD_CONFIG.maxContentLen}" required></textarea>
        </div>
        <div class="comment-form-footer">
          <span id="commentNotice" class="comment-notice" role="status" aria-live="polite"></span>
          <span id="commentCharCount" class="comment-char-count">0 / ${GUARD_CONFIG.maxContentLen}</span>
        </div>
      </form>

      <div class="comments-list-header">
        <span id="commentCount">${d0.count(0)}</span>
        <button type="button" id="adminAuthBtn" class="btn-admin-auth" title="${d0.adminTitle}">${d0.admin}</button>
      </div>

      <div id="commentsList" class="comments-list">
        <div class="comment-loading">${d0.loading}</div>
      </div>
    </div>
  `;

  const commentForm = document.getElementById("commentForm");
  const websiteHp = document.getElementById("websiteHp");
  const authorInput = document.getElementById("authorInput");
  const pwInput = document.getElementById("pwInput");
  const contentInput = document.getElementById("contentInput");
  const submitBtn = document.getElementById("submitCommentBtn");
  const commentNotice = document.getElementById("commentNotice");
  const charCountEl = document.getElementById("commentCharCount");
  const commentsList = document.getElementById("commentsList");
  const commentCount = document.getElementById("commentCount");
  const adminAuthBtn = document.getElementById("adminAuthBtn");

  function showNotice(msg, type = "error") {
    commentNotice.textContent = msg;
    commentNotice.className = `comment-notice ${msg ? `is-${type}` : ""}`;
  }

  function updateCharCount() {
    const len = sanitizeText(contentInput.value).length;
    charCountEl.textContent = `${len} / ${GUARD_CONFIG.maxContentLen}`;
  }

  contentInput.addEventListener("input", () => {
    updateCharCount();
    if (commentNotice.classList.contains("is-error")) {
      showNotice("");
    }
  });

  function updateAdminButton() {
    const d = getCommentDict();
    if (isAdmin) {
      adminAuthBtn.textContent = d.adminActive;
      adminAuthBtn.classList.add("is-active");
      adminAuthBtn.title = d.adminLogoutTitle;
    } else {
      adminAuthBtn.textContent = d.admin;
      adminAuthBtn.classList.remove("is-active");
      adminAuthBtn.title = d.adminTitle;
    }
  }

  adminAuthBtn.addEventListener("click", async () => {
    if (isAdmin) {
      await signOut(auth);
      activeReplyParentId = null;
      showNotice("운영자 모드에서 로그아웃되었습니다.", "info");
      return;
    }

    if (ADMIN_EMAILS.length === 0) {
      showNotice("comments.js 상단의 ADMIN_EMAILS에 운영자 구글 이메일을 먼저 등록해주세요.", "error");
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!isAllowedAdminEmail(result.user?.email)) {
        await signOut(auth);
        showNotice("등록된 운영자 계정이 아닙니다.", "error");
      } else {
        showNotice("운영자 모드로 로그인되었습니다. 이제 댓글에 답글을 달 수 있습니다.", "info");
      }
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        showNotice(`운영자 로그인 실패: ${err.message}`, "error");
      }
    }
  });

  const unsubAuth = onAuthStateChanged(auth, async (user) => {
    if (user && !isAllowedAdminEmail(user.email)) {
      await signOut(auth);
      isAdmin = false;
    } else {
      isAdmin = Boolean(user && isAllowedAdminEmail(user.email));
    }

    if (!isAdmin) {
      activeReplyParentId = null;
    }

    updateAdminButton();
    if (hasLoadedSnapshot) {
      renderComments();
    }
  });

  function startCooldown(untilMs) {
    if (cooldownTimerId) {
      clearInterval(cooldownTimerId);
      cooldownTimerId = null;
    }

    const tick = () => {
      const remainSec = Math.ceil((untilMs - Date.now()) / 1000);
      if (remainSec <= 0) {
        clearInterval(cooldownTimerId);
        cooldownTimerId = null;
        submitBtn.disabled = false;
        submitBtn.textContent = "댓글 등록";
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = `${remainSec}초 후 가능`;
    };

    tick();
    cooldownTimerId = setInterval(tick, 500);
  }

  // 새로고침 후에도 남은 쿨다운이 있으면 버튼 잠금 복원
  const initialGuard = loadGuardState();
  const lastTs = initialGuard.timestamps[initialGuard.timestamps.length - 1] || 0;
  if (lastTs && Date.now() - lastTs < GUARD_CONFIG.cooldownMs) {
    startCooldown(lastTs + GUARD_CONFIG.cooldownMs);
  }

  // tool 조건만 걸고, 정렬은 클라이언트에서 처리하여 Firestore 색인(Index) 오류 방지
  const q = query(
    collection(db, "comments"),
    where("tool", "==", TOOL_ID)
  );

  const unsubSnapshot = onSnapshot(q, (snapshot) => {
    latestDocs = snapshot.docs;
    hasLoadedSnapshot = true;
    renderComments();
  }, (err) => {
    console.error("Firestore 에러 상세:", err);
    commentsList.innerHTML = "";
    const errEl = document.createElement("div");
    errEl.className = "comment-error";
    errEl.textContent = `댓글을 불러오지 못했습니다: ${err.message}`;
    commentsList.appendChild(errEl);
  });

  function formatCommentDate(createdAt) {
    return createdAt
      ? new Date(createdAt.toDate()).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })
      : "방금 전";
  }

  function createCommentNode({ docId, data, isReply = false, rootParentId = null }) {
    const item = document.createElement("div");
    item.className = isReply ? "comment-reply-item" : "comment-item";

    const header = document.createElement("div");
    header.className = "comment-item-header";

    const authorEl = document.createElement("span");
    authorEl.className = "comment-author";
    authorEl.textContent = data.author || "익명";
    header.appendChild(authorEl);

    if (data.isAdmin) {
      const badge = document.createElement("span");
      badge.className = "comment-admin-badge";
      badge.textContent = "운영자";
      header.appendChild(badge);
    }

    const dateEl = document.createElement("span");
    dateEl.className = "comment-date";
    dateEl.textContent = formatCommentDate(data.createdAt);
    header.appendChild(dateEl);

    // 운영자만 답글 버튼 노출
    if (isAdmin && docId) {
      const targetParentId = rootParentId || docId;
      const replyBtn = document.createElement("button");
      replyBtn.type = "button";
      replyBtn.className = "btn-reply";
      replyBtn.textContent = activeReplyParentId === targetParentId && !isReply ? "닫기" : "답글";
      replyBtn.addEventListener("click", () => {
        activeReplyParentId = (activeReplyParentId === targetParentId && !isReply) ? null : targetParentId;
        renderComments();
      });
      header.appendChild(replyBtn);
    }

    if (docId) {
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn-del";
      delBtn.title = "삭제";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => handleDeleteComment(docId, data));
      header.appendChild(delBtn);
    }

    const contentEl = document.createElement("div");
    contentEl.className = "comment-item-content";
    contentEl.textContent = data.content || "";

    item.append(header, contentEl);
    return item;
  }

  function createInlineReplyForm(parentId) {
    const form = document.createElement("form");
    form.className = "reply-form";
    form.noValidate = true;

    const row = document.createElement("div");
    row.className = "reply-form-row";

    const nickInput = document.createElement("input");
    nickInput.type = "text";
    nickInput.className = "text-input reply-author-input";
    nickInput.value = "운영자";
    nickInput.maxLength = GUARD_CONFIG.maxAuthorLen;
    nickInput.placeholder = "운영자 닉네임";
    nickInput.required = true;

    const submitReplyBtn = document.createElement("button");
    submitReplyBtn.type = "submit";
    submitReplyBtn.className = "btn btn-primary btn-sm";
    submitReplyBtn.textContent = "답글 등록";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn btn-sm btn-cancel";
    cancelBtn.textContent = "취소";
    cancelBtn.addEventListener("click", () => {
      activeReplyParentId = null;
      renderComments();
    });

    row.append(nickInput, submitReplyBtn, cancelBtn);

    const textarea = document.createElement("textarea");
    textarea.className = "text-input reply-textarea";
    textarea.rows = 2;
    textarea.maxLength = GUARD_CONFIG.maxContentLen;
    textarea.placeholder = "운영자 답글을 입력하세요...";
    textarea.required = true;

    const noticeEl = document.createElement("div");
    noticeEl.className = "comment-notice";

    form.append(row, textarea, noticeEl);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!isAdmin) {
        noticeEl.textContent = "운영자 권한이 필요합니다.";
        noticeEl.className = "comment-notice is-error";
        return;
      }

      const author = sanitizeText(nickInput.value) || "운영자";
      const content = sanitizeText(textarea.value);

      if (content.length < GUARD_CONFIG.minContentLen || content.length > GUARD_CONFIG.maxContentLen) {
        noticeEl.textContent = `답글은 ${GUARD_CONFIG.minContentLen}~${GUARD_CONFIG.maxContentLen}자로 입력해주세요.`;
        noticeEl.className = "comment-notice is-error";
        return;
      }

      submitReplyBtn.disabled = true;
      submitReplyBtn.textContent = "등록 중...";

      try {
        await addDoc(collection(db, "comments"), {
          tool: TOOL_ID,
          parentId,
          isAdmin: true,
          adminUid: auth.currentUser?.uid || "",
          author,
          password: "",
          content,
          createdAt: serverTimestamp()
        });
        activeReplyParentId = null;
        showNotice("운영자 답글이 등록되었습니다.", "info");
      } catch (err) {
        noticeEl.textContent = `답글 등록 실패: ${err.message}`;
        noticeEl.className = "comment-notice is-error";
        submitReplyBtn.disabled = false;
        submitReplyBtn.textContent = "답글 등록";
      }
    });

    // 폼 렌더링 직후 입력 포커스
    requestAnimationFrame(() => textarea.focus());
    return form;
  }

  function renderComments() {
    const d = getCommentDict();
    commentsList.innerHTML = "";
    commentCount.textContent = d.count(latestDocs.length);

    if (latestDocs.length === 0) {
      const emptyEl = document.createElement("div");
      emptyEl.className = "comment-empty";
      emptyEl.textContent = d.empty;
      commentsList.appendChild(emptyEl);
      return;
    }

    const topLevelDocs = [];
    const repliesByParent = new Map();

    latestDocs.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.parentId) {
        const list = repliesByParent.get(data.parentId) || [];
        list.push(docSnap);
        repliesByParent.set(data.parentId, list);
      } else {
        topLevelDocs.push(docSnap);
      }
    });

    // 원댓글: 최신순 정렬
    topLevelDocs.sort((a, b) => {
      const timeA = a.data().createdAt?.toMillis() || 0;
      const timeB = b.data().createdAt?.toMillis() || 0;
      return timeB - timeA;
    });

    const renderedParentIds = new Set();

    const appendThread = (parentId, parentData) => {
      renderedParentIds.add(parentId);
      const item = createCommentNode({ docId: parentData ? parentId : null, data: parentData || { author: "알림", content: "삭제된 댓글입니다." } });

      const replies = (repliesByParent.get(parentId) || []).sort((a, b) => {
        const timeA = a.data().createdAt?.toMillis() || 0;
        const timeB = b.data().createdAt?.toMillis() || 0;
        return timeA - timeB; // 답글은 작성순
      });

      if (replies.length > 0) {
        const repliesWrap = document.createElement("div");
        repliesWrap.className = "comment-replies";
        replies.forEach((replySnap) => {
          repliesWrap.appendChild(
            createCommentNode({
              docId: replySnap.id,
              data: replySnap.data(),
              isReply: true,
              rootParentId: parentId
            })
          );
        });
        item.appendChild(repliesWrap);
      }

      if (isAdmin && activeReplyParentId === parentId) {
        item.appendChild(createInlineReplyForm(parentId));
      }

      commentsList.appendChild(item);
    };

    topLevelDocs.forEach((docSnap) => {
      appendThread(docSnap.id, docSnap.data());
    });

    // 원댓글이 삭제되었지만 답글이 남아있는 경우 유실 방지
    repliesByParent.forEach((_, parentId) => {
      if (!renderedParentIds.has(parentId)) {
        appendThread(parentId, null);
      }
    });
  }

  async function handleDeleteComment(docId, data) {
    if (isAdmin) {
      if (!confirm("운영자 권한으로 이 댓글을 삭제하시겠습니까?")) return;
      try {
        await deleteDoc(doc(db, "comments", docId));
        showNotice("댓글이 삭제되었습니다.", "info");
      } catch (err) {
        alert("삭제 실패: " + err.message);
      }
      return;
    }

    if (data.isAdmin) {
      alert("운영자 댓글은 삭제할 수 없습니다.");
      return;
    }

    const inputPw = prompt("댓글 작성 시 설정한 비밀번호를 입력하세요:");
    if (!inputPw) return;

    const matched = await verifyPassword(inputPw.trim(), data.password);
    if (!matched) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await deleteDoc(doc(db, "comments", docId));
      showNotice("댓글이 삭제되었습니다.", "info");
    } catch (err) {
      alert("삭제 실패: " + err.message);
    }
  }

  // 일반 댓글 등록 처리
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showNotice("");

    const author = sanitizeText(authorInput.value);
    const password = pwInput.value.trim();
    const content = sanitizeText(contentInput.value);
    const honeypot = websiteHp.value.trim();

    const check = validateCommentSubmission({
      author,
      password,
      content,
      honeypot,
      formInitAt,
      recentDocs: latestDocs,
      bypassRateLimit: isAdmin
    });

    if (!check.ok) {
      if (check.silent) {
        contentInput.value = "";
        updateCharCount();
        return;
      }
      showNotice(check.reason, "error");
      if (check.cooldownUntil) {
        startCooldown(check.cooldownUntil);
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "등록 중...";

    try {
      const hashedPassword = await hashPassword(password);
      await addDoc(collection(db, "comments"), {
        tool: TOOL_ID,
        parentId: null,
        isAdmin: false,
        author,
        password: hashedPassword,
        content,
        createdAt: serverTimestamp()
      });

      const now = Date.now();
      if (!isAdmin) {
        const guard = loadGuardState();
        guard.timestamps.push(now);
        guard.lastNormalizedContent = normalizeForDuplicate(content);
        saveGuardState(guard);
      }

      contentInput.value = "";
      pwInput.value = "";
      updateCharCount();
      showNotice("댓글이 등록되었습니다.", "info");

      if (!isAdmin) {
        startCooldown(now + GUARD_CONFIG.cooldownMs);
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = "댓글 등록";
      }
    } catch (err) {
      showNotice("댓글 등록에 실패했습니다: " + err.message, "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "댓글 등록";
    }
  });

  const onLangChange = () => {
    const d = getCommentDict();
    authorInput.placeholder = d.nick;
    pwInput.placeholder = d.pw;
    contentInput.placeholder = d.body;
    if (!submitBtn.disabled) submitBtn.textContent = d.submit;
    updateAdminButton();
    if (hasLoadedSnapshot) renderComments();
    else commentCount.textContent = d.count(0);
  };
  window.addEventListener("mini-toolkit-lang-change", onLangChange);

  return () => {
    window.removeEventListener("mini-toolkit-lang-change", onLangChange);
    if (typeof unsubAuth === "function") unsubAuth();
    if (typeof unsubSnapshot === "function") unsubSnapshot();
    if (cooldownTimerId) {
      clearInterval(cooldownTimerId);
      cooldownTimerId = null;
    }
  };
}

/**
 * 스팸, 봇, 연속·폭탄 댓글 종합 검증
 */
function validateCommentSubmission({ author, password, content, honeypot, formInitAt, recentDocs, bypassRateLimit = false }) {
  // 1. 허니팟(숨겨진 필드)에 값이 채워져 있으면 자동화 봇으로 판단
  if (honeypot.length > 0) {
    return { ok: false, silent: true };
  }

  // 2. 페이지 로드 후 너무 빠른 제출 차단 (봇 방어)
  if (!bypassRateLimit && Date.now() - formInitAt < GUARD_CONFIG.minFillTimeMs) {
    return { ok: false, reason: "너무 빠르게 제출되었습니다. 잠시 후 다시 시도해주세요." };
  }

  // 3. 기본 필드 유효성 검증
  if (!author || author.length > GUARD_CONFIG.maxAuthorLen) {
    return { ok: false, reason: `닉네임은 1~${GUARD_CONFIG.maxAuthorLen}자로 입력해주세요.` };
  }
  if (password.length < GUARD_CONFIG.minPasswordLen || password.length > GUARD_CONFIG.maxPasswordLen) {
    return { ok: false, reason: `비밀번호는 ${GUARD_CONFIG.minPasswordLen}~${GUARD_CONFIG.maxPasswordLen}자로 입력해주세요.` };
  }
  if (content.length < GUARD_CONFIG.minContentLen || content.length > GUARD_CONFIG.maxContentLen) {
    return { ok: false, reason: `댓글 내용은 ${GUARD_CONFIG.minContentLen}~${GUARD_CONFIG.maxContentLen}자로 입력해주세요.` };
  }

  if (bypassRateLimit) {
    return { ok: true };
  }

  // 4. 도배성 패턴(동일 문자 10회 이상 연속 반복) 차단
  if (/(.)\1{9,}/.test(content)) {
    return { ok: false, reason: "같은 문자를 과도하게 반복한 댓글은 등록할 수 없습니다." };
  }

  // 5. 과도한 링크(URL) 스팸 차단
  const urlMatches = content.match(/(https?:\/\/|www\.)/gi);
  if (urlMatches && urlMatches.length > GUARD_CONFIG.maxUrlCount) {
    return { ok: false, reason: `스팸 방지를 위해 링크는 최대 ${GUARD_CONFIG.maxUrlCount}개까지만 포함할 수 있습니다.` };
  }

  // 6. Rate Limit (쿨다운 / 5분 폭탄 제한 / 24시간 일일 제한)
  const now = Date.now();
  const guard = loadGuardState();
  const lastTs = guard.timestamps[guard.timestamps.length - 1] || 0;

  if (lastTs && now - lastTs < GUARD_CONFIG.cooldownMs) {
    const waitSec = Math.ceil((GUARD_CONFIG.cooldownMs - (now - lastTs)) / 1000);
    return {
      ok: false,
      reason: `연속 댓글 방지를 위해 ${waitSec}초 후에 다시 등록할 수 있습니다.`,
      cooldownUntil: lastTs + GUARD_CONFIG.cooldownMs
    };
  }

  const burstCount = guard.timestamps.filter((ts) => now - ts < GUARD_CONFIG.burstWindowMs).length;
  if (burstCount >= GUARD_CONFIG.burstMaxCount) {
    return {
      ok: false,
      reason: `짧은 시간 내 댓글 등록이 너무 많습니다. (5분당 최대 ${GUARD_CONFIG.burstMaxCount}개)`
    };
  }

  if (guard.timestamps.length >= GUARD_CONFIG.dailyMaxCount) {
    return {
      ok: false,
      reason: `하루 최대 댓글 등록 횟수(${GUARD_CONFIG.dailyMaxCount}개)를 초과했습니다.`
    };
  }

  // 7. 동일 내용 중복 등록 차단 (직전 등록 내용 + 최근 5분 내 서버 댓글)
  const normalized = normalizeForDuplicate(content);
  if (guard.lastNormalizedContent && guard.lastNormalizedContent === normalized) {
    return { ok: false, reason: "방금 등록한 댓글과 동일한 내용은 연속으로 등록할 수 없습니다." };
  }

  const hasRecentDuplicate = recentDocs.some((docSnap) => {
    const d = docSnap.data();
    const createdMs = d.createdAt?.toMillis?.() || 0;
    const isRecent = now - createdMs < GUARD_CONFIG.burstWindowMs;
    return isRecent && normalizeForDuplicate(d.content || "") === normalized;
  });
  if (hasRecentDuplicate) {
    return { ok: false, reason: "최근 등록된 댓글과 동일한 내용이 이미 존재합니다." };
  }

  return { ok: true };
}

function loadGuardState() {
  const now = Date.now();
  const prune = (state) => ({
    timestamps: (Array.isArray(state.timestamps) ? state.timestamps : [])
      .filter((ts) => typeof ts === "number" && now - ts < GUARD_CONFIG.dailyWindowMs),
    lastNormalizedContent: typeof state.lastNormalizedContent === "string" ? state.lastNormalizedContent : ""
  });

  try {
    const raw = localStorage.getItem(GUARD_CONFIG.storageKey);
    if (!raw) return prune(memoryGuardState);
    const parsed = prune(JSON.parse(raw));
    memoryGuardState = parsed;
    return parsed;
  } catch {
    return prune(memoryGuardState);
  }
}

function saveGuardState(state) {
  const cleaned = {
    timestamps: state.timestamps.filter((ts) => Date.now() - ts < GUARD_CONFIG.dailyWindowMs),
    lastNormalizedContent: state.lastNormalizedContent || ""
  };
  memoryGuardState = cleaned;
  try {
    localStorage.setItem(GUARD_CONFIG.storageKey, JSON.stringify(cleaned));
  } catch {
    // localStorage 사용 불가 환경에서는 메모리 상태만 유지
  }
}

function sanitizeText(str) {
  if (!str) return "";
  // 제로 너비 문자 및 제어 문자(줄바꿈/탭 제외) 제거
  return str
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

function normalizeForDuplicate(str) {
  return sanitizeText(str).replace(/\s+/g, "").toLowerCase();
}

function generateSalt(byteLength = 8) {
  const bytes = new Uint8Array(byteLength);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < byteLength; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(text) {
  if (window.crypto?.subtle) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Web Crypto 미지원(비보안 컨텍스트 등) 폴백 해시
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

async function hashPassword(password, existingSalt = null) {
  const salt = existingSalt || generateSalt();
  const hex = await sha256Hex(`${salt}:${password}`);
  return `sha256:${salt}:${hex}`;
}

async function verifyPassword(inputPw, storedPw) {
  if (!storedPw) return false;
  if (typeof storedPw === "string" && storedPw.startsWith("sha256:")) {
    const parts = storedPw.split(":");
    if (parts.length !== 3) return false;
    const [, salt] = parts;
    const expected = await hashPassword(inputPw, salt);
    return expected === storedPw;
  }
  // 기존 평문 저장 댓글과의 하위 호환성 유지
  return storedPw === inputPw;
}
