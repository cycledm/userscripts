# Google CN Redirect

Redirect `google.cn` and `www.google.cn` to `https://www.google.com`, keeping
useful search parameters and showing a transition page that follows your system
theme.

- Keeps your query (`q`) and the original `client` when present. Neither is
  required to redirect, and the script does not force a Safari client value.
- Preserves language, region, SafeSearch, pagination, search type, and supported
  filters. Drops unknown parameters and URL fragments using an allowlist.
- Provides a light/dark transition card, loading indicator, and manual continue
  link. Reduced-motion preferences disable the animation.
- Uses online Tailwind with local fallback CSS. Navigation does not wait for
  the CDN, and there is no artificial animation delay.
- Replaces the current history entry so Back does not return to the redirect.

## Experimental system-theme sync

On `.com` search results, requests `cs=1` for dark and `cs=0` for light when the
system theme changes. This reloads the results page and may interrupt reading or
unsubmitted input. Direct `.com` visits without `cs` start syncing on the next
system-theme change. Google may ignore the parameter in some environments.

Set `SYNC_SYSTEM_THEME = false` near the top of the script to disable this
workaround. It does not edit Google account preferences or cookies.

## Scope and limitations

- Runs only in the top frame on `google.cn` / `www.google.cn`, plus the
  `www.google.com/search` page for theme synchronization.
- Unknown parameters are removed; non-search paths or features depending on
  other parameters may lose functionality. URL cleaning does not prevent cookie
  or account tracking, or undo the original request to `.cn`.
- The transition loads third-party Tailwind JavaScript from jsDelivr with
  `no-referrer`; CDN failure or CSP blocking leaves local fallback styles usable.
  No CDN code is loaded by this script on `.com`.
- `client=safari` banner suppression and Safari/iOS/userscript-manager
  compatibility have not been independently verified. Automated tests and local
  transition-page previews do not prove Google server behavior.

[Full parameter list and usage notes](https://github.com/cycledm/userscripts/blob/main/google-cn-redirect/README.md)
 · [Report an issue](https://github.com/cycledm/userscripts/issues)

Licensed under **GPL-3.0-or-later**. Copyright (C) 2026 CycleDM.
