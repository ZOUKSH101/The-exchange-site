// Barrel export for the primitive set. Route/feature code should import
// from "@/components/primitives" rather than reaching into individual
// files, so this list stays the single source of truth for what's public.
export { default as Text } from "./Text"
export type { TextProps, TextVariant } from "./Text"

export { default as Button, LinkButton } from "./Button"
export type { ButtonProps, ButtonVariant, LinkButtonProps } from "./Button"

export { default as Surface } from "./Surface"
export type { SurfaceProps, SurfaceRadius, SurfaceElevation } from "./Surface"

export { default as Rule } from "./Rule"
export type { RuleProps, RuleVariant } from "./Rule"

export { default as Stagger } from "./Stagger"
export type { StaggerProps } from "./Stagger"
