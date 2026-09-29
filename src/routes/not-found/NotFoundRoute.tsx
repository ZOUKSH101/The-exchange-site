import { LinkButton } from "@/components/primitives"
import PageHeader from "@/components/chrome/PageHeader"
import MarketBackdrop from "@/routes/home/MarketBackdrop"
import styles from "./NotFoundRoute.module.css"

/** Any path the router does not know. Same header as the inner pages, with
 *  the home chart behind it, and a way back to each real page. */
export default function NotFoundRoute() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <PageHeader
        eyebrow="404"
        title="Off the chart"
        lede="This page does not exist. It may have moved, or the link may be wrong."
        backdrop={<MarketBackdrop />}
      >
        <div className={styles.actions}>
          <LinkButton href="/">Back to the club</LinkButton>
          <LinkButton variant="ghost" href="/events">
            Events
          </LinkButton>
          <LinkButton variant="ghost" href="/team">
            Team
          </LinkButton>
        </div>
      </PageHeader>
    </main>
  )
}
