import type { ElementType, ReactNode } from "react"
import styles from "./Surface.module.css"

export type SurfaceRadius = "sm" | "md" | "lg"
export type SurfaceElevation = "none" | "sm" | "md" | "lg"

const RADIUS_CLASS: Record<SurfaceRadius, string> = {
  sm: styles.radiusSm,
  md: styles.radiusMd,
  lg: styles.radiusLg,
}

const ELEVATION_CLASS: Record<SurfaceElevation, string> = {
  none: styles.elevationNone,
  sm: styles.elevationSm,
  md: styles.elevationMd,
  lg: styles.elevationLg,
}

export interface SurfaceProps {
  /** 18/22/28px radius step — see tokens.css --radius-sm/md/lg. */
  radius?: SurfaceRadius
  /** Draw the --c-hairline 1px border used to separate a surface from pure black. */
  hairline?: boolean
  /** Which --shadow-* step to lift the surface with. */
  elevation?: SurfaceElevation
  as?: ElementType
  className?: string
  children?: ReactNode
}

/**
 * The card / tile / panel container. This is the one primitive allowed to
 * reach for the shadow scale, since the flat-surface rule is lifted only
 * for contained surfaces like this, not for type or buttons.
 */
export default function Surface({
  radius = "md",
  hairline = false,
  elevation = "sm",
  as: Tag = "div",
  className,
  children,
}: SurfaceProps) {
  const classes = [
    styles.surface,
    RADIUS_CLASS[radius],
    ELEVATION_CLASS[elevation],
    hairline ? styles.hairline : null,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return <Tag className={classes}>{children}</Tag>
}
