[English](README.md) | [简体中文](README.zh-CN.md)

# Steam Store Region

Choose a Steam storefront display region with login-aware initial defaults,
remembered manual choices, and a compact glass toolbar.

## Region selection

| Situation | Initial selection |
| --- | --- |
| A valid region preference exists | Use that preference, regardless of login state |
| No valid preference and Steam identifies a signed-in visitor | 🌐 Default (no automatic rewriting) |
| No valid preference and signed out or login state unknown | 🇨🇳 CN |

The toolbar runs in all three cases. Login detection never hides it or disables
region buttons. It uses Steam's `data-userinfo`, account UI, or global login link;
this is best-effort DOM detection, not an official authentication API. When no
manual preference exists, state checks on restored/visible pages can update the
initial selection without saving it. Steam page changes may require an update.

- Options are **🇨🇳 CN**, **🇭🇰 HK**, **🇯🇵 JP**, **🇺🇸 US**, and **🌐 Default**,
  in that order. Chinese pages use 国区、港区、日区、美区、默认.
- Each signed-in page load also deletes a stored Default, restoring login-based defaults.
- Other saved preference changes require a successful click on a region or Default button.
  While signed in, Default deletes it through `GM_deleteValue`; other choices use `GM_setValue`. Loading a page, detecting login state, or expanding and
  collapsing the toolbar never saves a region. Saved choices take precedence on
  subsequent page loads, including while signed in. Other tabs read them on reload.
- Automatic navigation adds the preferred `cc` only if no `cc` exists. An existing
  `cc` wins, including empty values, repeated keys, encoded names and case variants.
  Explicitly choosing a region replaces all `cc` variants and reloads, preserving
  other parameters' original encoding and the fragment.
- Clicking **🌐 Default** removes all current `cc` variants and reloads if needed.
  While signed in, Default clears the saved choice, restoring login-based defaults
  on future loads (CN after signing out). Otherwise, it saves Default, which leaves
  future URLs untouched, including links with their own `cc`. It does not reset Steam's region cookies or guarantee a pricing region.
- The selected option and the toggle's tooltip describe the preference, not proof
  of the server's actual pricing region. Logged-in users can request any listed
  display region; Steam may ignore the request or use the account's country.

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

Only `GM_getValue`, `GM_setValue`, and `GM_deleteValue` are requested, for region preferences. The
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

Simulated-browser tests cover region defaults across login states, stored-choice
precedence, manual-only preference writes, URL preservation, Default cleanup,
loop protection and collapse accessibility. Local browser previews exercise
responsive layout and animation. These do not prove real-account price changes
or end-to-end Tampermonkey, Violentmonkey, physical-phone or Safari/iOS behavior.

## License

CycleDM's code uses **GPL-3.0-or-later**: GNU General Public License version 3 or,
at your option, any later version. See [LICENSE](../LICENSE). Embedded Tailwind
utilities retain their MIT license and Tailwind Labs, Inc. copyright notice in
the script and [src/tailwind-LICENSE](src/tailwind-LICENSE).

Copyright (C) 2026 CycleDM
