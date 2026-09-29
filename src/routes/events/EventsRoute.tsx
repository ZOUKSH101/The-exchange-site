import { useEffect, useRef } from "react"
import { LinkButton, Text } from "@/components/primitives"
import PageHeader from "@/components/chrome/PageHeader"
import { addKeyframe } from "@/lib/scroll"
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, LINKEDIN_URL } from "@/data/contact"
import CandleBackdrop from "./CandleBackdrop"
import styles from "./EventsRoute.module.css"

/* The three formats are the club's own list (marketing voice, 2026-09-13:
   "speakers, IPO nights, competitions"). The one-line descriptions are
   drafted from the same brief and logged in docs/ASSUMPTIONS.md. No dates:
   the site does not carry a calendar, Instagram does. */
const FORMATS = [
  {
    title: "Speakers",
    body: "People with experience in the field, in the room with you.",
  },
  {
    title: "IPO Nights",
    body: "A company going public, taken apart together.",
  },
  {
    title: "Competitions",
    body: "Put what you have learned to work, against other students.",
  },
]

/**
 * Each format row lights up as it reaches the middle of the screen: one
 * scalar per row, --lit, written by the scroll engine and turned into
 * opacity, offset and colour in CSS (§4). Start and end are authored on
 * .format in the stylesheet.
 */
function useLitRows(listRef: React.RefObject<HTMLOListElement | null>) {
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const rows = [...list.querySelectorAll<HTMLElement>("[data-format]")]
    const disposers = rows.map((row) => {
      const cs = getComputedStyle(row)
      return addKeyframe({
        el: row,
        start: cs.getPropertyValue("--lit-start").trim() || "t - 90vh",
        end: cs.getPropertyValue("--lit-end").trim() || "t - 55vh",
        ease: parseFloat(cs.getPropertyValue("--lit-ease")) || 0.2,
        disabledWhen: ["reduced-motion"],
        apply: (p) => row.style.setProperty("--lit", p.toFixed(3)),
      })
    })
    return () => disposers.forEach((d) => d())
  }, [listRef])
}

export default function EventsRoute() {
  const listRef = useRef<HTMLOListElement>(null)
  useLitRows(listRef)

  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <PageHeader
        eyebrow="Events"
        title={
          /* One format per line, so no name is split across lines. */
          <>
            <span className={styles.titleLine}>Speakers.</span>{" "}
            <span className={styles.titleLine}>IPO nights.</span>{" "}
            <span className={styles.titleLine}>Competitions.</span>
          </>
        }
        lede="Where the club meets in person. Dates are announced on Instagram first."
        backdrop={<CandleBackdrop />}
      />

      <section className={styles.section} aria-labelledby="formats-heading">
        <Text variant="labelL" as="h2" id="formats-heading" className="type-label--lime">
          The formats
        </Text>
        <ol className={styles.formats} ref={listRef}>
          {FORMATS.map((f, i) => (
            <li key={f.title} className={styles.format} data-format>
              <span className={`type-label-l ${styles.index}`} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Text variant="hero" as="h3" className={styles.formatTitle}>
                {f.title}
              </Text>
              <Text variant="lede" className={styles.formatBody}>
                {f.body}
              </Text>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.cta} aria-labelledby="dates-heading">
        <div className={styles.ctaInner}>
          <Text variant="headline" as="h2" id="dates-heading">
            Never miss one
          </Text>
          <Text variant="lede" className={styles.ctaLede}>
            Dates and sign-ups go out on {INSTAGRAM_HANDLE}.
          </Text>
          <div className={styles.actions}>
            <LinkButton href={INSTAGRAM_URL} target="_blank" rel="noreferrer noopener">
              Follow on Instagram
            </LinkButton>
            <LinkButton variant="ghost" href={LINKEDIN_URL} target="_blank" rel="noreferrer noopener">
              LinkedIn
            </LinkButton>
          </div>
        </div>
      </section>
    </main>
  )
}
