import { createElement, type ElementType, type ReactNode } from "react"

/**
 * One row of the type table in src/styles/type.css. Each maps to a global
 * `.type-*` class so the numbers live in exactly one place.
 */
export type TextVariant =
  | "hero"
  | "headline"
  | "title"
  | "lede"
  | "body"
  | "bodySmall"
  | "meta"
  | "legal"
  | "labelL"
  | "labelM"
  | "labelS"

const VARIANT_CLASS: Record<TextVariant, string> = {
  hero: "type-hero",
  headline: "type-headline",
  title: "type-title",
  lede: "type-lede",
  body: "type-body",
  bodySmall: "type-body-sm",
  meta: "type-meta",
  legal: "type-legal",
  labelL: "type-label-l",
  labelM: "type-label-m",
  labelS: "type-label-s",
}

// Sensible default element per variant — a Hero is a page's <h1>, a Meta
// line is inline <span> content, etc. `as` overrides this independently of
// `variant`, so e.g. a Title-styled string can still render as a <p>.
const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  hero: "h1",
  headline: "h2",
  title: "h3",
  lede: "p",
  body: "p",
  bodySmall: "p",
  meta: "span",
  legal: "small",
  labelL: "span",
  labelM: "span",
  labelS: "span",
}

export interface TextProps {
  variant: TextVariant
  as?: ElementType
  className?: string
  children?: ReactNode
  id?: string
}

/**
 * Polymorphic type primitive. Never sets a raw font-size, line-height,
 * letter-spacing or colour inline — it only ever attaches the `.type-*`
 * class that owns those values in type.css, so the whole site's type
 * scale is editable from one file.
 */
export default function Text({ variant, as, className, children, id }: TextProps) {
  const Tag = as ?? DEFAULT_TAG[variant]
  const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(" ")
  return createElement(Tag, { className: classes, id }, children)
}
