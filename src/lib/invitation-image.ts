import { wedding } from '@/data/wedding';

export const invitationImageName = `${wedding.groom}与${wedding.bride}的婚礼邀请-${wedding.date.replaceAll('.', '-')}.png`;

/** Draw a standalone keepsake at a fixed print size, independent of the screen. */
export async function createInvitationImage(): Promise<File> {
  await Promise.all([
    document.fonts.load('60px "LXGW WenKai GB"'),
    document.fonts.load('48px "Letter Serif"'),
    document.fonts.load('160px "Wedding Numerals"'),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1620;
  const context = canvas.getContext('2d')!;
  const red = '#902e2c';
  const ink = '#000000';
  context.fillStyle = '#f6f0e4';
  context.fillRect(0, 0, 1080, 1620);
  context.strokeStyle = '#c7b696';
  context.lineWidth = 1.5;
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

  text('一纸 · 余生', 132, '28px "Letter Serif"', red);
  text('囍', 382, '210px "LXGW WenKai GB"', red);
  text(`${wedding.groom}  &  ${wedding.bride}`, 520, '64px "LXGW WenKai GB"');
  text('诚挚敬邀', 585, '32px "Letter Serif"', red);
  text('有你在，才是圆满。', 655, '32px "LXGW WenKai GB"');
  rule(719);
  const [year, month, day] = wedding.date.split('.');
  text(year, 792, '32px "Wedding Numerals"');
  number(`${month}.`, day, 981, '190px "Wedding Numerals"');
  text(`${wedding.day} · ${wedding.lunar}`, 1035, '30px "Letter Serif"');
  number(
    wedding.welcome.slice(0, 3),
    wedding.welcome.slice(3),
    1162,
    '86px "Wedding Numerals"',
    328,
  );
  number(
    wedding.ceremony.slice(0, 3),
    wedding.ceremony.slice(3),
    1162,
    '86px "Wedding Numerals"',
    752,
  );
  text('到场相聚', 1220, '30px "Letter Serif"', ink, 328);
  text('仪式开始', 1220, '30px "Letter Serif"', ink, 752);
  rule(1280);
  text(wedding.venue, 1369, '44px "Letter Serif"');
  text(wedding.room, 1438, '42px "LXGW WenKai GB"', red);
  text('以爱为笺，敬候相见。', 1520, '27px "LXGW WenKai GB"');

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (image) =>
        image ? resolve(image) : reject(new Error('Image export failed')),
      'image/png',
    );
  });
  return new File([blob], invitationImageName, { type: 'image/png' });
}
