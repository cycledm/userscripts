# Google CN Redirect

Redirect `google.cn` and `www.google.cn` to `https://www.google.com`, keeping
useful search parameters and showing a transition page that follows your system
theme.

- Keeps your query (`q`) and the original `client` when present. Neither is
  required to redirect, and the script does not force a Safari client value.
- Preserves language, region, SafeSearch, pagination, search type, and supported
  filters. Drops unknown parameters and URL fragments using an allowlist.
- Provides a light/dark transition card, a loading ring around an embedded,
  stationary Google G, the domain route below the heading, and a manual continue
  link. Online and fallback styles share the same layout and typography.
  Compact spacing and a wrapping domain route support narrow screens. The
  continue link has visible keyboard focus and a minimum 44 px target height;
  reduced-motion preferences disable animation and link transitions.
- Immediately covers the source with a blank background that follows the
  system theme, then requests navigation. The full fallback card and online
  Tailwind load wait 150 ms; navigation does not wait. Content painted before
  the script starts may still briefly appear.
- Replaces the current history entry so Back does not return to the redirect.

## Scope and limitations

- Runs only in the top frame on `google.cn` / `www.google.cn`.
- Unknown parameters are removed; non-search paths or features depending on
  other parameters may lose functionality. URL cleaning does not prevent cookie
  or account tracking, or undo the original request to `.cn`.
- The transition loads third-party Tailwind JavaScript from jsDelivr with
  `no-referrer`; CDN failure or CSP blocking leaves local fallback styles usable.
- `client=safari` banner suppression and Safari/iOS/userscript-manager
  compatibility have not been independently verified. Automated tests and local
  transition-page previews do not prove Google server behavior.

[Full parameter list and usage notes](https://github.com/cycledm/userscripts/blob/main/google-cn-redirect/README.md)
 · [Report an issue](https://github.com/cycledm/userscripts/issues)

Script code licensed under **GPL-3.0-or-later**. Copyright (C) 2026 CycleDM.
