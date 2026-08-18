import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { paintBack, paintFront, paintSpine } from "./paint";
import type { ShelfBook, ShelfHandle } from "./types";

type Pose = { x: number; z: number; yaw: number; scale: number };

type BookNode = {
  book: ShelfBook;
  slot: THREE.Group;
  content: THREE.Group;
  idle: THREE.Group;
  pick: THREE.Mesh;
  width: number;
  height: number;
  thickness: number;
  pose: Pose;
};

type Mode = "browse" | "focusing" | "inspect" | "returning";

const GAP = 0.045;
const SHELVED_Z = -0.64;
const LANE_Z = 0.04;
const PRESENT_Z = 0.36;
const PRESENT_SCALE = 1.035;

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
  return reducedMotion() ? base * 0.45 : base;
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

async function waitForType() {
  if (!("fonts" in document)) return;
  await Promise.all([
    document.fonts.load("600 42px Fraunces"),
    document.fonts.load("500 22px 'Instrument Sans'"),
    document.fonts.load("500 16px 'IBM Plex Mono'"),
  ]).catch(() => undefined);
}

function buildBook(book: ShelfBook, textures: {
  front: THREE.Texture;
  spine: THREE.Texture;
  back: THREE.Texture;
}): BookNode {
  const width = clamp(book.height * book.coverAspect, 1.05, 1.85);
  const { height, thickness } = book;
  const slot = new THREE.Group();
  const content = new THREE.Group();
  const idle = new THREE.Group();
  const physical = new THREE.Group();

  const cloth = clothMaterial(book);
  const pageMat = new THREE.MeshStandardMaterial({
    color: 0xf3ead6,
    roughness: 0.92,
    metalness: 0,
  });

  const pages = new THREE.Mesh(
    new RoundedBoxGeometry(width * 0.94, height * 0.97, thickness * 0.8, 2, 0.018),
    pageMat,
  );
  const front = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, 0.032, 2, 0.016),
    cloth.clone(),
  );
  front.position.z = thickness / 2;
  const back = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, 0.032, 2, 0.016),
    cloth.clone(),
  );
  back.position.z = -thickness / 2;
  const spine = new THREE.Mesh(
    new RoundedBoxGeometry(0.032, height, thickness, 2, 0.014),
    cloth.clone(),
  );
  spine.position.x = -width / 2 + 0.01;

  const bandMat = new THREE.MeshStandardMaterial({ color: book.accent, roughness: 0.55 });
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, thickness * 0.72, 10), bandMat);
  head.rotation.z = Math.PI / 2;
  head.position.set(-width / 2 + 0.02, height / 2 - 0.03, 0);
  const tail = head.clone();
  tail.position.y = -height / 2 + 0.03;

  const frontArt = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.94, height * 0.94),
    new THREE.MeshStandardMaterial({ map: textures.front, roughness: 0.72 }),
  );
  frontArt.position.z = thickness / 2 + 0.018;

  const backArt = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.94, height * 0.94),
    new THREE.MeshStandardMaterial({ map: textures.back, roughness: 0.78 }),
  );
  backArt.position.z = -thickness / 2 - 0.018;
  backArt.rotation.y = Math.PI;

  const spineArt = new THREE.Mesh(
    new THREE.PlaneGeometry(thickness * 0.88, height * 0.92),
    new THREE.MeshStandardMaterial({ map: textures.spine, roughness: 0.76 }),
  );
  spineArt.position.x = -width / 2 - 0.018;
  spineArt.rotation.y = -Math.PI / 2;

  const pick = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.08, height + 0.08, thickness + 0.12),
    new THREE.MeshBasicMaterial({ visible: false }),
  );

  for (const mesh of [pages, front, back, spine, head, tail, frontArt, backArt, spineArt]) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    physical.add(mesh);
  }
  physical.add(pick);
  idle.add(physical);
  content.add(idle);
  slot.add(content);
  slot.position.y = height / 2;

  return {
    book,
    slot,
    content,
    idle,
    pick,
    width,
    height,
    thickness,
    pose: { x: 0, z: SHELVED_Z, yaw: Math.PI / 2, scale: 1 },
  };
}

function layoutX(nodes: BookNode[], presented: number) {
  const xs: number[] = [];
  let cursor = 0;
  for (let i = 0; i < nodes.length; i += 1) {
    const face = i === presented;
    const span = face ? nodes[i].width : nodes[i].thickness;
    const extra = face ? (nodes[i].width - nodes[i].thickness) * 0.28 : 0;
    cursor += extra;
    xs.push(cursor + span / 2);
    cursor += span + extra + GAP;
  }
  const origin = xs[presented] ?? 0;
  return xs.map((x) => x - origin);
}

function applyPose(node: BookNode) {
  node.slot.position.x = node.pose.x;
  node.content.position.z = node.pose.z;
  node.content.rotation.y = node.pose.yaw;
  node.content.scale.setScalar(node.pose.scale);
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
  renderer.toneMappingExposure = 1.03;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  const controls = new OrbitControls(camera, canvas);
  controls.enabled = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = true;
  controls.minDistance = 2.7;
  controls.maxDistance = 7.2;
  controls.minPolarAngle = 0.22 * Math.PI;
  controls.maxPolarAngle = 0.78 * Math.PI;

  const hemi = new THREE.HemisphereLight(0xf2efe8, 0xc8c2b8, 0.85);
  const key = new THREE.DirectionalLight(0xfff6ea, 1.35);
  key.position.set(2.4, 5.2, 4.2);
  key.castShadow = true;
  key.shadow.mapSize.set(mobile() ? 1024 : 2048, mobile() ? 1024 : 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 18;
  const rim = new THREE.DirectionalLight(0xdde6f2, 0.55);
  rim.position.set(-3.2, 2.4, -2.6);
  const bounce = new THREE.PointLight(0xffe3c4, 0.4, 12);
  bounce.position.set(-1.2, 0.4, 2.4);
  scene.add(hemi, key, rim, bounce);

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.16 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 12), shadowMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  const applyLights = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    hemi.color.set(dark ? 0xb8c0cc : 0xf2efe8);
    hemi.groundColor.set(dark ? 0x1a1a1a : 0xc8c2b8);
    hemi.intensity = dark ? 0.55 : 0.85;
    key.intensity = dark ? 1.15 : 1.35;
    key.color.set(dark ? 0xf0e6d8 : 0xfff6ea);
    rim.intensity = dark ? 0.45 : 0.55;
    bounce.intensity = dark ? 0.28 : 0.4;
    shadowMat.opacity = dark ? 0.42 : 0.16;
  };
  applyLights();

  const themeWatch = new MutationObserver(applyLights);
  themeWatch.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const nodes: BookNode[] = [];
  const shelf = new THREE.Group();
  scene.add(shelf);

  for (const book of books) {
    const front = canvasTexture(paintFront(book));
    const spine = canvasTexture(paintSpine(book));
    const back = canvasTexture(paintBack(book));
    const node = buildBook(book, { front, spine, back });
    node.pick.userData.bookIndex = nodes.length;
    nodes.push(node);
    shelf.add(node.slot);
    if (book.coverImage) {
      void loadPhoto(book.coverImage, anisotropy).then((photo) => {
        if (!photo) return;
        node.idle.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh)) return;
          const mat = obj.material;
          if (mat instanceof THREE.MeshStandardMaterial && mat.map === front) {
            mat.map = photo;
            mat.needsUpdate = true;
          }
        });
      });
    }
  }

  let presented = 0;
  let mode: Mode = "browse";
  let swapping = false;
  let pending = 0;
  let raf = 0;
  let visible = true;
  let clock = 0;

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
      dLink.textContent = "View on Open Library";
    }
    if (details) details.setAttribute("aria-hidden", mode === "browse" ? "true" : "false");
  };

  function placeCameraBrowse() {
    camera.fov = root.clientWidth < 600 ? 33 : root.clientWidth < 920 ? 30 : 27;
    camera.position.set(0, 1.42, mobile() ? 8.3 : 6.65);
    camera.lookAt(0, 1.28, 0.15);
    camera.clearViewOffset();
    camera.updateProjectionMatrix();
    controls.target.set(0, 1.28, 0.15);
    controls.update();
  }

  function frameInspect() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    // Shift the projection so the book is centered in the leftover
    // space beside (or above) the details panel, not under it.
    if (w > 620) {
      const panel = Math.min(320, w * 0.46);
      camera.setViewOffset(w, h, panel / 2, 0, w, h);
    } else {
      const sheet = Math.min(h * 0.4, 260);
      camera.setViewOffset(w, h, 0, sheet / 2, w, h);
    }
    camera.updateProjectionMatrix();
  }

  function resize() {
    const w = Math.max(1, root.clientWidth);
    const h = Math.max(1, root.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (mode === "browse") placeCameraBrowse();
    else {
      camera.updateProjectionMatrix();
      frameInspect();
    }
  }

  function snapLayout(index: number) {
    const xs = layoutX(nodes, index);
    nodes.forEach((node, i) => {
      const face = i === index;
      node.pose.x = xs[i] ?? 0;
      node.pose.z = face ? PRESENT_Z : SHELVED_Z;
      node.pose.yaw = face ? 0 : Math.PI / 2;
      node.pose.scale = face ? PRESENT_SCALE : 1;
      applyPose(node);
    });
  }

  function tween(duration: number, draw: (t: number) => void) {
    return new Promise<void>((resolve) => {
      const start = performance.now();
      const step = (now: number) => {
        const t = smoothstep((now - start) / duration);
        draw(t);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  async function playSwap(next: number) {
    if (next === presented || swapping || mode !== "browse") return;
    swapping = true;
    const from = presented;
    const current = nodes[from];
    const incoming = nodes[next];
    if (!current || !incoming) {
      swapping = false;
      return;
    }
    const startXs = nodes.map((n) => n.pose.x);
    const midXs = layoutX(nodes, from);
    const endXs = layoutX(nodes, next);

    await tween(phaseMs(110), (t) => {
      current.pose.z = lerp(PRESENT_Z, LANE_Z, t);
      current.pose.scale = lerp(PRESENT_SCALE, 1, t);
      applyPose(current);
    });
    await tween(phaseMs(140), (t) => {
      current.pose.yaw = lerp(0, Math.PI / 2, t);
      applyPose(current);
    });
    await tween(phaseMs(130), (t) => {
      current.pose.z = lerp(LANE_Z, SHELVED_Z, t);
      nodes.forEach((node, i) => {
        node.pose.x = lerp(startXs[i] ?? 0, midXs[i] ?? 0, t * 0.4);
        applyPose(node);
      });
    });
    await tween(phaseMs(130), (t) => {
      incoming.pose.z = lerp(SHELVED_Z, LANE_Z, t);
      nodes.forEach((node, i) => {
        node.pose.x = lerp(midXs[i] ?? 0, endXs[i] ?? 0, t);
        applyPose(node);
      });
    });
    await tween(phaseMs(140), (t) => {
      incoming.pose.yaw = lerp(Math.PI / 2, 0, t);
      applyPose(incoming);
    });
    await tween(phaseMs(110), (t) => {
      incoming.pose.z = lerp(LANE_Z, PRESENT_Z, t);
      incoming.pose.scale = lerp(1, PRESENT_SCALE, t);
      applyPose(incoming);
    });

    presented = next;
    snapLayout(presented);
    paintCaption();
    announce(`Selected ${books[presented]?.title ?? ""} by ${books[presented]?.author ?? ""}`);
    swapping = false;
    if (pending !== 0) {
      const dir = pending > 0 ? 1 : -1;
      pending -= dir;
      void goTo(presented + dir);
    }
  }

  async function goTo(index: number) {
    const next = clamp(index, 0, books.length - 1);
    if (mode !== "browse") return;
    if (next === presented) return;
    if (swapping) {
      pending += next > presented ? 1 : -1;
      return;
    }
    await playSwap(next);
  }

  function focusPose(): Pose {
    if (mobile()) return { x: 0, z: 1.45, yaw: 0, scale: 0.88 };
    return { x: 0, z: 1.7, yaw: 0, scale: 1.05 };
  }

  async function focusBook(index?: number) {
    if (mode !== "browse" || swapping) return;
    if (typeof index === "number" && index !== presented) {
      await goTo(index);
    }
    mode = "focusing";
    root.classList.add("is-focused");
    canvas.style.touchAction = "none";
    paintDetails();
    announce(`Inspecting ${books[presented]?.title ?? ""}`);
    const node = nodes[presented];
    if (!node) return;
    const start = { ...node.pose };
    const dest = focusPose();
    frameInspect();
    await tween(phaseMs(280), (t) => {
      node.pose.x = lerp(start.x, dest.x, t);
      node.pose.z = lerp(start.z, dest.z, t);
      node.pose.scale = lerp(start.scale, dest.scale, t);
      applyPose(node);
      nodes.forEach((other, i) => {
        if (i === presented) return;
        other.content.position.z = lerp(other.pose.z, other.pose.z - 0.8, t);
      });
    });
    controls.target.copy(node.slot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0, dest.z)));
    controls.enabled = true;
    mode = "inspect";
  }

  async function returnToShelf() {
    if (mode !== "inspect" && mode !== "focusing") return;
    mode = "returning";
    controls.enabled = false;
    const node = nodes[presented];
    if (!node) return;
    const start = { ...node.pose };
    const destXs = layoutX(nodes, presented);
    await tween(phaseMs(260), (t) => {
      node.pose.x = lerp(start.x, destXs[presented] ?? 0, t);
      node.pose.z = lerp(start.z, PRESENT_Z, t);
      node.pose.scale = lerp(start.scale, PRESENT_SCALE, t);
      applyPose(node);
      nodes.forEach((other, i) => {
        if (i === presented) return;
        other.pose.x = destXs[i] ?? 0;
        applyPose(other);
      });
    });
    snapLayout(presented);
    placeCameraBrowse();
    canvas.style.touchAction = "pan-y";
    root.classList.remove("is-focused");
    mode = "browse";
    paintCaption();
    canvas.focus({ preventScroll: true });
    announce(`Selected ${books[presented]?.title ?? ""}`);
  }

  snapLayout(presented);
  placeCameraBrowse();
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

  const onPointerDown = (event: PointerEvent) => {
    if (mode !== "browse") return;
    pointerId = event.pointerId;
    dragX = event.clientX;
    dragAbs = 0;
    dragging = false;
    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (mode === "browse" && pointerId === event.pointerId) {
      const dx = event.clientX - dragX;
      dragAbs += Math.abs(dx);
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
    }
    if (mode === "browse" && !dragging) {
      const index = pickAt(event);
      canvas.style.cursor = index >= 0 ? "pointer" : "grab";
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    canvas.releasePointerCapture(event.pointerId);
    canvas.classList.remove("is-dragging");
    if (mode === "browse" && !dragging && dragAbs < 7) {
      const index = pickAt(event);
      if (index >= 0) void focusBook(index);
    }
    pointerId = null;
    dragging = false;
    canvas.style.cursor = "grab";
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
      if (mode === "inspect" || mode === "focusing") {
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

  inspectBtn?.addEventListener("click", () => void focusBook());
  prevBtn?.addEventListener("click", () => void goTo(presented - 1));
  nextBtn?.addEventListener("click", () => void goTo(presented + 1));
  backBtn?.addEventListener("click", () => void returnToShelf());
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("keydown", onKey);
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
    const dt = time * 0.001;
    clock = dt;
    if (mode === "inspect" && !reducedMotion()) {
      const node = nodes[presented];
      if (node) {
        node.idle.position.y = Math.sin(clock * 1.4) * 0.018;
        node.idle.rotation.y = Math.sin(clock * 0.9) * 0.02;
      }
    }
    if (controls.enabled) controls.update();
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  root.classList.add("is-ready");

  const dispose = () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    themeWatch.disconnect();
    window.removeEventListener("resize", onResize);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    canvas.removeEventListener("wheel", onWheel);
    canvas.removeEventListener("keydown", onKey);
    inspectBtn?.removeEventListener("click", () => void focusBook());
    controls.dispose();
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
