"use client";

import { useEffect, useRef, useState } from "react";
import { toggleTheme } from "@/lib/theme";

const DIRS = [
  "center",
  "top",
  "top-right",
  "right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "left",
  "top-left",
  "right-down",
  "down-right",
  "down-left",
  "left-down",
  "left-up",
  "up-left",
  "up-right",
  "right-up",
] as const;

type Dir = (typeof DIRS)[number];

const RING: Dir[] = [
  "right",
  "right-down",
  "bottom-right",
  "down-right",
  "bottom",
  "down-left",
  "bottom-left",
  "left-down",
  "left",
  "left-up",
  "top-left",
  "up-left",
  "top",
  "up-right",
  "top-right",
  "right-up",
];

function srcFor(dir: Dir) {
  return `/profile/${dir}.jpg`;
}

function directionFromPoint(wrap: HTMLElement, x: number, y: number): Dir {
  const rect = wrap.getBoundingClientRect();
  const dx = x - (rect.left + rect.width / 2);
  const dy = y - (rect.top + rect.height / 2);
  if (Math.hypot(dx, dy) < 60) return "center";
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const wedge = Math.floor(((deg + 11.25 + 360) % 360) / 22.5);
  return RING[wedge] ?? "center";
}

export function Portrait() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const [dir, setDir] = useState<Dir>("center");

  useEffect(() => {
    DIRS.forEach((name) => {
      const img = new Image();
      img.src = srcFor(name);
    });

    const wrap = wrapRef.current;
    if (!wrap) return;

    const onPointer = (event: PointerEvent) => {
      setDir(directionFromPoint(wrap, event.clientX, event.clientY));
    };
    const reset = () => setDir("center");

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("touchend", reset);
    window.addEventListener("touchcancel", reset);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("mouseleave", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("touchend", reset);
      window.removeEventListener("touchcancel", reset);
    };
  }, []);

  return (
    <button
      ref={wrapRef}
      type="button"
      className="avatar-wrap"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
    >
      <img
        className="avatar"
        src={srcFor(dir)}
        alt="John Robert Reed"
        width={120}
        height={120}
      />
    </button>
  );
}
