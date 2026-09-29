import { useEffect, useRef } from 'react'
import LocalNav from '@/components/chrome/LocalNav'
import Footer from '@/components/chrome/Footer'
import HomeRoute from '@/routes/home/HomeRoute'
import TeamRoute from '@/routes/team/TeamRoute'
import EventsRoute from '@/routes/events/EventsRoute'
import JoinRoute from '@/routes/join/JoinRoute'
import NotFoundRoute from '@/routes/not-found/NotFoundRoute'
import { useRoute, type Route } from '@/lib/router'

const SITE = 'The Exchange @ EUI'

const TITLES: Record<Route, string> = {
  '/': SITE,
  '/events': `Events · ${SITE}`,
  '/team': `Team · ${SITE}`,
  '/join': `Join · ${SITE}`,
  '404': `Page not found · ${SITE}`,
}

function Page({ route }: { route: Route }) {
  switch (route) {
    case '/':
      return <HomeRoute />
    case '/events':
      return <EventsRoute />
    case '/team':
      return <TeamRoute />
    case '/join':
      return <JoinRoute />
    default:
      return <NotFoundRoute />
  }
}

export default function App() {
  const route = useRoute()
  const first = useRef(true)

  /* A client-side route change is silent to a screen reader. Retitle the
     document, and after the first render move focus to the new page's <main>
     so the next Tab starts at its content, as a full page load would. */
  useEffect(() => {
    document.title = TITLES[route]
    if (first.current) {
      first.current = false
      return
    }
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [route])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <LocalNav />
      <Page route={route} />
      <Footer />
    </>
  )
}
