import styles from "./Rule.module.css"

export type RuleVariant = "full" | "stub"

export interface RuleProps {
  /** "full" = 4px full-bleed bar. "stub" = 76x4px mark. Fixed brand dimensions — do not parameterise. */
  variant?: RuleVariant
  className?: string
}

/**
 * The brand's signature lime bar. 4px height and the 76px stub width are
 * shipped-brand constants (not tokens) precisely because they must never
 * change independent of a brand refresh — everything else about the bar
 * (its colour) still comes from --c-lime.
 */
export default function Rule({ variant = "full", className }: RuleProps) {
  const classes = [styles.rule, variant === "stub" ? styles.stub : styles.full, className]
    .filter(Boolean)
    .join(" ")

  return <hr className={classes} aria-hidden="true" />
}
