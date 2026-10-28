/* ============================================================
   宣纸.中国 — 购物车逻辑（localStorage 持久化）
   无后端依赖，订单在浏览器本地生成。
   生产环境需对接支付/订单系统，见 README。
   ============================================================ */

window.XZCart = (function () {
  var KEY = 'xuanzhi_cart_v1';

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      /* 隐私模式或容量满，降级为内存态 */
    }
  }

  function get() { return load(); }

  function find(id) {
    return load().find(function (i) { return i.id === id; });
  }

  function add(product, qty) {
    qty = qty || 1;
    var items = load();
    var found = items.find(function (i) { return i.id === product.id; });
    if (found) {
      found.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        catName: product.catName,
        spec: product.spec,
        size: product.size,
        price: product.price,
        img: product.img,
        qty: qty
      });
    }
    save(items);
    updateBadge();
    toast('已加入购物车：' + product.name);
    return items;
  }

  function setQty(id, qty) {
    var items = load();
    var found = items.find(function (i) { return i.id === id; });
    if (found) {
      found.qty = Math.max(1, parseInt(qty) || 1);
      save(items);
      updateBadge();
    }
    return items;
  }

  function inc(id) {
    var it = find(id);
    if (it) setQty(id, it.qty + 1);
    return load();
  }

  function dec(id) {
    var it = find(id);
    if (it && it.qty > 1) setQty(id, it.qty - 1);
    return load();
  }

  function remove(id) {
    var items = load().filter(function (i) { return i.id !== id; });
    save(items);
    updateBadge();
    return items;
  }

  function clear() {
    save([]);
    updateBadge();
  }

  function count() {
    return load().reduce(function (s, i) { return s + i.qty; }, 0);
  }

  function total() {
    return load().reduce(function (s, i) { return s + i.qty * i.price; }, 0);
  }

  function updateBadge() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.setAttribute('data-zero', n === 0 ? 'true' : 'false');
    });
  }

  /* 轻量提示条 */
  var toastTimer = null;
  function toast(msg) {
    var t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.innerHTML = '<span class="toast__dot"></span><span class="toast__msg"></span>';
      document.body.appendChild(t);
    }
    t.querySelector('.toast__msg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* 格式化金额 */
  function yuan(n) {
    return '¥' + Number(n).toFixed(0);
  }

  /* 初始化：页面加载即刷新徽章 */
  function init() {
    updateBadge();
  }

  return {
    load: load, get: get, find: find, add: add, setQty: setQty,
    inc: inc, dec: dec, remove: remove, clear: clear,
    count: count, total: total, updateBadge: updateBadge,
    yuan: yuan, toast: toast, init: init
  };
})();
