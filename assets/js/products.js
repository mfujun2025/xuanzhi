/* 宣纸.中国 — 产品列表页逻辑 */
(function () {
  'use strict';
  var qsa = XZApp.qsa, esc = XZApp.esc;
  var PAGE = 8;
  var sizeOrder = { '三尺': 1, '四尺对开': 2, '四尺': 3, '斗方': 4, '六尺': 5, '八尺': 6 };
  var state = { cats: [], sizes: [], materials: [], crafts: [], price: '0', sort: 'default', search: '', page: 1 };

  function rating(p) {
    var s = 0; for (var i = 0; i < p.id.length; i++) s += p.id.charCodeAt(i);
    return (4 + (s % 10) / 10).toFixed(1);
  }
  function sales(p) {
    var s = 0; for (var i = 0; i < p.name.length; i++) s += p.name.charCodeAt(i);
    return 120 + (s % 200);
  }

  function readInit() {
    var p = new URLSearchParams(location.search);
    var c = p.get('cat');
    if (c && XZ_DATA.categories.find(function (x) { return x.id === c; })) state.cats = [c];
    var q = p.get('q');
    if (q) state.search = q;
  }

  function syncSidebar(g, vals) {
    var box = document.getElementById(g + 'Filter');
    if (box) qsa('input', box).forEach(function (i) { i.checked = vals.indexOf(i.value) > -1; });
  }
  function syncChips() {
    var box = document.getElementById('catChips');
    if (!box) return;
    var c = state.cats[0] || '';
    qsa('.cat-chip', box).forEach(function (x) { x.classList.toggle('active', x.getAttribute('data-cat') === c); });
  }

  function buildCatChips() {
    var box = document.getElementById('catChips');
    if (!box) return;
    box.innerHTML = '<button class="cat-chip active" data-cat="">全部</button>' + XZ_DATA.categories.map(function (c) {
      return '<button class="cat-chip" data-cat="' + c.id + '">' + esc(c.name) + '</button>';
    }).join('');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.cat-chip'); if (!b) return;
      var cat = b.getAttribute('data-cat');
      qsa('.cat-chip', box).forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      state.cats = cat ? [cat] : []; syncSidebar('cat', state.cats); state.page = 1; render();
    });
  }

  function cnt(fn) { return XZ_DATA.products.filter(fn).length; }

  function buildFilters() {
    var catBox = document.getElementById('catFilter');
    catBox.innerHTML = XZ_DATA.categories.map(function (c) {
      return '<label><input type="checkbox" value="' + c.id + '"' + (state.cats.indexOf(c.id) > -1 ? ' checked' : '') + '> ' + esc(c.name) + '<span class="filter-count">' + cnt(function (p) { return p.cat === c.id; }) + '</span></label>';
    }).join('');
    var sizeBox = document.getElementById('sizeFilter');
    sizeBox.innerHTML = XZ_DATA.sizes.map(function (s) {
      return '<label><input type="checkbox" value="' + esc(s) + '"' + (state.sizes.indexOf(s) > -1 ? ' checked' : '') + '> ' + esc(s) + '</label>';
    }).join('');
    var matBox = document.getElementById('matFilter');
    matBox.innerHTML = XZ_DATA.materials.map(function (m) {
      return '<label><input type="checkbox" value="' + esc(m) + '"' + (state.materials.indexOf(m) > -1 ? ' checked' : '') + '> ' + esc(m) + '<span class="filter-count">' + cnt(function (p) { return p.material === m; }) + '</span></label>';
    }).join('');
    var craftBox = document.getElementById('craftFilter');
    craftBox.innerHTML = XZ_DATA.crafts.map(function (c) {
      return '<label><input type="checkbox" value="' + esc(c) + '"' + (state.crafts.indexOf(c) > -1 ? ' checked' : '') + '> ' + esc(c) + '<span class="filter-count">' + cnt(function (p) { return p.craft === c; }) + '</span></label>';
    }).join('');

    var on = function (id, key) {
      var box = document.getElementById(id);
      box.addEventListener('change', function (e) {
        if (e.target.type === 'checkbox') { state[key] = qsa('input:checked', box).map(function (i) { return i.value; }); if (key === 'cats') syncChips(); state.page = 1; render(); }
      });
    };
    on('catFilter', 'cats'); on('sizeFilter', 'sizes'); on('matFilter', 'materials'); on('craftFilter', 'crafts');
    document.getElementById('priceFilter').addEventListener('change', function (e) { if (e.target.name === 'price') { state.price = e.target.value; state.page = 1; render(); } });
    document.getElementById('sortSelect').addEventListener('change', function (e) { state.sort = e.target.value; state.page = 1; render(); });
    document.getElementById('searchInput').addEventListener('input', function (e) { state.search = e.target.value.trim(); state.page = 1; render(); });
    document.getElementById('clearFilters').addEventListener('click', clearAll);
    document.getElementById('emptyClear').addEventListener('click', clearAll);
  }

  function clearAll() {
    state = { cats: [], sizes: [], materials: [], crafts: [], price: '0', sort: state.sort, search: '', page: 1 };
    var si = document.getElementById('searchInput'); if (si) si.value = '';
    syncSidebar('cat', []); syncSidebar('size', []); syncSidebar('mat', []); syncSidebar('craft', []);
    syncChips();
    var p0 = document.querySelector('input[name="price"][value="0"]'); if (p0) p0.checked = true;
    buildFilters(); render();
  }

  function inPrice(p) {
    if (state.price === '0') return true;
    if (state.price === '1') return p.price < 200;
    if (state.price === '2') return p.price >= 200 && p.price < 400;
    if (state.price === '3') return p.price >= 400;
    return true;
  }

  function getSorted() {
    var kw = state.search.toLowerCase();
    var list = XZ_DATA.products.filter(function (p) {
      var ok = (state.cats.length === 0 || state.cats.indexOf(p.cat) > -1) &&
        (state.sizes.length === 0 || state.sizes.indexOf(p.size) > -1) &&
        (state.materials.length === 0 || state.materials.indexOf(p.material) > -1) &&
        (state.crafts.length === 0 || state.crafts.indexOf(p.craft) > -1) &&
        (inPrice(p)) &&
        (!kw || p.name.toLowerCase().indexOf(kw) > -1 || p.desc.toLowerCase().indexOf(kw) > -1 || p.catName.toLowerCase().indexOf(kw) > -1 || p.material.toLowerCase().indexOf(kw) > -1);
      return ok;
    });
    var s = state.sort;
    if (s === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
    else if (s === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
    else if (s === 'size') list.sort(function (a, b) { return (sizeOrder[a.size] || 0) - (sizeOrder[b.size] || 0); });
    else if (s === 'new') list.sort(function (a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0); });
    else list.sort(function (a, b) { return (b.hot ? 1 : 0) - (a.hot ? 1 : 0); });
    return list;
  }

  function activeTagsHTML() {
    var tags = [];
    state.cats.forEach(function (c) { var n = XZ_DATA.categories.find(function (x) { return x.id === c; }).name; tags.push(['cat', c, n]); });
    state.sizes.forEach(function (s) { tags.push(['size', s, s]); });
    state.materials.forEach(function (m) { tags.push(['mat', m, m]); });
    state.crafts.forEach(function (c) { tags.push(['craft', c, c]); });
    if (state.price !== '0') { var lb = { '1': '¥200以下', '2': '¥200-400', '3': '¥400以上' }; tags.push(['price', state.price, lb[state.price]]); }
    if (state.search) tags.push(['search', state.search, '“' + state.search + '”']);
    var af = document.getElementById('activeFilters');
    if (tags.length === 0) { af.classList.add('hidden'); af.innerHTML = ''; return; }
    af.classList.remove('hidden');
    af.innerHTML = '<span class="af-label">已选</span>' + tags.map(function (t) {
      return '<button class="af-tag" data-g="' + t[0] + '" data-v="' + esc(t[1]) + '">' + esc(t[2]) + '<span class="af-x">×</span></button>';
    }).join('') + '<button class="af-clear" data-g="all">清除全部</button>';
  }

  function cardHTML(p) {
    var old = p.oldPrice ? '<span class="price__old">' + XZApp.yuan(p.oldPrice) + '</span>' : '';
    var badges = (p.hot ? '<span class="badge badge--hot product-card__badge">热销</span>' : '') +
      (p.isNew ? '<span class="badge badge--new product-card__badge" style="left:auto;right:12px;">新品</span>' : '');
    return '<article class="product-card rv in">' +
      '<a class="product-card__img" href="product.html?id=' + p.id + '">' +
        '<img src="' + p.img + '" alt="' + esc(p.name) + ' 商品图" loading="lazy">' + badges +
      '</a>' +
      '<div class="product-card__body">' +
        '<div class="product-card__cat">' + esc(p.catName) + ' · ' + esc(p.size) + '</div>' +
        '<a href="product.html?id=' + p.id + '"><h3 class="product-card__name">' + esc(p.name) + '</h3></a>' +
        '<div class="product-card__spec">' + esc(p.spec) + '</div>' +
        '<div class="product-card__rate">' +
          '<span class="stars">★★★★★</span><span class="rt">' + rating(p) + '</span>' +
          '<span class="sales">已售 ' + sales(p) + '</span>' +
        '</div>' +
        '<div class="product-card__foot">' +
          '<div class="product-card__price"><span class="price"><span class="price__sym">¥</span>' + p.price + '</span>' + old + '</div>' +
          '<button class="product-card__add" data-add-cart="' + p.id + '" aria-label="加入购物车 ' + esc(p.name) + '">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
          '</button>' +
        '</div>' +
      '</div></article>';
  }

  function render() {
    var list = getSorted();
    document.getElementById('resultCount').textContent = list.length;
    var grid = document.getElementById('productGrid');
    var empty = document.getElementById('emptyState');
    var show = list.slice(0, state.page * PAGE);
    if (list.length === 0) { grid.innerHTML = ''; empty.classList.remove('hidden'); }
    else { empty.classList.add('hidden'); grid.innerHTML = show.map(cardHTML).join(''); }
    activeTagsHTML();
    var loadBtn = document.getElementById('loadMore');
    if (list.length > show.length) { loadBtn.classList.remove('hidden'); loadBtn.textContent = '查看更多（' + (list.length - show.length) + ' 款）'; }
    else loadBtn.classList.add('hidden');
    updateSearchBox();
  }

  function updateSearchBox() {
    var si = document.getElementById('searchInput');
    if (si && state.search && si.value !== state.search) si.value = state.search;
  }

  function bindActiveTags() {
    document.getElementById('activeFilters').addEventListener('click', function (e) {
      var t = e.target.closest('.af-tag'); var clr = e.target.closest('.af-clear');
      if (clr) { clearAll(); return; }
      if (!t) return;
      var g = t.getAttribute('data-g'), v = t.getAttribute('data-v');
      if (g === 'cat') state.cats = state.cats.filter(function (x) { return x !== v; }); syncSidebar('cat', state.cats); syncChips();
      else if (g === 'size') state.sizes = state.sizes.filter(function (x) { return x !== v; }); syncSidebar('size', state.sizes);
      else if (g === 'mat') state.materials = state.materials.filter(function (x) { return x !== v; }); syncSidebar('mat', state.materials);
      else if (g === 'craft') state.crafts = state.crafts.filter(function (x) { return x !== v; }); syncSidebar('craft', state.crafts);
      else if (g === 'price') { state.price = '0'; var p0 = document.querySelector('input[name="price"][value="0"]'); if (p0) p0.checked = true; }
      else if (g === 'search') { state.search = ''; }
      state.page = 1; render();
    });
    document.getElementById('loadMore').addEventListener('click', function () { state.page++; render(); });
  }

  readInit();
  buildCatChips();
  buildFilters();
  bindActiveTags();
  render();
  updateSearchBox();
})();
