# The Lete Gaun Resort website

Static multi-page site: index, about, rooms, gallery, explore, getting-here, book (+ 404). No build step.

## Run / deploy
Open `index.html`, or upload the whole folder to any static host. Keep `assets/` next to the pages.
Before launch replace `YOURDOMAIN` in `sitemap.xml`, `robots.txt`, the canonical and Open Graph tags of every page, and the JSON-LD in `index.html`.

## Background motion (real photos, synced to the page)
The background uses the resort's own photos from `assets/images/` (gallery-1 to 4, setting). As you scroll, it crossfades to the photo assigned to the section in view (each `<section>` has a `data-bg` key from `config.js` `IMG`: g1, g2, g3, g4, setting). Photos drift slowly, move gently with scroll, get a warmer dusk glow the further you scroll, and a light mist and snowfall sit on top.
Change which photo a section uses by editing its `data-bg` value.
Optional real video: see `VIDEO-BRIEF.md`. Put `hero.mp4` and `hero.webm` in `assets/video/` and it replaces the photos automatically, keeping the scroll movement.
Data saver and reduced-motion visitors get still photos with no drift or snow.

## Edit content
`assets/js/config.js`: phone, email, address, Facebook, policies (empty fields are hidden), room prices (a price replaces "Rates on request").
Rooms and gallery are plain HTML in `rooms.html`, `index.html` and `gallery.html`; edit them there.

## Connect the backend later
Set `apiUrl` in `config.js`. The form POSTs JSON `{ref,name,phone,email,checkin,checkout,nights,guests,room,note}`; return any 2xx for success.
If it fails or is empty, guests get buttons to send the same details on WhatsApp or email.

## Before selling
Verify phone/email with the owner, get written approval for content and photos, add real rates and policies.

## Making bookings reach the owner automatically
Out of the box the form opens WhatsApp or email pre-filled (works with no server). To receive requests automatically, create a free form endpoint (for example Formspree) and paste its URL into `apiUrl` in `assets/js/config.js`. Update `privacy.html` if you do.

## Prices in USD
Set `usdRate` in `config.js` (NPR per 1 USD) and each room price also shows an approximate USD figure.

## Also included
`make-loop.sh` and `VIDEO-BRIEF.md` (video), `privacy.html`, `_headers` (Netlify), `.htaccess` (cPanel/Apache).

## Research notes (public sources only)
- Facebook and Instagram block automated reading, so their posts could not be checked. Please compare the site text with the resort's own pages.
- Himal Press (17 June 2026) confirms the owner, location, a main building and several standalone cottages. No public source lists rates, facilities or room counts.
- Glamour Nepal and TikTok name Karan KC's wife, Barsha Basnet KC, as co-developer. This is not on the site; add it only with the owners' approval.
- The bizdirenepal.com directory lists coordinates that point to Kathmandu, not Lete. Ask the owner to correct it, and do not copy those coordinates.
