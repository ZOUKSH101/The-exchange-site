# Assumptions log

Each entry is a call made without asking. Fix any that are wrong.

## 2026-09-16

1. **Names and roles come from the photo filenames** in `Social Media Post Template (1)/` and `notes/meet-the-team-teaser/captions.md`: Nirmin Alghobary, Hana Khaled (not "Hanna"), Farida Hashesh.
2. ~~Farida under Media & Design~~ Corrected by you: Farida now leads her own team. **Its name, "Content Creation", is my choice.**
3. **Hana's role is set as "Vice Head of Automation & Organization"**, from her filename, with "&" to match Eyad's line. The roster had said "Vice Head of Automation".
4. **Portraits come from the raw source photos**, not the `exports/` post graphics. They are resized to 960px wide at JPEG quality 82. Omar's existing photo was also recompressed (445 → 313 KB).
5. **Framing (face position and zoom) was set by eye** for the three new photos.
6. **The roster count is now 12, across 6 departments,** and the team page's stat updates itself. The teaser caption's "Six people run The Exchange" is not used on the site.
7. **The favicon and app icon are `logo.png` (white mark) on black.** The social preview image is `lockup-light.png` on black with a short lime rule. No new artwork was made.
8. **The social preview text reuses the page description.** No new copy was written.
9. **The home teaser now shows the members who have photos** (8 of 12), with the line "12 people, 6 departments". That line is new copy, built from roster counts.
10. **Added a skip link** ("Skip to content"), in lime with black text, shown only on keyboard focus.
11. **Fonts now load from `<link>` tags in `index.html`** instead of a CSS `@import`. Same families and weights.
12. **Moved `public/metrics.html` to `docs/metrics-probe.html`.** It was a build-time type measurement probe and would otherwise have been published with the site.
13. **Code comments about Kareem now use "they"**, since no pronouns were given.
14. **HR is labelled "Human Resources"**, with Fady Tarek as "Head of HR" (matching "Head of PR") and a monogram until a photo arrives. The department order is Marketing, PR, Media & Design, Content Creation, Automation & Organization, then HR.
15. **LinkedIn is back** (your address) in the footer, on Join and on Events. It uses the club's own `li-lime.png` glyph, copied from `The Exchange/`.
16. **New pages: Events (`/events`), Join (`/join`) and a 404 page.** The nav now reads Club, Events, Team, Join. On phones the nav shows the mark alone, so all four links fit. The footer gained an "Explore" list, and the home "Who it's for" section gained "Join us" and "See the events" buttons.
17. **Events copy.** The three formats are yours. Their one-line descriptions are my drafts: "People with experience in the field, in the room with you." / "A company going public, taken apart together." / "Put what you have learned to work, against other students." Also mine: "Where the club meets in person. Dates are announced on Instagram first." and "Never miss one / Dates and sign-ups go out on @theexchange.eui." There are no dates and no calendar.
18. **Join copy.** The four "What you get" points are your short wording from the mission carousel. Mine: the "Find us" notes ("Events, dates and sign-ups." / "Club news and our network." / "Questions? Write to us.") and the LinkedIn display name "The Exchange @ EUI". There is no application form or sign-up process, since none was given.
19. **404 copy: "Off the chart"** plus "This page does not exist. It may have moved, or the link may be wrong."
20. **Each page sets its own tab title.** Changing page moves keyboard focus to the new content.
21. **Hosting needs a fallback rule:** every unknown path must serve `index.html`, or `/events`, `/team` and `/join` will 404 on refresh. Vite's dev server already does this.

## 2026-09-26

1. **"Sha3rawy" is Mostafa el Shaarawy.** His photo file names him "Vice Head PR", so he is now **Vice Head of PR**, listed first under PR ahead of Elsayed.
2. **Mariam Sameh is added as Vice Head of HR**, under Fady Tarek, from her photo's filename. Both vice-head lines use "Vice Head of ..." to match "Head of PR".
3. **Fady Tarek's portrait is the raw photo** (`fady tarek head of HR.jpeg`), not the member-card graphic. As before, all three new photos are resized to 960px wide, and the face framing was set by eye.
4. **The roster is now 13 people, 11 with photos.** The Join page's photo wall had room for 9 faces. It now has 11 slots, and its colour loop is retimed so only one face is in colour at a time.
5. **Department selling points (Team page).** The Automation & Organization lead, "Experience with automations and similar software.", is yours. Everything else is my draft from your 2026-27 plan and the metrics matrix:
   - The five other leads: "Grow a real audience.", "Build your network.", "Leave with a portfolio.", "Learn it by explaining it." and "Grow the club and its people."
   - All six body lines.
   - A&O names Google Sheets and Apps Script because the daily movers system runs on them.
   - Media & Design has no row in the matrix, so its line is entirely mine.
6. **Home page, "What we do":** a new first card, "Automated tools", carries your line "The only club with strong technical infrastructure and automated tools for new members to see and work with." Only the card title is mine.
7. **Added an `exchange-site` dev-server entry** to `claude site trainer/.claude/launch.json` (port 5173) for previewing.

## Still open (needs you)

- Surnames and photos for Reem and Elsayed.
- A real photo of Kareem (the current image is the comic poster).
- Hosting, domain, and git (the folder is not a repository). `og:image` is a relative path until there is a domain.
- Carried over: the tracking-table sign, approval of the lime gradient ramp, and whether to remove Tailwind.
