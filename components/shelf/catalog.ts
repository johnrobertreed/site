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
  "9781439156810": {
    shortTitle: "On Writing",
    cover: "#3b2a1e",
    accent: "#e6d3b0",
    ink: "#f4efe4",
    motif: "efficiency",
    coverAspect: 0.65,
    height: 2.02,
    thickness: 0.2,
  },
  "9780679744399": {
    shortTitle: "Pretty Horses",
    cover: "#8a5a2b",
    accent: "#f0d5a0",
    ink: "#f7efe0",
    motif: "wave",
    coverAspect: 0.64,
    height: 2.08,
    thickness: 0.22,
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
  "9780060926175": {
    shortTitle: "Art of Living",
    cover: "#1e2a4a",
    accent: "#d4af37",
    ink: "#f4efe4",
    motif: "branches",
    coverAspect: 0.63,
    height: 2.14,
    thickness: 0.24,
  },
  "9780553418026": {
    shortTitle: "The Martian",
    cover: "#9a3412",
    accent: "#f0c070",
    ink: "#f7efe4",
    motif: "schematic",
    coverAspect: 0.66,
    height: 2.0,
    thickness: 0.26,
  },
  "9781250262486": {
    shortTitle: "Wanting",
    cover: "#6b1d2a",
    accent: "#e8c37a",
    ink: "#f7f0e6",
    motif: "maze",
    coverAspect: 0.67,
    height: 2.06,
    thickness: 0.21,
  },
  "9781324106036": {
    shortTitle: "Breakneck",
    cover: "#2c4a5e",
    accent: "#e6c84a",
    ink: "#f2efe6",
    motif: "steps",
    coverAspect: 0.68,
    height: 2.16,
    thickness: 0.23,
  },
  "9780451524935": {
    shortTitle: "1984",
    cover: "#7a1f1f",
    accent: "#d4c4a0",
    ink: "#f3ead8",
    motif: "windows",
    coverAspect: 0.62,
    height: 1.92,
    thickness: 0.18,
  },
  "9781501124068": {
    shortTitle: "Countries Go Broke",
    cover: "#8b1e1e",
    accent: "#f2f2f2",
    ink: "#f7f1e6",
    motif: "continuum",
    coverAspect: 0.66,
    height: 2.18,
    thickness: 0.3,
  },
  "9780593798690": {
    shortTitle: "Technological Republic",
    cover: "#152238",
    accent: "#c9a46c",
    ink: "#f0ebe3",
    motif: "lattice",
    coverAspect: 0.65,
    height: 2.12,
    thickness: 0.25,
  },
  "9781439149959": {
    shortTitle: "Lessons of History",
    cover: "#4a1c28",
    accent: "#d4af37",
    ink: "#f6f1e3",
    motif: "branches",
    coverAspect: 0.7,
    height: 1.94,
    thickness: 0.16,
  },
  "9781737676560": {
    shortTitle: "Great Founders Write",
    cover: "#d8c9a8",
    accent: "#2a2520",
    ink: "#2a2520",
    motif: "efficiency",
    coverAspect: 0.66,
    height: 1.98,
    thickness: 0.19,
  },
  "9780143134428": {
    shortTitle: "The New Map",
    cover: "#1a3a4a",
    accent: "#d4a017",
    ink: "#eef3f6",
    motif: "wave",
    coverAspect: 0.64,
    height: 2.2,
    thickness: 0.28,
  },
  "9781952120206": {
    shortTitle: "Angel Investing",
    cover: "#1f4d3a",
    accent: "#e6d5b8",
    ink: "#f4efe4",
    motif: "branches",
    coverAspect: 0.67,
    height: 2.1,
    thickness: 0.24,
  },
  "9780989341950": {
    shortTitle: "Art of Being There",
    cover: "#8b4a2f",
    accent: "#f0d5a0",
    ink: "#f7efe0",
    motif: "windows",
    coverAspect: 0.65,
    height: 2.04,
    thickness: 0.22,
  },
  "9781544514215": {
    shortTitle: "Almanack of Naval",
    cover: "#3d2e14",
    accent: "#e6c84a",
    ink: "#f7f1e6",
    motif: "lattice",
    coverAspect: 0.66,
    height: 2.07,
    thickness: 0.2,
  },
  "9780062464316": {
    shortTitle: "Homo Deus",
    cover: "#4a5560",
    accent: "#c8d4dc",
    ink: "#f2f4f6",
    motif: "continuum",
    coverAspect: 0.65,
    height: 2.15,
    thickness: 0.29,
  },
  "9780593236598": {
    shortTitle: "Outlive",
    cover: "#1a4a45",
    accent: "#d4c4a0",
    ink: "#eef6f4",
    motif: "steps",
    coverAspect: 0.68,
    height: 2.19,
    thickness: 0.31,
  },
  "9780307389831": {
    shortTitle: "When I Talk About Running",
    cover: "#2c3540",
    accent: "#b8c4c8",
    ink: "#eef2f4",
    motif: "wave",
    coverAspect: 0.63,
    height: 1.9,
    thickness: 0.17,
  },
  "9780525559993": {
    shortTitle: "The Power Law",
    cover: "#3d1f3a",
    accent: "#e0c070",
    ink: "#f6f0e6",
    motif: "maze",
    coverAspect: 0.66,
    height: 2.21,
    thickness: 0.3,
  },
  "9780525576709": {
    shortTitle: "Uninhabitable Earth",
    cover: "#7a3a12",
    accent: "#f0c070",
    ink: "#f7efe4",
    motif: "schematic",
    coverAspect: 0.65,
    height: 2.11,
    thickness: 0.27,
  },
  "9780143119418": {
    shortTitle: "More Money Than God",
    cover: "#1f3d2b",
    accent: "#d4af37",
    ink: "#f6f1e3",
    motif: "continuum",
    coverAspect: 0.64,
    height: 2.13,
    thickness: 0.28,
  },
  "9780525536499": {
    shortTitle: "The Fixer",
    cover: "#d4a017",
    accent: "#8b1e1e",
    ink: "#1a1a1a",
    motif: "windows",
    coverAspect: 0.67,
    height: 2.01,
    thickness: 0.21,
  },
  "9781732265103": {
    shortTitle: "High Growth Handbook",
    cover: "#c45c3e",
    accent: "#f4efe4",
    ink: "#f4efe4",
    motif: "steps",
    coverAspect: 0.72,
    height: 2.22,
    thickness: 0.32,
  },
  "9781612194196": {
    shortTitle: "Debt",
    cover: "#4a3020",
    accent: "#c4a574",
    ink: "#f3ead8",
    motif: "continuum",
    coverAspect: 0.65,
    height: 2.17,
    thickness: 0.32,
  },
  "9780071373586": {
    shortTitle: "Positioning",
    cover: "#1a3350",
    accent: "#d4a017",
    ink: "#f4efe4",
    motif: "lattice",
    coverAspect: 0.66,
    height: 1.93,
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
    coverImage: `/books/${book.isbn}.jpg`,
    coverAspect: visual.coverAspect,
    height: visual.height,
    thickness: visual.thickness,
  };
}

export function shelfCatalog(): ShelfBook[] {
  return [...books.map(toShelfBook)].sort((a, b) => b.height - a.height);
}
