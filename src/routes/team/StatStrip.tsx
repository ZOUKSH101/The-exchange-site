import { useEffect, useRef, useState } from "react"
import { ALL_MEMBERS, DEPARTMENTS } from "@/data/roster"
import { isReducedMotion } from "@/lib/scroll"
import styles from "./StatStrip.module.css"

/* Every figure is counted from roster.ts, never typed in, so the strip can
   never disagree with the cards below it. */
const STATS = [
  { value: ALL_MEMBERS.length, label: "On the roster" },
  { value: DEPARTMENTS.length, label: "Departments" },
]

const pad = (n: number) => String(n).padStart(2, "0")
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The team page's counterpart to the home ticker tape: a band of figures that
 * count up once when the strip arrives (at roughly t - 85vh, like the stagger).
 *
 * The count is time-based, not scroll-scrubbed, and its duration is read from
 * CSS. Screen readers get the final figures as plain text from the start; the
 * counting digits are aria-hidden.
 */
export default function StatStrip() {
  const ref = useRef<HTMLDListElement | null>(null)
  const [shown, setShown] = useState<number[]>(() => STATS.map(() => 0))

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const finalValues = STATS.map((s) => s.value)

    if (isReducedMotion() || typeof IntersectionObserver === "undefined") {
      setShown(finalValues)
      return
    }

    const duration = parseFloat(getComputedStyle(el).getPropertyValue("--stat-count-duration")) * 1000
    if (Number.isNaN(duration)) {
      console.warn("[StatStrip] --stat-count-duration is not set; showing final figures without counting.")
      setShown(finalValues)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = easeOutCubic(t)
          setShown(finalValues.map((v) => Math.round(v * eased)))
          /* Stops itself when done: no loop left running on a finished count. */
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { rootMargin: "0px 0px -15% 0px" },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <dl ref={ref} className={styles.strip}>
      {STATS.map((s, i) => (
        <div key={s.label} className={styles.stat}>
          <dt className={`${styles.label} type-label-m`}>{s.label}</dt>
          <dd className={`${styles.value} type-headline`}>
            <span aria-hidden="true">{pad(shown[i])}</span>
            <span className={styles.srOnly}>{s.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
