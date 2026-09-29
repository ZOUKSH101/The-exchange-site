import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react"
import styles from "./Button.module.css"

export type ButtonVariant = "solid" | "ghost"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** "solid" is the lime-fill pill with #000 label; "ghost" is the quiet outline variant. */
  variant?: ButtonVariant
}

/**
 * The brand's 980px pill button. Solid variant is lime fill / on-accent
 * (black) label — the only combination that satisfies contrast on lime.
 * Focus and press feedback are token-driven (--shadow-focus, --dur-exit,
 * --ease-standard) so neither can drift from the rest of the system.
 */
const classesFor = (variant: ButtonVariant, className?: string) =>
  ["type-label-l", styles.button, variant === "ghost" ? styles.ghost : styles.solid, className]
    .filter(Boolean)
    .join(" ")

export default function Button({ variant = "solid", className, children, ...rest }: ButtonProps) {
  const classes = classesFor(variant, className)

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}

export interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
}

/** The same pill, as a link. Use it whenever the action navigates. */
export function LinkButton({ variant = "solid", className, children, ...rest }: LinkButtonProps) {
  return (
    <a className={classesFor(variant, className)} {...rest}>
      {children}
    </a>
  )
}
