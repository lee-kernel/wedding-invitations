# wedding-invitations

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE) · [![LinuxDO](https://img.shields.io/badge/community-LinuxDO-FFA500)](https://linux.do/)

一个使用 Vue 3、TypeScript 和 Vite 构建的响应式单页婚礼请柬，支持桌面端与手机端浏览。

## 主要功能

- 响应式婚礼首屏、照片故事、时间地点和 RSVP 表单
- 婚礼倒计时与爱心日期标记
- 背景音乐、旋转唱片封面、动态音频条和可拖动进度条
- 奶白浅粉蝴蝶结请柬封面，点击印章播放花瓣并进入正文，同时尝试启动音乐
- 全屏粉色花瓣飘落效果，页面由用户手动滚动；减少动态效果时停用花瓣动画
- 婚纱照、小朋友头像、音乐封面和场地图片均可直接替换
- 婚纱照支持点击全屏预览，手机端支持双指缩放与放大后拖动
- 婚纱照进入视口时以显影、上浮和交错动效出现，并兼容减少动态效果设置
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

每次打开页面先展示请柬封面，点击印章或“直接进入请柬”时尝试播放音乐。点击印章后上下遮幕立即展开，约 0.9 秒完成；正文预先渲染在遮幕后，幕布动画结束即进入正文，直接进入或系统减少动态效果时跳过动画；播放失败仍可进入正文并使用音乐按钮重试。页面由用户手动滚动。

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

## 社区交流

欢迎到 [LinuxDO](https://linux.do/) 社区交流 AI 工具与提示词使用心得。

## 开源协议

wedding-invitations 基于 [MIT 许可证](LICENSE) 开源。第三方依赖、社区样例与素材遵循各自的许可声明。

### 花瓣动画来源

`src/components/FloatingCherryBlossoms.vue` 改编自 [royal-wedding-invitation 的 FloatingCherryBlossoms.tsx](https://github.com/MrDevashish-777/royal-wedding-invitation/blob/main/src/components/FloatingCherryBlossoms.tsx)，保留 Canvas 花瓣绘制与运动方式，适配 Vue 生命周期，并补充时间步长、高分屏和减少动态效果支持。

开场组件 `src/components/OpeningEntrance.vue` 参考同一项目的 `OpeningEntrance.tsx`，适配为中文姓名、婚期与 Vue 生命周期；装饰背景采用 CSS 绘制，复用正文蝴蝶结与 Canvas 花瓣组件，印章带有轻柔悬浮和呼吸光晕，点击时从印章中心抛撒 70 片花瓣，随后受重力下落。

### 故事旅程

四段故事使用 `StoryJourney.vue` 展示，参考 [wedding-website 的 JourneyTrail](https://github.com/deepeshmi26/wedding-website/blob/main/src/app/JourneyTrail.tsx) 的长滚动区域与 sticky 舞台方式，使用 SVG 路径长度控制粉色婚车的位置、转向和路线进度。支持鼠标、触屏和键盘原生滚动，倒滚可回看；路线结束后恢复普通浏览。系统减少动态效果时显示静态故事列表。婚车为本项目绘制的 SVG，不依赖外部图片或动画库。

首屏使用奶白浅粉渐变、低透明度蝴蝶结和淡纸纹背景，以白色弧形边缘衔接第二屏；背景只作用于首屏区域。

### 聊天与相册

原两张横图区域由 `StoryAlbum.vue` 替换为文字、模拟微信聊天和横向相册，参考 wedding-website 的 StorySection / StoryPhotoCarousel 布局创意。对话为展示用模拟文案；相册复用现有图片槽位（横向照片、横向近景、双人竖图、故事主图），支持触屏滑动、鼠标拖动、方向键和按钮切换，以及点击预览。缺失的图片仍展示原有占位，替换 `public/images/invitation/` 对应文件即可。

模拟微信界面包含手机状态栏、单聊标题、照片头像、白色/绿色气泡、底部静态输入区和手势条。模拟聊天保留原文案，输入区仅作视觉展示。头像通过 `src/data/wedding.ts` 的 `chatProfiles` 配置，也可直接替换 `public/images/invitation/chat-groom.webp`、`chat-bride.webp`。

### RSVP 赴约回执

日期配图已替换为浅粉信笺式 `RsvpCard.vue`，左侧日历保留。参考 wedding-website 的 RsvpSection，使用本项目配色与 CSS 邮戳。配置 `src/data/wedding.ts` 中的 `wedding.rsvpUrl` 为腾讯问卷完整 HTTPS 链接即可启用跳转；未配置时按钮禁用并显示“赴约回执即将开放”。问卷在新标签页打开。
