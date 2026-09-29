/* ============================================================================
   scroll.ts — the shared scroll engine.

   The architecture is the one thing worth copying from the reference: CSS is
   the score, JS is the player. A component declares its entire choreography as
   custom properties; this module reads them with getComputedStyle and never
   holds a timing of its own. That makes motion responsive — a media query
   retunes the choreography at a breakpoint with no JS involvement at all.

   Three pieces:
     1. a read/write scheduler, so we never interleave measure and mutate
     2. an expression resolver for scroll-position strings ("t - 85vh")
     3. a keyframe list whose rendered value CHASES its scroll-derived target
        instead of tracking it exactly — see `ease` below, it is the whole trick
   ========================================================================== */

const html = document.documentElement

export const isReducedMotion = (): boolean => html.classList.contains('reduced-motion')
export const isEnhanced = (): boolean => html.classList.contains('enhanced')

/* -- 1. Read/write batching -------------------------------------------------
   Setters mark dirty, one rAF callback writes. Reads all happen before any
   write, so a measurement never triggers a layout flush caused by a sibling's
   mutation earlier in the same frame. */

type Job = () => void
let readQ: Job[] = []
let writeQ: Job[] = []
let scheduled = false

function flush(): void {
  scheduled = false
  const r = readQ
  const w = writeQ
  readQ = []
  writeQ = []
  for (const fn of r) fn()
  for (const fn of w) fn()
}

function schedule(): void {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(flush)
}

/** Queue a MEASURE. Runs before every write queued in the same frame. */
export function update(fn: Job): void {
  readQ.push(fn)
  schedule()
}

/** Queue a MUTATE. Runs after every read queued in the same frame. */
export function draw(fn: Job): void {
  writeQ.push(fn)
  schedule()
}

/* -- 2. The scroll-position expression grammar ------------------------------
   Units:
     t / b       the target's own top / bottom, in document space
     h / w       the target's height / width
     a0t / a0b   anchor 0's top / bottom — lets a child animate against the
                 section that contains it rather than against itself
     px vh vw    viewport-relative lengths
     css(--x)    reads a live custom property INSIDE the expression, so a
                 value the CSS already knows never gets duplicated in JS

   Everything resolves to a document-space Y in pixels. */

export type Expr = string | number

function readVar(name: string): number {
  return parseFloat(getComputedStyle(html).getPropertyValue(name)) || 0
}

export function resolve(expr: Expr, rect: DOMRect, anchorRect: DOMRect): number {
  if (typeof expr === 'number') return expr

  const vh = window.innerHeight
  const vw = window.innerWidth
  const scrollY = window.scrollY

  let s = String(expr).replace(/css\(\s*(--[\w-]+)\s*\)/g, (_m, name: string) =>
    String(readVar(name)),
  )

  /* Anchor tokens must be substituted BEFORE the single-letter target tokens,
     or the "t" inside "a0t" gets eaten by the \bt\b pass. */
  s = s
    .replace(/\ba0t\b/g, String(anchorRect.top + scrollY))
    .replace(/\ba0b\b/g, String(anchorRect.bottom + scrollY))
    .replace(/\bt\b/g, String(rect.top + scrollY))
    .replace(/\bb\b/g, String(rect.bottom + scrollY))
    .replace(/\bh\b/g, String(rect.height))
    .replace(/\bw\b/g, String(rect.width))
    .replace(/([\d.]+)vh/g, (_m, n: string) => String((parseFloat(n) * vh) / 100))
    .replace(/([\d.]+)vw/g, (_m, n: string) => String((parseFloat(n) * vw) / 100))
    .replace(/([\d.]+)px/g, '$1')

  /* Refuse anything that is not pure arithmetic. The expressions are authored
     by us in CSS, but this keeps a stray value from reaching the evaluator. */
  if (!/^[\d\s+\-*/().]+$/.test(s)) return 0
  try {
    return Function('"use strict";return(' + s + ')')() as number
  } catch {
    return 0
  }
}

/* -- 3. Keyframes ----------------------------------------------------------- */

export const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
export const easeInOutSin = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2
export const linear = (t: number): number => t

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)

export type KeyframeOptions = {
  /** Element whose box t/b/h/w refer to. */
  el: HTMLElement
  /** Element whose box a0t/a0b refer to. Defaults to el. */
  anchor?: HTMLElement
  start: Expr
  end: Expr
  /** Shapes scroll progress into a value. */
  easeFunction?: (t: number) => number
  /**
   * Per-frame smoothing factor, NOT a curve. The rendered value chases the
   * scroll-derived target: current += (target - current) * ease.
   *
   * This is the single thing that makes scroll motion feel weighted rather
   * than pinned. A value locked 1:1 to scroll position reads as mechanical
   * and jitters with trackpad noise; 0.4-0.6 adds momentum and filters it.
   * Pass 1 to opt out (parallax, video scrubbing) where exactness matters.
   */
  ease?: number
  /** Receives the smoothed 0..1 progress once per frame. */
  apply: (progress: number) => void
  /** Skip this keyframe entirely under the named capability classes. */
  disabledWhen?: string[]
  /**
   * The progress a disabled keyframe resolves to. Defaults to 1, which is
   * right for anything whose end state is its settled look (the nav morph).
   * It is wrong for a parallax, where 1 means fully drifted: pass 0 there, or
   * a reduced-motion visitor gets the background parked at its far offset.
   */
  restProgress?: number
}

type Frame = {
  el: HTMLElement
  anchor: HTMLElement
  start: Expr
  end: Expr
  easeFunction: (t: number) => number
  ease: number
  apply: (progress: number) => void
  current: number | null
  target: number
  rect: DOMRect
  anchorRect: DOMRect
}

const frames: Frame[] = []
let running = false
let lastY = -1

/* Below this the lerp is visually finished; chasing it further is just
   layout reads for nothing. */
const SETTLE_EPSILON = 0.0005

export function addKeyframe(opts: KeyframeOptions): () => void {
  if (opts.disabledWhen?.some((c) => html.classList.contains(c))) {
    /* Resolve to the resting state once, so a disabled keyframe still leaves
       the element in a sane position rather than its unstyled default. */
    opts.apply(opts.restProgress ?? 1)
    return () => {}
  }

  const anchor = opts.anchor ?? opts.el
  const frame: Frame = {
    el: opts.el,
    anchor,
    start: opts.start,
    end: opts.end,
    easeFunction: opts.easeFunction ?? easeInOutQuad,
    ease: opts.ease ?? 0.5,
    apply: opts.apply,
    current: null,
    target: 0,
    rect: opts.el.getBoundingClientRect(),
    anchorRect: anchor.getBoundingClientRect(),
  }
  frames.push(frame)
  start()

  return () => {
    const i = frames.indexOf(frame)
    if (i !== -1) frames.splice(i, 1)
  }
}

function tick(): void {
  if (frames.length === 0) {
    running = false
    return
  }

  /* READ phase — every measurement first. */
  for (const f of frames) {
    f.rect = f.el.getBoundingClientRect()
    f.anchorRect = f.anchor.getBoundingClientRect()
  }
  const y = window.scrollY
  const reduced = isReducedMotion()

  /* WRITE phase. */
  for (const f of frames) {
    const a = resolve(f.start, f.rect, f.anchorRect)
    const b = resolve(f.end, f.rect, f.anchorRect)
    const raw = b === a ? 0 : clamp01((y - a) / (b - a))
    const target = f.easeFunction(raw)
    f.target = target

    /* Snap on the first frame so nothing eases in from zero on load, and snap
       under reduced motion so the value tracks scroll exactly. */
    if (f.current === null || reduced) f.current = target
    else f.current += (target - f.current) * f.ease

    f.apply(f.current)
  }

  /* Idle when nothing is moving. Without this the loop re-queued forever and
     a still, unscrolled page paid two layout reads per keyframe at 60fps —
     continuous battery drain on a phone. The scroll and resize listeners
     below re-arm it the moment anything can change. */
  const settled = frames.every(
    (f) => f.current !== null && Math.abs(f.target - f.current) < SETTLE_EPSILON,
  )
  if (settled && y === lastY) {
    running = false
    return
  }
  lastY = y

  requestAnimationFrame(tick)
}

function start(): void {
  if (running) return
  running = true
  lastY = -1
  requestAnimationFrame(tick)
}

/* -- Resize hygiene ---------------------------------------------------------
   Transitions must not run while the browser is reflowing, or every
   transitioned property animates on a window resize. Add the class, let the
   resize settle, remove it. */

let resizeTimer: number | undefined
const resizeListeners = new Set<() => void>()

/**
 * Re-measure the scrollbar gutter onto the root.
 *
 * index.html sets this before first paint, which is correct for the first
 * frame but wrong for an SPA: at that moment the root element is empty, so
 * the document does not overflow and the measurement comes back 0. Anything
 * doing `100vw - var(--global-scrollbar-width)` would then be off by a
 * scrollbar as soon as content mounts. Re-measure after mount and after every
 * settled resize.
 */
export function measureScrollbarWidth(): void {
  html.style.setProperty('--global-scrollbar-width', window.innerWidth - html.clientWidth + 'px')
}

export function onResizeSettled(fn: () => void): () => void {
  resizeListeners.add(fn)
  return () => {
    resizeListeners.delete(fn)
  }
}

if (typeof window !== 'undefined') {
  /* Re-arm the idled loop. Passive: this listener never needs to cancel. */
  window.addEventListener('scroll', () => start(), { passive: true })

  window.addEventListener('resize', () => {
    start()
    document.body.classList.add('block-transitions')
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      document.body.classList.remove('block-transitions')
      measureScrollbarWidth()
      for (const fn of resizeListeners) fn()
    }, 180)
  })

  /* First real measurement, once content has actually mounted. */
  requestAnimationFrame(measureScrollbarWidth)
}
