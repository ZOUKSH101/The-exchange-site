import { Children, isValidElement, useEffect, useMemo, useRef, type ReactNode } from "react"
import styles from "./Stagger.module.css"

export interface StaggerProps {
  /** Each direct child becomes one animated item, revealed in order. */
  children: ReactNode
  className?: string
}

/**
 * StaggeredFadeIn container (§5). Renders each child wrapped in its own
 * animated item element, then — once, when the container is roughly 85vh
 * from the viewport — plays a translateY+opacity entrance per item, offset
 * by --staggered-delay each.
 *
 * Deliberately reads every timing from motion.css via getComputedStyle
 * rather than hardcoding numbers here: if the four --staggered-* tokens
 * disagree with the contract this component was built against (translate
 * duration shorter than opacity duration), it warns to console and falls
 * back to the plain resting state instead of silently animating wrong.
 */
export default function Stagger({ children, className }: StaggerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const items = useMemo(() => Children.toArray(children), [children])

  useEffect(() => {
    const root = document.documentElement

    // Static gate: reduced-motion visitors never get a WAAPI timeline
    // built in the first place — this is an absence of motion, not a
    // fast one. (Stagger.module.css also covers no-js/reduced-motion as a
    // CSS backstop in case this effect never runs at all.)
    if (root.classList.contains("reduced-motion")) return

    const container = containerRef.current
    if (!container) return

    const rootStyle = getComputedStyle(root)
    const read = (name: string) => rootStyle.getPropertyValue(name).trim()

    const delayStep = parseFloat(read("--staggered-delay"))
    const opacityDuration = parseFloat(read("--staggered-opacity-duration"))
    const translateY = read("--staggered-translate-y")
    const translateDuration = parseFloat(read("--staggered-translate-y-duration"))
    const easing = read("--ease-standard") || "ease"

    const contractMet =
      !Number.isNaN(delayStep) &&
      !Number.isNaN(opacityDuration) &&
      !Number.isNaN(translateDuration) &&
      translateY.length > 0 &&
      translateDuration < opacityDuration

    if (!contractMet) {
      // eslint-disable-next-line no-console
      console.warn(
        "[Stagger] --staggered-* token contract unmet in motion.css " +
          "(translate duration must be shorter than opacity duration, and " +
          "all four tokens must be present). Rendering items visible with " +
          "no animation instead of guessing at values.",
      )
      itemRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = "1"
          el.style.transform = "none"
        }
      })
      return
    }

    let fired = false
    const animations: Animation[] = []

    const observer = new IntersectionObserver(
      (entries) => {
        if (fired || !entries[0]?.isIntersecting) return
        fired = true
        observer.disconnect()

        itemRefs.current.forEach((el, index) => {
          if (!el) return

          // Promoted right before the animation starts, released the
          // moment it finishes — holding a compositor layer open longer
          // than that wastes memory on content that is no longer moving.
          el.style.willChange = "opacity, transform"

          const animation = el.animate(
            [
              { opacity: 0, transform: `translateY(${translateY})` },
              // Translate reaches rest at its own (shorter) fraction of
              // the timeline; opacity keeps fading to full afterwards.
              { opacity: 1, transform: "translateY(0)", offset: translateDuration / opacityDuration },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: opacityDuration * 1000,
              delay: index * delayStep * 1000,
              easing,
              fill: "forwards",
            },
          )

          animation.onfinish = () => {
            // Write the resting state into the element's own style, then
            // destroy the timeline — commitStyles() is what lets cancel()
            // happen without the element snapping back to its pre-
            // animation (opacity: 0) CSS state.
            animation.commitStyles()
            animation.cancel()
            el.style.willChange = "auto"
          }

          animations.push(animation)
        })
      },
      // Approximates "t - 85vh": fire while the container is still 15% of
      // the viewport below the bottom edge, rather than reading raw
      // scrollY against --lead-play.
      { root: null, rootMargin: "0px 0px -15% 0px", threshold: 0 },
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [items.length])

  return (
    <div ref={containerRef} className={[styles.container, className].filter(Boolean).join(" ")}>
      {items.map((child, index) => (
        <div
          key={isValidElement(child) && child.key != null ? child.key : index}
          ref={(el) => {
            itemRefs.current[index] = el
          }}
          className={styles.item}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
