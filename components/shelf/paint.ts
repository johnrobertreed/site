import type { Motif, ShelfBook } from "./types";

function seed(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number) {
  for (let i = 0; i < 1600; i += 1) {
    const x = rand() * w;
    const y = rand() * h;
    const a = 0.035 + rand() * 0.05;
    ctx.fillStyle = rand() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    ctx.fillRect(x, y, 1.2, 1.2);
  }
}

function paintMotif(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  motif: Motif,
  accent: string,
  rand: () => number,
) {
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 2;

  if (motif === "wave") {
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      const y0 = 140 + i * 70;
      ctx.moveTo(40, y0);
      for (let x = 40; x < w - 40; x += 12) {
        ctx.lineTo(x, y0 + Math.sin(x / 36 + i) * 16);
      }
      ctx.stroke();
    }
  } else if (motif === "windows") {
    const cols = 4;
    const rows = 6;
    const gw = 56;
    const gh = 64;
    const ox = (w - cols * gw) / 2;
    const oy = 150;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        ctx.globalAlpha = 0.3 + rand() * 0.4;
        ctx.strokeRect(ox + c * gw + 6, oy + r * gh + 6, gw - 16, gh - 16);
      }
    }
  } else if (motif === "lattice") {
    for (let x = 50; x < w - 40; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 130);
      ctx.lineTo(x, h - 180);
      ctx.stroke();
    }
    for (let y = 130; y < h - 180; y += 28) {
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(w - 50, y);
      ctx.stroke();
    }
  } else if (motif === "steps") {
    let x = 64;
    let y = h - 220;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < 6; i += 1) {
      x += 56;
      ctx.lineTo(x, y);
      y -= 70;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else if (motif === "branches") {
    const draw = (x: number, y: number, ang: number, len: number, depth: number) => {
      if (depth <= 0) return;
      const x2 = x + Math.cos(ang) * len;
      const y2 = y + Math.sin(ang) * len;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      draw(x2, y2, ang - 0.45, len * 0.68, depth - 1);
      draw(x2, y2, ang + 0.4, len * 0.64, depth - 1);
    };
    draw(w / 2, h - 200, -Math.PI / 2, 110, 6);
  } else if (motif === "maze") {
    const cell = 28;
    for (let y = 140; y < h - 200; y += cell) {
      for (let x = 56; x < w - 56; x += cell) {
        ctx.beginPath();
        if (rand() > 0.5) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + cell, y + cell);
        } else {
          ctx.moveTo(x + cell, y);
          ctx.lineTo(x, y + cell);
        }
        ctx.stroke();
      }
    }
  } else if (motif === "schematic") {
    for (let i = 0; i < 18; i += 1) {
      const x = 70 + rand() * (w - 140);
      const y = 160 + rand() * (h - 360);
      ctx.globalAlpha = 0.4 + rand() * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, 5 + rand() * 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(70 + rand() * (w - 140), 160 + rand() * (h - 360));
      ctx.stroke();
    }
  } else if (motif === "continuum") {
    for (let i = 0; i < 12; i += 1) {
      ctx.globalAlpha = 0.18 + i * 0.04;
      ctx.beginPath();
      ctx.ellipse(w / 2, 360, 40 + i * 16, 90 + i * 10, 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 5; i += 1) {
      const y = 180 + i * 80;
      ctx.fillRect(70, y, w - 140 - i * 18, 8);
    }
  }
  ctx.globalAlpha = 1;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current = next;
    }
  }
  if (lines.length < maxLines && current) lines.push(current);
  if (lines.length === maxLines && words.length) {
    let last = lines[lines.length - 1] ?? "";
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length) {
      last = last.slice(0, -1);
    }
    lines[lines.length - 1] = `${last}…`;
  }
  return lines;
}

export function paintFront(book: ShelfBook) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const rand = seed(book.id);
  ctx.fillStyle = book.cover;
  ctx.fillRect(0, 0, 512, 768);
  paintMotif(ctx, 512, 768, book.motif, book.accent, rand);
  grain(ctx, 512, 768, rand);
  ctx.strokeStyle = book.ink;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, 468, 724);
  ctx.globalAlpha = 1;
  ctx.fillStyle = book.ink;
  ctx.font = "600 42px Fraunces, Georgia, serif";
  wrapLines(ctx, book.title, 400, 4).forEach((line, i) => {
    ctx.fillText(line, 48, 560 + i * 48);
  });
  ctx.font = "500 20px 'Instrument Sans', system-ui, sans-serif";
  ctx.fillText(book.author, 48, 720);
  ctx.font = "500 11px 'IBM Plex Mono', monospace";
  ctx.fillText("BOOKSHELF", 48, 90);
  return canvas;
}

export function paintSpine(book: ShelfBook) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.fillStyle = book.cover;
  ctx.fillRect(0, 0, 128, 1024);
  ctx.fillStyle = book.accent;
  ctx.fillRect(0, 0, 10, 1024);
  ctx.save();
  ctx.translate(78, 900);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = book.ink;
  ctx.font = "600 42px Fraunces, Georgia, serif";
  ctx.fillText(book.shortTitle, 0, 0);
  ctx.font = "500 22px 'Instrument Sans', system-ui, sans-serif";
  ctx.fillText(book.author, 0, 40);
  ctx.restore();
  ctx.font = "600 16px 'IBM Plex Mono', monospace";
  ctx.fillStyle = book.ink;
  ctx.fillText("JR", 48, 990);
  return canvas;
}

export function paintBack(book: ShelfBook) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.fillStyle = book.cover;
  ctx.fillRect(0, 0, 512, 768);
  ctx.fillStyle = book.accent;
  ctx.fillRect(48, 80, 80, 3);
  ctx.fillStyle = book.ink;
  ctx.font = "500 22px 'Instrument Sans', system-ui, sans-serif";
  wrapLines(ctx, book.description, 400, 10).forEach((line, i) => {
    ctx.fillText(line, 48, 140 + i * 32);
  });
  ctx.font = "500 11px 'IBM Plex Mono', monospace";
  ctx.fillText("BOOKSHELF", 48, 700);
  return canvas;
}
