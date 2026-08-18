"use client";

import { useEffect, useId, useRef, useState } from "react";
import { email, helpTopics } from "@/lib/content";

export function HelpOverlay() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(helpTopics[0]?.id ?? "");
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const active = helpTopics.find((topic) => topic.id === activeId) ?? helpTopics[0];
  const mailto = active
    ? `mailto:${email}?subject=${encodeURIComponent(active.label)}`
    : `mailto:${email}`;

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();

      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      };
      window.addEventListener("keydown", onKey);

      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("keydown", onKey);
      };
    }

    if (wasOpen.current) {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-line bg-page px-5 py-2.5 text-[15px] text-ink shadow-[var(--shadow)] transition-colors hover:border-accent hover:text-accent"
        onClick={() => setOpen(true)}
      >
        How I can help
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-50 overflow-y-auto bg-page"
        >
          <div className="mx-auto flex min-h-full w-full max-w-[740px] flex-col px-6 py-10 sm:py-16">
            <button
              ref={closeRef}
              type="button"
              className="mb-10 w-fit font-mono text-[13px] text-muted transition-colors hover:text-ink"
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true">← </span>
              Back
            </button>

            <h2
              id={titleId}
              className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl"
            >
              3 things I can help with
            </h2>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {helpTopics.map((topic) => {
                const selected = topic.id === activeId;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    aria-pressed={selected}
                    className={`rounded-full border px-4 py-2 text-left text-[15px] transition-colors ${
                      selected
                        ? "border-accent bg-accent text-page"
                        : "border-line bg-page text-ink hover:border-accent hover:text-accent"
                    }`}
                    onClick={() => setActiveId(topic.id)}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>

            {active ? (
              <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-muted">
                {active.subtitle}
              </p>
            ) : null}

            <p className="mt-12 text-[15px] text-ink">
              Write to JR —{" "}
              <a href={mailto} className="company">
                {email}
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
