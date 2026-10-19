# Steam Store Region

Choose a display region for signed-out Steam storefront pages with remembered
manual choices and a compact, animated glass toolbar.

## Defaults and saved choices

- Detected signed-in sessions exit without creating controls, reading or changing
  preferences, or rewriting URLs. Existing saved choices remain intact.
- Otherwise a valid saved choice wins; without one, start with **🇨🇳 CN**.
  Unknown login state is treated the same as signed out.
- Login detection uses Steam page data and account UI and is best effort. On
  restored/visible pages and before control actions, a newly detected login hides
  existing controls and stops rewriting. Steam layout changes may require updates.
- Only clicking a region or Auto button saves a preference. Page loads and
  expanding/collapsing never save the initial choice.

Options are **🇨🇳 CN**, **🇭🇰 HK**, **🇯🇵 JP**, **🇺🇸 US**, and **🌐 Auto**, in
that order. Chinese pages use Chinese names. Saved choices apply on future eligible visits.

Automatic navigation adds the preferred `cc` only when no `cc` exists. Existing
values, including empty, repeated, encoded or case-variant names, are preserved.
Clicking a region explicitly replaces all `cc` variants and reloads while keeping
other parameters' encoding and the fragment. Clicking **🌐 Auto** saves Auto,
removes current `cc` variants and reloads if needed; future URLs are left alone,
including links with their own `cc`. Steam cookies are not reset.

## Compact controls and motion

- Each full page load starts collapsed. Collapse state is not stored.
- The bottom-right **54 × 54 px** anchor stays fixed throughout the animation.
  Its separate tray opens left on wide screens or upward in a narrower vertical
  column below 640 px. Buttons have 44 px touch height; short phone screens can
  scroll the options, with screen safe-area clearance.
- Horizontal controls use **◀️ / ▶️**; vertical controls use **🔼 / 🔽**. The
  selected region remains visible in the option highlight and toggle tooltip.
- Buttons appear from the anchor outward with staggered directional movement
  and light spring-like overshoot; closing reverses the order toward the anchor.
  Opening takes about 0.6 seconds and closing about 0.36 seconds. Reduced-motion
  preferences remove movement and delays; collapsed controls are inert.
- A more transparent dark glass surface uses 24 px blur and enhanced saturation.
  Darker button surfaces, white text and subtle text shadows protect readability.
  Unsupported blur uses a higher-opacity fallback; supported reduced-transparency
  preferences use an opaque background. Precompiled Tailwind styles are isolated
  in Shadow DOM; no runtime CDN, external font or compiler is downloaded.

## Scope and limitations

Top-level `https://store.steampowered.com/` pages only: `/` and `app`, `bundle`,
`sub`, `search`, `category`, `genre`, `tags`, `specials`, `sale`, `charts`, `publisher`,
`developer`, `franchise`, `curator`, `curators`, `wishlist`, `points`, `explore`, and
`steamdeck` path families. `/search/results` is excluded. Account, login, cart,
checkout, API, other paths, iframes and background requests are not rewritten.
Same-document SPA navigation is not intercepted.

The first request already reaches Steam before a possible second navigation.
A per-tab 15-second session-storage guard limits repeated automatic navigation
if Steam strips `cc`; unavailable session storage skips automatic navigation,
but explicit buttons still work. Malformed query keys leave URLs unchanged.
This session value is for loop protection, not a saved region preference.

This requests a display region, not a change to account country, purchase
eligibility, proxy routing or dynamically loaded search-result prices. Steam
may ignore `cc` or retain region cookies. Signed-in currency display is outside this script's scope.
The script cannot bypass region restrictions or fix failed page loads. It does
not intercept Steam-client traffic or require Surge/MITM. Disable an existing
Steam region Surge module separately to avoid independent rewrites.

Only `GM_getValue` and `GM_setValue` are used for region preferences. No cookies
or credentials are read, no account identifiers are stored, and no external
requests are made apart from storefront navigation.

Simulated tests cover signed-in early exit, hidden controls after login, saved-choice priority, manual-only
preference writes, URL handling and collapse behavior. Local browser previews
check responsive layout and motion; these do not prove actual account prices or
end-to-end userscript-manager, physical-phone or Safari/iOS compatibility.

[Source and full usage notes](https://github.com/cycledm/userscripts/tree/main/steam-store-region)
 · [Report an issue](https://github.com/cycledm/userscripts/issues)

CycleDM's code uses **GPL-3.0-or-later**. Copyright (C) 2026 CycleDM. Embedded
Tailwind utilities retain their MIT license and Tailwind Labs, Inc. copyright
notice in the script and [third-party license file](https://github.com/cycledm/userscripts/blob/main/steam-store-region/src/tailwind-LICENSE).
