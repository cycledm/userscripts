# Steam Store Region

Default signed-out Steam storefront pages to China when browsing through a proxy,
with a persistent region switcher.

## Features

- Starts with China (`cc=cn`). The bottom-right toolbar offers **🇨🇳 CN**,
  **🇭🇰 HK**, **🇯🇵 JP**, **🇺🇸 US**, and **🌐 Default**, in that order.
  Chinese pages use Chinese labels. Region preferences persist across page loads.
- Automatic navigation adds the preferred `cc` only when no `cc` exists.
  Existing values, including empty, encoded, repeated, or case-variant parameter
  names, are preserved. Clicking a region explicitly replaces all `cc` variants
  and reloads the page, preserving other query parameters and fragments.
- Clicking **🌐 Default** saves the preference, removes all `cc` variants from
  the current URL, and reloads if needed, preserving other parameters and the
  fragment. This explicit cleanup works even while login detection pauses region
  rewriting. Future page loads are left untouched, including links with their
  own `cc`. This does not reset Steam's region cookies or guarantee a pricing region.
- Only rewrites when page data or the global login link clearly indicates a
  signed-out visitor. Signed-in or unknown login state pauses rewriting and
  disables region buttons; Default remains available. Detection is best effort
  and may need updating if Steam changes its page structure.
- Collapse the toolbar to the selected region's flag, or **🌐** for Default.
  It starts collapsed if there is no valid saved state; existing saved choices
  are preserved. The collapsed emoji is enlarged and centered in a 44 × 44 px button without
  leftover spacing from hidden controls.
  Click again to expand. The collapsed state persists independently of the
  region preference. A 200 ms width/fade transition respects reduced-motion
  settings. Collapsing does not stop rewriting. The flag and highlighted region
  reflect the saved preference, not proof of Steam's actual pricing region.
- On viewports below 640 px, options open vertically upward from the bottom-right
  corner; desktop layouts remain horizontal. Buttons have at least 44 px touch
  height, short screens can scroll the options internally, and safe-area insets
  provide clearance from screen edges and the home indicator.
- A dark translucent glass background uses a 16 px backdrop blur with light text.
  Browsers without blur support use a higher-opacity background; supported
  reduced-transparency preferences use an opaque background.
- Uses precompiled Tailwind CSS inside Shadow DOM, with no runtime CDN,
  external font, or additional downloaded script.

## Scope and limitations

Runs only on top-level `https://store.steampowered.com/` pages: the homepage and
the `app`, `bundle`, `sub`, `search`, `category`, `genre`, `tags`, `specials`,
`sale`, `charts`, `publisher`, `developer`, `franchise`, `curator`, `curators`,
`wishlist`, `points`, `explore`, and `steamdeck` path families. `/search/results`
is excluded. Account, login, cart, checkout, API, other paths, iframes, and
background requests are not rewritten. Same-document SPA navigation is not
intercepted.

The first request reaches Steam before login detection and any second navigation;
the original region may briefly appear. A per-tab 15-second guard prevents
repeating the same automatic destination if Steam removes `cc`. Unavailable
session storage skips automatic navigation; explicit region buttons still work.
Malformed query keys leave the page unchanged.

This requests a storefront display region, not an account-country change.
Steam may ignore `cc` or retain region cookies. The script does not change
purchase eligibility, proxy routing, or dynamically loaded search-result prices,
and cannot bypass region restrictions or repair a page that fails to load.
It does not intercept Steam-client traffic or require Surge/MITM. Disable an
existing Steam region Surge module separately to avoid independent rewrites.

Only `GM_getValue` and `GM_setValue` are used to save preferences. The script
does not read cookies or credentials, store account identifiers, or make external
requests apart from storefront navigation.

Automated simulated-browser tests and local previews cover URL handling and
toolbar behavior. Public Steam HTML was checked for signed-out markers; one
`cc=cn` request returned `country_code: CN`. These checks do not establish real
account behavior, actual regional prices, or end-to-end compatibility with
Tampermonkey, Violentmonkey, or Safari/iOS.
Mobile layout was checked in 320 × 568, 390 × 740, and 568 × 260 px iframe
viewports; these simulations do not establish physical-phone or iOS safe-area behavior.

[Source and full usage notes](https://github.com/cycledm/userscripts/tree/main/steam-store-region)
 · [Report an issue](https://github.com/cycledm/userscripts/issues)

CycleDM's code is licensed under **GPL-3.0-or-later**. Copyright (C) 2026 CycleDM.
Embedded Tailwind CSS utilities retain their MIT license and Tailwind Labs, Inc.
copyright notice in the script and
[third-party license file](https://github.com/cycledm/userscripts/blob/main/steam-store-region/src/tailwind-LICENSE).
