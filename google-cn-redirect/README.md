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
  Navigation starts on the next timer tick; no artificial animation delay or
  CDN wait is added. Fast navigation may make the transition barely visible.
- Shows a compact bilingual card, loading indicator, and manual continue link.
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

## Experimental search-theme sync

Enabled by default; set `SYNC_SYSTEM_THEME` to `false` near the top of the script
to disable it. No settings storage or GM permissions are needed.

For `.cn` searches, the target receives `cs=1` for dark or `cs=0` for light.
On `https://www.google.com/search` (also `/search/`), the script listens for
`prefers-color-scheme` changes and reloads with the appropriate `cs` value.
Returning to a hidden tab or a cached page also checks for changes. Existing
`.com` search parameters and fragments are preserved; URL cleaning applies only
to the `.cn` redirect. No Tailwind or transition UI is loaded on `.com`.

An existing mismatched `cs` is corrected on load. Direct `.com` visits without
`cs` start syncing on the next system-theme change; missing `cs` is not repeatedly
re-added on load, avoiding a redirect loop if Google strips it. Theme switching
reloads results and may interrupt reading or unsubmitted input. This option
requests the system theme even if Google's appearance setting differs; it does
not edit account settings, cookies, or apply image-distorting CSS filters.

The `cs` values appear in [Chromium's own URL builder](https://chromium.googlesource.com/chromium/src/+/328fd587ff59399a3c3c6ea2781e2bc52482bc1b%5E%21/).
This is a best-effort workaround, not a documented Google Search compatibility
guarantee. Google may ignore it for some layouts, accounts, or browsers.
Google also provides an [Appearance → Device default setting](https://support.google.com/websearch/answer/2539428?co=GENIE.Platform%3DAndroid&hl=en).

## Installation and styling

Open [google-cn-redirect.user.js](google-cn-redirect.user.js) and import its
contents into your userscript manager. Enable access to the matched sites.
You can also use the
[Raw installation URL](https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/google-cn-redirect.user.js)
from the verified `main` branch.

<!-- greasyfork-link:start -->
Greasy Fork: Not published
<!-- greasyfork-link:end -->

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
theme events, visibility handling, loop prevention, and disabled sync in a
simulated browser. They do not prove Google server behavior or userscript-manager
compatibility. Safari/iOS, Tampermonkey, and Violentmonkey end-to-end installation,
banner suppression, and Google's actual theme response still require testing.
A temporary local preview was visually checked in the in-app browser with
Tailwind loaded and with the CDN blocked by CSP. The dark palette was forced
in that preview; this was not a real system-theme or Google results-page test.

## License

GNU General Public License, version 3 or (at your option) any later version
(**GPL-3.0-or-later**). See the repository [LICENSE](../LICENSE).

Copyright (C) 2026 CycleDM
