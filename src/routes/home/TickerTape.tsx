import { useEffect, useRef, useState } from "react"
import { TICKERS } from "@/data/tickers"
import styles from "./TickerTape.module.css"

/**
 * A two-lane tape of the largest tech tickers between the hero and the mission.
 *
 * Decorative, so the whole band is aria-hidden: the symbols are texture, not
 * content a screen-reader user is missing. Each lane renders its list twice
 * and translates EACH copy by exactly -100% in lockstep, so the loop seam is
 * invisible. Animating the copies separately rather than the whole lane keeps
 * each compositor layer under half the width — see TickerTape.module.css.
 *
 * The animation pauses while the band is off screen — an infinite marquee
 * nobody can see is pure compositor work on a phone battery.
 */
export default function TickerTape() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      setVisible(Boolean(entries[0]?.isIntersecting))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const lane = (key: string, className: string, accentEvery: number) => (
    <div className={`${styles.lane} ${className}`} key={key}>
      {[0, 1].map((copy) => (
        <ul className={styles.track} key={copy}>
          {TICKERS.map((t, i) => (
            <li
              key={t.symbol}
              className={i % accentEvery === 0 ? `${styles.item} ${styles.accent}` : styles.item}
            >
              <span className={styles.symbol}>{t.symbol}</span>
              <span className={styles.marker}>//</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )

  return (
    <div
      ref={ref}
      className={styles.tape}
      data-paused={visible ? undefined : ""}
      aria-hidden="true"
    >
      {lane("display", `${styles.display} type-headline`, 4)}
      {lane("label", `${styles.label} type-label-l`, 3)}
    </div>
  )
}
