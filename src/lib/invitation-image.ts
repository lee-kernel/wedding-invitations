import { imageSlots, wedding } from '@/data/wedding';

export const invitationImageName = `${wedding.groom}与${wedding.bride}的婚礼邀请-${wedding.date.replaceAll('.', '-')}.png`;
export const invitationImageSize = { width: 1080, height: 2160 };

function loadPhoto(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Invitation portrait could not be loaded'));
    image.src = src;
  });
}

/** A paper invitation using the same portrait as the welcome section. */
export async function createInvitationImage(): Promise<File> {
  const [photo] = await Promise.all([
    loadPhoto(imageSlots.portrait.src),
    document.fonts.load('160px "Letter Hand"'),
    document.fonts.load('38px "Letter Serif"'),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = invitationImageSize.width;
  canvas.height = invitationImageSize.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable');
  const red = '#a72f3c';
  const ink = '#342b28';
  ctx.fillStyle = '#f8f5ed';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fine, repeatable paper grain, kept away from the photograph.
  let seed = 31;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 65000; i++) {
    ctx.fillStyle = `rgba(103, 79, 57, ${random() * 0.055})`;
    ctx.fillRect(random() * 1080, random() * 2160, 1.2, 1.2);
  }

  // Preserve the complete portrait, including its existing lettering and veil.
  const photoHeight = Math.min(1260, 1080 * photo.naturalHeight / photo.naturalWidth);
  const photoTop = 370;
  const scale = Math.min(1080 / photo.naturalWidth, photoHeight / photo.naturalHeight);
  const photoWidth = photo.naturalWidth * scale;
  ctx.drawImage(photo, (1080 - photoWidth) / 2, photoTop, photoWidth, photoHeight);
  const footerTop = photoTop + photoHeight;
  const text = (value: string, x: number, y: number, font: string, color = ink, align: CanvasTextAlign = 'left', maxWidth?: number) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    if (maxWidth) ctx.fillText(value, x, y, maxWidth);
    else ctx.fillText(value, x, y);
  };

  text('我们的', 45, 190, '170px "Letter Hand"', red);
  text('婚礼', 285, 353, '176px "Letter Hand"', red);
  text('WELCOME', 620, 105, '22px Georgia', ink);
  text('TO OUR', 65, 280, '22px Georgia', ink);
  text('WEDDING', 70, 325, '22px Georgia', ink);

  // A light ribbon drawing echoes the website bows without covering the photo.
  ctx.save();
  ctx.translate(900, 215);
  ctx.rotate(0.12);
  ctx.strokeStyle = '#786b64';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-105, -105, -110, 45, 0, 0);
  ctx.bezierCurveTo(100, -90, 105, 40, 0, 0);
  ctx.bezierCurveTo(-45, 45, -80, 35, -70, 105);
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(5, 45, 70, 50, 45, 120);
  ctx.stroke();
  ctx.restore();

  const y = footerTop + 65;
  text('【婚礼邀请函】', 55, y, '34px "Letter Serif"', red);
  text(`${wedding.groom} & ${wedding.bride}`, 1025, y, '34px "Letter Serif"', ink, 'right', 510);
  text('love', 65, y + 82, 'italic 58px Georgia', red);
  text('诚挚邀请您参加', 60, y + 155, '27px "Letter Serif"');
  text('我们的婚礼', 60, y + 202, '27px "Letter Serif"');
  text('与我们共同见证', 60, y + 294, '27px "Letter Serif"');
  text('并分享我们的幸福时刻', 60, y + 341, '27px "Letter Serif"');
  text(wedding.dateLong, 1020, y + 144, '32px "Letter Serif"', ink, 'right', 530);
  text(`${wedding.lunar} · ${wedding.day}`, 1020, y + 192, '26px "Letter Serif"', ink, 'right');
  text(`${wedding.welcome} 到场 · ${wedding.ceremony} 仪式`, 1020, y + 242, '25px "Letter Serif"', ink, 'right');
  text(wedding.venue, 1020, y + 315, '30px "Letter Serif"', ink, 'right', 500);
  text(wedding.room, 1020, y + 362, '28px "Letter Serif"', ink, 'right');
  text('I N V I T A T I O N', 1020, y + 445, '24px Georgia', red, 'right');

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((image) => image ? resolve(image) : reject(new Error('Image export failed')), 'image/png');
  });
  return new File([blob], invitationImageName, { type: 'image/png' });
}
