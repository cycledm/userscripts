[English](README.md) | [简体中文](README.zh-CN.md)

# Steam Store Region

Choose a display region for signed-out Steam storefront pages with remembered
manual choices and a compact glass toolbar.

## Region selection

- When Steam identifies a signed-in session, the script exits without creating
  controls, reading or changing preferences, or rewriting the URL.
- Otherwise, a valid saved choice wins; without one, the initial region is **🇨🇳 CN**.
  Unknown login state is treated the same as signed out.
- Login detection uses Steam's `data-userinfo` and account UI. It is best effort;
  Steam page changes may require an update. On restored/visible pages and before
  control actions, a newly detected login hides existing controls and stops rewriting.
- Options are **🇨🇳 CN**, **🇭🇰 HK**, **🇯🇵 JP**, **🇺🇸 US**, and **🌐 Default**,
  in that order. Chinese pages use 国区、港区、日区、美区、默认.
- Only clicking a region or Default button saves a preference through `GM_setValue`.
  Page loads and expanding/collapsing never save a region. Other tabs read the
  latest preference on reload. Signed-in visits leave existing preferences intact.
- Automatic navigation adds the preferred `cc` only if no `cc` exists. An existing
  `cc` wins, including empty values, repeated keys, encoded names and case variants.
  Explicitly choosing a region replaces all `cc` variants and reloads, preserving
  other parameters' original encoding and the fragment.
- Clicking **🌐 Default** saves Default, removes all current `cc` variants, and
  reloads if needed. Future loads leave URLs untouched, including links with their
  own `cc`. It does not reset Steam's region cookies or guarantee a pricing region.
- The selected option and toggle tooltip describe the preference, not proof of
  the server's actual pricing region. Signed-in currency display is outside this script's scope.

## Toolbar and animation

Each full page load starts collapsed. Collapse state stays in memory only, and
old stored collapse records are ignored. The fixed bottom-right anchor stays
**54 × 54 px** throughout opening and closing; its button has a **44 × 44 px**
touch target. The separate tray opens left on screens at least 640 px wide and
upward in a compact vertical column on narrower screens. Short mobile viewports
can scroll the options; safe-area offsets provide clearance from screen edges.

| Layout | Expand | Collapse |
| --- | --- | --- |
| Horizontal | ◀️ | ▶️ |
| Vertical | 🔼 | 🔽 |

Buttons appear from the anchor outward, with directional movement and a light
spring-like overshoot. They disappear in reverse order toward the anchor.
Opening takes about 0.6 seconds; closing takes about 0.36 seconds. CSS transitions
can reverse mid-animation; reduced-motion preferences remove movement and delays.
Collapsed controls are inert and excluded from accessibility navigation.

The more transparent dark glass surface uses 24 px blur and saturation, while
darker button backgrounds, white labels and subtle text shadows preserve contrast.
Unsupported blur uses a higher-opacity background; supported reduced-transparency
preferences use an opaque surface. Styles are precompiled Tailwind CSS 3.4.17 in
Shadow DOM. No runtime CDN, external font or downloaded compiler is used.

## Scope and limitations

Only top-level `https://store.steampowered.com/` pages are matched: `/` and the
`app`, `bundle`, `sub`, `search`, `category`, `genre`, `tags`, `specials`, `sale`,
`charts`, `publisher`, `developer`, `franchise`, `curator`, `curators`, `wishlist`,
`points`, `explore`, and `steamdeck` path families. `/search/results` is excluded.
Account, login, cart, checkout, API, other paths, iframes and background requests
are not rewritten. Same-document SPA navigation is not intercepted.

The script runs at `document-end`; the original request has already reached
Steam and the original region may briefly appear before a second navigation.
A per-tab 15-second session-storage guard prevents repeated navigation to the
same destination if Steam removes `cc`. This session value is only for loop
protection; it is not a saved region preference. Unavailable session storage
skips automatic navigation; explicit buttons still work. Malformed query keys
leave the request unchanged.

This changes a display-region request, not account country, purchase eligibility,
proxy routing or dynamically loaded search-result prices. It cannot bypass region
restrictions or fix a page that fails to load. It does not intercept Steam-client
traffic or require Surge/MITM. Disable an existing Steam region Surge module
separately to avoid independent rewrites.

## Installation and publication

Import [steam-store-region.user.js](steam-store-region.user.js) into your userscript
manager, or use the [Raw installation link](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/steam-store-region.user.js).
Unpushed local changes are available only by local import until publication.

<!-- greasyfork-link:start -->
Greasy Fork: [Greasy Fork](https://greasyfork.org/scripts/601020)
<!-- greasyfork-link:end -->

For additional-information sync, use the [English description source](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/greasyfork-description.md)
for the **default entry** and the [Chinese description source](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/greasyfork-description-zh-cn.md)
for one **Chinese (China), `zh-CN`** localized entry matching `@name:zh-CN`.
Select **Markdown** for both; do not add a duplicate English localization.
Configure these URLs separately on Greasy Fork. Committing files does not configure
synchronization or publish the script.

Only `GM_getValue` and `GM_setValue` are requested, for region preferences. The
script does not read cookies or credentials, store account identifiers, or make
external requests apart from storefront navigation.

## Development and validation

After changing utility classes or `src/tailwind.css`, rebuild the embedded CSS:

```sh
python3 steam-store-region/src/build-styles.py
node --check steam-store-region/steam-store-region.user.js
node --test steam-store-region/tests/region.test.cjs
```

Rebuilding needs Python 3, Node.js/npm, and npm access or a populated cache for the
pinned Tailwind CLI. Installing and using the script needs none of these tools.
No repository package manifest is required.

Simulated-browser tests cover signed-in early exit and hidden controls after login,
stored-choice precedence, manual-only preference writes, URL preservation, Default cleanup,
loop protection and collapse accessibility. Local browser previews exercise
responsive layout and animation. These do not prove real-account price changes
or end-to-end Tampermonkey, Violentmonkey, physical-phone or Safari/iOS behavior.

## License

CycleDM's code uses **GPL-3.0-or-later**: GNU General Public License version 3 or,
at your option, any later version. See [LICENSE](../LICENSE). Embedded Tailwind
utilities retain their MIT license and Tailwind Labs, Inc. copyright notice in
the script and [src/tailwind-LICENSE](src/tailwind-LICENSE).

Copyright (C) 2026 CycleDM
