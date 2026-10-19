// 日常修改入口：姓名、日期、地点、文案。日期使用 YYYY-MM-DD，时间使用 HH:mm。
export const invitation = {
  groom: '张子乔',
  bride: '陈美嘉',
  date: '2027-01-31',
  // 农历请随公历日期手动核对。
  lunar: '农历腊月廿四',
  utcOffset: '+08:00',
  venue: '黄山市歙县徽苑一楼',
  room: '2号厅',
  mapCity: '黄山市',
  mapRegion: '歙县',
  welcome: '17:28',
  ceremony: '17:58',
  rsvpUrl: 'https://wj.qq.com/s2/27795794/u9dj/',
  // 留空时按配置生成邀请图；指定成品图后，需自行同步图片内的文字。
  invitationImage: '',
};

export const copy = {
  title: '我们结婚啦！',
  titleEnglish: 'WE ARE GETTING MARRIED',
  openingHeading: '一封写给你的幸福邀请',
  openingMessage: '一封请柬，一份欢喜，静候你的到来。',
  heroLines: ['嗨～当你看到这封邀请的时候', '我们的婚礼', '已经进入倒计时啦～'],
  keepsake: '往后余生，持证同行。',
  welcomeTitle: ['嘿，当你看到这封邀请，', '我们的婚礼已经进入倒计时。'],
  welcomeBody: ['很开心我们出现在彼此的生命中，', '也很开心能把这份喜悦，认真地分享给你。'],
  storyTitle: ['我们有的是以后，', '以后都是我们。'],
  storyBody: ['世界这么大，两个人相识相爱的概率很小。', '所以我们想把相处的日常，慢慢写进往后的每一天。'],
  storyQuote: ['“不是所有浪漫都要盛大。', '和你一起的普通日子，本身就足够珍贵。”'],
  storyFocusTitle: ['敬我们，', '也敬余生。'],
  storyFocusBody: ['有些欢喜，想当面说。', '有些时刻，想与你一起。'],
  detailsTitle: ['良辰已定，', '静候卿来。'],
  welcomeLabel: '到场相聚',
  ceremonyLabel: '仪式开始',
  rsvpTitle: ['为我们的婚礼，', '留一份你的期待。'],
  rsvpBody: ['想把这一天的欢喜，与你一起分享。', '告诉我们你的赴约计划，', '让我们为你留好位置。'],
  farewell: '谢谢你，来见证我们的幸福。',
  footer: '有你在，才是圆满。',
  footerDate: '不见不散',
  chatClock: '17:20',
  chatTime: '婚礼前的某一天 17:28',
};

const [year, month, day] = invitation.date.split('-').map(Number);
const date = new Date(Date.UTC(year, month - 1, day));
if (!/^\d{4}-\d{2}-\d{2}$/.test(invitation.date) || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
  throw new Error('婚礼日期无效，请使用 YYYY-MM-DD 格式的真实日期');
}
for (const time of [invitation.welcome, invitation.ceremony]) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('婚礼时间无效，请使用 HH:mm 格式');
}
const eventTime = Date.parse(`${invitation.date}T${invitation.ceremony}:00${invitation.utcOffset}`);
if (!Number.isFinite(eventTime)) throw new Error('婚礼时区偏移无效');

export const wedding = {
  ...invitation,
  date: invitation.date.replaceAll('-', '.'),
  dateLong: `${year} 年 ${month} 月 ${day} 日`,
  day: `星期${'日一二三四五六'[date.getUTCDay()]}`,
  address: `${invitation.venue}，${invitation.room}`,
  year,
  month: String(month).padStart(2, '0'),
  dayOfMonth: day,
  dayPadded: String(day).padStart(2, '0'),
  stampDate: `${year} · ${String(month).padStart(2, '0')} · ${String(day).padStart(2, '0')}`,
  calendarOffset: (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7,
  calendarDays: Array.from({ length: new Date(Date.UTC(year, month, 0)).getUTCDate() }, (_, index) => index + 1),
  eventTime,
};

export const metadata = {
  title: `${wedding.groom} & ${wedding.bride}｜${copy.title}`,
  description: `${wedding.groom}与${wedding.bride}的婚礼邀请。${wedding.dateLong}，${wedding.welcome} 到场，${wedding.ceremony} 仪式。${wedding.address}。诚邀你见证。`,
  shareDescription: `${wedding.dateLong}，${wedding.venue} ${wedding.room}。诚邀你见证我们的婚礼。`,
  siteName: `${wedding.groom}与${wedding.bride}的婚礼`,
  imageAlt: `${wedding.groom}与${wedding.bride}的婚礼邀请封面`,
};
