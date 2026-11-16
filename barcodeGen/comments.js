// Firebase SDK v10 (CDN) 기반 자체 비회원 댓글 시스템
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD0Gtv43CVBXjff5NVUR4FLp4621GHsRQ0",
  authDomain: "mini-toolkit.firebaseapp.com",
  projectId: "mini-toolkit",
  storageBucket: "mini-toolkit.firebasestorage.app",
  messagingSenderId: "805511448383",
  appId: "1:805511448383:web:11be15650c3beefbcbf58a"
};

const TOOL_ID = "barcodeGen";

const commentsContainer = document.getElementById("comments");
const setupNotice = document.getElementById("comments-setup");

const isConfigured = Boolean(FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.apiKey);

if (!isConfigured) {
  if (setupNotice) setupNotice.hidden = false;
} else {
  initGuestComments();
}

function initGuestComments() {
  if (setupNotice) setupNotice.hidden = true;

  const app = initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);

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

  const q = query(
    collection(db, "comments"),
    where("tool", "==", TOOL_ID)
  );

  onSnapshot(q, (snapshot) => {
    commentsList.innerHTML = "";
    commentCount.textContent = `댓글 ${snapshot.docs.length}개`;

    if (snapshot.empty) {
      commentsList.innerHTML = `<div class="comment-empty">첫 번째 댓글을 남겨보세요! ✨</div>`;
      return;
    }

    const docs = [...snapshot.docs].sort((a, b) => {
      const timeA = a.data().createdAt?.toMillis() || 0;
      const timeB = b.data().createdAt?.toMillis() || 0;
      return timeB - timeA;
    });

    docs.forEach((docSnap) => {
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
    console.error("Firestore 에러 상세:", err);
    commentsList.innerHTML = `<div class="comment-error">댓글을 불러오지 못했습니다: ${err.message}</div>`;
  });

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
