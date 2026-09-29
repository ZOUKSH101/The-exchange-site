import { useEffect, useState, type RefObject } from "react"

export interface TieredImageLoadState {
  /** Crossed --lead-download: safe to set the real src/srcSet. */
  shouldLoad: boolean
}

/**
 * §11 tiered preload budget, applied to a still image rather than the
 * reference's scroll-scrubbed <video>. This build ships no video, and the
 * mission watermark never animates, so only the download tier is meaningful:
 *
 *   --lead-download  (200vh out) start fetching the real asset
 *
 * The will-change tier was wired up here once and removed: it promoted a
 * compositor layer for an element whose opacity and transform never change,
 * and nothing ever released it, so it reserved GPU memory for an animation
 * that did not exist. The video tiers (--lead-media-load / --lead-play /
 * --lead-release-offset) likewise have nothing to act on.
 */
export function useTieredImageLoad(ref: RefObject<HTMLElement | null>): TieredImageLoadState {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const downloadVh = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--lead-download"),
    )

    if (Number.isNaN(downloadVh)) {
      // eslint-disable-next-line no-console
      console.warn(
        "[HomeRoute] --lead-download token contract unmet; " +
          "loading the mark immediately instead of guessing a lead distance.",
      )
      setShouldLoad(true)
      return
    }

    // IntersectionObserver rootMargin wants px, tokens are authored in vh --
    // resolve against the current viewport once per observer setup.
    const toPx = (vh: number) => Math.round((vh / 100) * window.innerHeight)

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: `0px 0px ${toPx(downloadVh)}px 0px` },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return { shouldLoad }
}
