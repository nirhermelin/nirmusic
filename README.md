# Nir Music — nirmusic.com

The website of Nir Hermelin, fingerstyle guitar. It's a plain static site: HTML, CSS and a little JavaScript, with no build step and nothing to install. GitHub stores the files, and Vercel publishes them automatically each time something changes here.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | Home page: hero video, YouTube video, photo + Bandcamp with the leaves, reviews, contact |
| `events.html` | Events page: upcoming signup + past shows by year |
| `lessons.html` | Lessons page: the 1-Month Fingerstyle Coaching Package, FAQ, contact |
| `pages.css` | Styles for the Events and Lessons pages (the home page has its styles built in) |
| `player.js` | The music player at the bottom of every page, plus the track list |
| `hero.mp4` | Background video in the home hero (silent, loops) |
| `hero-poster.jpg` | Still frame shown while the video loads; also the Events page header |
| `guitar.jpg` | Guitar-with-mushrooms art; shows if the video can't play, and the Lessons page header |
| `portrait.jpg` | Nir's photo next to Bandcamp (**still to be added**, see below) |
| `music/` | The four MP3s for the bottom player |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` | The ampersand icon in the browser tab and on phone home screens |
| `vercel.json` | Lets pages open without `.html` (e.g. `nirmusic.com/events`) |

## How to change things

Every change works the same way: open the file on GitHub, click the pencil icon, edit, then **Commit changes**. Vercel updates the live site within about a minute. To replace a file such as a photo or MP3, use **Add file → Upload files** and drop in a file with the same name.

**Add an upcoming show:** in `events.html`, find the comment `UPCOMING`. Copy any line that starts with `<div class="ev">` from the list below it, paste it under the comment, and change the date, time, title and venue.

**Add a past show:** copy an `<div class="ev">` line into the right year in the list. Newest goes first.

**Change the music:** upload the MP3 into `music/`, then open `player.js` and edit the `TRACKS` list near the bottom. Each line holds a title and the path to its file:

```js
{title:"Abba'le", src:"music/abbale.mp3"},
```

**Change the hero video:** upload a new file named `hero.mp4`. Keep it short (under about 40 seconds), silent, and under about 8 MB so it loads quickly on phones.

**Change wording:** search the page for the sentence you want to change and edit it in place. Leave the `<...>` tags around it untouched.

## Still to do

- **`portrait.jpg`**: save the photo from the current nirmusic.com and upload it here with exactly that name. Until then the page borrows it from Bandzoogle, and it will disappear when Bandzoogle is cancelled.
- **Forms:** the mailing-list signup and the contact forms only show a message for now. They still need to be connected to an email service.
- **Domain:** in Vercel, open Settings → Domains, add `nirmusic.com`, and copy the DNS records it shows into the domain registrar. Cancel Bandzoogle only after nirmusic.com shows the new site.

## Setup reference

- GitHub repo: `nirhermelin/nirmusic`
- Vercel: project imported from this repo, Framework preset **Other**, no build command. Under Settings → Deployment Protection, Vercel Authentication must be **off** so the site is public.
- Fonts: Fraunces (headings) and Hanken Grotesk (text), loaded from Google Fonts.
- Embeds: YouTube `HCZj8-paEJQ` and Bandcamp album `546238492`, both in `index.html`.
