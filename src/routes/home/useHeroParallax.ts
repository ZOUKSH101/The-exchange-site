import { useEffect, type RefObject } from "react"
import { addKeyframe, linear } from "@/lib/scroll"

/**
 * Hero background parallax (§1, §3).
 *
 * The choreography is authored as CSS custom properties on the hero
 * SECTION itself (see .hero in HomeRoute.module.css: --home-hero-parallax-
 * distance / --home-hero-parallax-ease) and this hook only ever reads them
 * with getComputedStyle -- it holds no timing or distance of its own. A
 * design change to how far or how "weighted" the drift feels is a CSS edit,
 * not a code edit.
 *
 * `ease` (not `easeFunction`) is the per-frame lerp described in scroll.ts:
 * the rendered offset chases the scroll-derived target instead of tracking
 * it 1:1, which is what keeps the drift feeling weighted rather than
 * mechanically pinned to the scrollbar.
 */
export function useHeroParallax(
  sectionRef: RefObject<HTMLElement | null>,
  bgRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const section = sectionRef.current
    const bg = bgRef.current
    if (!section || !bg) return

    const style = getComputedStyle(section)
    const distance = parseFloat(style.getPropertyValue("--home-hero-parallax-distance"))
    const ease = parseFloat(style.getPropertyValue("--home-hero-parallax-ease"))

    if (Number.isNaN(distance) || Number.isNaN(ease)) {
      // eslint-disable-next-line no-console
      console.warn(
        "[HomeRoute] --home-hero-parallax-distance/-ease token contract unmet on .hero; " +
          "leaving the background static instead of guessing a fallback distance.",
      )
      return
    }

    // Scroll-driven background motion is exactly the kind of effect
    // prefers-reduced-motion exists to suppress, so it is disabled outright
    // rather than merely de-lerped, and resolves to progress 0 -- the
    // undrifted frame. The default rest of 1 would park the background at its
    // full offset and leave an unlit band at the top of the hero.
    //
    // Measured against the SECTION, not the background: the background is
    // the element being translated, so measuring it fed the output back into
    // its own progress and the tween never reached either end.
    return addKeyframe({
      el: section,
      anchor: section,
      start: "t",
      end: "b",
      ease,
      easeFunction: linear,
      disabledWhen: ["reduced-motion"],
      restProgress: 0,
      apply: (progress) => {
        bg.style.setProperty("--home-hero-parallax", `${(progress * distance).toFixed(1)}px`)
      },
    })
  }, [sectionRef, bgRef])
}
