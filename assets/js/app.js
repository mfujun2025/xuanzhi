/* ============================================================
   宣纸.中国 — 通用脚本
   导航交互 / 滚动揭示 / 移动端筛选抽屉 / 工具函数
   ============================================================ */

(function () {
  'use strict';

  /* ---- 工具函数 ---- */
  function qs(s, el) { return (el || document).querySelector(s); }
  function qsa(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }

  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function yuan(n) { return '¥' + Number(n).toFixed(0); }

  /* ---- 导航：汉堡菜单 ---- */
  function initNav() {
    var btn = qs('#navToggle');
    var links = qs('#navLinks');
    if (!btn || !links) return;
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    /* 点击链接后自动收起 */
    qsa('a', links).forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- 滚动揭示（三保险降级） ---- */
  function initReveal() {
    var els = qsa('.rv');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
    /* 兜底：3 秒后强制显示 */
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add('in'); });
    }, 3000);
  }

  /* ---- 移动端筛选抽屉 ---- */
  function initFilterDrawer() {
    var openBtn = qs('[data-filter-open]');
    var panel = qs('#filterPanel');
    var overlay = qs('#filterOverlay');
    var closeBtn = qs('[data-filter-close]');
    if (!openBtn || !panel) return;

    function open() { panel.classList.add('open'); if (overlay) overlay.classList.add('show'); }
    function close() { panel.classList.remove('open'); if (overlay) overlay.classList.remove('show'); }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
  }

  /* ---- 数量输入框：回车确认 ---- */
  function initQtyInputs() {
    qsa('input[type="number"]').forEach(function (inp) {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var id = inp.getAttribute('data-id');
          var val = parseInt(inp.value) || 1;
          if (id && window.XZCart) XZCart.setQty(id, val);
        }
      });
    });
  }

  /* ---- 表单校验 ---- */
  function initFormValidation() {
    qsa('form[data-validate]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var valid = true;
        qsa('[required]', form).forEach(function (field) {
          var group = field.closest('.form-group');
          if (!field.value.trim()) {
            valid = false;
            if (group) group.classList.add('has-error');
          } else {
            if (group) group.classList.remove('has-error');
          }
          /* 手机号校验 */
          if (field.name === 'phone' && field.value.trim() && !/^1[3-9]\d{9}$/.test(field.value.trim())) {
            valid = false;
            if (group) group.classList.add('has-error');
            if (group && !group.querySelector('.form-error')) {
              var err = document.createElement('div');
              err.className = 'form-error';
              err.textContent = '请输入有效的手机号';
              group.appendChild(err);
            }
          }
        });
        if (!valid) {
          e.preventDefault();
          var firstErr = qs('.has-error', form);
          if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      /* 输入时清除错误 */
      qsa('[required]', form).forEach(function (field) {
        field.addEventListener('input', function () {
          var group = field.closest('.form-group');
          if (group && field.value.trim()) group.classList.remove('has-error');
        });
      });
    });
  }

  /* ---- 商品卡片：加入购物车（事件委托） ---- */
  function initAddToCart() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add-cart]');
      if (!btn) return;
      e.preventDefault();
      var id = btn.getAttribute('data-add-cart');
      var p = (window.XZ_DATA && window.XZ_DATA.products.find(function (x) { return x.id === id; })) || (window.__currentProduct);
      if (!p) return;
      if (window.XZCart) window.XZCart.add(p, 1);
    });
  }

  /* ---- 初始化 ---- */
  function init() {
    initNav();
    initReveal();
    initFilterDrawer();
    initQtyInputs();
    initFormValidation();
    initAddToCart();
    if (window.XZCart) window.XZCart.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* 暴露工具 */
  window.XZApp = { qs: qs, qsa: qsa, esc: esc, yuan: yuan };
})();
