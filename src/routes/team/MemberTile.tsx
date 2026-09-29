import type { CSSProperties } from "react"
import type { Member } from "@/data/roster"
import styles from "./MemberTile.module.css"

export type TileSize = "sm" | "md" | "lg"

export interface MemberTileProps {
  member: Member
  /** 72 / 104 / 152px tile — see MemberTile.module.css for the geometry. */
  size?: TileSize
  /** Marks this tile as a head (department head, reporting lead) — the only
   *  place the ring badge appears, so a head and a member never render as
   *  identical peer cards. */
  ring?: boolean
  className?: string
}

/* Where the face lands vertically in the tile. A little above centre, so the
   crop reads as head and shoulders rather than a face floating mid-square. */
const FACE_LINE = 0.42

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * Positions a photo inside the square tile so its face sits on FACE_LINE at
 * the requested zoom.
 *
 * object-position alone cannot do this: it pans a cover crop but cannot
 * magnify it, and in a full-length travel shot the face is well under a tenth
 * of the frame. So the image is sized and offset explicitly, in percentages of
 * the tile, from the photo's known dimensions. Nothing is measured at runtime,
 * and the offsets are clamped so an edge of the photo never shows inside the
 * tile however the focus is set.
 */
export function framePhoto(member: Member): CSSProperties | undefined {
  const { photoSize, photoFocus } = member
  if (!photoSize || !photoFocus) return undefined

  const [w, h] = photoSize
  /* Cover scale for a square box: the shorter side fills it. */
  const coverW = w >= h ? w / h : 1
  const coverH = w >= h ? 1 : h / w
  const zoom = Math.max(1, photoFocus.zoom)
  const imgW = coverW * zoom
  const imgH = coverH * zoom

  const left = clamp(0.5 - photoFocus.x * imgW, 1 - imgW, 0)
  const top = clamp(FACE_LINE - photoFocus.y * imgH, 1 - imgH, 0)

  return {
    inset: "auto",
    left: `${(left * 100).toFixed(3)}%`,
    top: `${(top * 100).toFixed(3)}%`,
    width: `${(imgW * 100).toFixed(3)}%`,
    height: `${(imgH * 100).toFixed(3)}%`,
    maxWidth: "none",
    objectFit: "fill",
  }
}

/**
 * The no-portrait state, and the eventual portrait state — same component,
 * same box. `member.photo` is null for everyone today, so every tile takes
 * the monogram branch; dropping a real file into src/assets and pointing a
 * roster entry's `photo` at it (roster.ts is the only file that needs to
 * change) switches a member to the photo branch with no layout change.
 *
 * The tile and everything in it is `aria-hidden` — a monogram is decorative
 * (initials standing in for a face), not a label, so the accessible name
 * for a member must come from the real text next to it (see MemberCard),
 * never from alt text here.
 */
export default function MemberTile({
  member,
  size = "md",
  ring = false,
  className,
}: MemberTileProps) {
  const classes = [
    styles.tile,
    styles[size],
    ring ? styles.ring : null,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={classes} aria-hidden="true">
      <span className={styles.clip}>
        {member.photo ? (
          <img
            src={member.photo}
            alt=""
            className={styles.photo}
            loading="lazy"
            decoding="async"
            style={framePhoto(member)}
          />
        ) : (
          <span className={styles.monogram}>{member.monogram}</span>
        )}
        <span className={`${styles.roleOverlay} type-legal`}>{member.role}</span>
      </span>
    </div>
  )
}
