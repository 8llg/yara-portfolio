import {
  ACESFilmicToneMapping,
  BackSide,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  DataTexture,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  NearestFilter,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  RedFormat,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

export interface BustController {
  setDirection(direction: 'ltr' | 'rtl'): void;
  setScroll(progress: number): void;
  setActive(active: boolean): void;
  dispose(): void;
}

interface Options {
  reducedMotion: boolean;
  lowPower: boolean;
}

interface Rig {
  root: Object3D;
  headPivot: Object3D;
  update(t: number, look: Vector2, happy: number, blink: number): void;
  hitTargets: Object3D[];
}

const COLORS = {
  skin: '#f1d3c0',
  skinShade: '#c99a88',
  cloth: '#26222b',
  mask: '#17131b',
  trim: '#d9a441',
  lash: '#160f12',
  outline: '#07050a',
};

function gauss(dx: number, dy: number, dz: number, sigma: number): number {
  return Math.exp(-(dx * dx + dy * dy + dz * dz) / (2 * sigma * sigma));
}

function smooth(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function sculpt(p: Vector3): Vector3 {
  const { x, y, z } = p;
  let sx = 0.76;
  const sy = 1.0;
  let sz = 0.86;
  const jaw = smooth(0.0, -0.95, y);
  sx *= 1 - 0.26 * jaw;
  sz *= 1 - 0.06 * jaw;
  const nx = x * sx;
  const ny = y * sy;
  let nz = z * sz;
  if (z > 0) {
    nz += 0.04 * gauss(x - 0.42, y + 0.1, z - 0.62, 0.22) + 0.04 * gauss(x + 0.42, y + 0.1, z - 0.62, 0.22);
    nz -= 0.03 * gauss(x - 0.3, y - 0.12, z - 0.85, 0.12) + 0.03 * gauss(x + 0.3, y - 0.12, z - 0.85, 0.12);
    nz += 0.06 * gauss(x * 2.6, 0, 0, 0.12) * smooth(0.2, 0.0, y) * smooth(-0.35, -0.05, y) * smooth(0.7, 0.95, z);
  }
  return new Vector3(nx, ny, nz);
}

function deform(geometry: BufferGeometry, fn: (p: Vector3) => Vector3): BufferGeometry {
  const position = geometry.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < position.count; i += 1) {
    v.fromBufferAttribute(position, i);
    const out = fn(v);
    position.setXYZ(i, out.x, out.y, out.z);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function cutOpening(geometry: BufferGeometry, keep: (centroid: Vector3) => boolean): BufferGeometry {
  const index = geometry.index;
  const position = geometry.attributes.position;
  if (!index) return geometry;
  const kept: number[] = [];
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  for (let i = 0; i < index.count; i += 3) {
    a.fromBufferAttribute(position, index.getX(i));
    b.fromBufferAttribute(position, index.getX(i + 1));
    c.fromBufferAttribute(position, index.getX(i + 2));
    const centroid = a.add(b).add(c).multiplyScalar(1 / 3);
    if (keep(centroid)) kept.push(index.getX(i), index.getX(i + 1), index.getX(i + 2));
  }
  geometry.setIndex(kept);
  return geometry;
}

function toonGradient(): DataTexture {
  const data = new Uint8Array([110, 170, 225, 255]);
  const texture = new DataTexture(data, data.length, 1, RedFormat);
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

function outlineMaterial(thickness: number): ShaderMaterial {
  return new ShaderMaterial({
    side: BackSide,
    uniforms: { thickness: { value: thickness }, color: { value: new Color(COLORS.outline) } },
    vertexShader: 'uniform float thickness; void main() { vec3 p = position + normal * thickness; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }',
    fragmentShader: 'uniform vec3 color; void main() { gl_FragColor = vec4(color, 1.0); }',
  });
}

function irisTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const r = size / 2;
    const grad = ctx.createRadialGradient(r, r * 1.15, r * 0.1, r, r, r);
    grad.addColorStop(0, '#d9a441');
    grad.addColorStop(0.45, '#8a4f22');
    grad.addColorStop(0.85, '#3a1d12');
    grad.addColorStop(1, '#1a0d09');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#120808';
    ctx.beginPath();
    ctx.ellipse(r, r * 1.02, r * 0.34, r * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 220, 160, 0.35)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 24; i += 1) {
      const angle = (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(r + Math.cos(angle) * r * 0.42, r + Math.sin(angle) * r * 0.42);
      ctx.lineTo(r + Math.cos(angle) * r * 0.82, r + Math.sin(angle) * r * 0.82);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(r * 0.66, r * 0.6, r * 0.2, r * 0.16, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 1.32, r * 1.3, r * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function buildProcedural(detail: number): Rig {
  const gradientMap = toonGradient();
  const toon = (color: string) => new MeshToonMaterial({ color, gradientMap });
  const skin = toon(COLORS.skin);
  const cloth = toon(COLORS.cloth);
  const maskMat = toon(COLORS.mask);
  const trim = toon(COLORS.trim);
  const lashMat = new MeshBasicMaterial({ color: COLORS.lash });
  const outline = outlineMaterial(0.012);
  const outlineThick = outlineMaterial(0.02);
  const hitTargets: Object3D[] = [];

  const withOutline = (mesh: Mesh, material = outline) => {
    const hull = new Mesh(mesh.geometry, material);
    hull.renderOrder = -1;
    mesh.add(hull);
    return mesh;
  };

  const root = new Group();
  const headPivot = new Group();
  headPivot.position.set(0, 1.2, 0);
  const head = new Group();
  head.position.set(0, 0.52, 0);
  headPivot.add(head);
  root.add(headPivot);

  const face = withOutline(new Mesh(deform(new SphereGeometry(1, detail, detail), sculpt), skin));
  head.add(face);
  hitTargets.push(face);

  const scarfShell = new SphereGeometry(1, detail, detail);
  deform(scarfShell, (p) => sculpt(p).multiplyScalar(1.1).add(new Vector3(0, 0.02, -0.02)));
  cutOpening(scarfShell, (c) => {
    const inFace = c.z > 0.2 && Math.abs(c.x) < 0.6 * (1 - smooth(0.05, 0.55, c.y) * 0.25) * (1 - smooth(-0.2, -0.7, c.y) * 0.35) && c.y < 0.46 && c.y > -0.72;
    return !inFace;
  });
  const scarf = withOutline(new Mesh(scarfShell, cloth), outlineThick);
  scarf.material = cloth;
  (scarf.material as MeshToonMaterial).side = DoubleSide;
  head.add(scarf);
  hitTargets.push(scarf);

  const hemPoints: Vector3[] = [];
  for (let i = 0; i < 48; i += 1) {
    const angle = (i / 48) * Math.PI * 2;
    const y = -0.13 + 0.6 * Math.sin(angle);
    const narrow = 1 - smooth(-0.2, -0.7, y) * 0.35;
    const px = (0.6 * narrow * Math.cos(angle)) / 0.76;
    const pz = Math.sqrt(Math.max(0.02, 1 - px * px - y * y));
    hemPoints.push(sculpt(new Vector3(px, y, pz)).multiplyScalar(1.085));
  }
  const hem = withOutline(new Mesh(new TubeGeometry(new CatmullRomCurve3(hemPoints, true), 96, 0.05, 10, true), cloth));
  head.add(hem);

  const frontFold = new CatmullRomCurve3([
    new Vector3(-0.6, 0.42, 0.62),
    new Vector3(0, 0.54, 0.8),
    new Vector3(0.6, 0.42, 0.62),
  ]);
  head.add(new Mesh(new TubeGeometry(frontFold, 32, 0.035, 10, false), cloth));

  const eyes: { group: Group; parts: Mesh[]; iris: Mesh; happy: Mesh }[] = [];
  const iris = irisTexture();
  [-1, 1].forEach((side) => {
    const group = new Group();
    group.position.set(0.255 * side, 0.12, 0.8);
    group.rotation.y = 0.3 * side;
    group.rotation.z = -0.06 * side;
    head.add(group);
    const sclera = new Mesh(new CircleGeometry(0.115, 40), new MeshBasicMaterial({ color: '#fbf6f1' }));
    sclera.scale.set(1.25, 0.95, 1);
    group.add(sclera);
    const irisMesh = new Mesh(new CircleGeometry(0.088, 40), new MeshBasicMaterial({ map: iris, transparent: true }));
    irisMesh.position.z = 0.004;
    irisMesh.scale.set(0.95, 1.12, 1);
    group.add(irisMesh);
    const upper = new CatmullRomCurve3([
      new Vector3(-0.15 * side, -0.005, 0.01),
      new Vector3(-0.07 * side, 0.09, 0.02),
      new Vector3(0.05 * side, 0.112, 0.02),
      new Vector3(0.15 * side, 0.06, 0.015),
      new Vector3(0.21 * side, 0.1, 0.0),
    ]);
    const upperLash = new Mesh(new TubeGeometry(upper, 32, 0.017, 8, false), lashMat);
    group.add(upperLash);
    const lower = new CatmullRomCurve3([
      new Vector3(-0.1 * side, -0.07, 0.01),
      new Vector3(0.02 * side, -0.1, 0.012),
      new Vector3(0.12 * side, -0.065, 0.01),
    ]);
    const lowerLash = new Mesh(new TubeGeometry(lower, 16, 0.006, 6, false), lashMat);
    group.add(lowerLash);
    const happyCurve = new CatmullRomCurve3([
      new Vector3(-0.13 * side, -0.02, 0.02),
      new Vector3(0, 0.07, 0.025),
      new Vector3(0.13 * side, -0.02, 0.02),
    ]);
    const happy = new Mesh(new TubeGeometry(happyCurve, 24, 0.016, 8, false), lashMat);
    happy.visible = false;
    group.add(happy);
    const brow = new CatmullRomCurve3([
      new Vector3(-0.14 * side, 0.2, 0.0),
      new Vector3(0.0, 0.25, 0.01),
      new Vector3(0.16 * side, 0.22, -0.01),
    ]);
    const browMesh = new Mesh(new TubeGeometry(brow, 20, 0.011, 6, false), lashMat);
    head.add(browMesh);
    browMesh.position.copy(group.position);
    browMesh.rotation.copy(group.rotation);
    eyes.push({ group, parts: [sclera, irisMesh, upperLash, lowerLash], iris: irisMesh, happy });
  });

  const maskGeometry = new SphereGeometry(1, detail, Math.round(detail / 2), Math.PI / 2 - 0.95, 1.9, 1.66, 0.88);
  deform(maskGeometry, (p) => {
    const out = sculpt(p);
    const n = p.clone().normalize();
    const lift = 0.04 + 0.1 * gauss(p.x * 1.8, p.y + 0.1, 0, 0.16) * smooth(0.6, 0.95, p.z);
    const pleat = 0.006 * Math.sin((p.y + 0.1) * 30) * smooth(0.2, 0.7, p.z);
    return out.addScaledVector(n, lift + pleat);
  });
  const mask = withOutline(new Mesh(maskGeometry, maskMat));
  (mask.material as MeshToonMaterial).side = DoubleSide;
  head.add(mask);

  const drapeProfile = [
    new Vector2(0.62, 0.15),
    new Vector2(0.66, -0.3),
    new Vector2(0.74, -0.65),
    new Vector2(1.05, -0.95),
    new Vector2(1.38, -1.15),
    new Vector2(1.5, -1.35),
  ];
  const drape = withOutline(new Mesh(new LatheGeometry(drapeProfile, Math.max(48, detail)), cloth), outlineThick);
  drape.scale.set(1, 1, 0.7);
  drape.position.set(0, 0, -0.05);
  head.add(drape);

  const body = new Group();
  root.add(body);
  const torsoProfile = [
    new Vector2(0.001, 0.62),
    new Vector2(0.5, 0.6),
    new Vector2(1.1, 0.38),
    new Vector2(1.38, 0.1),
    new Vector2(1.46, -0.4),
    new Vector2(1.44, -1.1),
    new Vector2(1.5, -1.9),
    new Vector2(0.001, -1.9),
  ];
  const torso = withOutline(new Mesh(new LatheGeometry(torsoProfile, Math.max(48, detail)), cloth), outlineThick);
  torso.scale.set(1, 1, 0.55);
  torso.position.set(0, 0, -0.08);
  body.add(torso);
  hitTargets.push(torso);

  [-1, 1].forEach((side) => {
    const sleeve = withOutline(new Mesh(new CapsuleGeometry(0.34, 1.5, 8, 24), cloth), outlineThick);
    sleeve.position.set(1.42 * side, -0.85, 0.02);
    sleeve.rotation.z = 0.1 * side;
    body.add(sleeve);
    const edge = new CatmullRomCurve3([
      new Vector3(0.1 * side, 0.6, 0.62 * 0.55 + 0.05),
      new Vector3(0.22 * side, 0.1, 0.8 * 0.55 + 0.04),
      new Vector3(0.28 * side, -0.6, 0.82 * 0.55 + 0.04),
      new Vector3(0.3 * side, -1.9, 0.82 * 0.55 + 0.04),
    ]);
    body.add(new Mesh(new TubeGeometry(edge, 40, 0.018, 8, false), trim));
  });

  let blinkScale = 1;
  return {
    root,
    headPivot,
    hitTargets,
    update(t, look, happy, blink) {
      blinkScale = 1 - blink * 0.92;
      eyes.forEach(({ group, parts, iris: irisMesh, happy: arc }) => {
        const showHappy = happy > 0.5;
        group.scale.y = showHappy ? 1 : blinkScale;
        arc.visible = showHappy;
        parts.forEach((part) => {
          part.visible = !showHappy;
        });
        irisMesh.position.x = look.x * 0.022;
        irisMesh.position.y = -look.y * 0.016;
      });
      body.scale.y = 1 + Math.sin(t * 1.3) * 0.004;
    },
  };
}

async function loadVrm(scene: Scene): Promise<Rig | null> {
  try {
    const probe = await fetch(`${import.meta.env.BASE_URL}models/yara.vrm`, { method: 'HEAD' });
    if (!probe.ok || (probe.headers.get('content-type') ?? '').includes('text/html')) return null;
    const [{ GLTFLoader }, { VRMLoaderPlugin, VRMUtils }] = await Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('@pixiv/three-vrm'),
    ]);
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    const gltf = await loader.loadAsync(`${import.meta.env.BASE_URL}models/yara.vrm`);
    const vrm = gltf.userData.vrm as import('@pixiv/three-vrm').VRM | undefined;
    if (!vrm) return null;
    VRMUtils.removeUnnecessaryVertices(gltf.scene);
    VRMUtils.rotateVRM0(vrm);
    const root = new Group();
    vrm.scene.scale.setScalar(2.2);
    vrm.scene.position.set(0, -2.1, 0);
    root.add(vrm.scene);
    scene.add(root);
    const headBone = vrm.humanoid.getNormalizedBoneNode('head') ?? vrm.scene;
    const lookTarget = new Object3D();
    scene.add(lookTarget);
    if (vrm.lookAt) vrm.lookAt.target = lookTarget;
    let last = 0;
    return {
      root,
      headPivot: headBone,
      hitTargets: [vrm.scene],
      update(t, look, happy, blink) {
        lookTarget.position.set(look.x * 2, 1.4 - look.y * 1.2, 4);
        vrm.expressionManager?.setValue('blink', blink);
        vrm.expressionManager?.setValue('happy', happy);
        const delta = last ? t - last : 0.016;
        last = t;
        vrm.update(delta);
      },
    };
  } catch {
    return null;
  }
}

export async function mountBust(canvas: HTMLCanvasElement, options: Options): Promise<BustController> {
  const renderer = new WebGLRenderer({ canvas, antialias: !options.lowPower, alpha: true, powerPreference: 'high-performance' });
  const maxRatio = options.lowPower ? 1.25 : 1.75;
  let pixelRatio = Math.min(window.devicePixelRatio, maxRatio);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(26, 1, 0.1, 50);
  const lookAt = new Vector3(0, 1.15, 0);

  const key = new DirectionalLight('#fff1e4', 2.4);
  key.position.set(-3, 4, 5);
  const rim = new DirectionalLight('#e2a64a', 5);
  rim.position.set(4, 2.4, -3.5);
  const rimCool = new DirectionalLight('#a493c4', 3.2);
  rimCool.position.set(-4.2, 1.6, -3);
  const hemi = new HemisphereLight('#f6e7da', '#3a2830', 1.1);
  const fill = new DirectionalLight('#bfb0b8', 1.5);
  fill.position.set(2.5, -1, 4);
  scene.add(key, rim, rimCool, hemi, fill);

  const rig = (await loadVrm(scene)) ?? buildProcedural(options.lowPower ? 64 : 112);
  if (!rig.root.parent) scene.add(rig.root);

  const pointer = new Vector2(0, 0);
  const look = new Vector2(0, 0);
  const ndc = new Vector2(-2, -2);
  const raycaster = new Raycaster();
  let baseYaw = document.documentElement.dir === 'rtl' ? 0.32 : -0.32;
  let yaw = baseYaw;
  let scroll = 0;
  let smoothScroll = 0;
  let active = true;
  let frame = 0;
  let hovering = false;
  let happy = 0;
  let happyUntil = 0;
  let bounce = 0;
  let nextBlink = performance.now() + 2000;
  let blinkStart = -1;
  let slowFrames = 0;
  let lastFrame = performance.now();
  const start = performance.now();

  const onPointer = (event: PointerEvent) => {
    pointer.set((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
    const box = canvas.getBoundingClientRect();
    ndc.set(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1);
  };
  const onClick = (event: MouseEvent) => {
    const box = canvas.getBoundingClientRect();
    if (event.clientY < box.top || event.clientY > box.bottom) return;
    if (hovering) {
      happyUntil = performance.now() + 1400;
      bounce = 1;
    }
  };
  if (!options.reducedMotion) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('click', onClick);
  }

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = camera.aspect < 0.8 ? 34 : 26;
    camera.updateProjectionMatrix();
  };

  const render = (now: number) => {
    const t = (now - start) / 1000;
    const k = options.reducedMotion ? 1 : 0.07;
    look.lerp(pointer, k);
    yaw += (baseYaw - yaw) * (options.reducedMotion ? 1 : 0.04);
    smoothScroll += (scroll - smoothScroll) * (options.reducedMotion ? 1 : 0.1);

    if (!options.reducedMotion && Number.isFinite(ndc.x)) {
      raycaster.setFromCamera(ndc, camera);
      hovering = raycaster.intersectObjects(rig.hitTargets, true).length > 0;
      canvas.style.cursor = hovering ? 'pointer' : '';
    }
    const wantHappy = hovering || now < happyUntil ? 1 : 0;
    happy += (wantHappy - happy) * 0.2;
    bounce *= 0.9;

    let blink = 0;
    if (!options.reducedMotion && now > nextBlink && blinkStart < 0) blinkStart = now;
    if (blinkStart >= 0) {
      const p = (now - blinkStart) / 170;
      blink = Math.sin(Math.min(1, p) * Math.PI);
      if (p >= 1) {
        blinkStart = -1;
        nextBlink = now + 2400 + Math.random() * 3400;
      }
    }

    const idle = options.reducedMotion ? 0 : 1;
    rig.headPivot.rotation.y = yaw + look.x * 0.36 + Math.sin(t * 0.45) * 0.03 * idle;
    rig.headPivot.rotation.x = look.y * 0.14 + Math.sin(t * 0.6) * 0.012 * idle - smoothScroll * 0.1 - bounce * 0.08;
    rig.headPivot.rotation.z = -look.x * 0.05 + happy * 0.08 * (yaw > 0 ? -1 : 1);
    rig.root.rotation.y = yaw * 0.3 + look.x * 0.05 + smoothScroll * 0.55;
    rig.root.position.y = -smoothScroll * 0.4 + bounce * 0.05;
    rig.update(t, look, happy, blink);

    const narrow = camera.aspect < 0.8;
    camera.position.set(0, narrow ? 1.45 : 1.35, (narrow ? 10.6 : 9.6) - smoothScroll * 1.4);
    camera.lookAt(lookAt);
    renderer.render(scene, camera);

    const delta = now - lastFrame;
    lastFrame = now;
    if (delta > 26) slowFrames += 1;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 45 && pixelRatio > 1) {
      pixelRatio = Math.max(1, pixelRatio - 0.25);
      renderer.setPixelRatio(pixelRatio);
      resize();
      slowFrames = 0;
    }
  };

  const loop = (now: number) => {
    frame = 0;
    if (!active || document.hidden) return;
    render(now);
    if (!options.reducedMotion) frame = requestAnimationFrame(loop);
  };

  const observer = new ResizeObserver(() => {
    resize();
    if (options.reducedMotion) requestAnimationFrame(render);
  });
  observer.observe(canvas);
  resize();
  frame = requestAnimationFrame(loop);

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (active && !frame) {
      lastFrame = performance.now();
      frame = requestAnimationFrame(loop);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    setDirection(direction) {
      baseYaw = direction === 'rtl' ? 0.32 : -0.32;
      if (options.reducedMotion) requestAnimationFrame(render);
    },
    setScroll(progress) {
      scroll = progress;
      if (options.reducedMotion) requestAnimationFrame(render);
    },
    setActive(next) {
      if (next === active) return;
      active = next;
      if (active && !frame) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(loop);
      }
    },
    dispose() {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
    },
  };
}
