/* ============================================================================
   router.ts — a small history router, hand-rolled.

   Deliberately not react-router: the whole requirement is "render one of a
   handful of components and intercept same-origin link clicks". A dependency for that
   would be more code shipped, not less, and the brief keeps the runtime
   dependency list at React alone.
   ========================================================================== */

import { useSyncExternalStore } from 'react'

/** Every page the site has, in nav order. Anything else renders the 404. */
export const ROUTES = ['/', '/events', '/team', '/join'] as const
export type Route = (typeof ROUTES)[number] | '404'

const listeners = new Set<() => void>()

function clean(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/'
}

function normalise(pathname: string): Route {
  const p = clean(pathname)
  return (ROUTES as readonly string[]).includes(p) ? (p as Route) : '404'
}

function emit(): void {
  for (const fn of listeners) fn()
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function getSnapshot(): Route {
  return normalise(window.location.pathname)
}

/** Current route, re-rendering the subscriber on navigation. */
export function useRoute(): Route {
  return useSyncExternalStore(subscribe, getSnapshot, () => '/' as Route)
}

/** Programmatic navigation. Pushes history and scrolls to top, as a real page load would. */
export function navigate(to: string): void {
  if (clean(window.location.pathname) === clean(to)) return
  window.history.pushState({}, '', to)
  emit()
  /* A client-side route change that leaves the reader halfway down the
     previous page is disorienting — match what a full navigation does. */
  window.scrollTo(0, 0)
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', emit)

  /* Intercept same-origin left-clicks on plain anchors, so routes can be
     written as ordinary <a href="/team"> and still work without a reload.
     Everything that should behave like a real navigation still does:
     modified clicks, new-tab clicks, downloads, external hosts and explicit
     targets all fall through to the browser. */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    const anchor = (e.target as Element | null)?.closest?.('a')
    if (!anchor) return
    if (anchor.target && anchor.target !== '_self') return
    if (anchor.hasAttribute('download')) return

    const href = anchor.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return

    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin) return

    e.preventDefault()
    navigate(url.pathname)
  })
}
