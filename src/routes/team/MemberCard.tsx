import type { Member } from "@/data/roster"
import { Text } from "@/components/primitives"
import MemberTile, { type TileSize } from "./MemberTile"
import styles from "./MemberCard.module.css"

export interface MemberCardProps {
  member: Member
  size?: TileSize
  ring?: boolean
  className?: string
}

/**
 * Tile + name + role. The member's name is deliberately NOT a heading
 * (`as="p"`) — a person is not a document section, so the heading outline
 * for this page runs h1 -> h2 (Founder/Leadership/Departments) -> h3
 * (department names) and stops there. This is also the one place the
 * accessible name for the tile's monogram/photo actually lives, as real
 * text rather than alt text.
 */
export default function MemberCard({
  member,
  size = "md",
  ring = false,
  className,
}: MemberCardProps) {
  const classes = [styles.card, className].filter(Boolean).join(" ")

  /* Small cards (members reporting into a head) set the name as an uppercase
     label rather than Archivo Black. At title size a member name overflowed
     the 140px sub-grid ("SHA3RAWY" measured 174.5px in a 158.5px track) and
     ran into the next name, so two people read as one. Heads and officers
     keep the display face; the step down also makes the reporting line
     visible in the type, not only in the tile size. */
  const nameVariant = size === "sm" ? "labelL" : "title"

  return (
    <div className={classes}>
      <MemberTile member={member} size={size} ring={ring} />
      <div>
        <Text variant={nameVariant} as="p" className={styles.name}>
          {member.name}
        </Text>
        <Text variant="meta" as="p">
          {member.role}
        </Text>
      </div>
    </div>
  )
}
