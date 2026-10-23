# Setup guide: Northstar website

A multi page static website for Northstar with a free consultation form
that saves into a Supabase database.

## What is in this folder

```
index.html          the whole landing page (10 sections)
privacy.html        privacy policy (Datenschutz), required because you collect data
css/style.css       all design: colours, fonts, layout, mobile view
js/config.js        your Supabase URL and public key go here
js/main.js          mobile menu + form validation + sending to Supabase
supabase-setup.sql  creates the database table and its security rules
assets/             logo and favicon
images/             put your own photos here
```

## Pages

| File | Page |
|---|---|
| index.html | Home: hero, key facts, why Germany, salary table, six steps, services, stories |
| pathway.html | The six stages in detail, a self check and a glossary |
| about.html | Story, how we work, team |
| pricing.html | Full package, what is included, FSP extra |
| faq.html | Questions grouped by topic |
| contact.html | Free consultation form (saves to Supabase) and contact details |
| privacy.html, terms.html | Legal drafts |

Every page shares the same header, footer, WhatsApp button and mobile bar.
If you change the menu or footer, change it in every HTML file.

## Photos

Free photos from Unsplash (unsplash.com/license), loaded from images.unsplash.com.
Replace them with your own photos whenever you can. Photo pages:
unsplash.com/photos/medical-professionals-working-U4FyCp3-KzY,
unsplash.com/photos/brandenburg-gate-and-tv-tower-berlin-mtfTz0FnwBw,
unsplash.com/photos/berlin-tv-tower-seen-from-a-street-with-trees-eyp39t8r0xw,
unsplash.com/photos/person-holding-ballpoint-pen-writing-on-notebook-505eectW54k,
unsplash.com/photos/doctor-holding-red-stethoscope-hIgeoQjS_iE

## What you need (all free)

| Tool | Why | Link |
|---|---|---|
| VS Code | write and edit the code | code.visualstudio.com |
| Live Server extension (inside VS Code) | see the page live while editing | Extensions tab, search "Live Server" |
| Git | version control | git-scm.com |
| GitHub account | stores your code online | github.com |
| Supabase account | the database for the form | supabase.com |
| Netlify or Cloudflare Pages account | hosts the website | netlify.com or pages.cloudflare.com |
| Domain name (only paid part, about €10 a year) | yourname.com | Namecheap, Cloudflare, IONOS |

---

## Step 1. Open and run the site on your laptop

1. Unzip the folder and open it in VS Code (File, Open Folder).
2. Right click `index.html`, choose **Open with Live Server**.
3. The site opens at `http://127.0.0.1:5500`. Every time you save a file, it refreshes.
4. Try the form now: it will say "The form is not connected yet". That is expected.

## Step 2. Understand how the page is built

* **HTML (`index.html`)** is the content and structure. Each part is a `<section>` with an `id`,
  for example `<section id="pricing">`. The navbar links (`href="#pricing"`) jump to those ids.
* **CSS (`css/style.css`)** is the look. Read it top to bottom, it is numbered:
  1. Design tokens: change `--line` (teal) and `--signal` (yellow) to restyle the whole site.
  2. Flexbox is used for rows (navbar, buttons). Grid is used for card layouts (pricing, team).
  3. The roadmap line is pure CSS: `.line::before` draws the track, `.stop::before` draws each numbered station.
  4. Section 15 (media queries) turns everything into one column on phones.
* **FAQ** uses the built in `<details>` and `<summary>` tags, so it opens and closes with no JavaScript.
* **JavaScript (`js/main.js`)** does two things: the phone menu, and the form.

## Step 3. Create the database (Supabase, free plan)

1. Go to supabase.com, sign in with GitHub, click **New project**.
2. Name it, set a strong database password (save it), and choose region **Central EU (Frankfurt)** for GDPR.
3. Wait about 2 minutes while it starts.
4. Left menu, **SQL Editor**, **New query**. Paste everything from `supabase-setup.sql`, click **Run**.
   You should see "Success. No rows returned".
5. Left menu, **Table Editor**: you now have an empty `consultation_requests` table.

What the SQL did, in plain words:
* Created a table with one column per form field, plus `id`, `created_at` and `status`.
* Added **check rules** so the database itself rejects junk (too long text, wrong email format, no consent).
* Turned on **Row Level Security (RLS)** and allowed the public to **insert only**. Nobody on the internet can read your students' data, even though the key is in the page.

## Step 4. Connect the form to the database

1. In Supabase: **Project Settings**, **API** (or **Data API** / **API Keys**).
2. Copy the **Project URL** and the **anon** (or **publishable**) key.
3. Paste both into `js/config.js`.
4. Never paste the **service_role** or **secret** key anywhere in the website. That key bypasses all security.
5. Save, go back to the browser, fill the form, click **Send application**.
6. Open Supabase, Table Editor, `consultation_requests`: your row is there.

How the form works (`js/main.js`, section 2):
1. Stops the browser's normal submit (`e.preventDefault()`).
2. Reads the fields with `FormData`.
3. A hidden "website" field catches spam bots: real people never see it, bots fill it.
4. Checks each field and highlights mistakes.
5. Sends the data with `db.from("consultation_requests").insert(data)`.
6. Shows a success or error message.

Test the security yourself (good practice for a security person): open the browser console and run
```js
await window.supabase.createClient(SITE_CONFIG.SUPABASE_URL, SITE_CONFIG.SUPABASE_ANON_KEY).from("consultation_requests").select("*")
```
You should get an error or an empty list, never the data.

## Step 5. Put your own content in

* Replace "Northstar" everywhere (VS Code: Ctrl+Shift+H to find and replace across files).
* Replace the email `hello@yourdomain.com`.
* Write your own testimonials (only real ones, with permission).
* Team photos: put `team-1.jpg` in `images/`, then in `index.html` replace the
  `<div class="avatar">AB</div>` with `<img src="images/team-1.jpg" alt="Photo of Name">`.
* Compress images first at squoosh.app (WebP, under 200 KB each).
* Do not copy text, images or the logo from another company's website.

## Step 6. Put the code on GitHub

```bash
git init
git add .
git commit -m "First version of landing page"
```
Then on github.com create a new empty repository and run the two commands GitHub shows you
(`git remote add origin ...` and `git push -u origin main`).

## Step 7. Host it for free (Netlify)

1. netlify.com, sign in with GitHub.
2. **Add new site**, **Import an existing project**, choose GitHub, pick your repository.
3. Build command: leave empty. Publish directory: leave empty (or `.`).
4. Click **Deploy**. In under a minute it is live at `something.netlify.app`.
5. From now on, every `git push` updates the live site automatically.

(Cloudflare Pages works the same way: Workers & Pages, Create, Pages, Connect to Git.)

## Step 8. Connect your own domain

1. Buy the domain.
2. Netlify: **Domain management**, **Add a domain**, type it in.
3. Netlify shows DNS records (or nameservers). Enter them at your domain seller.
4. Wait from a few minutes up to 24 hours. HTTPS (padlock) is added automatically.

## Step 9. Before going live (checklist)

- [ ] Privacy policy generated and checked
- [ ] Supabase region is Frankfurt, data processing agreement (DPA) accepted in Supabase settings
- [ ] Form tested: success, error, and the security test from Step 4
- [ ] Tested on a phone
- [ ] Self host the Google Fonts (google-webfonts-helper) to avoid a German GDPR issue with loading fonts from Google
- [ ] Remember: the free Supabase project pauses after a week without activity. Check it weekly, or upgrade when real students apply.

## Step 10. Daily use: reading applications

Supabase, Table Editor, `consultation_requests`. Sort by `created_at`. Change the `status` column
to `contacted` or `enrolled` as you work through them. Export to CSV with the button at the top.

Optional next step: get an email for every new application with a Supabase
**Database Webhook** or a free automation tool (Make or n8n) watching the table.
