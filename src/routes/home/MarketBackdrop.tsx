import styles from "./MarketBackdrop.module.css"

/* ============================================================================
   MarketBackdrop — the hero's imagery.

   The reference fills this slot with product photography. The club's
   equivalent subject is the market itself, drawn as an ABSTRACT price field:
   a seeded random walk, not a real series. There are no axis values, no dates
   and no ticker on it, so it cannot be read as a claim about any instrument.
   It is monochrome — lime and white only — because direction colour is
   reserved for text that states a real move.

   The paths are generated once at module load from fixed seeds, so every
   visitor and every render gets the identical drawing, and React never
   recomputes them.
   ========================================================================== */

const W = 1440
const H = 900

/** Small, fast, deterministic PRNG so the drawing is stable across loads. */
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type SeriesSpec = {
  seed: number
  points: number
  /** Per-step upward bias; positive trends the line up the frame. */
  drift: number
  volatility: number
  /** Vertical band the series is normalised into, as fractions of H. */
  band: [number, number]
}

function buildSeries({ seed, points, drift, volatility, band }: SeriesSpec): string {
  const rand = mulberry32(seed)
  const values: number[] = []
  let v = 0
  for (let i = 0; i < points; i++) {
    v += drift + (rand() - 0.5) * volatility
    values.push(v)
  }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const [top, bottom] = band

  /* Straight segments rather than a smoothed curve: the brand's visual
     language is angular, cut from the logo's arrows, and a spline would read
     as a generic dashboard. */
  return values
    .map((val, i) => {
      const x = (i / (points - 1)) * W
      const y = (bottom - ((val - min) / span) * (bottom - top)) * H
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
}

const MAIN = buildSeries({ seed: 20260912, points: 96, drift: 0.22, volatility: 2.4, band: [0.16, 0.74] })
const GHOST_A = buildSeries({ seed: 5071, points: 72, drift: 0.12, volatility: 2.8, band: [0.28, 0.86] })
const GHOST_B = buildSeries({ seed: 90210, points: 120, drift: 0.05, volatility: 1.9, band: [0.36, 0.7] })
const MAIN_AREA = `${MAIN} L${W} ${H} L0 ${H} Z`

const GRID_ROWS = [0.2, 0.35, 0.5, 0.65, 0.8]

export default function MarketBackdrop() {
  return (
    <svg
      className={styles.backdrop}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="market-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className={styles.areaStopTop} />
          <stop offset="100%" className={styles.areaStopBottom} />
        </linearGradient>
      </defs>

      <g className={styles.grid}>
        {GRID_ROWS.map((r) => (
          <line key={r} x1="0" x2={W} y1={r * H} y2={r * H} />
        ))}
      </g>

      <path d={GHOST_B} pathLength={1} className={`${styles.line} ${styles.ghost} ${styles.ghostB}`} />
      <path d={GHOST_A} pathLength={1} className={`${styles.line} ${styles.ghost} ${styles.ghostA}`} />
      <path d={MAIN_AREA} className={styles.area} fill="url(#market-area)" />
      <path d={MAIN} pathLength={1} className={`${styles.line} ${styles.main}`} />
    </svg>
  )
}
