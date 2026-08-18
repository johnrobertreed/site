import { books, type Book } from "@/lib/content";
import type { Motif, ShelfBook } from "./types";

type Visual = {
  shortTitle: string;
  cover: string;
  accent: string;
  ink: string;
  motif: Motif;
  coverAspect: number;
  height: number;
  thickness: number;
};

const visuals: Record<string, Visual> = {
  "9780060517120": {
    shortTitle: "Crossing the Chasm",
    cover: "#1e3a5f",
    accent: "#d4a017",
    ink: "#f4efe4",
    motif: "wave",
    coverAspect: 0.65,
    height: 2.05,
    thickness: 0.22,
  },
  "9780062273208": {
    shortTitle: "Hard Things",
    cover: "#1a1a1a",
    accent: "#c0392b",
    ink: "#f2f2f2",
    motif: "steps",
    coverAspect: 0.66,
    height: 2.12,
    thickness: 0.26,
  },
  "9780061241895": {
    shortTitle: "Influence",
    cover: "#6b1d1d",
    accent: "#e8c37a",
    ink: "#f7f0e6",
    motif: "windows",
    coverAspect: 0.67,
    height: 2.0,
    thickness: 0.24,
  },
  "9780804139298": {
    shortTitle: "Zero to One",
    cover: "#111111",
    accent: "#f2f2f2",
    ink: "#f2f2f2",
    motif: "lattice",
    coverAspect: 0.66,
    height: 1.96,
    thickness: 0.2,
  },
  "9780374533557": {
    shortTitle: "Thinking, Fast and Slow",
    cover: "#2c1810",
    accent: "#c4a574",
    ink: "#f3ead8",
    motif: "continuum",
    coverAspect: 0.64,
    height: 2.18,
    thickness: 0.3,
  },
  "9781578645015": {
    shortTitle: "Poor Charlie's Almanack",
    cover: "#1f3d2b",
    accent: "#d4af37",
    ink: "#f6f1e3",
    motif: "branches",
    coverAspect: 0.72,
    height: 2.2,
    thickness: 0.32,
  },
  "9780857197689": {
    shortTitle: "Psychology of Money",
    cover: "#3d2914",
    accent: "#e6d5b8",
    ink: "#f7f1e6",
    motif: "maze",
    coverAspect: 0.65,
    height: 2.02,
    thickness: 0.21,
  },
  "9780684832722": {
    shortTitle: "Sovereign Individual",
    cover: "#241c15",
    accent: "#b8956a",
    ink: "#efe6d6",
    motif: "schematic",
    coverAspect: 0.66,
    height: 2.08,
    thickness: 0.25,
  },
  "9780060891541": {
    shortTitle: "On Writing Well",
    cover: "#2a2520",
    accent: "#f0ebe3",
    ink: "#f0ebe3",
    motif: "efficiency",
    coverAspect: 0.65,
    height: 1.94,
    thickness: 0.18,
  },
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function toShelfBook(book: Book): ShelfBook {
  const visual = visuals[book.isbn];
  if (!visual) {
    throw new Error(`Missing shelf visuals for ISBN ${book.isbn}`);
  }
  return {
    id: slugify(book.title),
    title: book.title,
    shortTitle: visual.shortTitle,
    author: book.author,
    description: book.description,
    url: book.href,
    isbn: book.isbn,
    cover: visual.cover,
    accent: visual.accent,
    ink: visual.ink,
    motif: visual.motif,
    coverImage: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`,
    coverAspect: visual.coverAspect,
    height: visual.height,
    thickness: visual.thickness,
  };
}

export function shelfCatalog(): ShelfBook[] {
  return [...books.map(toShelfBook)].sort((a, b) => b.height - a.height);
}
