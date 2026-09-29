import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { DEPARTMENTS, FOUNDER, LEADERSHIP } from "@/data/roster"
import { Rule, Stagger, Surface, Text } from "@/components/primitives"
import { addKeyframe, draw, linear, update } from "@/lib/scroll"
import MemberCard from "./MemberCard"
import NetworkBackdrop from "./NetworkBackdrop"
import StatStrip from "./StatStrip"
import styles from "./TeamRoute.module.css"

// The founder is retired, so roster.ts holds them as a separate export rather than
// as the first element of LEADERSHIP — "who is the founder" is a fact about the
// club, not a property of array order.
const founder = FOUNDER
const leadership = LEADERSHIP

export default function TeamRoute() {
  const headerRef = useRef<HTMLElement | null>(null)
  const washRef = useRef<HTMLDivElement | null>(null)
  const deptGridRef = useRef<HTMLDivElement | null>(null)
  const deptStageRef = useRef<HTMLElement | null>(null)
  const [deptsRevealed, setDeptsRevealed] = useState(false)

  // §1 / §3 — the header wash's parallax distance is authored as a CSS
  // custom property on .wash (TeamRoute.module.css), never as a number in
  // this file. The scroll engine's per-frame lerp (ease: 0.5) gives it the
  // weighted, chasing feel rather than a 1:1 scroll lock.
  useEffect(() => {
    const headerEl = headerRef.current
    const washEl = washRef.current
    if (!headerEl || !washEl) return

    const raw = getComputedStyle(washEl)
      .getPropertyValue("--team-wash-drift")
      .trim()
    const drift = parseFloat(raw)
    if (Number.isNaN(drift)) {
      // eslint-disable-next-line no-console
      console.warn(
        "[TeamRoute] --team-wash-drift is not set on .wash in TeamRoute.module.css — " +
          "skipping the header parallax rather than hardcoding a distance here.",
      )
      return
    }

    washEl.style.willChange = "transform"
    const dispose = addKeyframe({
      el: headerEl,
      start: "t",
      end: "b",
      ease: 0.5,
      easeFunction: linear,
      // Progress 0 is the resting frame (translate3d(0,0,0)), so a disabled
      // keyframe must resolve there, not at the fully drifted default of 1.
      disabledWhen: ["reduced-motion"],
      restProgress: 0,
      apply: (p) => {
        washEl.style.transform = `translate3d(0, ${(p * drift).toFixed(1)}px, 0)`
      },
    })

    return () => {
      dispose()
      washEl.style.willChange = "auto"
    }
  }, [])

  // §4 — the Departments stage opens from an inset rounded panel to
  // full-bleed as it scrolls in. One scalar, --clip-progress, drives the inset
  // AND the corner radius together in CSS. The start, end and lerp are
  // authored on .deptStage in TeamRoute.module.css and only read here.
  useEffect(() => {
    const stage = deptStageRef.current
    if (!stage) return
    const cs = getComputedStyle(stage)
    const start = cs.getPropertyValue("--dept-clip-start").trim()
    const end = cs.getPropertyValue("--dept-clip-end").trim()
    const ease = parseFloat(cs.getPropertyValue("--dept-clip-ease"))
    if (!start || !end || Number.isNaN(ease)) {
      console.warn(
        "[TeamRoute] --dept-clip-start/-end/-ease are not set on .deptStage; " +
          "leaving the stage fully open rather than guessing a choreography.",
      )
      return
    }
    return addKeyframe({
      el: stage,
      start,
      end,
      ease,
      // Resting state under reduced motion is fully open (progress 1 -> clip 0).
      disabledWhen: ["reduced-motion"],
      apply: (p) => {
        stage.style.setProperty("--clip-progress", (1 - p).toFixed(4))
      },
    })
  }, [])

  // Pointer spotlight on department cards. One read, one write per event,
  // through the engine's read/write queues so a fast pointer never forces a
  // layout flush between measuring and painting. CSS limits the effect to
  // html.no-touch, so touch devices never show a stuck light.
  const onCardPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const { clientX, clientY } = e
    update(() => {
      const r = el.getBoundingClientRect()
      const x = ((clientX - r.left) / r.width) * 100
      const y = ((clientY - r.top) / r.height) * 100
      draw(() => {
        el.style.setProperty("--mx", `${x.toFixed(1)}%`)
        el.style.setProperty("--my", `${y.toFixed(1)}%`)
      })
    })
  }, [])

  // §13 index-driven CSS stagger for the department cards: this effect only
  // flips one class once, all the per-card delay math lives in CSS as
  // `calc(var(--i) * 50ms)`.
  useEffect(() => {
    const el = deptGridRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        setDeptsRevealed(true)
        observer.disconnect()
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <header className={styles.header} ref={headerRef}>
        <div className={styles.wash} ref={washRef} aria-hidden="true">
          <NetworkBackdrop />
        </div>
        <div className={styles.headerInner}>
          <Text variant="labelL" className="type-label--lime">
            The Team
          </Text>
          <Text variant="headline" as="h1">
            Who Runs It
          </Text>
          <Text variant="lede" className={styles.lede}>
            A student committee. Names, roles, and what each part of the club is
            responsible for.
          </Text>
        </div>
      </header>

      <StatStrip />

      <section className={styles.section} aria-labelledby="founder-heading">
        <Text variant="title" as="h2" id="founder-heading">
          Founder
        </Text>
        <Surface
          radius="lg"
          hairline
          elevation="none"
          className={styles.founderSurface}
        >
          <MemberCard member={founder} size="lg" />
        </Surface>
        <Rule variant="stub" className={styles.divider} />
      </section>

      <section className={styles.section} aria-labelledby="leadership-heading">
        <Text variant="title" as="h2" id="leadership-heading">
          Leadership
        </Text>
        <Stagger className={styles.leadershipGrid}>
          {leadership.map((member) => (
            <MemberCard key={member.name} member={member} size="md" />
          ))}
        </Stagger>
      </section>

      <section
        className={styles.deptStage}
        ref={deptStageRef}
        aria-labelledby="departments-heading"
      >
        <div className={styles.section}>
        <Text variant="title" as="h2" id="departments-heading">
          Departments
        </Text>
        <div
          ref={deptGridRef}
          className={[styles.departments, deptsRevealed ? styles.revealed : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {DEPARTMENTS.map((dept, i) => (
            <div
              key={dept.label}
              className={styles.deptCardWrap}
              style={{ "--i": i } as CSSProperties}
              onPointerMove={onCardPointerMove}
            >
              <Surface radius="lg" hairline className={styles.deptCard}>
                <Text variant="title" as="h3">
                  {dept.label}
                </Text>
                <div className={styles.pitch}>
                  <Text variant="body" as="p" className={styles.pitchLead}>
                    {dept.sellingPoint.lead}
                  </Text>
                  <Text variant="bodySmall" as="p">
                    {dept.sellingPoint.body}
                  </Text>
                </div>
                <MemberCard member={dept.head} size="md" ring />
                {dept.members.length > 0 ? (
                  <>
                    <Rule variant="stub" />
                    <Stagger className={styles.memberGrid}>
                      {dept.members.map((member) => (
                        <MemberCard
                          key={member.name}
                          member={member}
                          size="sm"
                        />
                      ))}
                    </Stagger>
                  </>
                ) : null}
              </Surface>
            </div>
          ))}
        </div>
        </div>
      </section>
    </main>
  )
}
