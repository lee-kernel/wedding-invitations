# 汪家喆 & 朱敏｜婚礼邀请

Vue 3 + Vite 实现的响应式单页婚礼请柬。页面采用连续长页结构，包含倒计时、照片故事、婚礼日历、时间地点、地图入口和邀请图片保存功能。

## 运行

```sh
npm install
npm run dev
```

开发地址通常为 `http://localhost:5173/wedding/`。生产构建：

```sh
npm run build
```

## 替换婚纱照

页面预留了 9 个固定比例的图片槽位。将 WebP 图片放进 `public/images/invitation/`，并使用以下文件名：

- `hero.webp`：首屏创意主视觉，1:1
- `music-cover.webp`：首屏音乐卡片封面，1:1
- `portrait.webp`：欢迎段双人竖图，4:5
- `story-left.webp`：故事双图左侧，3:4
- `story-right.webp`：故事双图右侧，3:4
- `story-focus.webp`：故事主图，4:5
- `gallery-wide.webp`：横向画廊第一张，16:9
- `gallery-close.webp`：横向画廊第二张，16:9
- `wedding-date.webp`：日期旁配图，4:5
- `venue.webp`：场地或地图图片，5:3

缺少图片时页面显示带文件路径的占位框，方便确认构图。详细尺寸建议见 `public/images/invitation/README.md`。

## 修改婚礼信息

姓名、日期、时间、地点与图片槽位统一维护在 `src/data/wedding.ts`。页面结构位于 `src/App.vue`，全局样式位于 `src/styles/invitation-page.css`。
