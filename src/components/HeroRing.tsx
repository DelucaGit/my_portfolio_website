"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

/**
 * The ring of coloured dashes behind the hero text.
 *
 * Two layers. The still ring is plain CSS and is in the page from the start,
 * so there is a whole ring without JavaScript and without WebGL. When WebGL
 * runs, the canvas takes over: the dashes drift, and the ring's centre follows
 * the pointer (or wanders slowly on its own when there is no pointer). With
 * reduced motion the canvas draws one frame and stays there.
 */

/* ── Still ring: an SVG mask of dashed circles over a colour wheel ── */

const smoothstep = (from: number, to: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

function stillRingMask(): string {
  const RINGS = 11;
  const DASHES = 44;
  let circles = "";
  for (let j = 0; j < RINGS; j++) {
    const t = j / (RINGS - 1);
    const radius = 40 + 60 * t;
    const count = Math.round(DASHES * (0.6 + 1.3 * t));
    const step = (2 * Math.PI * radius) / count;
    const length = 0.55 + 1.15 * t;
    const width = 0.3 + 0.42 * t;
    const edge = smoothstep(0, 0.3, t) * (1 - smoothstep(0.7, 1, t));
    const opacity = (0.75 * (0.25 + 0.75 * edge)).toFixed(2);
    circles +=
      `<circle r='${radius.toFixed(1)}' stroke-width='${width.toFixed(2)}' ` +
      `stroke-opacity='${opacity}' ` +
      `stroke-dasharray='${length.toFixed(2)} ${(step - length).toFixed(3)}' ` +
      `transform='rotate(${(j * 47) % 360})'/>`;
  }
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-105 -105 210 210'>` +
    `<g fill='none' stroke='black' stroke-linecap='round'>${circles}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const STILL_MASK = stillRingMask();

/* ── Live ring: every dash is placed in the vertex shader, so JavaScript only
   moves two points (the centre, and a slower centre the outer rings trail to) ── */

const VERTEX_SHADER = `
attribute vec3 a;
uniform vec2 uRes, uC1, uC2;
uniform float uT, uR, uDpr;
varying float vRot, vS;
varying vec4 vCol;
vec3 pal(float t) {
  vec3 A = vec3(.18, .42, .97), B = vec3(.54, .31, .88), C = vec3(.89, .25, .10), D = vec3(.96, .62, .08);
  t = fract(t) * 4.;
  if (t < 1.) return mix(A, B, t);
  if (t < 2.) return mix(B, C, t - 1.);
  if (t < 3.) return mix(C, D, t - 2.);
  return mix(D, A, t - 3.);
}
void main() {
  float ring = a.x, s = a.z;
  float dir = mod(floor(ring * 10.99), 2.) < .5 ? 1. : -1.;
  float ang = a.y + uT * (.03 + .03 * s) * dir;
  float pulse = .5 + .5 * sin(uT * 1.1 - ring * 6.5 + s * 1.3);
  float r = uR * (.8 + ring * 1.2) * (1. + .035 * sin(uT * .7 + ring * 4.)) + (s - .5) * uR * .08;
  vec2 c = mix(uC1, uC2, ring * .85);
  vec2 p = c + vec2(cos(ang), sin(ang)) * r;
  vec2 q = p / uRes * 2. - 1.;
  gl_Position = vec4(q.x, -q.y, 0., 1.);
  vS = max(3., (5. + 11. * ring) * (.55 + .45 * pulse) * uDpr);
  gl_PointSize = vS;
  vRot = ang + 1.5708 + (s - .5) * 1.2;
  float edge = smoothstep(0., .3, ring) * (1. - smoothstep(.7, 1., ring));
  float al = (.3 + .7 * pulse) * mix(.25, 1., edge);
  vCol = vec4(pal(1. - ang / 6.2832) * al, al);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
varying float vRot, vS;
varying vec4 vCol;
void main() {
  vec2 q = gl_PointCoord - .5;
  float c = cos(vRot), s = sin(vRot);
  vec2 r = vec2(c * q.x + s * q.y, -s * q.x + c * q.y);
  r.x = abs(r.x) - .3;
  float d = length(vec2(max(r.x, 0.), r.y)) - .11;
  float aa = 1.1 / vS;
  float m = 1. - smoothstep(-aa, aa, d);
  if (m < .02) discard;
  gl_FragColor = vCol * m;
}`;

/** After this long without pointer movement the ring wanders on its own. */
const IDLE_MS = 2600;
/** The time the still frame is drawn at (a moment where the ring looks full). */
const STILL_TIME = 7.3;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Starts the WebGL ring on the canvas. Returns a function that stops it, or
 * null when WebGL is not available (the still ring then stays).
 * `onLost` is called if the browser takes the WebGL context away later.
 */
function startRing(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  onLost: () => void,
): (() => void) | null {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
  } catch {}
  if (!gl) return null;
  const context = gl;

  const compile = (type: number, source: string) => {
    const shader = context.createShader(type);
    if (!shader) return null;
    context.shaderSource(shader, source);
    context.compileShader(shader);
    return context.getShaderParameter(shader, context.COMPILE_STATUS)
      ? shader
      : null;
  };
  const vertex = compile(context.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(context.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = context.createProgram();
  if (!vertex || !fragment || !program) return null;
  context.attachShader(program, vertex);
  context.attachShader(program, fragment);
  context.linkProgram(program);
  if (!context.getProgramParameter(program, context.LINK_STATUS)) return null;
  context.useProgram(program);

  // Fewer rings and dashes on a phone keep it light.
  const small = window.innerWidth < 700;
  const rings = small ? 8 : 11;
  const base = small ? 26 : 44;
  const maxDpr = small ? 1.5 : 2;
  const data: number[] = [];
  for (let j = 0; j < rings; j++) {
    const t = j / (rings - 1);
    const n = Math.round(base * (0.6 + t * 1.3));
    for (let i = 0; i < n; i++) {
      data.push(t, ((i + Math.random() * 0.7) / n) * 6.2832, Math.random());
    }
  }
  const count = data.length / 3;
  context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array(data),
    context.STATIC_DRAW,
  );
  const attribute = context.getAttribLocation(program, "a");
  context.enableVertexAttribArray(attribute);
  context.vertexAttribPointer(attribute, 3, context.FLOAT, false, 0, 0);
  const uniform = (name: string) => context.getUniformLocation(program, name);
  const uRes = uniform("uRes");
  const uC1 = uniform("uC1");
  const uC2 = uniform("uC2");
  const uT = uniform("uT");
  const uR = uniform("uR");
  const uDpr = uniform("uDpr");
  context.enable(context.BLEND);
  context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);
  context.clearColor(0, 0, 0, 0);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 1;
  let height = 1;
  let dpr = 1;
  let c1 = [0, 0];
  let c2 = [0, 0];
  let targetX = 0;
  let targetY = 0;
  let lastMove = -1e9;
  let moved = false;
  let seen = false;
  let frameId = 0;
  let stopped = false;
  const startTime = performance.now();

  const centre = () => {
    c1 = [width / 2, height * 0.46];
    c2 = [...c1];
  };
  const size = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.viewport(0, 0, canvas.width, canvas.height);
    if (!moved) centre();
  };
  const draw = (time: number) => {
    context.uniform2f(uRes, width, height);
    context.uniform2f(uC1, c1[0], c1[1]);
    context.uniform2f(uC2, c2[0], c2[1]);
    context.uniform1f(uT, time);
    context.uniform1f(
      uR,
      clamp(Math.max(width * 0.2, Math.min(width, height) * 0.4), 140, 320),
    );
    context.uniform1f(uDpr, dpr);
    context.clear(context.COLOR_BUFFER_BIT);
    context.drawArrays(context.POINTS, 0, count);
  };
  const frame = (now: number) => {
    frameId = 0;
    const time = (now - startTime) / 1000;
    if (now - lastMove > IDLE_MS) {
      targetX = width / 2 + Math.sin(time * 0.23) * width * 0.17;
      targetY = height * 0.46 + Math.sin(time * 0.31 + 1) * height * 0.1;
    }
    c1[0] += (targetX - c1[0]) * 0.09;
    c1[1] += (targetY - c1[1]) * 0.09;
    c2[0] += (targetX - c2[0]) * 0.035;
    c2[1] += (targetY - c2[1]) * 0.035;
    moved = true;
    draw(time);
    kick();
  };
  // The loop only runs while the ring is on screen, the tab is visible and
  // the visitor has not asked for reduced motion.
  function kick() {
    if (stopped || frameId || !seen || document.hidden || reduce.matches) {
      return;
    }
    frameId = requestAnimationFrame(frame);
  }
  const still = () => {
    moved = false;
    size();
    draw(STILL_TIME);
  };
  const onMode = () => {
    if (reduce.matches) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      still();
    } else {
      kick();
    }
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!seen || reduce.matches) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < -40 || y < -40 || x > rect.width + 40 || y > rect.height + 40) {
      return;
    }
    targetX = x;
    targetY = y;
    lastMove = performance.now();
  };
  const onResize = () => {
    if (reduce.matches) still();
    else size();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    onLost();
  };

  size();
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      seen = entries[entries.length - 1].isIntersecting;
      kick();
    },
    { rootMargin: "80px" },
  );
  intersectionObserver.observe(canvas);
  document.addEventListener("visibilitychange", kick);
  reduce.addEventListener("change", onMode);
  canvas.addEventListener("webglcontextlost", onContextLost);
  onMode();

  return () => {
    stopped = true;
    cancelAnimationFrame(frameId);
    window.removeEventListener("pointermove", onPointerMove);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", kick);
    reduce.removeEventListener("change", onMode);
    canvas.removeEventListener("webglcontextlost", onContextLost);
  };
}

export default function HeroRing() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    // `data-live` swaps the still ring for the canvas (see Hero.module.css).
    const stop = startRing(host, canvas, () => {
      delete host.dataset.live;
    });
    if (!stop) return;
    host.dataset.live = "";
    return () => {
      stop();
      delete host.dataset.live;
    };
  }, []);

  return (
    <div ref={hostRef} className={styles.ring} aria-hidden="true">
      <div
        className={styles.still}
        style={{ WebkitMaskImage: STILL_MASK, maskImage: STILL_MASK }}
      />
      <canvas ref={canvasRef} className={styles.live} />
    </div>
  );
}
