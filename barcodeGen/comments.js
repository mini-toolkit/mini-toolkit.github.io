/**
 * 댓글 설정
 * ------------------------------------------------------------
 * provider: 'giscus' 또는 'disqus'
 *
 * [Giscus] GitHub Discussions 기반 · 무료 · 광고 없음 (댓글 작성 시 GitHub 로그인 필요)
 *   1) 공개(public) GitHub 저장소에서 Settings > Features > Discussions 활성화
 *   2) https://github.com/apps/giscus 앱을 해당 저장소에 설치
 *   3) https://giscus.app/ko 에서 저장소 입력 → 생성된 data-repo-id, data-category-id 값을 아래에 입력
 *
 * [Disqus] 소셜/이메일/게스트 댓글 지원 (무료 플랜은 광고 포함)
 *   1) https://disqus.com 에서 사이트 등록 → shortname 확인 후 아래에 입력
 */
const COMMENTS_CONFIG = {
  provider: 'giscus',

  giscus: {
    repo: 'mini-toolkit/mini-toolkit.github.io',
    repoId: 'R_kgDOVvuNTA',
    category: 'General',
    categoryId: 'DIC_kwDOVvuNTM4DLSa1',
    mapping: 'specific',
    term: 'barcodeGen', // 이 도구 전용 댓글 스레드 이름 (도구마다 다르게)
    theme: 'light',
    lang: 'ko'
  },

  disqus: {
    shortname: ''      // 예: 'my-barcode-gen'
  }
};

(() => {
  'use strict';

  const container = document.getElementById('comments');
  const setupNotice = document.getElementById('comments-setup');
  const cfg = COMMENTS_CONFIG;

  function showSetup() {
    setupNotice.hidden = false;
  }

  function loadGiscus(g) {
    if (!g.repo || !g.repoId || !g.categoryId) return showSetup();
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    const attrs = {
      'data-repo': g.repo,
      'data-repo-id': g.repoId,
      'data-category': g.category,
      'data-category-id': g.categoryId,
      'data-mapping': g.mapping,
      ...(g.mapping === 'specific' && g.term ? { 'data-term': g.term } : {}),
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-theme': g.theme,
      'data-lang': g.lang,
      'data-loading': 'lazy'
    };
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    container.appendChild(s);
  }

  function loadDisqus(d) {
    if (!d.shortname) return showSetup();
    container.id = 'disqus_thread';
    window.disqus_config = function () {
      this.page.url = location.origin + location.pathname;
      this.page.identifier = location.pathname;
    };
    const s = document.createElement('script');
    s.src = `https://${d.shortname}.disqus.com/embed.js`;
    s.setAttribute('data-timestamp', String(Date.now()));
    s.async = true;
    document.body.appendChild(s);
  }

  if (location.protocol === 'file:') {
    setupNotice.hidden = false;
    setupNotice.querySelector('span').textContent =
      '댓글은 웹 서버(예: python -m http.server 또는 GitHub Pages)로 접속했을 때만 표시됩니다.';
    return;
  }

  if (cfg.provider === 'disqus') loadDisqus(cfg.disqus);
  else loadGiscus(cfg.giscus);
})();
