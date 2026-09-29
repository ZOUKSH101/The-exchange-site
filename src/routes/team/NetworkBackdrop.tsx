import type { CSSProperties } from "react"
import { DEPARTMENTS, LEADERSHIP } from "@/data/roster"
import styles from "./NetworkBackdrop.module.css"

/* ============================================================================
   NetworkBackdrop — the team header's imagery.

   Home draws the market as a price line. This page draws the club as a
   network, and it is not a random one: the graph IS the org chart, built from
   roster.ts. The president is the hub; the vice president and every department
   head hang off it; each head's members hang off that head; the founder
   connects on a dashed line, because they are retired. Add someone to the roster
   and a node appears here.

   It carries no names, so it is decorative (aria-hidden); the real roster, as
   text, is the rest of the page.
   ========================================================================== */

const W = 1440
const H = 600

type Kind = "hub" | "officer" | "founder" | "member"
type Node = { x: number; y: number; kind: Kind }
type Edge = { from: number; to: number; dashed?: boolean }

const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos((deg * Math.PI) / 180),
  y: cy + r * Math.sin((deg * Math.PI) / 180),
})

function buildGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const add = (n: Node) => nodes.push(n) - 1

  /* Placed right of centre, clear of the heading that sits bottom-left. */
  const hub = add({ x: 1030, y: 290, kind: "hub" })

  const [, ...others] = LEADERSHIP
  others.forEach((_, i) => {
    const p = polar(1030, 290, 170, -40 - i * 30)
    edges.push({ from: hub, to: add({ ...p, kind: "officer" }) })
  })

  const f = polar(1030, 290, 200, -140)
  edges.push({ from: hub, to: add({ ...f, kind: "founder" }), dashed: true })

  /* Departments fan out around the hub. Angles are spread so the busiest
     department (most members) gets the most open side of the frame. */
  const angles = [195, 55, 130, 5, 160, 100]
  DEPARTMENTS.forEach((dept, d) => {
    const a = angles[d % angles.length]
    const head = add({ ...polar(1030, 290, 215, a), kind: "officer" })
    edges.push({ from: hub, to: head })
    const n = dept.members.length
    dept.members.forEach((_, m) => {
      const spread = n === 1 ? 0 : (m / (n - 1) - 0.5) * 44
      const p = polar(nodes[head].x, nodes[head].y, 110, a + spread)
      edges.push({ from: head, to: add({ ...p, kind: "member" }) })
    })
  })

  return { nodes, edges }
}

const { nodes: NODES, edges: EDGES } = buildGraph()

export default function NetworkBackdrop() {
  return (
    <svg
      className={styles.backdrop}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="team-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" className={styles.dot} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#team-dots)" />

      {EDGES.map((e, i) => {
        const a = NODES[e.from]
        const b = NODES[e.to]
        return (
          <line
            key={`e${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            pathLength={1}
            className={e.dashed ? `${styles.edge} ${styles.edgeDashed}` : styles.edge}
            style={{ "--n": i } as CSSProperties}
          />
        )
      })}

      {NODES.map((n, i) => (
        <g
          key={`n${i}`}
          className={`${styles.node} ${styles[n.kind] ?? ""}`}
          style={{ "--n": i } as CSSProperties}
        >
          {n.kind !== "member" ? <circle cx={n.x} cy={n.y} r={n.kind === "hub" ? 22 : 15} className={styles.halo} /> : null}
          <circle cx={n.x} cy={n.y} r={n.kind === "hub" ? 9 : n.kind === "member" ? 4.5 : 7} className={styles.core} />
        </g>
      ))}
    </svg>
  )
}
