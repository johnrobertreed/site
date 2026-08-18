"use client";

import { useEffect, useRef } from "react";
import { toggleTheme } from "@/lib/theme";

const MAX_TILT = 16;

export function Portrait() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const faceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const face = faceRef.current;
    if (!wrap || !face) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const apply = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      face.style.transform = `rotateX(${currentY.toFixed(2)}deg) rotateY(${currentX.toFixed(2)}deg) translateZ(10px)`;
      frame = requestAnimationFrame(apply);
    };
    frame = requestAnimationFrame(apply);

    const toward = (clientX: number, clientY: number) => {
      const rect = wrap.getBoundingClientRect();
      const dx = clientX - (rect.left + rect.width / 2);
      const dy = clientY - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) < 60) {
        targetX = 0;
        targetY = 0;
        return;
      }
      targetX = clamp((dx / (rect.width / 2)) * MAX_TILT, -MAX_TILT, MAX_TILT);
      targetY = clamp((-dy / (rect.height / 2)) * MAX_TILT, -MAX_TILT, MAX_TILT);
    };

    const onPointer = (event: PointerEvent) => toward(event.clientX, event.clientY);
    const reset = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    wrap.addEventListener("mouseleave", reset);
    wrap.addEventListener("touchend", reset);
    wrap.addEventListener("touchcancel", reset);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      wrap.removeEventListener("mouseleave", reset);
      wrap.removeEventListener("touchend", reset);
      wrap.removeEventListener("touchcancel", reset);
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
      <span ref={faceRef} className="avatar-face">
        <img
          className="avatar"
          src="/jr.jpg"
          alt="John Robert Reed"
          width={120}
          height={120}
        />
      </span>
    </button>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
