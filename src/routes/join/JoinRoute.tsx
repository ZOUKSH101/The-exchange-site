import type { CSSProperties } from "react"
import { LinkButton, Stagger, Text } from "@/components/primitives"
import PageHeader from "@/components/chrome/PageHeader"
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, LINKEDIN_URL } from "@/data/contact"
import igGlyph from "@/assets/ig-lime.png"
import liGlyph from "@/assets/li-lime.png"
import mailGlyph from "@/assets/mail-lime.png"
import FaceMosaic from "./FaceMosaic"
import styles from "./JoinRoute.module.css"

/* "Join us" is the club's own call to action (flag and Instagram posts). The
   channel notes are short drafts, logged in docs/ASSUMPTIONS.md. */
const CHANNELS = [
  {
    name: "Instagram",
    handle: INSTAGRAM_HANDLE,
    note: "Events, dates and sign-ups.",
    href: INSTAGRAM_URL,
    glyph: igGlyph,
    external: true,
  },
  {
    name: "LinkedIn",
    handle: "The Exchange @ EUI",
    note: "Club news and our network.",
    href: LINKEDIN_URL,
    glyph: liGlyph,
    external: true,
  },
  {
    name: "Email",
    handle: CONTACT_EMAIL,
    note: "Questions? Write to us.",
    href: `mailto:${CONTACT_EMAIL}`,
    glyph: mailGlyph,
    external: false,
  },
]

/* The club's four points (marketing voice, 2026-09-13), in their short form. */
const OFFER = [
  { title: "Key concepts", body: "What an asset is, how to invest, portfolio splits and more." },
  { title: "Market updates", body: "Up to date on market movements." },
  { title: "Network", body: "Access to experienced people in the field." },
  { title: "Events", body: "Speakers, IPO nights and competitions.", href: "/events" },
]

export default function JoinRoute() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <PageHeader
        eyebrow="Join us"
        title="Join The Exchange"
        lede="No prior finance coursework is assumed. Bring the willingness to learn."
        backdrop={<FaceMosaic />}
      >
        <div className={styles.headerActions}>
          <LinkButton href={INSTAGRAM_URL} target="_blank" rel="noreferrer noopener">
            Follow {INSTAGRAM_HANDLE}
          </LinkButton>
        </div>
      </PageHeader>

      <section className={styles.section} aria-labelledby="channels-heading">
        <Text variant="title" as="h2" id="channels-heading">
          Find us
        </Text>
        <ul className={styles.channels}>
          {CHANNELS.map((c, i) => (
            <li key={c.name} style={{ "--i": i } as CSSProperties}>
              <a
                className={styles.channel}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              >
                <img className={styles.glyph} src={c.glyph} alt="" width={28} height={28} />
                <span className={`type-label-m ${styles.channelName}`}>{c.name}</span>
                <span className={styles.handle}>{c.handle}</span>
                <span className="type-body-sm">{c.note}</span>
                <svg
                  className={styles.arrow}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17 17 7M8 7h9v9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="offer-heading">
        <Text variant="title" as="h2" id="offer-heading">
          What you get
        </Text>
        <Stagger className={styles.offer}>
          {OFFER.map((o, i) => (
            <div key={o.title} className={styles.offerItem}>
              <span className={`type-label-l ${styles.offerIndex}`} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Text variant="labelL" as="h3" className={styles.offerTitle}>
                {o.href ? <a href={o.href}>{o.title}</a> : o.title}
              </Text>
              <Text variant="bodySmall">{o.body}</Text>
            </div>
          ))}
        </Stagger>
      </section>
    </main>
  )
}
