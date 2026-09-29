import type { CSSProperties } from "react"
import styles from "./CandleBackdrop.module.css"

/* ============================================================================
   CandleBackdrop — the Events header's imagery.

   Home draws the market as a line, Team draws the club as a network; Events
   draws it as candles, the view a room full of people watches together. Like
   the home chart it is an abstract seeded walk: no axis, no ticker, no dates,
   so it states nothing about any real instrument. Candles are hollow, and
   direction is carried by stroke only (lime up, grey down), never by a fill.
   ========================================================================== */

const W = 1440
const H = 600
const COUNT = 44

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Candle = { x: number; open: number; close: number; high: number; low: number }

function buildCandles(): Candle[] {
  const rand = mulberry32(20260916)
  const raw: Omit<Candle, "x">[] = []
  let price = 0
  for (let i = 0; i < COUNT; i++) {
    const open = price
    const close = open + 0.35 + (rand() - 0.5) * 3.2
    const high = Math.max(open, close) + rand() * 1.2
    const low = Math.min(open, close) - rand() * 1.2
    raw.push({ open, close, high, low })
    price = close
  }
  const min = Math.min(...raw.map((c) => c.low))
  const max = Math.max(...raw.map((c) => c.high))
  /* Held to the band between 18% and 82% of the frame, high values up. */
  const y = (v: number) => H * (0.82 - ((v - min) / (max - min)) * 0.64)
  const step = W / COUNT
  return raw.map((c, i) => ({
    x: step * (i + 0.5),
    open: y(c.open),
    close: y(c.close),
    high: y(c.high),
    low: y(c.low),
  }))
}

const CANDLES = buildCandles()
const BODY_W = (W / COUNT) * 0.46

export default function CandleBackdrop() {
  return (
    <svg
      className={styles.backdrop}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} className={styles.grid} x1={0} x2={W} y1={H * f} y2={H * f} />
      ))}
      {CANDLES.map((c, i) => {
        const up = c.close < c.open
        const top = Math.min(c.open, c.close)
        const h = Math.max(2, Math.abs(c.open - c.close))
        return (
          <g
            key={i}
            className={`${styles.candle} ${up ? styles.up : styles.down}`}
            style={{ "--i": i } as CSSProperties}
          >
            <line x1={c.x} x2={c.x} y1={c.high} y2={c.low} className={styles.wick} />
            <rect x={c.x - BODY_W / 2} y={top} width={BODY_W} height={h} rx={2} className={styles.body} />
          </g>
        )
      })}
    </svg>
  )
}
