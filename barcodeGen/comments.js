// Firebase SDK v10 (CDN) 기반 자체 비회원 댓글 시스템
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const TOOL_ID = "barcodeGen";

const commentsContainer = document.getElementById("comments");
const setupNotice = document.getElementById("comments-setup");

// 설정 누락 여부 확인
const isConfigured = Boolean(FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.apiKey);

if (!isConfigured) {
  if (setupNotice) {
    setupNotice.hidden = false;
    setupNotice.innerHTML = `
      <strong>💡 비회원 댓글을 위한 Firebase 설정이 필요합니다.</strong>
      <span style="margin-top:6px; line-height:1.6;">
        1. <a href="https://console.firebase.google.com/" target="_blank" style="color:var(--primary); font-weight:600;">Firebase 콘솔</a>에 구글 로그인 후 <b>[프로젝트 만들기]</b> (이름: mini-toolkit)<br>
        2. 좌측 메뉴 <b>[빌드] > [Firestore Database]</b> 클릭 후 <b>[데이터베이스 만들기]</b> (테스트 모드로 시작)<br>
        3. 프로젝트 개요(톱니바퀴) > <b>[프로젝트 설정] > [내 앱] > 웹(&lt;/&gt;)</b> 추가 후 나오는 <code>firebaseConfig</code> 값을 <code>comments.js</code> 상단에 입력하면 끝납니다!
      </span>
    `;
  }
} else {
  initGuestComments();
}

function initGuestComments() {
  if (setupNotice) setupNotice.hidden = true;

  // Firebase 초기화
  const app = initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);

  // UI 생성
  commentsContainer.innerHTML = `
    <div class="guest-comment-box">
      <form id="commentForm" class="comment-form">
        <div class="form-row">
          <input type="text" id="authorInput" class="text-input" placeholder="닉네임 (필수)" maxlength="20" required />
          <input type="password" id="pwInput" class="text-input" placeholder="비밀번호 4자리 (삭제용)" maxlength="20" required />
          <button type="submit" id="submitCommentBtn" class="btn btn-primary">댓글 등록</button>
        </div>
        <div class="form-row" style="margin-top:8px;">
          <textarea id="contentInput" class="text-input comment-textarea" rows="3" placeholder="로그인 없이 자유롭게 댓글을 남겨보세요." maxlength="500" required></textarea>
        </div>
      </form>

      <div class="comments-list-header">
        <span id="commentCount">댓글 0개</span>
      </div>

      <div id="commentsList" class="comments-list">
        <div class="comment-loading">댓글을 불러오는 중...</div>
      </div>
    </div>
  `;

  const commentForm = document.getElementById("commentForm");
  const authorInput = document.getElementById("authorInput");
  const pwInput = document.getElementById("pwInput");
  const contentInput = document.getElementById("contentInput");
  const submitBtn = document.getElementById("submitCommentBtn");
  const commentsList = document.getElementById("commentsList");
  const commentCount = document.getElementById("commentCount");

  // 실시간 댓글 목록 구독 (onSnapshot)
  const q = query(
    collection(db, "comments"),
    where("tool", "==", TOOL_ID),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    commentsList.innerHTML = "";
    commentCount.textContent = `댓글 ${snapshot.docs.length}개`;

    if (snapshot.empty) {
      commentsList.innerHTML = `<div class="comment-empty">첫 번째 댓글을 남겨보세요! ✨</div>`;
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;
      const dateStr = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString("ko-KR", {
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
      }) : "방금 전";

      const item = document.createElement("div");
      item.className = "comment-item";
      item.innerHTML = `
        <div class="comment-item-header">
          <span class="comment-author">${escapeHtml(data.author)}</span>
          <span class="comment-date">${dateStr}</span>
          <button type="button" class="btn-del" data-id="${docId}" title="삭제">✕</button>
        </div>
        <div class="comment-item-content">${escapeHtml(data.content).replace(/\n/g, '<br/>')}</div>
      `;
      commentsList.appendChild(item);
    });

    // 삭제 버튼 이벤트
    commentsList.querySelectorAll(".btn-del").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const docId = btn.dataset.id;
        const inputPw = prompt("댓글 작성 시 설정한 비밀번호를 입력하세요:");
        if (!inputPw) return;

        const targetDoc = snapshot.docs.find(d => d.id === docId);
        if (targetDoc && targetDoc.data().password === inputPw) {
          try {
            await deleteDoc(doc(db, "comments", docId));
            alert("댓글이 삭제되었습니다.");
          } catch (err) {
            alert("삭제 실패: " + err.message);
          }
        } else {
          alert("비밀번호가 일치하지 않습니다.");
        }
      });
    });
  }, (err) => {
    console.error(err);
    commentsList.innerHTML = `<div class="comment-error">댓글을 불러오지 못했습니다. Firestore 규칙을 확인해주세요.</div>`;
  });

  // 댓글 등록 처리
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const author = authorInput.value.trim();
    const password = pwInput.value.trim();
    const content = contentInput.value.trim();

    if (!author || !password || !content) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "등록 중...";

    try {
      await addDoc(collection(db, "comments"), {
        tool: TOOL_ID,
        author: author,
        password: password,
        content: content,
        createdAt: serverTimestamp()
      });

      contentInput.value = "";
      pwInput.value = "";
    } catch (err) {
      alert("댓글 등록에 실패했습니다: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "댓글 등록";
    }
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[m]);
}
