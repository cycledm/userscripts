[English](README.md) | [简体中文](README.zh-CN.md)

# Google CN Redirect

Redirect `google.cn` to `https://www.google.com` with selected search parameters
and a transition page that follows the system's color scheme.

## Behavior

- Covers HTTP and HTTPS on `google.cn` and `www.google.cn`, in the top frame only.
  Other subdomains are excluded. Paths are preserved; `/` with a `q` parameter
  becomes `/search`. A homepage without a query goes to the `.com` homepage.
- Preserves `q` (including an empty query) and the original `client` when present.
  Neither is required to redirect. No client value is invented or forced.
- Uses an allowlist; unknown parameters and URL fragments are discarded.
  Typical discarded parameters include `ved`, `ei`, `sei`, `oq`, `aqs`, `source`,
  `sourceid`, `sclient`, `rlz`, `gs_lcrp`, `sca_esv`, and `utm_*`.
- Uses `location.replace` so Back does not return to the redirect page.
  The source is immediately replaced with a blank, system-themed background
  before requesting navigation. The full fallback card and CDN load wait
  150 ms, so fast navigation skips the card; this delay does not postpone
  the destination request. Content painted before the script starts may
  still briefly appear.
- Shows a compact bilingual card, a loading ring around a stationary Google G,
  the domain route below the heading, and a manual continue link. The icon is
  embedded and needs no image request. Online and fallback styles share the
  same geometry and typography.
  CSS media queries track the system theme, including changes while waiting;
  reduced-motion preferences disable the animation.

Parameters retained from `.cn`:

| Purpose | Parameters |
| --- | --- |
| Query and client | `q`, `client` |
| Language and region | `hl`, `lr`, `gl`, `cr` |
| SafeSearch | `safe` |
| Pagination | `start`, `num` |
| Search type and filters | `tbm`, `udm`, `tbs` |
| Advanced search | `as_q`, `as_epq`, `as_oq`, `as_eq`, `as_sitesearch`, `as_filetype`, `as_rights`, `as_qdr`, `as_nlo`, `as_nhi` |

For duplicate keys, the first value is kept. The allowlist prioritizes ordinary
search; non-search paths and search features requiring other parameters may lose
functionality. This cleans the outgoing URL, not cookies, account tracking, or
the original request that already reached `.cn`. `client` can itself convey
client attribution; it is retained deliberately. The author's requested
`client=safari` banner behavior has not been independently verified here.
The script needs a page on which to run; it cannot intercept an earlier HTTP
server redirect or repair a network error that prevents the page from loading.

## Installation and styling

Open [google-cn-redirect.user.js](google-cn-redirect.user.js) and import its
contents into your userscript manager. Enable access to the matched sites.
You can also use the
[Raw installation URL](https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/google-cn-redirect.user.js)
from the verified `main` branch.

<!-- greasyfork-link:start -->
Greasy Fork: [Greasy Fork](https://greasyfork.org/scripts/601010)
<!-- greasyfork-link:end -->

The metadata links to the source directory and the repository's issue tracker.
For Greasy Fork's additional-information sync, use the English
[description source](https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/greasyfork-description.md)
and the Simplified Chinese
[description source](https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/greasyfork-description-zh-cn.md).
These are Markdown files using absolute links. Greasy Fork selects the
localized description; the publication text does not include language switches.
In Greasy Fork's script management page, use the English source for the
**default additional information** (this script's default locale is English).
Add one **Chinese (China), `zh-CN`** localized entry for the Chinese source,
matching `@name:zh-CN`. Do not add a separate English localization duplicating
the default entry. Select **Markdown** as the format for both sync URLs.
If previously configured for HTML, replace the `.html` URLs with the `.md`
URLs above and change the format to Markdown. Committing these files does not change
Greasy Fork's settings automatically.

The transition uses online [Tailwind Play CDN](https://tailwindcss.com/docs/installation/play-cdn)
(`@tailwindcss/browser@4` from jsDelivr), plus complete local fallback CSS.
Tailwind describes this runtime as intended for development. It is used here
to honor the online-Tailwind requirement without a build tool; CDN failures or
page CSP restrictions leave the fallback usable and do not delay navigation.
The CDN runs third-party JavaScript on the `.cn` transition; no search query is
displayed, and the request uses `no-referrer`. No external logo or font is used.

## Validation

Run the dependency-free checks with:

```sh
node --check google-cn-redirect/google-cn-redirect.user.js
node --test google-cn-redirect/tests/redirect.test.cjs
```

Tests exercise URL selection, tracking removal, missing and encoded values,
immediate navigation, delayed fallback rendering, failure recovery, and domain
isolation in a simulated browser. They do not prove Google server behavior or userscript-manager
compatibility. End-to-end installation on Safari/iOS, Tampermonkey, and
Violentmonkey, plus banner suppression, still require testing.
A temporary local preview was visually checked in the in-app browser with
Tailwind loaded and with the CDN blocked by CSP. The dark palette was forced
in that preview; this was not a real system-theme test.

## License

GNU General Public License, version 3 or (at your option) any later version
(**GPL-3.0-or-later**). See the repository [LICENSE](../LICENSE).

Copyright (C) 2026 CycleDM
