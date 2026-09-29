import type { CSSProperties } from "react"
import { ALL_MEMBERS } from "@/data/roster"
import { framePhoto } from "@/routes/team/MemberTile"
import styles from "./FaceMosaic.module.css"

/* ============================================================================
   FaceMosaic — the Join header's imagery: the people you would be joining.

   A fixed grid of tiles. The members with photos are scattered through it in
   roster order, the rest of the cells are empty hairline squares, so the grid
   reads as a wall with room on it. Portraits sit in greyscale; one at a time
   warms to full colour on a slow loop.
   ========================================================================== */

const COLS = 9
const ROWS = 4
/* Cell indices that carry a portrait, spread so no two share an edge. One
   slot per supplied photo (eleven as of 2026-09-26); a face with no slot is
   simply not shown, so add a slot when a photo arrives. */
const SLOTS = [1, 4, 7, 11, 15, 18, 22, 26, 29, 32, 34]

const FACES = ALL_MEMBERS.filter((m) => m.photo)

export default function FaceMosaic() {
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
    const slot = SLOTS.indexOf(i)
    return slot >= 0 && slot < FACES.length ? FACES[slot] : null
  })
  return (
    <div className={styles.mosaic} style={{ "--cols": COLS, "--faces": FACES.length } as CSSProperties}>
      {cells.map((m, i) =>
        m ? (
          <span
            key={i}
            className={`${styles.cell} ${styles.face}`}
            style={{ "--i": i, "--f": SLOTS.indexOf(i) } as CSSProperties}
          >
            <img src={m.photo!} alt="" loading="lazy" decoding="async" style={framePhoto(m)} />
          </span>
        ) : (
          <span key={i} className={styles.cell} style={{ "--i": i } as CSSProperties} />
        ),
      )}
    </div>
  )
}
