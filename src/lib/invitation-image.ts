import { wedding } from '@/data/wedding';

export const invitationImageName = `${wedding.groom}与${wedding.bride}的婚礼邀请-${wedding.date.replaceAll('.', '-')}.png`;

/** Draw a standalone keepsake at a fixed print size, independent of the screen. */
export async function createInvitationImage(): Promise<File> {
  await Promise.all([
    document.fonts.load('60px "Letter Hand"'),
    document.fonts.load('48px "Letter Serif"'),
    document.fonts.load('160px "Wedding Numerals"'),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1620;
  const context = canvas.getContext('2d')!;
  const red = '#a72f3c';
  const pink = '#fae9ec';
  const ink = '#1f1a1c';

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, 1080, 1620);
  context.fillStyle = '#fff7f8';
  context.fillRect(48, 48, 984, 150);
  context.fillStyle = pink;
  context.beginPath();
  context.arc(540, 370, 218, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = '#e8dadd';
  context.lineWidth = 2;
  context.strokeRect(48, 48, 984, 1524);

  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  const text = (
    value: string,
    y: number,
    font: string,
    color = ink,
    x = 540,
  ) => {
    context.fillStyle = color;
    context.font = font;
    context.fillText(value, x, y);
  };
  const rule = (y: number) => {
    context.beginPath();
    context.moveTo(150, y);
    context.lineTo(930, y);
    context.stroke();
  };
  const number = (
    base: string,
    emphasis: string,
    y: number,
    font: string,
    x = 540,
  ) => {
    context.font = font;
    const baseWidth = context.measureText(base).width;
    const totalWidth = baseWidth + context.measureText(emphasis).width;
    context.textAlign = 'left';
    text(base, y, font, ink, x - totalWidth / 2);
    text(emphasis, y, font, red, x - totalWidth / 2 + baseWidth);
    context.textAlign = 'center';
  };

  text('WE ARE GETTING MARRIED', 115, '700 26px "Letter Serif"', red);
  text('我们结婚啦！', 190, '700 52px "Letter Hand"', red);
  text('囍', 430, '700 210px "Letter Hand"', red);
  text(`${wedding.groom}  &  ${wedding.bride}`, 550, '700 62px "Letter Hand"');
  text('诚挚敬邀', 610, '30px "Letter Serif"', red);
  text('有你在，才是圆满。', 670, '32px "Letter Hand"');
  rule(719);
  const [year, month, day] = wedding.date.split('.');
  text(year, 792, '32px "Wedding Numerals"');
  number(`${month}.`, day, 981, '190px "Wedding Numerals"');
  text(`${wedding.day} · ${wedding.lunar}`, 1035, '30px "Letter Serif"');
  number(wedding.welcome.slice(0, 3), wedding.welcome.slice(3), 1162, '86px "Wedding Numerals"', 328);
  number(wedding.ceremony.slice(0, 3), wedding.ceremony.slice(3), 1162, '86px "Wedding Numerals"', 752);
  text('到场相聚', 1220, '30px "Letter Serif"', ink, 328);
  text('仪式开始', 1220, '30px "Letter Serif"', ink, 752);
  rule(1280);
  text(wedding.venue, 1369, '44px "Letter Serif"');
  text(wedding.room, 1438, '42px "Letter Hand"', red);
  text('以爱为笺，敬候相见。', 1520, '27px "Letter Hand"');

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (image) => image ? resolve(image) : reject(new Error('Image export failed')),
      'image/png',
    );
  });
  return new File([blob], invitationImageName, { type: 'image/png' });
}
