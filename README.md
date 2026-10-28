# 宣纸.中国 — 手工宣纸销售网站

一个传统中式视觉风格的宣纸电商站点，纯静态、零外部依赖、离线可用，桌面端与移动端自适应。本站为**演示站点**，商品信息与价格为示例数据，正式上线前请按下方说明替换真实内容。

## 目录结构

```
xuanzhi-site/
├── index.html          首页：品牌与宣纸文化、主打产品推荐
├── products.html       产品列表页：品类筛选 + 尺寸/价格排序
├── product.html        商品详情页：图文介绍、规格参数、加购
├── cart.html           购物车：改量、删除、合计
├── checkout.html       下单结算：收货信息、配送支付、订单确认、成功页
├── about.html          品牌故事 + 购物条款与售后说明
└── assets/
    ├── css/style.css   设计令牌（中式配色、字体、布局）
    ├── css/pages.css   页面组件样式
    ├── js/data.js      商品数据层（品类、尺寸、商品列表）
    ├── js/cart.js      购物车逻辑（localStorage）
    └── js/app.js       导航、滚动揭示、筛选抽屉、表单校验
```

## 本地预览

```bash
cd xuanzhi-site
python -m http.server 8899 --bind 127.0.0.1
# 浏览器打开 http://127.0.0.1:8899/
```

## 部署到 GitHub Pages

本站使用中文域名「宣纸.中国」。部署步骤：

1. 将本目录所有文件推送到 GitHub 仓库 `mfujun2025/xuanzhi` 的 `main` 分支。
2. 在仓库根目录添加 `CNAME` 文件，内容为 `宣纸.中国`（GitHub Pages 会自动处理 Punycode）。
3. 仓库 Settings → Pages → Source 选择 `main` 分支、`/ (root)` 目录。
4. DNS：在域名服务商处将 `宣纸.中国` CNAME 指向 `mfujun2025.github.io`。
5. 等待 GitHub Pages 生效（约 1-2 分钟），访问 `https://宣纸.中国`。

> 中文域名需在域名注册商完成实名认证与 DNS 解析，且本地网络支持 IDN 访问。若遇浏览器无法解析中文域名，可用 Punycode 形式 `xn--fiqs8s...` 访问（具体 Punycode 以注册商为准）。

## 替换真实商品图片

当前商品图为**内联 SVG 占位图**（按品类区分色调）。替换方法：

1. 将真实商品照片放入 `assets/img/` 目录，建议命名 `p01.jpg`、`p02.jpg`…与商品 id 对应。
2. 图片预处理：宽度 ≤1600px、JPEG 质量 82、渐进式压缩（可用下方命令）。
3. 编辑 `assets/js/data.js`，将每个商品的 `img` 字段从 SVG data URI 改为图片路径：

```js
img: 'assets/img/p01.jpg',
```

批量压缩图片命令（需 Python PIL）：

```bash
python -c "
from PIL import Image
import os
src_dir = 'photos'  # 原始图片目录
dst_dir = 'assets/img'
os.makedirs(dst_dir, exist_ok=True)
for f in os.listdir(src_dir):
    if f.lower().endswith(('.jpg','.jpeg','.png')):
        im = Image.open(os.path.join(src_dir, f)).convert('RGB')
        if im.width > 1600:
            im = im.resize((1600, round(im.height*1600/im.width)), Image.LANCZOS)
        im.save(os.path.join(dst_dir, f), 'JPEG', quality=82, optimize=True, progressive=True)
        print('ok', f)
"
```

## 替换真实价格与商品信息

编辑 `assets/js/data.js` 的 `products` 数组：

- `price`：现价（元）
- `oldPrice`：划线原价（无则设为 `null`）
- `spec`：规格描述（如「138×69cm · 净皮 · 100张/刀」）
- `desc`：商品图文介绍
- `params`：规格参数表（品类、材质、规格、包装、产地、工艺）
- `hot`：是否标记「热销」

新增商品：复制一个商品对象，修改 `id`、`name`、`cat`（品类 id）、`img`、`price` 等字段即可，页面会自动渲染。

## 替换联系方式与备案信息

各 HTML 文件底部的页脚部分：

- 客服热线：`400-XXX-XXXX` → 真实号码
- 邮箱：`service@xuanzhi.cn` → 真实邮箱
- 地址：`安徽省宣城市泾县【待补充】` → 真实地址
- 备案号：`皖ICP备XXXXXXXX号【待补充】` → 真实 ICP 备案号

## 对接真实支付与订单系统

当前购物车与下单为**前端模拟**（localStorage 存储，不发生真实交易）。正式上线需：

1. 后端订单接口：将购物车数据 POST 到服务器创建订单，返回订单号。
2. 支付对接：接入微信支付 / 支付宝等，在 `checkout.html` 的提交逻辑中调用支付 SDK。
3. 库存与物流：对接库存系统与物流查询接口。

## 设计说明

- **配色**：宣纸暖底（#f7f1e3）+ 印泥红主色（#9a2018）+ 赭金点缀（#b8860b）+ 墨色文字，符合传统中式审美。
- **字体**：标题用宋体（Noto Serif SC / STSong / SimSun），正文用黑体（PingFang / Microsoft YaHei），零外部字体依赖。
- **响应式**：1024px / 920px / 760px / 480px 四档断点，移动端汉堡菜单 + 筛选抽屉。
- **可访问性**：语义化标签、唯一 h1、全图 alt、表单 label、焦点可见、no-js 与 reduced-motion 兜底。

## 版权

© 2026 宣纸.中国。本站为演示模板，商品信息与价格仅供参考，正式上线前请替换真实内容并补充备案信息。
