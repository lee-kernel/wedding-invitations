import { wedding } from './invitation-config';
export { wedding, copy } from './invitation-config';
const invitationImage = (file: string) => `${import.meta.env.BASE_URL}images/invitation/${file}`;


// 独立的微信头像，替换文件或修改这里的路径即可，不影响首屏人物图片。
export const chatProfiles = {
  groom: { avatar: invitationImage('chat-groom.webp') },
  bride: { avatar: invitationImage('chat-bride.webp') },
};

export const music = {
  title: '达尔文',
  artist: '林俊杰',
  src: `${import.meta.env.BASE_URL}audio/wedding-song.mp3`,
};
export const imageSlots = {
  hero: { src: invitationImage('hero.webp'), label: '01 / 首屏创意主视觉', alt: `${wedding.groom}与${wedding.bride}的婚礼创意主视觉` },
  childLeft: { src: invitationImage('child-left.webp'), label: '左侧小朋友头像', alt: '左侧小朋友头像' },
  childRight: { src: invitationImage('child-right.webp'), label: '右侧小朋友头像', alt: '右侧小朋友头像' },
  musicCover: { src: invitationImage('music-cover.webp'), label: '音乐封面', alt: `${wedding.groom}与${wedding.bride}的婚礼音乐封面` },
  portrait: { src: invitationImage('portrait.webp'), label: '02 / 双人竖图', alt: `${wedding.groom}与${wedding.bride}并肩合影` },
  storyLeft: { src: invitationImage('story-left.webp'), label: '03 / 故事左图', alt: `${wedding.groom}与${wedding.bride}的婚礼故事照片` },
  storyRight: { src: invitationImage('story-right.webp'), label: '04 / 故事右图', alt: `${wedding.groom}与${wedding.bride}的婚礼故事照片` },
  focus: { src: invitationImage('story-focus.webp'), label: '05 / 故事主图', alt: `${wedding.groom}与${wedding.bride}的婚纱照` },
  wide: { src: invitationImage('gallery-wide.webp'), label: '06 / 横向照片', alt: `${wedding.groom}与${wedding.bride}的横向婚纱照` },
  close: { src: invitationImage('gallery-close.webp'), label: '07 / 横向近景', alt: `${wedding.groom}与${wedding.bride}的近景婚纱照` },
  date: { src: invitationImage('wedding-date.webp'), label: '08 / 日期配图', alt: `${wedding.groom}与${wedding.bride}的婚礼日期配图` },
  venue: { src: invitationImage('venue.webp'), label: '09 / 场地图片', alt: '婚礼场地或交通示意图片' },
};

export const photographs = [
  {
    src: 'courtyard',
    label: '在你身旁',
    index: '01',
    caption: '人间的风景很多，\n我偏爱有你的这一处。',
    paper: 'letter',
    carrier: '一封信笺',
    alt: `${wedding.bride}身穿红色长裙，与${wedding.groom}在中式庭院相望`,
    position: '50% 46%',
  },
  {
    src: 'promise',
    label: '把爱写成日常',
    index: '02',
    caption: '那些平凡的小事，\n因为是你，都值得珍藏。',
    paper: 'memo',
    carrier: '一页日常',
    alt: `${wedding.groom}轻吻身穿白色婚纱的${wedding.bride}的额头`,
    position: '50% 37%',
  },
  {
    src: 'together',
    label: '往后的每一页',
    index: '03',
    caption: '不用赶路。\n往后的日子，我们慢慢走。',
    paper: 'postcard',
    carrier: '一张明信片',
    alt: `${wedding.groom}与${wedding.bride}在花园中相拥，${wedding.bride}手捧白花`,
    position: '50% 35%',
  },
  {
    src: 'a-long-way',
    label: '都想和你一起',
    index: '04',
    caption: '这一页写我们，\n下一页，想请你也在场。',
    paper: 'book',
    carrier: '一页余生',
    alt: '新人牵手走过宽阔的绿色草坪',
    position: '50% 58%',
  },
];
export const letterNotes = [
  {
    label: '一纸短，情意长',
    caption:
      '把平凡的日子，\n过成我们的日子。\n\n也把这份欢喜，\n郑重地交给你。',
  },
  {
    label: '共赴我们的婚礼',
    caption: `${wedding.dateLong} · ${wedding.day}\n${wedding.lunar}\n${wedding.welcome} 到场 · ${wedding.ceremony} 仪式\n${wedding.venue}\n${wedding.room}`,
  },
  {
    label: `${wedding.groom} & ${wedding.bride}`,
    caption: '有你在，才是圆满。\n诚邀你，与我们一起，\n开启人生的新一页。',
  },
  {
    label: '致 · 亲爱的你',
    caption: '有些欢喜，想当面说。\n\n有些时刻，想与你一起。',
  },
];

export const albumPhotos = [
  { ...imageSlots.wide, caption: '把喜欢，留在每一帧里。', previewIndex: 4 },
  { ...imageSlots.close, caption: '镜头再近一点，幸福也是。', previewIndex: 5 },
  { ...imageSlots.portrait, caption: '最好的风景，是身旁的你。', previewIndex: 0 },
  { ...imageSlots.focus, caption: '往后的照片，都想和你一起。', previewIndex: 3 },
];
export const chatMessages = [
  { from: 'bride', text: '相册选好了吗？要选最好看的。' },
  { from: 'groom', text: '选好了，每一张都有你。' },
  { from: 'bride', text: '我是说，我们俩都好看的。' },
  { from: 'groom', text: '那就都留下，慢慢看。' },
  { from: 'bride', text: '记得把这份幸福也分享给大家 ♡' },
  { from: 'groom', text: '往下滑，看看我们的珍藏。' },
];
