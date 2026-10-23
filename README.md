# Northstar website

The website for **Northstar**, a service that guides Indian doctors from their MBBS in India to a medical career in Germany: German language, state selection, documents, visa, FSP, Approbation and settling in.

Visitors can learn about the pathway, see salaries and pricing, and book a **free consultation** through a form that saves directly into a secure database.

## Pages

| Page | File | What it contains |
|---|---|---|
| Home | `index.html` | Hero, key facts, why Germany, salary table, six step overview, services, student stories |
| Pathway | `pathway.html` | The six stages in detail, an interactive "Is Germany right for you?" self check, glossary of German terms |
| About | `about.html` | Story, how we work, team |
| Pricing | `pricing.html` | Full package (₹3,50,000), everything included, FSP preparation as an extra |
| FAQ | `faq.html` | Questions grouped by topic |
| Contact | `contact.html` | Free consultation form and contact details |
| Legal | `privacy.html`, `terms.html` | Privacy policy and terms (drafts) |

## Features

- **Responsive** on phones, tablets, laptops and large screens, tested at 10 screen sizes including phones held sideways
- **Mobile first details:** full screen menu, bottom bar with "Free consultation" and "WhatsApp" buttons, floating WhatsApp button on desktop
- **Motion:** headlines that rise into place, photos that unveil and drift with gentle parallax, sections that fade in on scroll, smooth page transitions. All motion switches off for visitors who prefer reduced motion.
- **Consultation form** with lettered answer buttons (press A, B, C to choose), inline validation, a spam trap and a consent checkbox
- **Accessible:** semantic HTML, keyboard navigation, visible focus, skip link, alt text on every image
- **No build step:** plain HTML, CSS and JavaScript that any browser opens directly

## Tech stack

| Part | Tool |
|---|---|
| Frontend | HTML5, CSS3 (custom properties, Grid, Flexbox), vanilla JavaScript |
| Fonts | Archivo and Instrument Serif (Google Fonts) |
| Database | [Supabase](https://supabase.com) (PostgreSQL) with Row Level Security |
| Photos | Free images from [Unsplash](https://unsplash.com/license) |
| Hosting | Netlify or Cloudflare Pages (static hosting) |

## Project structure

```
northstar-website/
├── index.html            Home
├── pathway.html          The pathway
├── about.html            About us
├── pricing.html          Pricing
├── faq.html              FAQ
├── contact.html          Free consultation form
├── privacy.html          Privacy policy (draft)
├── terms.html            Terms and conditions (draft)
├── css/
│   └── style.css         All styling: design tokens, layout, motion, responsive rules
├── js/
│   ├── main.js           Menu, animations, self check, form handling
│   └── config.js         Supabase URL and public key
├── assets/               Logo and favicon
├── supabase-setup.sql    Creates the database table and its security rules
└── docs/
    └── SETUP.md          Step by step guide: database, hosting and domain
```

## Run it locally

No installation needed.

1. Clone the repository
   ```
   git clone https://github.com/bharath107/northstar-website.git
   ```
2. Open `index.html` in your browser, or in VS Code right click it and choose **Open with Live Server** for automatic reloads while editing.

## How the form and database work

1. A visitor fills in the consultation form on `contact.html`.
2. `js/main.js` checks every answer, then sends it to the `consultation_requests` table in Supabase.
3. **Row Level Security** allows the public to *insert* a request and nothing else. Nobody on the internet can read, change or delete submitted data, even though the public key is in the page.
4. The Northstar team reads new requests in the Supabase dashboard (Table Editor).

To set up your own database, run `supabase-setup.sql` once in the Supabase SQL Editor and put your project URL and publishable key in `js/config.js`. Never put a secret or service role key in this repository.

## Deployment

The site is static, so any static host works. With Netlify:

1. **Add new site → Import an existing project → GitHub**, then pick this repository
2. Leave the build command and publish directory empty
3. Deploy. Every push to `main` then updates the live site automatically.

Full instructions, including connecting a custom domain, are in [`docs/SETUP.md`](docs/SETUP.md).

## Before going live

- [ ] Replace placeholder testimonials and team profiles with real ones (with permission)
- [ ] Add the registered address to the privacy policy and terms
- [ ] Add the refund and cancellation policy to the terms
- [ ] Confirm the Instagram and YouTube handles
- [ ] Have the legal pages reviewed

## Credits

Photos from [Unsplash](https://unsplash.com), used under the Unsplash license. Salary figures from the TV-Ärzte VKA pay agreement, valid from June 2026.

© 2026 Northstar. All rights reserved.
