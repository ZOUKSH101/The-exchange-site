/* The roster, as supplied by the club on 2026-09-12, in the order given.
   Names and roles for members with photos are taken from the filenames the
   club supplied alongside those photos, which carry full names (Eyad Ahmed)
   and the club's own spelling ("Organization").

   Eleven members have photos. Everyone else renders the lime monogram tile in
   the same box, so the page reads as finished with any mix of the two.

   To add a portrait: drop the file in `src/assets/team/`, import it, and give
   that member `photo`, `photoSize` (the file's real pixel dimensions) and
   `photoFocus` (where the face is, and how far to zoom). Most member photos
   are full-length travel shots, so a plain centred square crop would land on
   a torso; the focus is what frames the face. */

import ziadPhoto from '@/assets/team/ziad-fayed.jpg'
import kareemPhoto from '@/assets/team/kareem-khalil.jpg'
import youssefPhoto from '@/assets/team/youssef-el-maghraby.jpg'
import omarPhoto from '@/assets/team/omar-ismail.jpg'
import eyadPhoto from '@/assets/team/eyad-ahmed.jpg'
import nirminPhoto from '@/assets/team/nirmin-alghobary.jpg'
import faridaPhoto from '@/assets/team/farida-hashesh.jpg'
import hanaPhoto from '@/assets/team/hana-khaled.jpg'
import mostafaPhoto from '@/assets/team/mostafa-el-shaarawy.jpg'
import fadyPhoto from '@/assets/team/fady-tarek.jpg'
import mariamPhoto from '@/assets/team/mariam-sameh.jpg'

export type PhotoFocus = {
  /** Horizontal position of the face centre, 0..1 of the image width. */
  x: number
  /** Vertical position of the face centre, 0..1 of the image height. */
  y: number
  /** Magnification over a plain cover crop. 1 = cover, 2 = twice as close. */
  zoom: number
}

export type Member = {
  /** Display name, set as given. Some members supplied one name only. */
  name: string
  /** Role line, verbatim from the club. */
  role: string
  /** Imported image URL, or null for the monogram fallback. */
  photo: string | null
  /** The photo's real pixel dimensions, [width, height]. Required with photo. */
  photoSize?: [number, number]
  /** Where to frame the square crop. Omit for a centred cover crop. */
  photoFocus?: PhotoFocus
  /** Initials for the monogram tile. */
  monogram: string
}

export type Department = {
  /** Section label, e.g. "Public Relations". */
  label: string
  /** Why a student would join this department: a short lead, then what the
      work is. Drafted from the club's 2026-27 plan and metrics matrix. */
  sellingPoint: { lead: string; body: string }
  /** The department head. */
  head: Member
  /** Members reporting into this department. Empty for departments of one. */
  members: Member[]
}

/* The founder is retired and is NOT a sitting officer, so they are held separate
   from LEADERSHIP rather than listed at the top of it — the page gives them their
   own block above the current committee. His supplied image is the club's
   illustrated poster rather than a photograph, so the crop is held tight on
   the face to keep the poster's lettering out of the tile. */
export const FOUNDER: Member = {
  name: 'Kareem Khalil',
  role: 'Founding President',
  photo: kareemPhoto,
  photoSize: [640, 640],
  photoFocus: { x: 0.5, y: 0.47, zoom: 2.2 },
  monogram: 'KK',
}

/* The sitting committee: the president and the vice president. */
export const LEADERSHIP: Member[] = [
  {
    name: 'Ziad Fayed',
    role: 'Club President',
    photo: ziadPhoto,
    photoSize: [960, 1280],
    photoFocus: { x: 0.54, y: 0.45, zoom: 4.2 },
    monogram: 'ZF',
  },
  {
    name: 'Nirmin Alghobary',
    role: 'Vice President',
    photo: nirminPhoto,
    photoSize: [960, 1024],
    photoFocus: { x: 0.59, y: 0.5, zoom: 1.15 },
    monogram: 'NA',
  },
]

export const DEPARTMENTS: Department[] = [
  {
    label: 'Marketing',
    sellingPoint: {
      lead: 'Grow a real audience.',
      body: "Run the club's Instagram, from reels and carousels to the weekly market sentiment challenge, and learn from the numbers behind every post.",
    },
    head: {
      name: 'Youssef el Maghraby',
      role: 'Head of Marketing',
      photo: youssefPhoto,
      photoSize: [960, 1280],
      photoFocus: { x: 0.515, y: 0.2, zoom: 1.2 },
      monogram: 'YM',
    },
    members: [],
  },
  {
    label: 'Public Relations',
    sellingPoint: {
      lead: 'Build your network.',
      body: 'Bring in speakers, set up joint sessions with GDG and IEEE, and reach out to companies. You meet the experienced people in the field first.',
    },
    head: {
      name: 'Omar Ismail',
      role: 'Head of PR',
      photo: omarPhoto,
      photoSize: [960, 1280],
      photoFocus: { x: 0.44, y: 0.49, zoom: 3 },
      monogram: 'OI',
    },
    /* Mostafa el Shaarawy is the roster's "Sha3rawy", now named in full and
       made vice head by the photo the club supplied on 2026-09-24. */
    members: [
      {
        name: 'Mostafa el Shaarawy',
        role: 'Vice Head of PR',
        photo: mostafaPhoto,
        photoSize: [960, 1276],
        photoFocus: { x: 0.495, y: 0.47, zoom: 2.9 },
        monogram: 'MS',
      },
      { name: 'Elsayed', role: 'PR Member', photo: null, monogram: 'E' },
    ],
  },
  {
    label: 'Media & Design',
    sellingPoint: {
      lead: 'Leave with a portfolio.',
      body: "Design the club's posts, banners and event visuals. Your work is the first thing people see of The Exchange.",
    },
    head: { name: 'Reem', role: 'Head of Media & Design', photo: null, monogram: 'R' },
    members: [],
  },
  {
    label: 'Content Creation',
    sellingPoint: {
      lead: 'Learn it by explaining it.',
      body: 'Turn key concepts and market movements into posts that keep the whole club informed.',
    },
    head: {
      name: 'Farida Hashesh',
      role: 'Lead Content Creator',
      photo: faridaPhoto,
      photoSize: [960, 960],
      photoFocus: { x: 0.335, y: 0.28, zoom: 1.9 },
      monogram: 'FH',
    },
    members: [],
  },
  {
    label: 'Automation & Organization',
    /* The lead is the club's own wording (2026-09-26). The tools named are
       the ones the daily movers system actually runs on. */
    sellingPoint: {
      lead: 'Experience with automations and similar software.',
      body: "Work on the club's automated tools, like the system that posts the daily EGX movers, built on Google Sheets and Apps Script. You also keep every session organized, from room bookings to the schedule.",
    },
    head: {
      name: 'Eyad Ahmed',
      role: 'Head of Automation & Organization',
      photo: eyadPhoto,
      photoSize: [960, 1280],
      photoFocus: { x: 0.35, y: 0.56, zoom: 2.4 },
      monogram: 'EA',
    },
    members: [
      {
        name: 'Hana Khaled',
        role: 'Vice Head of Automation & Organization',
        photo: hanaPhoto,
        photoSize: [960, 1255],
        photoFocus: { x: 0.535, y: 0.5, zoom: 2.6 },
        monogram: 'HK',
      },
    ],
  },
  {
    label: 'Human Resources',
    sellingPoint: {
      lead: 'Grow the club and its people.',
      body: 'Bring new members in, keep them involved, and run the CV and interview-prep sessions that help everyone launch their careers.',
    },
    head: {
      name: 'Fady Tarek',
      role: 'Head of HR',
      photo: fadyPhoto,
      photoSize: [960, 842],
      photoFocus: { x: 0.506, y: 0.57, zoom: 1.8 },
      monogram: 'FT',
    },
    members: [
      {
        name: 'Mariam Sameh',
        role: 'Vice Head of HR',
        photo: mariamPhoto,
        photoSize: [960, 1280],
        photoFocus: { x: 0.53, y: 0.565, zoom: 2.3 },
        monogram: 'MS',
      },
    ],
  },
]

/** Everyone, flat — for counts and for the home page's team teaser. Includes
    the founder, who is part of the roster even though they are not a sitting
    officer. */
export const ALL_MEMBERS: Member[] = [
  FOUNDER,
  ...LEADERSHIP,
  ...DEPARTMENTS.flatMap((d) => [d.head, ...d.members]),
]
