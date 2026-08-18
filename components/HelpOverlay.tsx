"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { email, helpTopics } from "@/lib/content";

function motionOff() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HelpOverlay() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [touchMode, setTouchMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const previewId = hoverId ?? activeId;
  const active = helpTopics.find((topic) => topic.id === previewId);
  const mailto = active
    ? `mailto:${email}?subject=${encodeURIComponent(active.label)}`
    : `mailto:${email}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onTouch = () => setTouchMode(true);
    window.addEventListener("touchstart", onTouch, { passive: true, once: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  useEffect(() => {
    const page = document.querySelector(".page");
    if (open) {
      wasOpen.current = true;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      page?.classList.add("is-leaving");
      closeRef.current?.focus();
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") closeHelp();
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("keydown", onKey);
      };
    }
    page?.classList.remove("is-leaving");
    if (wasOpen.current) triggerRef.current?.focus();
    return undefined;
  }, [open]);

  const openHelp = () => {
    window.scrollTo(0, 0);
    setShown(true);
    const start = () => setOpen(true);
    if (motionOff()) start();
    else requestAnimationFrame(start);
  };

  const closeHelp = () => {
    setOpen(false);
    window.setTimeout(() => setShown(false), motionOff() ? 0 : 250);
  };

  const overlay =
    mounted && shown
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`help-view${open ? " is-open" : ""}`}
          >
            <button
              ref={closeRef}
              type="button"
              className="help-back"
              aria-label="Back"
              onClick={closeHelp}
            >
              ←
            </button>

            <div className="help-content">
              <div className="help-image-wrap">
                <img
                  className="help-image"
                  src="/jr.jpg"
                  alt="John Robert Reed"
                  width={280}
                  height={280}
                />
              </div>
              <h2 id={titleId} className="help-title">
                3 things I can help with
              </h2>
              <div className="help-buttons">
                {helpTopics.map((topic) => {
                  const selected = topic.id === activeId;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      className={`help-btn${selected ? " active" : ""}`}
                      aria-pressed={selected}
                      onClick={() => setActiveId(topic.id)}
                      onPointerEnter={() => {
                        if (!touchMode) setHoverId(topic.id);
                      }}
                      onPointerLeave={() => {
                        if (!touchMode) setHoverId(null);
                      }}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>
              <p className={`help-subtitle${previewId ? " is-on" : ""}`}>
                {active?.subtitle ?? ""}
              </p>
              <a href={mailto} className="help-contact">
                Contact
              </a>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="help-trigger"
        onClick={openHelp}
      >
        How I can help
      </button>
      {overlay}
    </>
  );
}
