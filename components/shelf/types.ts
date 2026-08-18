export type Motif =
  | "wave"
  | "windows"
  | "efficiency"
  | "continuum"
  | "branches"
  | "maze"
  | "schematic"
  | "steps"
  | "lattice";

export type ShelfBook = {
  id: string;
  title: string;
  shortTitle: string;
  author: string;
  description: string;
  url: string;
  isbn: string;
  cover: string;
  accent: string;
  ink: string;
  motif: Motif;
  coverImage?: string;
  coverAspect: number;
  height: number;
  thickness: number;
};

export type ShelfHandle = {
  dispose: () => void;
};
