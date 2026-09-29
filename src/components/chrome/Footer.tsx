import Text from '@/components/primitives/Text'
import lockup from '@/assets/lockup-light.png'
import igGlyph from '@/assets/ig-lime.png'
import mailGlyph from '@/assets/mail-lime.png'
import liGlyph from '@/assets/li-lime.png'
import { CONTACT_EMAIL, INSTAGRAM_URL, LINKEDIN_URL } from '@/data/contact'
import styles from './Footer.module.css'

const PAGES = [
  { href: '/', label: 'Club' },
  { href: '/events', label: 'Events' },
  { href: '/team', label: 'Team' },
  { href: '/join', label: 'Join' },
]

/**
 * Site footer.
 *
 * Instagram, LinkedIn and mail, each with the club's own lime glyph. (LinkedIn
 * was off brand-wide until the club switched it back on, 2026-09-16.) The disclaimer is mandatory on newsletter sends and is
 * carried on the site too, since the site describes the same sessions and the
 * same newsletter.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <a className={styles.brand} href="/" aria-label="The Exchange, home">
            {/* width/height from the asset's measured 783x122 ratio */}
            <img className={styles.lockup} src={lockup} alt="" width={205} height={32} />
          </a>
          <div className={styles.contact}>
            <Text variant="meta" as="p">
              Egypt University of Informatics
            </Text>
            <a className={styles.contactLink} href={`mailto:${CONTACT_EMAIL}`}>
              <Text variant="meta" as="span">
                {CONTACT_EMAIL}
              </Text>
            </a>
          </div>
        </div>

        <nav className={styles.connect} aria-label="Footer">
          <Text variant="labelM" as="h2" className="type-label--lime">
            Explore
          </Text>
          <ul className={styles.pages}>
            {PAGES.map((p) => (
              <li key={p.href}>
                <a className={styles.contactLink} href={p.href}>
                  <Text variant="meta" as="span">
                    {p.label}
                  </Text>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.connect}>
          <Text variant="labelM" as="h2" className="type-label--lime">
            Stay Connected
          </Text>
          <div className={styles.socials}>
            <a
              className={styles.social}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                className={styles.socialGlyph}
                src={igGlyph}
                alt="Instagram"
                width={22}
                height={22}
              />
            </a>
            <a
              className={styles.social}
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                className={styles.socialGlyph}
                src={liGlyph}
                alt="LinkedIn"
                width={22}
                height={22}
              />
            </a>
            <a className={styles.social} href={`mailto:${CONTACT_EMAIL}`}>
              <img
                className={styles.socialGlyph}
                src={mailGlyph}
                alt="Email"
                width={22}
                height={22}
              />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.legal}>
          <Text variant="legal" as="p" className={styles.legalText}>
            Educational content only &mdash; nothing here is investment advice.
          </Text>
          <Text variant="legal" as="p" className={styles.legalText}>
            &copy; 2026 The Exchange &mdash; Egypt University of Informatics.
          </Text>
        </div>
      </div>
    </footer>
  )
}
