import { useCallback, useEffect, useRef, useState } from "react"
import { isReducedMotion } from "@/lib/scroll"

/** A position the rail can actually come to rest at. */
export interface RailStop {
  /** The first card fully brought into view at this position. */
  cardIndex: number
  /** scrollLeft for this position, already clamped to what the rail allows. */
  left: number
}

export interface RailControls {
  wrapRef: React.RefObject<HTMLDivElement | null>
  railRef: React.RefObject<HTMLDivElement | null>
  /** Reachable resting positions. Empty when every card already fits. */
  stops: RailStop[]
  /** Index into `stops` of the position currently showing. */
  activeStop: number
  scrollToStop: (stop: number) => void
  registerCard: (index: number) => (el: HTMLElement | null) => void
}

/**
 * Drives the "WHAT WE DO" horizontal rail: local state for which card is
 * active (for the dotnav, §13) and which edge fade should show (§9 -- a
 * fade only appears on the side that actually has unscrolled content;
 * symmetric fades on every rail regardless of scroll state is the tell of
 * a rushed job).
 */
export function useRail(): RailControls {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const railRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const [stops, setStops] = useState<RailStop[]>([])
  const [activeStop, setActiveStop] = useState(0)
  const stopsRef = useRef<RailStop[]>([])

  /* One dot per card was wrong. At desktop width the four cards overflow the
     column by only ~316px, so the rail can come to rest in exactly two places:
     cards 3 and 4 start beyond the furthest scroll position the browser
     allows. Their dots scrolled to the end, the rail stopped at 316px, and the
     active marker snapped back to card 2 — so those dots appeared dead. The
     dots now describe the positions that genuinely exist: each card's offset
     clamped to the maximum scroll, with duplicates collapsed. */
  const measureStops = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth)
    const next: RailStop[] = []
    if (max > 4) {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const left = Math.min(card.offsetLeft - rail.offsetLeft, max)
        if (!next.length || left - next[next.length - 1].left > 4) {
          next.push({ cardIndex: i, left })
        }
      })
    }
    stopsRef.current = next
    setStops(next)
  }, [])

  const sync = useCallback(() => {
    const rail = railRef.current
    const wrap = wrapRef.current
    if (!rail || !wrap) return

    const max = rail.scrollWidth - rail.clientWidth
    // Opaque ("#000" -> fully masked out, i.e. no visible fade) at rest;
    // transparent the moment that edge has more content to reveal.
    wrap.style.setProperty("--fade-left", rail.scrollLeft > 4 ? "transparent" : "#000")
    wrap.style.setProperty("--fade-right", rail.scrollLeft < max - 4 ? "transparent" : "#000")

    let nearest = 0
    let nearestDist = Number.POSITIVE_INFINITY
    stopsRef.current.forEach((stop, i) => {
      const dist = Math.abs(stop.left - rail.scrollLeft)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = i
      }
    })
    setActiveStop(nearest)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const remeasure = () => {
      measureStops()
      sync()
    }
    remeasure()
    /* Card widths depend on the webfont and the viewport, so stops are only
       right once layout has settled — re-measure whenever the rail resizes. */
    const ro = new ResizeObserver(remeasure)
    ro.observe(rail)
    rail.addEventListener("scroll", sync, { passive: true })
    return () => {
      ro.disconnect()
      rail.removeEventListener("scroll", sync)
    }
  }, [measureStops, sync])

  const scrollToStop = useCallback((index: number) => {
    const rail = railRef.current
    const stop = stopsRef.current[index]
    if (!rail || !stop) return
    /* Mark the clicked dot immediately rather than waiting for scroll events
       to catch up — during a smooth scroll the marker would otherwise lag the
       click by the whole length of the animation. */
    setActiveStop(index)
    rail.scrollTo({ left: stop.left, behavior: isReducedMotion() ? "auto" : "smooth" })
  }, [])

  const registerCard = useCallback(
    (index: number) =>
      (el: HTMLElement | null): void => {
        cardRefs.current[index] = el
      },
    [],
  )

  return { wrapRef, railRef, stops, activeStop, scrollToStop, registerCard }
}
