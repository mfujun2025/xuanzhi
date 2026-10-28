/* ============================================================
   宣纸.中国 — 商品数据层
   所有图片当前为内联 SVG 占位图（按品类区分色调）。
   后续替换真实商品图：将 img 字段改为 assets/img/<id>.jpg 即可。
   价格为演示数据，替换真实售价请修改 price 字段。
   ============================================================ */

window.XZ_DATA = (function () {

  /* ---- 品类定义 ---- */
  var categories = [
    { id: 'sheng',     name: '生宣',     desc: '吸水性强，墨韵丰富，适合写意花鸟与泼墨' },
    { id: 'shu',       name: '熟宣',     desc: '加矾不洇墨，适合工笔小楷与精细描摹' },
    { id: 'bansheng',  name: '半生熟宣', desc: '介于生熟之间，宜书宜画，初学进阶皆宜' },
    { id: 'lianxi',    name: '练习宣纸', desc: '经济实惠，日课临池，大量练习不心疼' },
    { id: 'jian',      name: '特种笺纸', desc: '洒金、仿古、蜡染，格调雅致，作品装裱首选' }
  ];

  /* ---- 尺寸规格池 ---- */
  var sizes = ['三尺', '四尺', '四尺对开', '六尺', '八尺', '斗方'];

  /* ---- 生成 SVG 占位图 data URI ---- */
  function svgImg(bg, accent, label, sub) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
        '<rect width="400" height="400" fill="' + bg + '"/>' +
        '<rect x="30" y="30" width="340" height="340" fill="none" stroke="' + accent +
          '" stroke-width="1.5" stroke-opacity="0.4" rx="6"/>' +
        '<rect x="44" y="44" width="312" height="312" fill="none" stroke="' + accent +
          '" stroke-width="0.8" stroke-opacity="0.25" rx="4"/>' +
        '<text x="200" y="200" font-family="STSong,SimSun,serif" font-size="78" fill="' + accent +
          '" text-anchor="middle" dominant-baseline="middle" opacity="0.82">' + label + '</text>' +
        '<text x="200" y="250" font-family="STSong,SimSun,serif" font-size="22" fill="' + accent +
          '" text-anchor="middle" opacity="0.6">' + sub + '</text>' +
        '<text x="200" y="340" font-family="sans-serif" font-size="12" fill="' + accent +
          '" text-anchor="middle" opacity="0.4" letter-spacing="2">宣纸.中国 · 占位图</text>' +
      '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  /* 各品类配色 */
  var palettes = {
    sheng:    { bg: '#f3e8d0', ac: '#9a2018', label: '生宣' },
    shu:      { bg: '#efe9dc', ac: '#7a1812', label: '熟宣' },
    bansheng: { bg: '#f5ecd6', ac: '#b8860b', label: '半生熟' },
    lianxi:   { bg: '#e8e0cc', ac: '#6b5d52', label: '练习' },
    jian:     { bg: '#f0e4cc', ac: '#8b6914', label: '笺纸' }
  };

  /* ---- 商品列表 ---- */
  var products = [
    // 生宣
    {
      id: 'p01', name: '净皮生宣四尺', cat: 'sheng', catName: '生宣',
      spec: '138×69cm · 净皮 · 100张/刀', size: '四尺', price: 368, oldPrice: 420,
      img: svgImg(palettes.sheng.bg, palettes.sheng.ac, '生宣', '净皮 · 四尺'),
      hot: true, desc: '采用三年陈皮净皮抄造，纸质柔韧，吸水润墨性佳，落笔墨韵层次分明，是写意花鸟、泼墨山水的上选。',
      params: { 品类: '生宣', 材质: '净皮', 规格: '138×69cm', 包装: '100张/刀', 产地: '安徽泾县', 工艺: '手工捞制' }
    },
    {
      id: 'p02', name: '棉料生宣三尺', cat: 'sheng', catName: '生宣',
      spec: '100×55cm · 棉料 · 100张/刀', size: '三尺', price: 228, oldPrice: 260,
      img: svgImg(palettes.sheng.bg, palettes.sheng.ac, '生宣', '棉料 · 三尺'),
      hot: false, desc: '棉料生宣，纸性偏柔，洇墨适中，适合中小尺幅写意与日常练笔，性价比高。',
      params: { 品类: '生宣', 材质: '棉料', 规格: '100×55cm', 包装: '100张/刀', 产地: '安徽泾县', 工艺: '手工捞制' }
    },
    {
      id: 'p03', name: '特净生宣六尺', cat: 'sheng', catName: '生宣',
      spec: '180×97cm · 特净皮 · 50张/刀', size: '六尺', price: 588, oldPrice: 660,
      img: svgImg(palettes.sheng.bg, palettes.sheng.ac, '生宣', '特净 · 六尺'),
      hot: true, desc: '特净皮生宣，纸面宽阔，墨韵饱满，适合大尺幅山水、人物创作，装裱后气势恢宏。',
      params: { 品类: '生宣', 材质: '特净皮', 规格: '180×97cm', 包装: '50张/刀', 产地: '安徽泾县', 工艺: '手工捞制' }
    },
    // 熟宣
    {
      id: 'p04', name: '云母熟宣四尺', cat: 'shu', catName: '熟宣',
      spec: '138×69cm · 云母笺 · 100张/刀', size: '四尺', price: 398, oldPrice: 440,
      img: svgImg(palettes.shu.bg, palettes.shu.ac, '熟宣', '云母 · 四尺'),
      hot: true, desc: '加矾云母熟宣，纸面莹润有光泽，不洇墨，落笔精准，工笔花鸟、小楷金文皆宜。',
      params: { 品类: '熟宣', 材质: '云母笺', 规格: '138×69cm', 包装: '100张/刀', 产地: '安徽泾县', 工艺: '加矾砑光' }
    },
    {
      id: 'p05', name: '清水熟宣斗方', cat: 'shu', catName: '熟宣',
      spec: '69×69cm · 清水 · 50张/刀', size: '斗方', price: 268, oldPrice: null,
      img: svgImg(palettes.shu.bg, palettes.shu.ac, '熟宣', '清水 · 斗方'),
      hot: false, desc: '斗方熟宣，方形构图，适合小品工笔与书法创作，装裱册页、镜心皆得体。',
      params: { 品类: '熟宣', 材质: '清水', 规格: '69×69cm', 包装: '50张/刀', 产地: '安徽泾县', 工艺: '加矾手工' }
    },
    // 半生熟
    {
      id: 'p06', name: '半生熟宣四尺对开', cat: 'bansheng', catName: '半生熟宣',
      spec: '138×34cm · 半生熟 · 100张/刀', size: '四尺对开', price: 298, oldPrice: 330,
      img: svgImg(palettes.bansheng.bg, palettes.bansheng.ac, '半生熟', '四尺对开'),
      hot: true, desc: '半生熟宣，纸性温和，既能出墨韵又可控笔，书法行草、写意小品两相宜，初学进阶首选。',
      params: { 品类: '半生熟宣', 材质: '棉料', 规格: '138×34cm', 包装: '100张/刀', 产地: '安徽泾县', 工艺: '手工捞制' }
    },
    {
      id: 'p07', name: '半生熟宣三尺', cat: 'bansheng', catName: '半生熟宣',
      spec: '100×55cm · 半生熟 · 100张/刀', size: '三尺', price: 208, oldPrice: 238,
      img: svgImg(palettes.bansheng.bg, palettes.bansheng.ac, '半生熟', '三尺'),
      hot: false, desc: '三尺半生熟，便携易用，日常临帖、创作练手，纸性稳定不易洇过头。',
      params: { 品类: '半生熟宣', 材质: '棉料', 规格: '100×55cm', 包装: '100张/刀', 产地: '安徽泾县', 工艺: '手工捞制' }
    },
    // 练习宣纸
    {
      id: 'p08', name: '书画练习宣四尺', cat: 'lianxi', catName: '练习宣纸',
      spec: '138×69cm · 棉料 · 200张/刀', size: '四尺', price: 168, oldPrice: 190,
      img: svgImg(palettes.lianxi.bg, palettes.lianxi.ac, '练习宣', '四尺 · 200张'),
      hot: true, desc: '专为日课练习设计，量大实惠，纸质稳定，适合临摹、习作与日常书写，练习不心疼。',
      params: { 品类: '练习宣纸', 材质: '棉料', 规格: '138×69cm', 包装: '200张/刀', 产地: '安徽泾县', 工艺: '半手工' }
    },
    {
      id: 'p09', name: '毛边练习纸四尺', cat: 'lianxi', catName: '练习宣纸',
      spec: '138×69cm · 毛边 · 150张/刀', size: '四尺', price: 128, oldPrice: null,
      img: svgImg(palettes.lianxi.bg, palettes.lianxi.ac, '练习宣', '毛边 · 四尺'),
      hot: false, desc: '毛边纸练习，色浅质朴，吸墨适中，适合楷书、行书日常临帖，经济耐用。',
      params: { 品类: '练习宣纸', 材质: '竹料毛边', 规格: '138×69cm', 包装: '150张/刀', 产地: '安徽泾县', 工艺: '半手工' }
    },
    // 特种笺纸
    {
      id: 'p10', name: '洒金笺纸四尺', cat: 'jian', catName: '特种笺纸',
      spec: '138×69cm · 洒金 · 50张/刀', size: '四尺', price: 358, oldPrice: 400,
      img: svgImg(palettes.jian.bg, palettes.jian.ac, '笺纸', '洒金 · 四尺'),
      hot: true, desc: '洒金笺纸，纸面金点闪烁，雅致华贵，适合作品书写与装裱，节庆题赠尤显心意。',
      params: { 品类: '特种笺纸', 材质: '洒金熟宣', 规格: '138×69cm', 包装: '50张/刀', 产地: '安徽泾县', 工艺: '洒金手工' }
    },
    {
      id: 'p11', name: '仿古笺纸斗方', cat: 'jian', catName: '特种笺纸',
      spec: '69×69cm · 仿古 · 50张/刀', size: '斗方', price: 288, oldPrice: null,
      img: svgImg(palettes.jian.bg, palettes.jian.ac, '笺纸', '仿古 · 斗方'),
      hot: false, desc: '仿古色笺纸，色泽温润古朴，配以小品书法、工笔，古意盎然，作品装裱格调不凡。',
      params: { 品类: '特种笺纸', 材质: '仿古熟宣', 规格: '69×69cm', 包装: '50张/刀', 产地: '安徽泾县', 工艺: '染色手工' }
    },
    {
      id: 'p12', name: '蜡染笺纸四尺', cat: 'jian', catName: '特种笺纸',
      spec: '138×69cm · 蜡染 · 50张/刀', size: '四尺', price: 388, oldPrice: 430,
      img: svgImg(palettes.jian.bg, palettes.jian.ac, '笺纸', '蜡染 · 四尺'),
      hot: false, desc: '蜡染笺纸，纹理天成，层次丰富，墨色与纹饰相映，适合精品创作与收藏级作品。',
      params: { 品类: '特种笺纸', 材质: '蜡染熟宣', 规格: '138×69cm', 包装: '50张/刀', 产地: '安徽泾县', 工艺: '蜡染手工' }
    }
  ];

  return {
    categories: categories,
    sizes: sizes,
    products: products
  };
})();
