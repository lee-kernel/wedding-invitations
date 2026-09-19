export const wedding = {
  groom: '汪家喆',
  bride: '朱敏',
  date: '2026.10.03',
  dateLong: '2026 年 10 月 3 日',
  lunar: '农历八月廿三',
  day: '星期六',
  venue: '黄山市歙县徽苑一楼',
  room: '2号厅',
  address: '黄山市歙县徽苑一楼，2号厅',
  welcome: '17:28',
  ceremony: '17:58',
};

const invitationImage = (file: string) => `${import.meta.env.BASE_URL}images/invitation/${file}`;

export const imageSlots = {
  hero: { src: invitationImage('hero.webp'), label: '01 / 首屏创意主视觉', alt: '汪家喆与朱敏的婚礼创意主视觉' },
  musicCover: { src: invitationImage('music-cover.webp'), label: '音乐封面', alt: '汪家喆与朱敏的婚礼音乐封面' },
  portrait: { src: invitationImage('portrait.webp'), label: '02 / 双人竖图', alt: '汪家喆与朱敏并肩合影' },
  storyLeft: { src: invitationImage('story-left.webp'), label: '03 / 故事左图', alt: '汪家喆与朱敏的婚礼故事照片' },
  storyRight: { src: invitationImage('story-right.webp'), label: '04 / 故事右图', alt: '汪家喆与朱敏的婚礼故事照片' },
  focus: { src: invitationImage('story-focus.webp'), label: '05 / 故事主图', alt: '汪家喆与朱敏的婚纱照' },
  wide: { src: invitationImage('gallery-wide.webp'), label: '06 / 横向照片', alt: '汪家喆与朱敏的横向婚纱照' },
  close: { src: invitationImage('gallery-close.webp'), label: '07 / 横向近景', alt: '汪家喆与朱敏的近景婚纱照' },
  date: { src: invitationImage('wedding-date.webp'), label: '08 / 日期配图', alt: '汪家喆与朱敏的婚礼日期配图' },
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
    alt: '朱敏身穿红色长裙，与汪家喆在中式庭院相望',
    position: '50% 46%',
  },
  {
    src: 'promise',
    label: '把爱写成日常',
    index: '02',
    caption: '那些平凡的小事，\n因为是你，都值得珍藏。',
    paper: 'memo',
    carrier: '一页日常',
    alt: '汪家喆轻吻身穿白色婚纱的朱敏的额头',
    position: '50% 37%',
  },
  {
    src: 'together',
    label: '往后的每一页',
    index: '03',
    caption: '不用赶路。\n往后的日子，我们慢慢走。',
    paper: 'postcard',
    carrier: '一张明信片',
    alt: '汪家喆与朱敏在花园中相拥，朱敏手捧白花',
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
    label: '汪家喆 & 朱敏',
    caption: '有你在，才是圆满。\n诚邀你，与我们一起，\n开启人生的新一页。',
  },
  {
    label: '致 · 亲爱的你',
    caption: '有些欢喜，想当面说。\n\n有些时刻，想与你一起。',
  },
];
