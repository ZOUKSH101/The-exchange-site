# Tracking table — re-derived for Archivo Black + Barlow Condensed

Apple's §12 table is calibrated for SF Pro. The *method* transfers; the numbers do not.
This file records the measured inputs and the derived output so the table can be re-checked
rather than re-guessed.

## Measured inputs

Parsed directly from the Google-hosted TTFs (EOT-wrapped; header stripped, tables read from
`head` / `hhea` / `OS/2` / `cmap` / `hmtx`).

| face | unitsPerEm | capHeight | xHeight | avg uppercase advance | natural line-height |
|---|---|---|---|---|---|
| Archivo Black 900       | 1000 | 0.688  | 0.528  | 0.7692 | 1.088 |
| Barlow Condensed 300    | 1000 | 0.700  | 0.504  | 0.4330 | 1.200 |
| Barlow Condensed 400    | 1000 | 0.700  | 0.506  | 0.4401 | 1.200 |
| Inter 400 (SF Pro proxy)| 2048 | 0.7275 | 0.5459 | 0.6815 | 1.210 |

## The two constants that drive the table

    width index = face avg uppercase advance / SF-proxy avg uppercase advance

    Archivo Black      0.7692 / 0.6815 = 1.129   (12.9% WIDER  than SF-class)
    Barlow Condensed   0.4330 / 0.6815 = 0.635   (36.5% NARROWER)

The negative (display) branch is scaled by 1.129 — a wider, heavier face opens larger optical
gaps between stems at size, so it needs proportionally more tightening.
The positive (text) branch is scaled by 1/0.635 = 1.575 — a narrow light face crowds at text
size, so it needs proportionally more opening.

Consequence worth noting: SF Pro crosses from positive to negative tracking between 12px and
17px. Barlow Condensed never crosses inside the text range; it stays positive throughout.
Copying Apple's sign at body size would have crammed it.

## Rules preserved from §12

- letter-spacing decreases (toward negative) as size increases
- line-height decreases as size increases
- discrete hand-tuned steps per breakpoint — no clamp()
- line-heights are exact leading / size, carried to full precision

## Derived table

### Archivo Black 900 — display and headings, uppercase

| role     | breakpoint | size  | leading | line-height    | letter-spacing |
|----------|-----------|-------|---------|----------------|----------------|
| Hero     | >=1069px  | 104px | 96px    | 0.9230769231   | -0.034em |
| Hero     | <=1068px  | 72px  | 68px    | 0.9444444444   | -0.030em |
| Hero     | <=734px   | 44px  | 44px    | 1              | -0.024em |
| Headline | >=1069px  | 56px  | 54px    | 0.9642857143   | -0.026em |
| Headline | <=1068px  | 44px  | 44px    | 1              | -0.022em |
| Headline | <=734px   | 34px  | 35px    | 1.0294117647   | -0.018em |
| Title    | >=1069px  | 28px  | 30px    | 1.0714285714   | -0.014em |
| Title    | <=1068px  | 24px  | 26px    | 1.0833333333   | -0.011em |
| Title    | <=734px   | 20px  | 22px    | 1.1            | -0.008em |

### Barlow Condensed 300 — body

| role       | size | leading | line-height    | letter-spacing |
|------------|------|---------|----------------|----------------|
| Lede       | 19px | 30px    | 1.5789473684   | +0.006em |
| Body       | 17px | 27px    | 1.5882352941   | +0.008em |
| Body small | 15px | 24px    | 1.6            | +0.010em |
| Meta       | 13px | 21px    | 1.6153846154   | +0.012em |
| Legal      | 11px | 17px    | 1.5454545455   | +0.014em |

### Barlow Condensed 300 — uppercase labels

Apple says nothing about letterspaced uppercase labels, so the passover governs unchanged.
Range kept from the shipped brand: emails run 0.25-0.40em, the social card 0.16-0.30em.

| role    | size | line-height    | letter-spacing |
|---------|------|----------------|----------------|
| Label L | 13px | 1.2307692308   | +0.22em |
| Label M | 11px | 1.2727272727   | +0.28em |
| Label S | 10px | 1.3            | +0.32em |

## Unresolved conflict, flagged to the user

The two shipped anchors disagree about Archivo Black at display size:

- email headline: 36px at -1px = -0.0278em — but that is Helvetica Neue bold, because email
  cannot rely on webfonts, so it is evidence of intent rather than of this typeface
- social card: Archivo Black 900 at +0.02em, line-height 0.88 — POSITIVE

This table follows the Apple method (negative, scaled by width index), which lands near the
email anchor. If the site's headlines should instead match the social card's stamped positive
tracking, that inverts §12's core rule and every negative step above flips sign.

## background-clip: text ramp

Built from the brand lime only. Every stop sits on one hue axis (69.8deg - 70.6deg), varying
lightness and chroma alone — a single lime lit across a surface, not a second lime token.

Option A, recommended:

    linear-gradient(104deg, #8FAD00 0%, #D4FF00 34%, #EAFF7F 58%, #D4FF00 82%, #A8CC00 100%)

Option B, specular bloom — only existing tokens, but washes out at small sizes:

    linear-gradient(104deg, #D4FF00 0%, #FFFFFF 50%, #D4FF00 100%)
