[English](README.md) | [简体中文](README.zh-CN.md)

# Steam Store Region

Default signed-out Steam storefront pages to China with a persistent region switcher.

## Behavior

- Starts with **China (`cc=cn`)**. The bottom-right toolbar offers **China**,
  **Hong Kong (`hk`)**, **Japan (`jp`)**, **US (`us`)**, and **🌐 Default**,
  in that order, with Chinese labels on Chinese pages and uppercase region codes
  (`CN`, `HK`, `JP`, `US`) on other pages. Region buttons prefix the label with the corresponding flag emoji and
  one space. The highlighted button is the saved preference, not proof of the
  server's current pricing region. The preference is saved in userscript-manager
  storage. Other open tabs read it on their next page load.
- The toolbar's right-hand button collapses it to the selected region's flag
  (**🇨🇳**, **🇭🇰**, **🇯🇵**, or **🇺🇸**); **Default** displays **🌐**.
  The icon reflects the saved preference, not Steam's actual pricing region.
  Click it again to expand. The state is saved separately from the region
  preference and restored on future page loads. Collapsing does not disable
  region rewriting. Width and opacity animate over 200 ms; the system's
  reduced-motion setting disables this animation. Hidden controls are excluded
  from keyboard focus and accessibility navigation while collapsed.
- Automatic navigation adds the preferred `cc` only when none exists. Existing
  `cc` values, including empty, encoded, repeated, or case-variant names, take
  precedence. Clicking a region explicitly replaces all `cc` variants and reloads
  the current page. Other query parameters and fragments retain their encoding.
- **🌐 Default** stops future automatic changes and leaves the current URL, including
  any existing `cc`, untouched. Remove `cc` manually if you want Steam to choose
  the current page's region again. It does not reset Steam's own cookies.
- Only acts after the page identifies a signed-out visitor using Steam's
  `data-userinfo` or a login link in the global header. Account UI or signed-in
  data pauses rewriting; unknown state also pauses it. Region buttons are
  disabled while paused; Default remains available. This is best-effort DOM detection,
  not an official Steam authentication API. Header/layout changes may require an
  update. State is checked again before each rewrite, on restored pages, and for
  toolbar display when returning to a visible tab.
- Runs at `document-end` to inspect login state. The first request has already
  reached Steam; a second navigation may briefly show the original region.
  A per-tab 15-second guard suppresses repeating the same automatic destination
  if Steam removes `cc`. When session storage is unavailable, automatic navigation
  is skipped; explicit region buttons still work. Malformed query keys are left alone.

## Scope and limitations

Only top-level pages on `https://store.steampowered.com/` are matched. Supported
paths are `/` and the `app`, `bundle`, `sub`, `search`, `category`, `genre`, `tags`,
`specials`, `sale`, `charts`, `publisher`, `developer`, `franchise`, `curator`,
`curators`, `wishlist`, `points`, `explore`, and `steamdeck` path families.
`/search/results` is excluded. Account, login, cart, checkout, API, other paths,
iframes, and background requests are not rewritten. Same-document SPA navigation
is not intercepted; another full supported page load runs the script again.

The script requests a storefront display region through `cc`; Steam may ignore
it or retain region cookies. It does not change account country, purchase
eligibility, proxy routing, or automatically loaded prices in search results.
It cannot overcome region restrictions or a page that fails to load through the
proxy. It needs no Surge module or MITM and does not intercept Steam-client traffic.
If replacing the supplied Surge module, disable it separately to avoid having
two independent rewriting mechanisms; this script cannot undo Surge's network
rewrites or host-level MITM configuration.

## Installation

Import the contents of [steam-store-region.user.js](steam-store-region.user.js)
into your userscript manager and allow access to the matched Steam site.
The [Raw installation link](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/steam-store-region.user.js)
points directly to this script on the repository's `main` branch.

<!-- greasyfork-link:start -->
Greasy Fork: [Greasy Fork](https://greasyfork.org/scripts/601020)
<!-- greasyfork-link:end -->

For Greasy Fork's additional-information sync, use the English
[description source](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/greasyfork-description.md)
for the **default entry**, and add one **Chinese (China), `zh-CN`** localized entry
using the [Chinese description source](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/greasyfork-description-zh-cn.md),
matching `@name:zh-CN`. Select **Markdown** for both. Do not add a duplicate
English localization. Configure these two sync URLs separately on Greasy Fork;
committing the files does not configure synchronization or publish the script.

Only `GM_getValue` and `GM_setValue` are requested, for region and collapse preferences.
No cookies or credentials are read, no account identifiers are stored, and no
external requests are made by the script apart from navigating the storefront.

## Styling and development

The toolbar uses **Tailwind CSS 3.4.17**, precompiled and embedded in the `.user.js`.
Its Shadow DOM isolates utility styles from the storefront. There is no runtime
CDN, external font, or Tailwind browser compiler. This follows Tailwind's
[static CSS compilation workflow](https://v3.tailwindcss.com/docs/installation).

To change styles, edit the utility classes and/or `src/tailwind.css`, then run:

```sh
python3 steam-store-region/src/build-styles.py
node --check steam-store-region/steam-store-region.user.js
node --test steam-store-region/tests/region.test.cjs
```

Rebuilding needs Python 3, Node.js/npm, and access to npm for the pinned Tailwind
CLI (or a populated npm cache). Installation and use need none of these tools.
No repository package manifest or dependency installation is required.

## Validation

Node's simulated-browser tests cover path boundaries, query preservation,
preferences, explicit switches, login/unknown-state skipping, storage failures,
collapse-state persistence and accessibility state,
and redirect-loop protection. Current public Steam HTML was checked for the
signed-out `data-userinfo` and global login-link markers; one public `cc=cn`
product-page request returned `country_code: CN`. A temporary local browser
preview using simulated manager storage confirmed the toolbar layout, switching
to `cc=hk`, and preserving the current URL when Default is selected. The collapsible toolbar was
also checked locally for collapse, expansion, and restoring the collapsed state
after a reload. This does not prove
logged-in behavior on a real account or end-to-end compatibility with
Tampermonkey, Violentmonkey, Safari/iOS, or Steam's actual regional price response.

## License

CycleDM's code is **GPL-3.0-or-later**: GNU General Public License, version 3 or,
at your option, any later version. See [LICENSE](../LICENSE).
Embedded Tailwind CSS utilities are MIT-licensed, Copyright (c) Tailwind Labs,
Inc.; their notice is retained in the script and [src/tailwind-LICENSE](src/tailwind-LICENSE).

Copyright (C) 2026 CycleDM
