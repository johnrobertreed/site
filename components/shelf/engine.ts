import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { paintBack, paintFront, paintSpine } from "./paint";
import type { ShelfBook, ShelfHandle } from "./types";

type Pose = { x: number; z: number; yaw: number; scale: number; dim: number };

type BookNode = {
  book: ShelfBook;
  slot: THREE.Group;
  content: THREE.Group;
  handle: THREE.Group;
  idle: THREE.Group;
  pick: THREE.Mesh;
  blob: THREE.Mesh;
  width: number;
  height: number;
  thickness: number;
  pose: Pose;
  hoverLean: number;
  lit: THREE.MeshStandardMaterial[];
  baseColors: THREE.Color[];
};

type Mode = "browse" | "inspect";

const GAP = 0.04;
const SHELVED_Z = -0.1;
const REVEAL_Z = 0.06;
const REVEAL_YAW = 0.7;
const SHELVED_YAW = Math.PI / 2;
const REVEAL_SCALE = 1;
const NEIGHBOR_SCALE = 1;
const FAR_SCALE = 1;
const NEIGHBOR_LEAN = 0.1;
const HOVER_PRELEAN = 0.15;
const TILT_YAW_MAX = (23 * Math.PI) / 180;
const TILT_PITCH_MAX = (17 * Math.PI) / 180;
const TILT_ROLL_MAX = (8 * Math.PI) / 180;
const TILT_RATE = 5.2;
const POSE_RATE = 3.35;
const CAM_RATE = 4.2;
const HANDLE_REST_RATE = 6;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function phaseMs(base: number) {
  return reducedMotion() ? Math.max(90, base * 0.38) : base;
}

function follow(current: number, target: number, rate: number, dt: number) {
  if (reducedMotion()) return target;
  const k = 1 - Math.exp(-rate * dt);
  return lerp(current, target, k);
}

function q<T extends HTMLElement>(root: HTMLElement, name: string) {
  return root.querySelector<T>(`[data-shelf="${name}"]`);
}

function canvasTexture(source: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(source);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function clothMaterial(book: ShelfBook) {
  return new THREE.MeshPhysicalMaterial({
    color: book.cover,
    roughness: 0.78,
    sheen: 0.4,
    sheenRoughness: 0.7,
    sheenColor: new THREE.Color(book.ink),
    clearcoat: 0.05,
    clearcoatRoughness: 0.65,
  });
}

function paintPageEdge() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.fillStyle = "#f4ead4";
  ctx.fillRect(0, 0, 64, 512);
  for (let i = 0; i < 110; i += 1) {
    const y = (i / 110) * 512;
    const a = i % 3 === 0 ? 0.1 : 0.045;
    ctx.fillStyle = i % 2 === 0 ? `rgba(70,55,35,${a})` : `rgba(255,250,240,${a + 0.03})`;
    ctx.fillRect(0, y, 64, 1.2);
  }
  return canvas;
}

async function waitForType() {
  if (!("fonts" in document)) return;
  await Promise.all([
    document.fonts.load("600 42px Fraunces"),
    document.fonts.load("500 22px 'Instrument Sans'"),
    document.fonts.load("500 16px 'IBM Plex Mono'"),
  ]).catch(() => undefined);
}

function buildBook(
  book: ShelfBook,
  textures: {
    front: THREE.Texture;
    spine: THREE.Texture;
    back: THREE.Texture;
    pages: THREE.Texture;
  },
): BookNode {
  const width = clamp(book.height * book.coverAspect, 1.05, 1.85);
  const { height, thickness } = book;
  const slot = new THREE.Group();
  const content = new THREE.Group();
  const handle = new THREE.Group();
  const idle = new THREE.Group();
  const physical = new THREE.Group();

  const cloth = clothMaterial(book);
  const pageMat = new THREE.MeshStandardMaterial({
    color: 0xf3ead6,
    roughness: 0.94,
    metalness: 0,
  });
  pageMat.userData.keepBright = true;

  const pageW = width * 0.9;
  const pageH = height * 0.93;
  const pageD = thickness * 0.74;
  const pageX = (width - pageW) * 0.32;

  const pages = new THREE.Mesh(
    new RoundedBoxGeometry(pageW, pageH, pageD, 2, 0.012),
    pageMat,
  );
  pages.position.x = pageX;
  const front = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, 0.03, 2, 0.014),
    cloth.clone(),
  );
  front.position.z = thickness / 2;
  const back = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, 0.03, 2, 0.014),
    cloth.clone(),
  );
  back.position.z = -thickness / 2;
  const spine = new THREE.Mesh(
    new RoundedBoxGeometry(0.03, height, thickness, 2, 0.012),
    cloth.clone(),
  );
  spine.position.x = -width / 2 + 0.012;

  const edgeMat = new THREE.MeshStandardMaterial({
    map: textures.pages,
    roughness: 0.96,
    metalness: 0,
    color: 0xf4ead4,
  });
  edgeMat.userData.keepBright = true;
  const head = new THREE.Mesh(new THREE.PlaneGeometry(pageW * 0.98, pageD * 0.98), edgeMat);
  head.rotation.x = -Math.PI / 2;
  head.position.set(pageX, pageH / 2 + 0.001, 0);
  const tail = new THREE.Mesh(new THREE.PlaneGeometry(pageW * 0.98, pageD * 0.98), edgeMat.clone());
  tail.rotation.x = Math.PI / 2;
  tail.position.set(pageX, -pageH / 2 - 0.001, 0);
  const fore = new THREE.Mesh(new THREE.PlaneGeometry(pageD * 0.98, pageH * 0.98), edgeMat.clone());
  fore.rotation.y = Math.PI / 2;
  fore.position.set(pageX + pageW / 2 + 0.001, 0, 0);

  const frontArt = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.94, height * 0.94),
    new THREE.MeshBasicMaterial({ map: textures.front }),
  );
  frontArt.position.z = thickness / 2 + 0.018;
  frontArt.userData.coverFace = "front";

  const backArt = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.94, height * 0.94),
    new THREE.MeshBasicMaterial({ map: textures.back }),
  );
  backArt.position.z = -thickness / 2 - 0.018;
  backArt.rotation.y = Math.PI;
  backArt.userData.coverFace = "back";

  const spineArt = new THREE.Mesh(
    new THREE.PlaneGeometry(thickness * 0.88, height * 0.92),
    new THREE.MeshBasicMaterial({ map: textures.spine }),
  );
  spineArt.position.x = -width / 2 - 0.018;
  spineArt.rotation.y = -Math.PI / 2;
  spineArt.userData.coverFace = "spine";

  const pick = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.08, height + 0.08, thickness + 0.12),
    new THREE.MeshBasicMaterial({ visible: false }),
  );

  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 1.2, thickness * 2.6),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    }),
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.set(0, 0.004, 0);

  for (const mesh of [pages, front, back, spine, head, tail, fore, frontArt, backArt, spineArt]) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    physical.add(mesh);
  }
  physical.add(pick);
  idle.add(physical);
  handle.add(idle);
  content.add(handle);
  slot.add(content);
  slot.add(blob);
  slot.position.y = height / 2;

  const lit: THREE.MeshStandardMaterial[] = [];
  const baseColors: THREE.Color[] = [];
  physical.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const material = obj.material;
    if (!(material instanceof THREE.MeshStandardMaterial)) return;
    if (material.userData.keepBright) return;
    lit.push(material);
    baseColors.push(material.color.clone());
  });

  return {
    book,
    slot,
    content,
    handle,
    idle,
    pick,
    blob,
    width,
    height,
    thickness,
    pose: { x: 0, z: SHELVED_Z, yaw: SHELVED_YAW, scale: 1, dim: 0.6 },
    hoverLean: 0,
    lit,
    baseColors,
  };
}

function faceSpan(node: BookNode) {
  return node.width * Math.cos(REVEAL_YAW) + node.thickness * Math.sin(REVEAL_YAW);
}

function layoutX(nodes: BookNode[], presented: number) {
  const xs: number[] = [];
  let cursor = 0;
  for (let i = 0; i < nodes.length; i += 1) {
    const face = i === presented;
    const span = face ? faceSpan(nodes[i]) : nodes[i].thickness;
    const extra = face ? (nodes[i].width - nodes[i].thickness) * 0.12 : 0;
    cursor += extra;
    xs.push(cursor + span / 2);
    cursor += span + extra + GAP;
  }
  const origin = xs[presented] ?? 0;
  return xs.map((x) => x - origin);
}

function applyDim(node: BookNode, dim: number) {
  node.pose.dim = dim;
  const gain = lerp(0.5, 1, dim);
  node.lit.forEach((material, i) => {
    const base = node.baseColors[i];
    if (!base) return;
    material.color.copy(base).multiplyScalar(gain);
  });
  const blobMat = node.blob.material;
  if (blobMat instanceof THREE.MeshBasicMaterial) {
    blobMat.opacity = lerp(0.08, 0.22, dim);
  }
}

function applyPose(node: BookNode) {
  node.slot.position.x = node.pose.x;
  node.content.position.z = node.pose.z;
  node.content.rotation.y = node.pose.yaw + node.hoverLean;
  node.content.scale.set(1, 1, 1);
  node.blob.position.z = node.pose.z * 0.35;
  node.blob.scale.set(1, 1, 1);
  applyDim(node, node.pose.dim);
}

function mixPose(node: BookNode, from: Pose, to: Pose, t: number) {
  node.pose.x = lerp(from.x, to.x, t);
  node.pose.z = lerp(from.z, to.z, t);
  node.pose.yaw = lerp(from.yaw, to.yaw, t);
  node.pose.scale = lerp(from.scale, to.scale, t);
  node.pose.dim = lerp(from.dim, to.dim, t);
  applyPose(node);
}

function loadPhoto(url: string, anisotropy: number) {
  return new Promise<THREE.Texture | null>((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = anisotropy;
        resolve(texture);
      },
      undefined,
      () => resolve(null),
    );
  });
}

export function warmCovers(books: ShelfBook[]) {
  for (const book of books) {
    if (!book.coverImage) continue;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = book.coverImage;
  }
}

export async function initBookshelf(root: HTMLElement, books: ShelfBook[]): Promise<ShelfHandle> {
  const foundCanvas = q<HTMLCanvasElement>(root, "canvas");
  if (!foundCanvas) throw new Error("shelf canvas missing");
  const canvas: HTMLCanvasElement = foundCanvas;
  if (!window.WebGLRenderingContext) throw new Error("WebGL unavailable");

  await waitForType();

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    throw new Error("WebGL renderer failed");
  }

  const mobile = () => root.clientWidth < 620;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile() ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  const lookCurrent = new THREE.Vector3(0, 1.28, 0.15);
  const lookGoal = new THREE.Vector3(0, 1.28, 0.15);
  const posGoal = new THREE.Vector3(0, 1.42, 6.65);

  const hemi = new THREE.HemisphereLight(0xf2efe8, 0xc8c2b8, 0.52);
  const key = new THREE.DirectionalLight(0xfff4e6, 1.55);
  key.position.set(-1.6, 5.6, 4.8);
  key.castShadow = true;
  key.shadow.mapSize.set(mobile() ? 1024 : 2048, mobile() ? 1024 : 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 18;
  key.shadow.radius = 4;
  key.shadow.bias = -0.0008;
  const fill = new THREE.DirectionalLight(0xe8e4dc, 0.18);
  fill.position.set(2.4, 1.6, 1.8);
  scene.add(hemi, key, fill);

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.14 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 12), shadowMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  const plank = new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.08, 1.35),
    new THREE.MeshStandardMaterial({
      color: 0xc4b49a,
      roughness: 0.82,
      metalness: 0.02,
    }),
  );
  plank.position.set(0, -0.04, -0.08);
  plank.receiveShadow = true;
  plank.castShadow = true;
  scene.add(plank);

  const applyLights = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    hemi.color.set(dark ? 0xb8c0cc : 0xf2efe8);
    hemi.groundColor.set(dark ? 0x1a1a1a : 0xc8c2b8);
    hemi.intensity = dark ? 0.4 : 0.52;
    key.intensity = dark ? 1.25 : 1.55;
    key.color.set(dark ? 0xf0e6d8 : 0xfff4e6);
    fill.intensity = dark ? 0.12 : 0.18;
    shadowMat.opacity = dark ? 0.36 : 0.14;
  };
  applyLights();

  const themeWatch = new MutationObserver(applyLights);
  themeWatch.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const pageEdge = canvasTexture(paintPageEdge());
  pageEdge.wrapS = THREE.RepeatWrapping;
  pageEdge.wrapT = THREE.RepeatWrapping;
  const nodes: BookNode[] = [];
  const shelf = new THREE.Group();
  scene.add(shelf);

  for (const book of books) {
    const front = canvasTexture(paintFront(book));
    const spine = canvasTexture(paintSpine(book));
    const back = canvasTexture(paintBack(book));
    const node = buildBook(book, { front, spine, back, pages: pageEdge });
    node.pick.userData.bookIndex = nodes.length;
    nodes.push(node);
    shelf.add(node.slot);
    if (book.coverImage) {
      void loadPhoto(book.coverImage, anisotropy).then((photo) => {
        if (!photo) return;
        node.idle.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh)) return;
          if (obj.userData.coverFace !== "front") return;
          const mat = obj.material;
          if (mat instanceof THREE.MeshBasicMaterial) {
            mat.map = photo;
            mat.needsUpdate = true;
          }
        });
      });
    }
  }

  let presented = 0;
  let mode: Mode = "browse";
  let tweenToken = 0;
  let raf = 0;
  let visible = true;
  let lastTime = 0;
  let hoverIndex = -1;
  let pointerInside = false;
  let tiltYaw = 0;
  let tiltPitch = 0;
  let tiltRoll = 0;
  let tiltGoalYaw = 0;
  let tiltGoalPitch = 0;
  let tiltGoalRoll = 0;

  const posEl = q<HTMLElement>(root, "pos");
  const titleEl = q<HTMLElement>(root, "title");
  const authorEl = q<HTMLElement>(root, "author");
  const inspectBtn = q<HTMLButtonElement>(root, "inspect");
  const prevBtn = q<HTMLButtonElement>(root, "prev");
  const nextBtn = q<HTMLButtonElement>(root, "next");
  const ticksEl = q<HTMLElement>(root, "ticks");
  const details = q<HTMLElement>(root, "details");
  const dTitle = q<HTMLElement>(root, "d-title");
  const dAuthor = q<HTMLElement>(root, "d-author");
  const dDesc = q<HTMLElement>(root, "d-desc");
  const dLink = q<HTMLAnchorElement>(root, "d-link");
  const backBtn = q<HTMLButtonElement>(root, "back");
  const live = q<HTMLElement>(root, "live");

  const ticks: HTMLButtonElement[] = [];
  if (ticksEl) {
    ticksEl.replaceChildren();
    books.forEach((book, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Show ${book.shortTitle}`);
      btn.addEventListener("click", () => void goTo(index));
      ticksEl.append(btn);
      ticks.push(btn);
    });
  }

  const announce = (text: string) => {
    if (live) live.textContent = text;
  };

  const paintCaption = () => {
    const book = books[presented];
    if (!book) return;
    if (posEl) {
      posEl.textContent = `${String(presented + 1).padStart(2, "0")} / ${String(books.length).padStart(2, "0")}`;
    }
    if (titleEl) titleEl.textContent = book.shortTitle;
    if (authorEl) authorEl.textContent = book.author;
    ticks.forEach((tick, i) => tick.classList.toggle("is-active", i === presented));
    if (prevBtn) prevBtn.disabled = presented <= 0 || mode !== "browse";
    if (nextBtn) nextBtn.disabled = presented >= books.length - 1 || mode !== "browse";
  };

  const paintDetails = () => {
    const book = books[presented];
    if (!book) return;
    if (dTitle) dTitle.textContent = book.title;
    if (dAuthor) dAuthor.textContent = book.author;
    if (dDesc) dDesc.textContent = book.description;
    if (dLink) {
      dLink.href = book.url;
      dLink.textContent = book.url.includes("amazon.")
        ? "View on Amazon"
        : book.url.includes("openlibrary.org")
          ? "View on Open Library"
          : "View book";
    }
    if (details) details.setAttribute("aria-hidden", mode === "browse" ? "true" : "false");
  };

  function shelfDim(index: number) {
    if (index === presented) return 1;
    if (Math.abs(index - presented) === 1) return 0.7;
    return 0.52;
  }

  function shelfScale(index: number) {
    if (index === presented) return REVEAL_SCALE;
    if (Math.abs(index - presented) === 1) return NEIGHBOR_SCALE;
    return FAR_SCALE;
  }

  function shelfTarget(index: number): Pose {
    const xs = layoutX(nodes, presented);
    const face = index === presented;
    let yaw = face ? REVEAL_YAW : SHELVED_YAW;
    if (!face) {
      if (index === presented - 1) yaw += NEIGHBOR_LEAN;
      if (index === presented + 1) yaw -= NEIGHBOR_LEAN;
    }
    return {
      x: xs[index] ?? 0,
      z: face ? REVEAL_Z : SHELVED_Z,
      yaw,
      scale: shelfScale(index),
      dim: shelfDim(index),
    };
  }

  function inspectTarget(index: number): Pose {
    if (index === presented) {
      if (mobile()) return { x: 0, z: 1.2, yaw: 0.28, scale: 1, dim: 1 };
      return { x: 0, z: 1.38, yaw: 0.3, scale: 1, dim: 1 };
    }
    const xs = layoutX(nodes, presented);
    return {
      x: xs[index] ?? 0,
      z: SHELVED_Z - 0.7,
      yaw: SHELVED_YAW,
      scale: FAR_SCALE,
      dim: 0.28,
    };
  }

  function setBrowseCameraGoal() {
    camera.fov = root.clientWidth < 600 ? 33 : root.clientWidth < 920 ? 30 : 27;
    posGoal.set(0, 1.42, mobile() ? 8.85 : 7.2);
    lookGoal.set(0, 1.28, 0.12);
  }

  function setInspectCameraGoal() {
    camera.fov = root.clientWidth < 600 ? 32 : 28;
    posGoal.set(0, 1.38, mobile() ? 7.8 : 6.5);
    lookGoal.set(0, 1.2, mobile() ? 1.05 : 1.22);
  }

  function frameInspect() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    if (w > 620) {
      const panel = Math.min(320, w * 0.46);
      camera.setViewOffset(w, h, panel / 2, 0, w, h);
    } else {
      const sheet = Math.min(h * 0.4, 260);
      camera.setViewOffset(w, h, 0, sheet / 2, w, h);
    }
    camera.updateProjectionMatrix();
  }

  function placeCameraBrowse(snap: boolean) {
    setBrowseCameraGoal();
    camera.clearViewOffset();
    if (snap || reducedMotion()) {
      camera.position.copy(posGoal);
      lookCurrent.copy(lookGoal);
      camera.lookAt(lookCurrent);
    }
    camera.updateProjectionMatrix();
  }

  function placeCameraInspect(snap: boolean) {
    setInspectCameraGoal();
    if (snap || reducedMotion()) {
      camera.position.copy(posGoal);
      lookCurrent.copy(lookGoal);
      camera.lookAt(lookCurrent);
    }
    frameInspect();
  }

  function resize() {
    const w = Math.max(1, root.clientWidth);
    const h = Math.max(1, root.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (mode === "browse") placeCameraBrowse(false);
    else placeCameraInspect(false);
  }

  function snapShelf() {
    nodes.forEach((node, i) => {
      node.pose = shelfTarget(i);
      node.hoverLean = 0;
      node.handle.rotation.set(0, 0, 0);
      node.idle.position.set(0, 0, 0);
      node.idle.rotation.set(0, 0, 0);
      applyPose(node);
    });
  }

  function tween(duration: number, draw: (t: number) => void) {
    const token = ++tweenToken;
    return new Promise<void>((resolve) => {
      const start = performance.now();
      const step = (now: number) => {
        if (token !== tweenToken) {
          resolve();
          return;
        }
        const t = smoothstep((now - start) / duration);
        draw(t);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  async function playSwap(next: number) {
    if (mode !== "browse") return;
    const from = nodes.map((node) => ({ ...node.pose }));
    presented = next;
    paintCaption();
    announce(`Selected ${books[presented]?.title ?? ""} by ${books[presented]?.author ?? ""}`);
    const dest = nodes.map((_, i) => shelfTarget(i));
    await tween(phaseMs(820), (t) => {
      nodes.forEach((node, i) => {
        const a = from[i];
        const b = dest[i];
        if (!a || !b) return;
        mixPose(node, a, b, t);
      });
    });
  }

  async function goTo(index: number) {
    if (mode !== "browse") return;
    const next = clamp(index, 0, books.length - 1);
    if (next === presented) return;
    await playSwap(next);
  }

  function resetInspectMotion() {
    tiltYaw = 0;
    tiltPitch = 0;
    tiltRoll = 0;
    tiltGoalYaw = 0;
    tiltGoalPitch = 0;
    tiltGoalRoll = 0;
  }

  async function focusBook(index?: number) {
    if (mode !== "browse") return;
    if (typeof index === "number" && index !== presented) {
      await goTo(index);
      if (mode !== "browse") return;
    }
    mode = "inspect";
    root.classList.add("is-focused");
    canvas.style.touchAction = "none";
    canvas.style.cursor = "default";
    paintDetails();
    paintCaption();
    announce(`Inspecting ${books[presented]?.title ?? ""}`);
    resetInspectMotion();
    placeCameraInspect(false);
    const from = nodes.map((node) => ({ ...node.pose }));
    const dest = nodes.map((_, i) => inspectTarget(i));
    await tween(phaseMs(640), (t) => {
      nodes.forEach((node, i) => {
        const a = from[i];
        const b = dest[i];
        if (!a || !b) return;
        mixPose(node, a, b, t);
        node.hoverLean = lerp(node.hoverLean, 0, t);
      });
    });
  }

  async function returnToShelf() {
    if (mode !== "inspect") return;
    mode = "browse";
    resetInspectMotion();
    canvas.style.touchAction = "pan-y";
    canvas.style.cursor = "grab";
    root.classList.remove("is-focused");
    placeCameraBrowse(false);
    paintCaption();
    canvas.focus({ preventScroll: true });
    announce(`Selected ${books[presented]?.title ?? ""}`);
    const from = nodes.map((node) => ({ ...node.pose }));
    const dest = nodes.map((_, i) => shelfTarget(i));
    await tween(phaseMs(520), (t) => {
      nodes.forEach((node, i) => {
        const a = from[i];
        const b = dest[i];
        if (!a || !b) return;
        mixPose(node, a, b, t);
      });
    });
  }

  snapShelf();
  placeCameraBrowse(true);
  paintCaption();
  resize();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let dragX = 0;
  let dragAbs = 0;
  let dragging = false;
  let pointerId: number | null = null;

  function pickAt(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(nodes.map((n) => n.pick));
    const hit = hits[0]?.object;
    if (!hit) return -1;
    const index = hit.userData.bookIndex;
    return typeof index === "number" ? index : -1;
  }

  function setTiltGoal(event: PointerEvent) {
    if (reducedMotion()) {
      tiltGoalYaw = 0;
      tiltGoalPitch = 0;
      tiltGoalRoll = 0;
      return;
    }
    const nx = clamp((event.clientX / Math.max(1, window.innerWidth)) * 2 - 1, -1, 1);
    const ny = clamp(-((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1), -1, 1);
    tiltGoalYaw = nx * TILT_YAW_MAX;
    tiltGoalPitch = ny * TILT_PITCH_MAX;
    tiltGoalRoll = clamp(nx * 0.55 - ny * 0.2, -1, 1) * TILT_ROLL_MAX;
  }

  const onPointerDown = (event: PointerEvent) => {
    pointerId = event.pointerId;
    dragX = event.clientX;
    dragAbs = 0;
    dragging = false;
    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (pointerId === event.pointerId) {
      const dx = event.clientX - dragX;
      dragAbs += Math.abs(dx);
      if (mode === "browse") {
        if (dragAbs > 6) {
          dragging = true;
          canvas.classList.add("is-dragging");
        }
        if (dragging) {
          const unit = Math.max(105, canvas.clientWidth * 0.11);
          if (Math.abs(dx) >= unit * 0.55) {
            const dir = dx < 0 ? 1 : -1;
            dragX = event.clientX;
            void goTo(presented + dir);
          }
        }
      } else if (mode === "inspect" && dragAbs > 6) {
        dragging = true;
      }
    }
    if (mode === "inspect") {
      const hit = pickAt(event);
      canvas.style.cursor = hit === presented ? "default" : "pointer";
      return;
    }
    if (!dragging) {
      hoverIndex = pickAt(event);
      canvas.style.cursor = hoverIndex >= 0 ? "pointer" : "grab";
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    canvas.releasePointerCapture(event.pointerId);
    canvas.classList.remove("is-dragging");
    if (mode === "browse" && !dragging && dragAbs < 7) {
      const index = pickAt(event);
      if (index >= 0) void focusBook(index);
    } else if (mode === "inspect" && !dragging && dragAbs < 7) {
      const index = pickAt(event);
      if (index !== presented) void returnToShelf();
    }
    pointerId = null;
    dragging = false;
    if (mode === "browse") canvas.style.cursor = "grab";
  };

  const onPointerLeave = () => {
    hoverIndex = -1;
    if (mode === "browse" && !dragging) canvas.style.cursor = "grab";
  };

  const onWindowPointer = (event: PointerEvent) => {
    if (mode !== "inspect") return;
    pointerInside = true;
    setTiltGoal(event);
  };

  const onWindowLeave = () => {
    pointerInside = false;
    tiltGoalYaw = 0;
    tiltGoalPitch = 0;
    tiltGoalRoll = 0;
  };

  const onWheel = (event: WheelEvent) => {
    if (mode !== "browse") return;
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    const step = event.deltaX * 0.0024;
    if (Math.abs(step) < 0.04) return;
    void goTo(presented + (step > 0 ? 1 : -1));
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      if (mode === "inspect") {
        event.preventDefault();
        void returnToShelf();
      }
      return;
    }
    if (mode !== "browse") return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      void goTo(presented + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      void goTo(presented - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      void goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      void goTo(books.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      void focusBook();
    }
  };

  const onInspect = () => void focusBook();
  const onPrev = () => void goTo(presented - 1);
  const onNext = () => void goTo(presented + 1);
  const onBack = () => void returnToShelf();

  inspectBtn?.addEventListener("click", onInspect);
  prevBtn?.addEventListener("click", onPrev);
  nextBtn?.addEventListener("click", onNext);
  backBtn?.addEventListener("click", onBack);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("keydown", onKey);
  window.addEventListener("pointermove", onWindowPointer);
  document.documentElement.addEventListener("mouseleave", onWindowLeave);
  canvas.tabIndex = 0;

  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  const ro = new ResizeObserver(resize);
  ro.observe(root);

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    },
    { threshold: 0.05 },
  );
  io.observe(root);

  const tick = (time: number) => {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    const dt = lastTime ? clamp((time - lastTime) / 1000, 0.001, 0.05) : 0.016;
    lastTime = time;

    if (mode === "browse") {
      nodes.forEach((node, i) => {
        const want =
          !reducedMotion() && hoverIndex === i && i !== presented ? -HOVER_PRELEAN : 0;
        node.hoverLean = follow(node.hoverLean, want, POSE_RATE, dt);
        applyPose(node);
        node.handle.rotation.x = follow(node.handle.rotation.x, 0, HANDLE_REST_RATE, dt);
        node.handle.rotation.y = follow(node.handle.rotation.y, 0, HANDLE_REST_RATE, dt);
        node.handle.rotation.z = follow(node.handle.rotation.z, 0, HANDLE_REST_RATE, dt);
      });
    } else {
      const node = nodes[presented];
      if (!pointerInside) {
        tiltGoalYaw = 0;
        tiltGoalPitch = 0;
        tiltGoalRoll = 0;
      }
      tiltYaw = follow(tiltYaw, tiltGoalYaw, TILT_RATE, dt);
      tiltPitch = follow(tiltPitch, tiltGoalPitch, TILT_RATE, dt);
      tiltRoll = follow(tiltRoll, tiltGoalRoll, TILT_RATE, dt);
      if (node) {
        node.handle.rotation.y = tiltYaw;
        node.handle.rotation.x = tiltPitch;
        node.handle.rotation.z = tiltRoll;
        node.idle.position.set(0, 0, 0);
        node.idle.rotation.set(0, 0, 0);
      }
    }

    camera.position.x = follow(camera.position.x, posGoal.x, CAM_RATE, dt);
    camera.position.y = follow(camera.position.y, posGoal.y, CAM_RATE, dt);
    camera.position.z = follow(camera.position.z, posGoal.z, CAM_RATE, dt);
    lookCurrent.x = follow(lookCurrent.x, lookGoal.x, CAM_RATE, dt);
    lookCurrent.y = follow(lookCurrent.y, lookGoal.y, CAM_RATE, dt);
    lookCurrent.z = follow(lookCurrent.z, lookGoal.z, CAM_RATE, dt);
    camera.lookAt(lookCurrent);

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  root.classList.add("is-ready");

  const dispose = () => {
    cancelAnimationFrame(raf);
    tweenToken += 1;
    io.disconnect();
    ro.disconnect();
    themeWatch.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onWindowPointer);
    document.documentElement.removeEventListener("mouseleave", onWindowLeave);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("wheel", onWheel);
    canvas.removeEventListener("keydown", onKey);
    inspectBtn?.removeEventListener("click", onInspect);
    prevBtn?.removeEventListener("click", onPrev);
    nextBtn?.removeEventListener("click", onNext);
    backBtn?.removeEventListener("click", onBack);
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const material of materials) {
          if ("map" in material && material.map instanceof THREE.Texture) {
            material.map.dispose();
          }
          material.dispose();
        }
      }
    });
    renderer.dispose();
  };

  return { dispose };
}
