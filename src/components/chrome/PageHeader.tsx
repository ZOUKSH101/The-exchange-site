import { useEffect, useRef, type ReactNode } from "react"
import { Text } from "@/components/primitives"
import { addKeyframe, linear } from "@/lib/scroll"
import styles from "./PageHeader.module.css"

export interface PageHeaderProps {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  /** Decorative imagery behind the heading. Rendered aria-hidden. */
  backdrop?: ReactNode
  /** Extra content under the lede (buttons, a handle). */
  children?: ReactNode
}

/**
 * The inner-page header: eyebrow, h1 and lede on the bottom edge of a tall
 * band, over imagery that drifts on scroll. Same composition as the Team
 * header, so every inner page opens the same way while each brings its own
 * picture. The drift distance is authored in CSS (§1) and read here.
 */
export default function PageHeader({ eyebrow, title, lede, backdrop, children }: PageHeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const washRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const wash = washRef.current
    if (!header || !wash) return
    const drift = parseFloat(getComputedStyle(wash).getPropertyValue("--page-wash-drift"))
    if (Number.isNaN(drift)) {
      console.warn("[PageHeader] --page-wash-drift is not set on .wash; skipping the parallax.")
      return
    }
    return addKeyframe({
      el: header,
      start: "t",
      end: "b",
      easeFunction: linear,
      disabledWhen: ["reduced-motion"],
      restProgress: 0,
      apply: (p) => {
        wash.style.transform = `translate3d(0, ${(p * drift).toFixed(1)}px, 0)`
      },
    })
  }, [])

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.wash} ref={washRef} aria-hidden="true">
        {backdrop}
      </div>
      <div className={styles.inner}>
        <Text variant="labelL" className="type-label--lime">
          {eyebrow}
        </Text>
        <Text variant="headline" as="h1" className={styles.title}>
          {title}
        </Text>
        {lede ? (
          <Text variant="lede" className={styles.lede}>
            {lede}
          </Text>
        ) : null}
        {children}
      </div>
    </header>
  )
}
