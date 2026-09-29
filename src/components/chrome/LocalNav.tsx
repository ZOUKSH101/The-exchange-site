import { useEffect, useRef } from 'react'
import { addKeyframe, isReducedMotion } from '@/lib/scroll'
import { useRoute } from '@/lib/router'
import lockup from '@/assets/lockup-light.png'
import mark from '@/assets/logo.png'
import styles from './LocalNav.module.css'

/* The choreography lives in CSS, not here. These are the property NAMES the
   component reads at runtime; the VALUES are authored in the stylesheet so a
   media query can retune the morph with no JS involvement. */
const VAR_START = '--localnav-morph-start'
const VAR_END = '--localnav-morph-end'
const VAR_EASE = '--localnav-morph-ease'

const LINKS = [
  { href: '/', label: 'Club' },
  { href: '/events', label: 'Events' },
  { href: '/team', label: 'Team' },
  { href: '/join', label: 'Join' },
] as const

/**
 * The morphing local nav (§4).
 *
 * A full-bleed bar at the top of the page that becomes a floating pill as the
 * hero scrolls away. JS tweens one scalar — `--progress` — and CSS derives
 * radius, width, padding, background alpha, outline and shadow from it.
 */
export default function LocalNav() {
  const route = useRoute()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    /* Read the choreography out of CSS. Warn rather than silently substituting
       a magic number: a missing variable means the contract was broken, and a
       hardcoded fallback would hide that for months. */
    const cs = getComputedStyle(nav)
    const start = cs.getPropertyValue(VAR_START).trim()
    const end = cs.getPropertyValue(VAR_END).trim()
    const easeRaw = cs.getPropertyValue(VAR_EASE).trim()

    if (!start || !end) {
      console.warn(
        `LocalNav: scroll choreography variables are not set (${VAR_START}, ${VAR_END}). ` +
          'The nav will not morph. Define them on .localnav in LocalNav.module.css.',
      )
      return
    }

    const ease = Number(easeRaw)

    const dispose = addKeyframe({
      el: document.body,
      start,
      end,
      /* The lerp is what makes this feel weighted rather than pinned to the
         scrollbar. A low factor here specifically: the nav is always on
         screen, so any jitter in it is permanently visible. */
      ease: Number.isFinite(ease) && ease > 0 ? ease : 0.18,
      apply: (p) => {
        nav.style.setProperty('--progress', p.toFixed(4))
      },
      /* Under reduced motion the nav resolves straight to its settled state
         rather than tracking scroll at all. */
      disabledWhen: ['reduced-motion'],
    })

    return dispose
  }, [])

  /* Under reduced motion the keyframe never runs, so paint the end state. */
  const style = isReducedMotion() ? ({ '--progress': 1 } as React.CSSProperties) : undefined

  return (
    <nav ref={navRef} className={styles.localnav} style={style} aria-label="Primary">
      <div className={styles.wrap}>
        <a className={styles.home} href="/" aria-label="The Exchange, home">
          {/* Small screens get the mark alone, so four links fit beside it.
              width/height match each asset's measured ratio (783x122, 391x167). */}
          <picture>
            <source media="(max-width: 734px)" srcSet={mark} width={56} height={24} />
            <img className={styles.lockup} src={lockup} alt="" width={154} height={24} />
          </picture>
        </a>
        <div className={styles.links}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              className={styles.link}
              href={l.href}
              aria-current={route === l.href ? 'page' : undefined}
            >
              <span className={styles.linkLabel}>{l.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
