'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { BlockData, SeatItem, SelectedSeat, ViewStandName } from '@/types/stadium';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface TicketEaseStadium3DProps {
  selectedSeats: SelectedSeat[];
  maxSeats?: number;
  tierFilter: number | null;
  onToggleSeat: (seat: SelectedSeat) => void;
  onSetTierFilter: (tier: number | null) => void;
  onStatusMessage: (msg: string) => void;
}

const NM = ['North', 'East', 'South', 'West'];
const ROWS = 10;
const TIER = [
  [1.18, 1.5],
  [1.58, 1.96],
];
const TC: Record<number, number> = {
  4500: 0x86e8ab,
  2500: 0x5bc788,
  1800: 0x3a9c69,
  1200: 0x2f7d5a,
};

const VIEWS: Record<ViewStandName, { th: number; el: number; R: number }> = {
  Overview: { th: 3.93, el: 0.62, R: 300 },
  North: { th: Math.PI, el: 0.7, R: 170 },
  East: { th: 4.712, el: 0.7, R: 170 },
  South: { th: 0, el: 0.7, R: 170 },
  West: { th: 1.571, el: 0.7, R: 170 },
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function TicketEaseStadium3D({
  selectedSeats,
  maxSeats = 6,
  tierFilter,
  onToggleSeat,
  onSetTierFilter,
  onStatusMessage,
}: TicketEaseStadium3DProps) {
  const { language } = useLanguage();
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedSeatsRef = useRef(selectedSeats);
  selectedSeatsRef.current = selectedSeats;
  const tierFilterRef = useRef(tierFilter);
  tierFilterRef.current = tierFilter;

  // HUD & Tooltip state for React UI overlay
  const [mode, setMode] = useState<'orbit' | 'seat'>('orbit');
  const [activeSeat, setActiveSeat] = useState<SeatItem | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    title: string;
    desc: string;
  }>({ visible: false, x: 0, y: 0, title: '', desc: '' });

  // References to imperatively control Three.js scene
  const sceneState = useRef<{
    paintAll?: () => void;
    flyView?: (v: ViewStandName) => void;
    enterSeat?: (i: number) => void;
    leaveSeat?: () => void;
    navigateSeat?: (dr: number, dk: number) => void;
    toggleCurrentSeat?: (i: number) => void;
    activeSeatIndex?: number;
  }>({});

  // Initialize and run the complete standalone Three.js implementation
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Verify WebGL availability
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      onStatusMessage('The 3D stadium needs WebGL, which this browser does not support.');
      return;
    }

    const T = THREE;

    // Seeded PRNG for consistent procedural seat availability
    const rnd = (seed: number) => {
      let a = seed;
      return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };

    // 1. Data model: 24 blocks (4 stands x 3 blocks x 2 tiers)
    const blocks: BlockData[] = [];
    for (let t = 0; t < 2; t++) {
      for (let i = 0; i < 12; i++) {
        const st = (i / 3) | 0;
        const n = i % 3;
        const a0 = st * 90 - 45 + n * 30;
        const mid = st % 2 === 1 && n === 1;
        const g = rnd(t * 40 + i + 11);
        const price = t ? (mid ? 1800 : 1200) : mid ? 4500 : 2500;
        const code = NM[st] + ' ' + (t ? 'U' : 'L') + (n + 1);
        const dem = code === 'South U2' ? 2 : mid ? 0.72 : 0.3 + g() * 0.35;

        blocks.push({
          i: blocks.length,
          code,
          t,
          a0,
          a1: a0 + 30,
          price,
          seats: [...Array(ROWS)].map((_, r) =>
            [...Array(12 + r)].map(() => {
              const v = g();
              return v < dem ? 1 : v < dem + 0.03 ? 2 : 0;
            })
          ),
          base: 0,
        });
      }
    }

    const ro = [0];
    for (let r = 0; r < ROWS; r++) ro.push(ro[r] + 12 + r);
    blocks.forEach((b) => (b.base = b.i * ro[ROWS]));
    const idx = (b: BlockData, r: number, k: number) => b.base + ro[r] + k;

    const S: SeatItem[] = [];
    const ty = (t: number, r: number) => (t ? 14 + r * 1.1 : 2 + r * 0.9);
    const pos = (b: BlockData, r: number, k: number) => {
      const n = 12 + r;
      const a = (b.a1 - ((b.a1 - b.a0) * (k + 0.5)) / n) * (Math.PI / 180);
      const [s0, s1] = TIER[b.t];
      const s = s0 + ((s1 - s0) * (r + 0.5)) / ROWS;
      return {
        x: 75 * s * Math.sin(a),
        y: ty(b.t, r),
        z: -65 * s * Math.cos(a),
      };
    };

    blocks.forEach((b) => {
      for (let r = 0; r < ROWS; r++) {
        for (let k = 0; k < 12 + r; k++) {
          const p = pos(b, r, k);
          const yaw = Math.atan2(-p.x, -p.z);
          S.push({ b, r, k, p, yaw });
        }
      }
    });

    // 2. Three.js Scene Setup
    const ren = new T.WebGLRenderer({ antialias: true, alpha: false });
    ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const el = ren.domElement;
    canvasRef.current = el;
    el.tabIndex = 0;
    el.className = 'w-full h-full block touch-none cursor-grab active:cursor-grabbing outline-none';
    host.prepend(el);

    const scene = new T.Scene();
    scene.background = new T.Color(0x080b18);
    scene.fog = new T.Fog(0x080b18, 320, 800);

    const cam = new T.PerspectiveCamera(45, 1, 0.3, 1500);
    scene.add(new T.HemisphereLight(0xcfdde6, 0x10181a, 1));

    const dl = new T.DirectionalLight(0xfff1d8, 0.7);
    dl.position.set(120, 200, 80);
    scene.add(dl);

    // Ground
    const gr = new T.Mesh(
      new T.CircleGeometry(900, 48),
      new T.MeshStandardMaterial({ color: 0x080d10, roughness: 1 })
    );
    gr.rotation.x = -Math.PI / 2;
    gr.position.y = -0.05;
    scene.add(gr);

    // Cricket Pitch Canvas Texture
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1024;
    const c = cv.getContext('2d')!;
    for (let i = 0; i < 16; i++) {
      c.fillStyle = i % 2 ? '#225c38' : '#1b4d2e';
      c.fillRect(i * 64, 0, 64, 1024);
    }
    c.strokeStyle = 'rgba(255,255,255,.55)';
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(512, 512, 184, 213, 0, 0, 7);
    c.stroke();
    c.fillStyle = '#cdbf94';
    c.fillRect(502, 433, 21, 158);
    c.fillStyle = '#fff';
    [441, 583].forEach((y) => c.fillRect(490, y, 45, 2));

    const tx = new T.CanvasTexture(cv);
    const pm = new T.Mesh(
      new T.CircleGeometry(1, 96),
      new T.MeshStandardMaterial({
        map: tx,
        emissive: 0xffffff,
        emissiveMap: tx,
        emissiveIntensity: 0.25,
        roughness: 1,
      })
    );
    pm.scale.set(75, 65, 1);
    pm.rotation.x = -Math.PI / 2;
    scene.add(pm);

    // Boundary rope
    const rp: THREE.Vector3[] = [];
    for (let i = 0; i < 128; i++) {
      const a = (i / 128) * 6.2832;
      rp.push(new T.Vector3(75 * Math.sin(a), 0.08, -65 * Math.cos(a)));
    }
    scene.add(
      new T.LineLoop(new T.BufferGeometry().setFromPoints(rp), new T.LineBasicMaterial({ color: 0xffffff }))
    );

    // Boundary advertising hoardings
    const hm = [0x8b5cf6, 0x1c1f2d].map((x) => new T.MeshStandardMaterial({ color: x, roughness: 0.6 }));
    for (let i = 0; i < 48; i++) {
      const a = ((i + 0.5) / 48) * 6.2832;
      const m = new T.Mesh(new T.BoxGeometry(10.5, 1.1, 0.3), hm[i % 2]);
      m.position.set(78 * Math.sin(a), 0.55, -67.6 * Math.cos(a));
      m.rotation.y = -Math.atan2(67.6 * Math.sin(a), 78 * Math.cos(a));
      scene.add(m);
    }

    // Sight screens
    [-1, 1].forEach((d) => {
      const m = new T.Mesh(new T.BoxGeometry(14, 7, 0.5), new T.MeshStandardMaterial({ color: 0xf2f2ee }));
      m.position.set(0, 3.5, d * 69.5);
      scene.add(m);
    });

    // 3. Swept Concrete Bowl Ring
    function ring(prof: number[][], col: number, N = 120) {
      const p: number[] = [];
      const ix: number[] = [];
      prof.forEach(([s, y]) => {
        for (let i = 0; i <= N; i++) {
          const a = (i / N) * 6.2832;
          p.push(75 * s * Math.sin(a), y, -65 * s * Math.cos(a));
        }
      });
      for (let j = 0; j < prof.length - 1; j++) {
        for (let i = 0; i < N; i++) {
          const a = j * (N + 1) + i;
          const b = a + 1;
          const d = a + N + 1;
          ix.push(a, d, b, b, d, d + 1);
        }
      }
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
      g.setIndex(ix);
      return new T.Mesh(
        g,
        new T.MeshStandardMaterial({ color: col, roughness: 0.95, side: T.DoubleSide, flatShading: true })
      );
    }

    const tierRows = (t: number) => {
      const [s0, s1] = TIER[t];
      const p: number[][] = [];
      for (let r = 0; r < ROWS; r++) {
        const y = ty(t, r);
        p.push([s0 + ((s1 - s0) * r) / ROWS, y], [s0 + ((s1 - s0) * (r + 1)) / ROWS, y]);
      }
      return p;
    };

    const TER = ring(
      [[1.18, 0], ...tierRows(0), [1.5, 14], ...tierRows(1), [1.96, 28], [2.1, 28], [2.1, 0]],
      0x141828
    );
    scene.add(TER);

    // 4. Floodlights with radial gradient flares
    const gc = document.createElement('canvas');
    gc.width = gc.height = 64;
    const g2 = gc.getContext('2d')!;
    const gg = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
    gg.addColorStop(0, 'rgba(255,248,224,1)');
    gg.addColorStop(0.25, 'rgba(255,244,214,.45)');
    gg.addColorStop(1, 'rgba(255,244,214,0)');
    g2.fillStyle = gg;
    g2.fillRect(0, 0, 64, 64);
    const gt = new T.CanvasTexture(gc);

    [45, 135, 225, 315].forEach((d) => {
      const a = (d * Math.PI) / 180;
      const x = 172 * Math.sin(a);
      const z = -150 * Math.cos(a);
      const m = new T.Mesh(
        new T.CylinderGeometry(0.7, 1.1, 56, 8),
        new T.MeshStandardMaterial({ color: 0x2a333a })
      );
      m.position.set(x, 28, z);
      scene.add(m);

      const h = new T.Mesh(new T.BoxGeometry(14, 7, 1.2), new T.MeshBasicMaterial({ color: 0xfff4d6 }));
      h.position.set(x, 58, z);
      h.lookAt(0, 20, 0);
      scene.add(h);

      const s = new T.Sprite(
        new T.SpriteMaterial({ map: gt, fog: false, depthWrite: false, blending: T.AdditiveBlending })
      );
      s.scale.set(90, 90, 1);
      s.position.set(x, 58, z);
      scene.add(s);
    });

    // 5. Instanced Seats
    const N = S.length;
    const sm = new T.MeshStandardMaterial({ roughness: 0.7 });
    const IC = new T.InstancedMesh(new T.BoxGeometry(1.5, 0.35, 1.4), sm, N);
    const IB = new T.InstancedMesh(new T.BoxGeometry(1.5, 1.1, 0.25), sm, N);

    const M = new T.Matrix4();
    const Q = new T.Quaternion();
    const V = new T.Vector3();
    const UP = new T.Vector3(0, 1, 0);
    const ONE = new T.Vector3(1, 1, 1);
    const col = new T.Color();
    const WH = new T.Color(0xffffff);

    let hov = -1;
    let dirty = 1;
    let currentMode: 'orbit' | 'seat' = 'orbit';

    let se: { i: number; e: THREE.Vector3; yaw: number; pi: number; f: number } | null = null;
    let ob = { th: 3.93, el: 0.62, R: 300 };
    const TG = new T.Vector3(0, 6, 0);
    const cur = { p: new T.Vector3(), l: new T.Vector3(), f: 45 };
    let tw: {
      a: { p: THREE.Vector3; l: THREE.Vector3; f: number };
      b: { p: THREE.Vector3; l: THREE.Vector3; f: number };
      t0: number;
      ms: number;
    } | null = null;

    const paint = (i: number) => {
      const s = S[i];
      const st = s.b.seats[s.r][s.k];
      const isSelected = selectedSeatsRef.current.some((x) => x.i === i);

      if (isSelected) {
        col.set(0x8b5cf6); // TicketEase Electric Violet
      } else if (st === 1) {
        col.set(0x39434a); // Sold
      } else if (st === 2) {
        col.set(0xd19a2a); // Held
      } else {
        col.set(TC[s.b.price]); // Available tier color
      }

      if (!isSelected && !st && tierFilterRef.current && s.b.price !== tierFilterRef.current) {
        col.multiplyScalar(0.2);
      }
      if (i === hov && !st && !isSelected) {
        col.copy(WH);
      }

      IC.setColorAt(i, col);
      IB.setColorAt(i, col);
      if (IC.instanceColor) IC.instanceColor.needsUpdate = true;
      if (IB.instanceColor) IB.instanceColor.needsUpdate = true;
      dirty = 1;
    };

    const paintAll = () => {
      for (let i = 0; i < N; i++) paint(i);
    };

    // Position seats on mount
    S.forEach((s, i) => {
      const p = s.p;
      const yaw = s.yaw;
      Q.setFromAxisAngle(UP, yaw);
      M.compose(V.set(p.x, p.y + 0.2, p.z), Q, ONE);
      IC.setMatrixAt(i, M);
      M.compose(V.set(p.x - Math.sin(yaw) * 0.62, p.y + 0.85, p.z - Math.cos(yaw) * 0.62), Q, ONE);
      IB.setMatrixAt(i, M);
      paint(i);
    });

    scene.add(IC, IB);

    // 6. Camera Poses and Flight Animation
    function pose() {
      if (currentMode === 'orbit') {
        const cVal = Math.cos(ob.el);
        return {
          p: new T.Vector3(
            TG.x + ob.R * Math.sin(ob.th) * cVal,
            TG.y + ob.R * Math.sin(ob.el),
            TG.z - ob.R * Math.cos(ob.th) * cVal
          ),
          l: TG.clone(),
          f: 45,
        };
      }
      const cVal = Math.cos(se!.pi);
      return {
        p: se!.e.clone(),
        l: se!.e
          .clone()
          .add(
            new T.Vector3(
              Math.sin(se!.yaw) * cVal,
              Math.sin(se!.pi),
              Math.cos(se!.yaw) * cVal
            ).multiplyScalar(20)
          ),
        f: se!.f,
      };
    }

    function applyPose(q: { p: THREE.Vector3; l: THREE.Vector3; f: number }) {
      cur.p.copy(q.p);
      cur.l.copy(q.l);
      cur.f = q.f;
      cam.position.copy(q.p);
      cam.lookAt(q.l);
      if (cam.fov !== q.f) {
        cam.fov = q.f;
        cam.updateProjectionMatrix();
      }
      dirty = 1;
    }

    const still = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    function fly(ms: number) {
      tw = {
        a: { p: cur.p.clone(), l: cur.l.clone(), f: cur.f },
        b: pose(),
        t0: performance.now(),
        ms: still ? 1 : ms,
      };
      dirty = 1;
    }

    const upd = () => {
      if (!tw) applyPose(pose());
    };

    // Render loop
    let animId: number;
    function loop(t: number) {
      if (tw) {
        const u = Math.min(1, (t - tw.t0) / tw.ms);
        const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        applyPose({
          p: tw.a.p.clone().lerp(tw.b.p, e),
          l: tw.a.l.clone().lerp(tw.b.l, e),
          f: tw.a.f + (tw.b.f - tw.a.f) * e,
        });
        if (u >= 1) {
          tw = null;
          applyPose(pose());
        }
      }
      if (dirty) {
        ren.render(scene, cam);
        dirty = 0;
      }
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);

    // Resize observer
    const robs = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      ren.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      dirty = 1;
    });
    robs.observe(host);

    // 7. Seat Mode Helpers
    const mkSeat = (i: number, f?: number) => {
      const s = S[i];
      const p = s.p;
      const d = Math.hypot(p.x, p.z);
      return {
        i,
        e: new T.Vector3(p.x, p.y + 1.35, p.z),
        yaw: s.yaw,
        pi: Math.atan2(-(p.y + 1.35), d) * 0.8,
        f: f || 72,
      };
    };

    function enterSeat(i: number) {
      se = mkSeat(i);
      currentMode = 'seat';
      setMode('seat');
      setActiveSeat(S[i]);
      sceneState.current.activeSeatIndex = i;
      fly(1300);
    }

    function leaveSeat() {
      currentMode = 'orbit';
      setMode('orbit');
      setActiveSeat(null);
      fly(1100);
    }

    function nbr(dr: number, dk: number) {
      if (!se) return null;
      const s = S[se.i];
      const b = s.b;
      const r = s.r;
      const k = s.k;

      if (dr) {
        const r2 = r + dr;
        if (r2 < 0 || r2 >= ROWS) return null;
        const n2 = 12 + r2;
        const kk = Math.round(((k + 0.5) / (12 + r)) * n2 - 0.5);
        for (let o = 0; o < n2; o++) {
          for (const q of [kk + o, kk - o]) {
            if (q >= 0 && q < n2 && !b.seats[r2][q]) {
              return idx(b, r2, q);
            }
          }
        }
        return null;
      }

      for (let q = k + dk; q >= 0 && q < 12 + r; q += dk) {
        if (!b.seats[r][q]) return idx(b, r, q);
      }
      return null;
    }

    function navigateSeat(dr: number, dk: number) {
      const j = nbr(dr, dk);
      if (j === null) {
        onStatusMessage('No available seat in that direction.');
        return;
      }
      onStatusMessage('');
      se = mkSeat(j, se?.f);
      setActiveSeat(S[j]);
      sceneState.current.activeSeatIndex = j;
      fly(700);
    }

    // 8. Pointer, Raycasting & Drag Handlers
    const ray = new T.Raycaster();
    const mv = new T.Vector2();
    const pp = new Map<number, { x: number; y: number }>();
    let drag = 0;
    let hq = 0;
    let hp: PointerEvent | null = null;

    function hit(e: PointerEvent | MouseEvent) {
      const rect = el.getBoundingClientRect();
      mv.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(mv, cam);
      const hits = ray.intersectObjects([IC, TER]);
      const h = hits[0];
      return h && h.object === IC ? h.instanceId! : -1;
    }

    const free = (i: number) => i >= 0 && !S[i].b.seats[S[i].r][S[i].k];

    function hoverAt(e: PointerEvent) {
      hp = e;
      if (hq) return;
      hq = 1;
      requestAnimationFrame(() => {
        hq = 0;
        if (currentMode !== 'orbit' || tw) return;
        const i = hit(hp!);
        const o = hov;
        hov = i;
        if (o !== i) {
          if (o >= 0) paint(o);
          if (i >= 0) paint(i);
        }

        if (i >= 0) {
          const s = S[i];
          const st = s.b.seats[s.r][s.k];
          const rect = host!.getBoundingClientRect();
          const desc =
            st === 1
              ? 'Sold'
              : st === 2
              ? 'Held by another buyer'
              : `${formatINR(s.b.price)} • Click to preview view`;
          setTooltip({
            visible: true,
            x: Math.min(hp!.clientX - rect.left + 14, rect.width - 220),
            y: hp!.clientY - rect.top + 14,
            title: `${s.b.code}, row ${s.r + 1}, seat ${s.k + 1}`,
            desc,
          });
        } else {
          setTooltip((prev) => ({ ...prev, visible: false }));
        }

        el.style.cursor = free(i) ? 'pointer' : '';
      });
    }

    const onPointerLeave = () => {
      setTooltip((prev) => ({ ...prev, visible: false }));
      if (hov >= 0) {
        const o = hov;
        hov = -1;
        paint(o);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pp.set(e.pointerId, { x: e.clientX, y: e.clientY });
      drag = 0;
      setTooltip((prev) => ({ ...prev, visible: false }));
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = pp.get(e.pointerId);
      if (!p) {
        if (currentMode === 'orbit' && !tw) hoverAt(e);
        return;
      }
      if (pp.size === 2) {
        const o = Array.from(pp.values()).find((v) => v !== p)!;
        const d0 = Math.hypot(p.x - o.x, p.y - o.y);
        p.x = e.clientX;
        p.y = e.clientY;
        const d1 = Math.hypot(p.x - o.x, p.y - o.y) || 1;
        drag = 99;
        if (currentMode === 'orbit') {
          ob.R = clamp((ob.R * d0) / d1, 70, 420);
        } else if (se) {
          se.f = clamp((se.f * d1) / d0, 40, 90);
        }
        upd();
        return;
      }

      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      drag += Math.abs(dx) + Math.abs(dy);
      if (tw) return;

      if (currentMode === 'orbit') {
        ob.th -= dx * 0.006;
        ob.el = clamp(ob.el + dy * 0.004, 0.12, 1.45);
      } else if (se) {
        se.yaw += dx * 0.005;
        se.pi = clamp(se.pi + dy * 0.004, -1.2, 0.9);
      }
      upd();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pp.has(e.pointerId) && e.type === 'pointerup' && drag < 6 && currentMode === 'orbit' && !tw && pp.size === 1) {
        const i = hit(e);
        if (free(i)) {
          enterSeat(i);
        } else if (i >= 0) {
          onStatusMessage(
            S[i].b.seats[S[i].r][S[i].k] === 1
              ? 'That seat is sold.'
              : 'Another buyer is holding that seat.'
          );
        } else {
          onStatusMessage('');
        }
      }
      pp.delete(e.pointerId);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (tw) return;
      if (currentMode === 'orbit') {
        ob.R = clamp(ob.R * Math.exp(e.deltaY * 0.001), 70, 420);
      } else if (se) {
        se.f = clamp(se.f + e.deltaY * 0.03, 40, 90);
      }
      upd();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key;
      if (currentMode === 'seat') {
        if (k === 'Escape') {
          leaveSeat();
        } else if (k === 'Enter' && (e.target as HTMLElement).tagName !== 'BUTTON') {
          if (se) sceneState.current.toggleCurrentSeat?.(se.i);
        } else {
          const moveMap: Record<string, [number, number]> = {
            ArrowLeft: [0, -1],
            ArrowRight: [0, 1],
            ArrowUp: [-1, 0],
            ArrowDown: [1, 0],
          };
          if (moveMap[k] && (e.target as HTMLElement).tagName !== 'BUTTON') {
            e.preventDefault();
            navigateSeat(...moveMap[k]);
          }
        }
      } else if (e.target === el && !tw) {
        if (k === 'ArrowLeft') ob.th += 0.1;
        else if (k === 'ArrowRight') ob.th -= 0.1;
        else if (k === 'ArrowUp') ob.el = clamp(ob.el + 0.05, 0.12, 1.45);
        else if (k === 'ArrowDown') ob.el = clamp(ob.el - 0.05, 0.12, 1.45);
        else if (k === '+' || k === '=') ob.R = clamp(ob.R * 0.9, 70, 420);
        else if (k === '-') ob.R = clamp(ob.R / 0.9, 70, 420);
        else return;
        e.preventDefault();
        upd();
      }
    };

    el.addEventListener('pointerleave', onPointerLeave);
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    // Initial camera apply
    applyPose(pose());

    // Expose imperative API for React controls
    sceneState.current = {
      paintAll,
      flyView: (v: ViewStandName) => {
        if (currentMode === 'seat') leaveSeat();
        ob = { ...VIEWS[v] };
        fly(1100);
      },
      enterSeat,
      leaveSeat,
      navigateSeat,
      toggleCurrentSeat: (i: number) => {
        const item = S[i];
        if (item && item.b.seats[item.r][item.k] === 0) {
          onToggleSeat({
            i,
            b: item.b,
            r: item.r,
            k: item.k,
            price: item.b.price,
          });
        }
      },
      activeSeatIndex: undefined,
    };

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(animId);
      robs.disconnect();
      el.removeEventListener('pointerleave', onPointerLeave);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      ren.dispose();
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []); // Run once on mount

  // Re-paint seats whenever selectedSeats or tierFilter changes
  useEffect(() => {
    sceneState.current.paintAll?.();
  }, [selectedSeats, tierFilter]);

  const isCurrentSeatSelected =
    sceneState.current.activeSeatIndex !== undefined &&
    selectedSeats.some((s) => s.i === sceneState.current.activeSeatIndex);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#070D10] overflow-hidden select-none" ref={hostRef}>
      {/* HUD Info Box (Top-Left) */}
      <div className="absolute left-3 top-3 z-10 max-w-[340px] p-3 bg-[#080B18]/90 backdrop-blur-md rounded border border-white/10 text-xs font-['Inter'] shadow-xl pointer-events-none">
        {mode === 'orbit' ? (
          <div>
            <div className="font-['Space_Grotesk'] text-[11px] text-[#42D9FF] font-bold uppercase tracking-wider mb-0.5">
              CHINNASWAMY 3D STADIUM ORBIT
            </div>
            <p className="text-[#9CA8BD] m-0">
              Drag to rotate 360°, scroll to zoom. Click any seat to enter first-person spectator view.
            </p>
          </div>
        ) : activeSeat ? (
          <div>
            <div className="font-['Space_Grotesk'] text-base font-bold text-[#F8FAFC]">
              {activeSeat.b.code}
            </div>
            <div className="text-[#9CA8BD] text-xs">
              Row {activeSeat.r + 1}, seat {activeSeat.k + 1} •{' '}
              <span className="text-[#8B5CF6] font-bold">{formatINR(activeSeat.b.price)}</span>
            </div>
            <div className="text-[11px] text-[#42D9FF] mt-1 font-['Space_Grotesk'] font-bold">
              SPECTATOR SIGHTLINE • Drag to look around. Arrow keys navigate seats.
            </div>
          </div>
        ) : null}
      </div>

      {/* Floating Hover Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-30 p-2.5 bg-[#080B18]/95 border border-[#8B5CF6]/50 rounded text-xs font-['Inter'] pointer-events-none shadow-2xl transition-transform"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          <div className="font-['Space_Grotesk'] font-bold text-[#F8FAFC]">{tooltip.title}</div>
          <div className="text-[#42D9FF] font-semibold text-[11px] mt-0.5">{tooltip.desc}</div>
        </div>
      )}

      {/* Bottom Camera / Seat Navigation Bar */}
      <div className="absolute left-3 right-3 bottom-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-auto">
        {mode === 'orbit' ? (
          <>
            {(['Overview', 'North', 'East', 'South', 'West'] as ViewStandName[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => sceneState.current.flyView?.(v)}
                className="px-3 py-1.5 rounded bg-[#10162A]/90 hover:bg-[#1C1F2D] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold border border-white/10 transition-colors shadow-lg"
              >
                {v === 'East' ? 'East (RCB Dugout)' : v}
              </button>
            ))}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => sceneState.current.leaveSeat?.()}
              className="px-3.5 py-1.5 rounded bg-[#1C1F2D] hover:bg-[#262938] text-[#42D9FF] font-['Space_Grotesk'] text-xs font-bold border border-white/10 transition-colors"
            >
              ← Back to Stadium Orbit
            </button>
            <div className="flex-1"></div>
            <button
              type="button"
              onClick={() => sceneState.current.navigateSeat?.(0, -1)}
              className="px-2.5 py-1.5 rounded bg-[#10162A]/90 hover:bg-[#1C1F2D] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold border border-white/10"
              title="Seat Left"
            >
              Seat ◀
            </button>
            <button
              type="button"
              onClick={() => sceneState.current.navigateSeat?.(0, 1)}
              className="px-2.5 py-1.5 rounded bg-[#10162A]/90 hover:bg-[#1C1F2D] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold border border-white/10"
              title="Seat Right"
            >
              Seat ▶
            </button>
            <button
              type="button"
              onClick={() => sceneState.current.navigateSeat?.(-1, 0)}
              className="px-2.5 py-1.5 rounded bg-[#10162A]/90 hover:bg-[#1C1F2D] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold border border-white/10"
              title="Row Ahead"
            >
              Row ▲
            </button>
            <button
              type="button"
              onClick={() => sceneState.current.navigateSeat?.(1, 0)}
              className="px-2.5 py-1.5 rounded bg-[#10162A]/90 hover:bg-[#1C1F2D] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold border border-white/10"
              title="Row Behind"
            >
              Row ▼
            </button>
            <button
              type="button"
              onClick={() => {
                if (sceneState.current.activeSeatIndex !== undefined) {
                  sceneState.current.toggleCurrentSeat?.(sceneState.current.activeSeatIndex);
                }
              }}
              className={`px-4 py-1.5 rounded font-['Space_Grotesk'] text-xs font-bold shadow-lg transition-colors ${
                isCurrentSeatSelected
                  ? 'bg-[#FB7185] hover:bg-[#e11d48] text-white'
                  : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white'
              }`}
            >
              {isCurrentSeatSelected ? 'Remove Seat' : '+ Add Seat'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
