import { useRef, type CSSProperties, type RefObject } from "react"
import { Text, Rule, Stagger, LinkButton } from "@/components/primitives"
import logoMark from "@/assets/logo.png"
import styles from "./HomeRoute.module.css"
import { useHeroParallax } from "./useHeroParallax"
import { useTieredImageLoad } from "./useTieredImageLoad"
import { useRail } from "./useRail"
import MarketBackdrop from "./MarketBackdrop"
import TickerTape from "./TickerTape"
import { ALL_MEMBERS, DEPARTMENTS } from "@/data/roster"
import { framePhoto } from "@/routes/team/MemberTile"

// The teaser shows the faces the club has supplied so far, in roster order.
const FACES = ALL_MEMBERS.filter((m) => m.photo)

// The club's own words (marketing voice brief, 2026-09-13): its four "what we
// do" points, lightly tidied for grammar and set as card title + body. Not
// embellished. The "//" marker is the brand's own device for this list.
// The first card is the advantage the club asked to push first (2026-09-26),
// in its own wording; only the card title is ours.
const WHAT_WE_DO = [
  {
    title: "AUTOMATED TOOLS",
    body: "The only club with strong technical infrastructure and automated tools for new members to see and work with.",
  },
  {
    title: "KEY CONCEPTS",
    body: "What an asset is, how to invest, standardized portfolio splits and more.",
  },
  {
    title: "STAY INFORMED",
    body: "We keep you up to date on market movements.",
  },
  {
    title: "NETWORK",
    body: "Access to experienced people in the field to help you start out.",
  },
  {
    title: "EVENTS",
    body: "Speakers, IPO nights and competitions.",
  },
] as const

export default function HomeRoute() {
  const heroRef = useRef<HTMLElement | null>(null)
  const heroBgRef = useRef<HTMLDivElement | null>(null)
  useHeroParallax(heroRef, heroBgRef)

  const markRef = useRef<HTMLDivElement | null>(null)
  const { shouldLoad } = useTieredImageLoad(markRef)

  const { wrapRef, railRef, stops, activeStop, scrollToStop, registerCard } = useRail()

  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      {/* ===================== HERO ===================== */}
      <section className={styles.hero} ref={heroRef as RefObject<HTMLElement>}>
        <div className={styles.heroBg} ref={heroBgRef} aria-hidden="true">
          <MarketBackdrop />
        </div>
        <div className={styles.heroScrim} aria-hidden="true" />
        {/* .wrap puts the hero copy on the same left edge as every section
            below it; without it the copy sat 128px left of the page grid. */}
        <div className={`${styles.wrap} ${styles.heroWrap}`}>
        <div className={styles.heroContent}>
          {/* as="p": labelL defaults to an inline <span>, and max-width has
              no effect on inline elements -- the eyebrow needs its own
              measure (see .eyebrow), so it has to be block-level. */}
          <Text variant="labelL" as="p" className={`type-label--lime ${styles.eyebrow}`}>
            FINANCE &amp; INVESTING CLUB &middot; EGYPT UNIVERSITY OF INFORMATICS
          </Text>
          <Text variant="hero" className={styles.heroTitle}>
            THE <span className={styles.gradientWord}>EXCHANGE</span>
          </Text>
          <Text variant="lede" as="p" className={styles.lede}>
            We teach you to keep your money.
          </Text>
        </div>
        </div>
      </section>

      <TickerTape />

      {/* ===================== MISSION ===================== */}
      <section className={styles.mission} aria-labelledby="mission-heading">
        <div className={styles.wrap}>
          <Stagger>
            <Text variant="labelL" as="h2" id="mission-heading" className="type-label--lime">
              MISSION
            </Text>
            <Text variant="lede" as="p" className={styles.missionBody}>
              Instead of losing your money to inflation, get that money to work for you and build
              your future.
            </Text>
          </Stagger>
        </div>

        <div
          ref={markRef}
          className={styles.missionMark}
          aria-hidden="true"
        >
          {shouldLoad ? (
            <picture>
              <img src={logoMark} width={391} height={167} alt="" loading="lazy" decoding="async" />
            </picture>
          ) : null}
        </div>
      </section>

      {/* ===================== WHAT WE DO ===================== */}
      <section className={styles.whatWeDo} aria-labelledby="what-we-do-heading">
        <div className={styles.wrap}>
          <Stagger>
            <Text variant="labelL" as="h2" id="what-we-do-heading" className="type-label--lime">
              WHAT WE DO
            </Text>
            <Rule variant="stub" className={styles.sectionHead} />
          </Stagger>

          <div className={styles.railWrap} ref={wrapRef}>
            <div className={styles.rail} ref={railRef}>
              {WHAT_WE_DO.map((item, i) => (
                <article className={styles.card} key={item.title} ref={registerCard(i)}>
                  <Text variant="labelM" className={styles.cardMarker}>
                    //
                  </Text>
                  <Text variant="title" as="h3">
                    {item.title}
                  </Text>
                  <Text variant="bodySmall" as="p" className={styles.cardBody}>
                    {item.body}
                  </Text>
                </article>
              ))}
            </div>
          </div>

          {/* A group, not a nav landmark: these are carousel controls, not
              navigation links. Rendered only when the rail actually scrolls. */}
          {stops.length > 1 ? (
            <div className={styles.dotnav} role="group" aria-label="What we do">
              {stops.map((stop, i) => (
                <button
                  key={stop.left}
                  type="button"
                  className={styles.dot}
                  aria-label={`Show ${WHAT_WE_DO[stop.cardIndex].title.toLowerCase()}`}
                  aria-current={activeStop === i}
                  onClick={() => scrollToStop(i)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ===================== WHO IT'S FOR ===================== */}
      <section className={styles.whoFor} aria-labelledby="who-for-heading">
        <div className={styles.wrap}>
          <Stagger>
            <Text variant="labelL" as="h2" id="who-for-heading" className="type-label--lime">
              WHO IT'S FOR
            </Text>
            <Text variant="body" as="p" className={styles.whoForBody}>
              No prior finance coursework is assumed. Bring the willingness to learn.
            </Text>
            <div className={styles.whoForActions}>
              <LinkButton href="/join">Join us</LinkButton>
              <LinkButton variant="ghost" href="/events">
                See the events
              </LinkButton>
            </div>
          </Stagger>
        </div>
      </section>

      {/* ===================== TEAM TEASER (whole-card link) ===================== */}
      <section className={styles.teamTeaser}>
        <div className={styles.wrap}>
          <div className={styles.teamTile}>
            {/* Click target for the whole tile. Hidden from assistive tech and
                out of the tab order -- the real link below carries both. */}
            <a className={styles.teamTileLink} href="/team" aria-hidden="true" tabIndex={-1} />
            <div className={styles.faces} aria-hidden="true">
              {FACES.map((m, i) => (
                <span key={m.name} className={styles.face} style={{ "--i": i } as CSSProperties}>
                  <img src={m.photo!} alt="" loading="lazy" decoding="async" style={framePhoto(m)} />
                </span>
              ))}
            </div>
            <Text variant="meta" as="p" className={styles.teamCount}>
              {ALL_MEMBERS.length} people, {DEPARTMENTS.length} departments
            </Text>
            <a className={styles.teamCta} href="/team">
              <Text variant="labelL" as="span">
                Meet the team
              </Text>
              <svg
                className={styles.teamArrow}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
