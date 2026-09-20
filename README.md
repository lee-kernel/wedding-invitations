# wedding-invitations

一个使用 Vue 3、TypeScript 和 Vite 构建的响应式单页婚礼请柬，支持桌面端与手机端浏览。

## 主要功能

- 响应式婚礼首屏、照片故事、时间地点和 RSVP 表单
- 婚礼倒计时与爱心日期标记
- 背景音乐、旋转唱片封面、动态音频条和可拖动进度条
- 自动播放失败时提供一次点击开启音乐的兼容入口
- 页面匀速自动滚动，用户手动滑动后自动停止
- 婚纱照、小朋友头像、音乐封面和场地图片均可直接替换
- 支持保存婚礼邀请图片
- 内置手写体和轻量化 WOFF2 字体资源

## 技术栈

- Vue 3
- TypeScript
- Vite
- CSS 响应式布局与动画

## 本地运行

```sh
npm install
npm run dev
```

默认页面路径：`http://localhost:5173/`

生产构建：

```sh
npm run build
```

本地预览生产版本：

```sh
npm run preview
```

## 分享卡片与站点地址

入口 HTML 使用固定的 Open Graph 元信息，微信等抓取器无需执行客户端 JavaScript 即可读取标题、描述、站点名称和分享封面。项目不接入微信公众号 JS-SDK，也不需要 `access_token`、`jsapi_ticket` 或签名。

`VITE_SITE_URL` 是公开、非敏感的构建变量，用于生成 `canonical`、`og:url` 和 `og:image` 的 HTTPS 绝对 URL：

| 环境 | 配置文件 | 默认值 |
| --- | --- | --- |
| 开发 | `.env.development` | `https://dev.wedding-invitations.pages.dev` |
| 测试 | `.env.test` | `https://test.wedding-invitations.pages.dev` |
| 生产 | `.env.production` | `https://wedding-invitations.pages.dev` |

测试环境构建可运行 `npm run build -- --mode test`。分享封面位于 `public/images/invitation/share-cover.png`，生产构建后公开地址为 `https://wedding-invitations.pages.dev/images/invitation/share-cover.png`。

绑定或更换正式域名时，必须修改 `.env.production` 中的 `VITE_SITE_URL`，然后重新执行生产构建并部署；仅修改 Cloudflare 域名设置不会改写已经生成的 HTML。

## 修改婚礼信息

日期、时间、地点、歌曲信息和图片槽位集中维护在：

```text
src/data/wedding.ts
```

主要页面结构位于 `src/App.vue`，页面样式位于 `src/styles/invitation-page.css`。

## 替换图片

将处理后的 WebP 图片放入 `public/images/invitation/`，保持以下文件名不变：

| 文件名 | 页面位置 | 推荐比例 |
| --- | --- | --- |
| hero.webp | 首屏创意主视觉 | 1:1 |
| share-cover.png | 微信／社交平台分享封面 | 1200:630 |
| `child-left.webp` | 左侧小朋友头像／新郎 | 1:1 |
| `child-right.webp` | 右侧小朋友头像／新娘 | 1:1 |
| `music-cover.webp` | 音乐唱片封面 | 1:1 |
| `portrait.webp` | 欢迎段双人竖图 | 4:5 |
| `story-left.webp` | 故事双图左侧 | 3:4 |
| `story-right.webp` | 故事双图右侧 | 3:4 |
| `story-focus.webp` | 故事主图 | 4:5 |
| `gallery-wide.webp` | 横向画廊第一张 | 16:9 |
| `gallery-close.webp` | 横向画廊第二张 | 16:9 |
| `wedding-date.webp` | 日期旁配图 | 4:5 |
| `venue.webp` | 场地或交通示意图 | 5:3 |

更详细的导出尺寸建议见 `public/images/invitation/README.md`。建议使用 sRGB WebP，并尽量将单张图片控制在 500 KB 内。

## 替换背景音乐

背景音乐文件位置：

```text
public/audio/wedding-song.mp3
```

歌曲名称和演唱者在 `src/data/wedding.ts` 的 `music` 对象中修改。

桌面浏览器允许时会直接自动播放；手机浏览器拦截有声自动播放时，页面会显示一次性开启按钮。点击后音乐和自动滚动会同步启动。

## 自定义字体

字体资源位于 `src/assets/`。页面中的“新郎 / 新娘”标签使用轻量子集 `xinye-nianti-labels.woff2`，用于减少手机端加载体积。

如需将 OTF 转换为 WOFF2，可使用 FontTools：

```sh
python -m pip install fonttools brotli
python -m fontTools.ttLib.woff2 compress input.otf -o output.woff2
```

## Cloudflare Pages 部署

在 Cloudflare 控制台进入 **Workers & Pages → Create application → Pages → Import an existing Git repository**，选择 GitHub 仓库 `lee-kernel/wedding-invitations`，然后填写：

| 配置项 | 值 |
| --- | --- |
| Production branch | `master` |
| Framework preset | `Vue` 或 `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist/client` |
| Root directory | 留空（仓库根目录） |

Cloudflare Pages 使用站点根路径 `/`，无需额外设置基础路径变量。保存并部署后，每次向生产分支推送都会自动重新构建，Pull Request 会生成预览部署。

## 项目结构

```text
public/
  audio/                    背景音乐
  images/invitation/        婚礼图片
src/
  assets/                   字体等打包资源
  components/               页面组件
  data/wedding.ts           婚礼信息与资源配置
  styles/                   页面及保存图片样式
  App.vue                   主页面
```