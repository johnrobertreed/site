"use client";

import { useEffect, useRef, useState } from "react";
import { useDrawerOpen } from "@/components/Accordion";
import { shelfCatalog } from "@/components/shelf/catalog";
import type { ShelfHandle } from "@/components/shelf/types";

const catalog = shelfCatalog();

export function Bookshelf() {
  const active = useDrawerOpen("bookshelf");
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ShelfHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!active || handleRef.current || failed) return;
    if (prefersSaveData()) {
      setFailed(true);
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    void (async () => {
      try {
        const { initBookshelf } = await import("@/components/shelf/engine");
        const handle = await initBookshelf(root, catalog);
        if (cancelled) {
          handle.dispose();
          return;
        }
        handleRef.current = handle;
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, failed]);

  useEffect(() => {
    return () => {
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, []);

  return (
    <div className="shelf-block">
      <p className="shelf-intro">
        A starter shelf while the real list gets swapped in. Drag the shelf to
        browse, click a book to pick it up.
      </p>

      <div
        ref={rootRef}
        className={`shelf-experience${active && !failed ? " is-active" : ""}${ready ? " is-ready" : ""}`}
        id="shelf-experience"
      >
        <canvas
          className="shelf-canvas"
          data-shelf="canvas"
          aria-label="Interactive 3D bookshelf"
        />
        <div className="shelf-caption">
          <div className="shelf-pos" data-shelf="pos" />
          <div className="shelf-title" data-shelf="title" />
          <div className="shelf-author" data-shelf="author" />
          <button type="button" className="shelf-inspect" data-shelf="inspect">
            Inspect ↗
          </button>
        </div>
        <button
          type="button"
          className="shelf-arrow shelf-arrow--left"
          data-shelf="prev"
          aria-label="Previous book"
        >
          ←
        </button>
        <button
          type="button"
          className="shelf-arrow shelf-arrow--right"
          data-shelf="next"
          aria-label="Next book"
        >
          →
        </button>
        <div className="shelf-ticks" data-shelf="ticks" />
        <aside className="shelf-details" data-shelf="details" aria-hidden="true">
          <button type="button" className="shelf-back" data-shelf="back">
            ← Back to shelf
          </button>
          <h3 className="shelf-details-title" data-shelf="d-title" />
          <p className="shelf-details-author" data-shelf="d-author" />
          <p className="shelf-details-desc" data-shelf="d-desc" />
          <a
            className="shelf-details-link"
            data-shelf="d-link"
            href="https://openlibrary.org"
            target="_blank"
            rel="noreferrer"
          >
            View on Open Library
          </a>
          <p className="shelf-details-hint">
            drag to orbit · scroll to zoom · esc to close
          </p>
        </aside>
        <div className="shelf-loading" aria-live="polite">
          assembling {catalog.length} volumes…
        </div>
        <p className="sr-only" data-shelf="live" aria-live="polite" />
      </div>

      <ul className={`books${ready && !failed ? " books-hidden" : ""}`} id="books-fallback">
        {catalog.map((book) => (
          <li key={book.id}>
            <a href={book.url} target="_blank" rel="noreferrer">
              {book.title}
            </a>
            <span className="author"> — {book.author}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function prefersSaveData() {
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}
