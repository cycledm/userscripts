# Repository Guidelines

## Maintaining These Guidelines

- Merge or replace before adding; state each requirement once and remove obsolete
  rules. Write short, actionable text; distinguish requirements from preferences.
  Omit decorative wording, hypothetical edge cases, and implementation history.
- Specify exact names, fields, and commands where needed; abstract shared rules
  without using individual scripts as normative references.
- Target about 1,200 words without sacrificing accuracy or requirements. Whenever
  an edit increases length, immediately review and tighten the file under these
  standards before finishing.
- Briefly walk through existing-script and new-script tasks after edits; fix
  execution ambiguities and stop once clear.

## Project and Layout

Personal userscripts for learning, research, and everyday use. Scripts are
independent; compatibility is documented per script. Use **CycleDM** for authorship
and **cycledm** for GitHub URLs: `https://github.com/cycledm/userscripts`.

- Each script lives directly under the root in `<script-name>/`, containing
  `<script-name>.user.js`, `README.md`, `README.zh-CN.md`,
  `greasyfork-description.md`, and `greasyfork-description-zh-cn.md`.
- Use lowercase kebab-case for directories and files. Preserve conventional and
  tool-required names such as `README.md`, `AGENTS.md`, and `LICENSE`.
  Versions belong in `@version`, never filenames.
- Add supporting directories (`assets/`, `src/`, `tests/`) only for actual needs.
  Do not add a root `scripts/` container, speculative files, or example scripts.

## JavaScript and Metadata

- Prefer native JavaScript and minimal dependencies. Add build tools, manifests,
  configuration, or automation only for a concrete task requirement.
- Preserve existing behavior and configuration; avoid unrelated refactors.
  Keep scripts isolated from page globals and use least-privilege URL matches
  and GM permissions. Never commit credentials, tokens, or cookies.
- Use double quotes, except when single quotes reduce escaping. Use template
  literals only for interpolation or multiline text. Apply this to changed code
  without unrelated quote-only edits.
- Start every entry with `// ==UserScript==` and end its metadata block with
  `// ==/UserScript==`. Include accurate `@name`, `@description`, `@version`,
  `@namespace`, `@author`, `@license`, `@match`, and `@grant`.
  Defaults: namespace is the repository URL, author is `CycleDM`, license is
  `GPL-3.0-or-later`. Grant only APIs used, or `none`; add other metadata only
  for a purpose.
- Set `@updateURL` and `@downloadURL` to the script's verified HTTPS GitHub Raw
  `.user.js` URL on `main`, matching its Raw installation link. Do not pin update
  URLs to commits or tags. GF strips these fields from hosted copies, which
  continue updating through GF. Check remote content/version after pushing;
  do not claim automatic updates were tested without a manager-level check.
- Increment `@version` for released script changes, not documentation alone.
  Retain `Copyright (C) <year or year range> CycleDM` outside metadata for
  CycleDM's code.

## CSS and UI

- Use the latest stable Tailwind CSS major (currently v4); verify releases when
  upgrading. Pin compiler versions for reproducible builds. Browser runtimes may
  track the stable major. Use syntax supported by that version.
- Keep layouts simple, spacing and typography consistent, colors restrained,
  hierarchy clear, and contrast readable. Preserve useful existing interactions.
- Standalone pages follow system light/dark preferences. Embedded widgets match
  the host website; fixed-theme websites keep that theme regardless of system
  settings. Follow host theme changes only when supported by the site.
- Prefer utilities; use custom CSS for animation, states, isolation, or fallbacks
  when clearer. Scope styles to owned elements or Shadow DOM. Keep resets and
  shared classes from affecting the host page.
- Choose delivery by environment: self-owned pages may use the browser CDN with
  complete local fallback CSS; persistent widgets may embed precompiled CSS.
  Do not add or replace build/runtime machinery merely for uniformity.
- Navigation and core behavior must not wait for styles, CDN loading, or animation.
  Avoid unstyled flashes and layout shifts. Support narrow screens, keyboard
  focus, reduced motion, and applicable blur/transparency fallbacks.
- Check affected layouts, states, themes, and blocked-CDN behavior. Document
  runtime/compiler versions and rebuild steps where relevant.

## Icons

- Use [Dashboard Icons](https://github.com/homarr-labs/dashboard-icons) or
  [Simple Icons](https://github.com/simple-icons/simple-icons). Choose clear,
  recognizable artwork with little unnecessary padding; prefer Dashboard Icons
  when equally suitable.
- Require Base64 image data URLs for `@icon` and `@icon64`; no remote icon URLs.
  Prefer a compact 128×128 PNG for `@icon`; use 64×64 for `@icon64`.
  Check decoding, dimensions, and display where possible. Source copies are
  optional; do not add dependencies or tools just for icons.
- Do not add standalone icon copyright declarations, attribution files,
  brand-permission reviews, or pending-approval prose to script documentation.

## License

Default: **GPL-3.0-or-later**. Keep that grant explicit in metadata and bilingual
READMEs. Do not modify the root `LICENSE` (official GPL v3 text), add noncommercial
restrictions, or change existing licenses without authorization. Commercial use
remains permitted under the GPL.

A script with a different license needs its own `LICENSE` and consistent metadata
and bilingual READMEs. Check compatibility of incorporated third-party code;
retain required licenses, attribution, and ownership. Do not relicense it or
replace its author with CycleDM without permission.

## Documentation

- Maintain English `README.md` and Simplified Chinese `README.zh-CN.md` at the root
  and in each script. Put reciprocal language links at the top and synchronize
  affected content. Describe purpose, features, installation, supported URLs,
  license, and useful usage notes; omit empty sections.
- Both root indexes list exactly the actual scripts in four columns: script name
  (directory link), localized description, Raw, and Greasy Fork. Raw points to
  the actual `.user.js`; verify repository, branch/ref, and path. GF links must be
  verified public listings, otherwise `Not published` / `未发布`. An empty index
  keeps the header and a short message, without placeholder entries.
- Each script needs both GF description files before publication. Keep them
  aligned with READMEs, use Markdown and absolute public links, and omit language
  switches. Both READMEs link to both Raw description sources and explain sync:
  default information follows the script locale; for English-default scripts,
  use English as default and add only `zh-CN`, without a duplicate English entry.
  Other locales follow `@name:<locale>`. Configure Markdown sync URLs separately
  on GF; committing files does not configure or publish anything.
- Add/delete/rename operations update files, indexes, and links together.
  Published identifier or URL changes that can disrupt updates need confirmation.
  Behavior changes require reviewing metadata, both READMEs, both GF descriptions,
  and root descriptions. Internal fixes need no mechanical documentation edits.
- Report tested compatibility and limits accurately. Local simulations or previews
  are not live-site, userscript-manager, or end-to-end proof.

## Greasy Fork Link Automation

- `.github/workflows/sync-greasyfork-links.yml`: push to `main`, manual dispatch,
  and cron `7,22,37,52 * * * *`. Preserve this interval unless requested otherwise.
  Push runs wait 30 seconds before querying; others do not. Neither that grace
  period nor GitHub scheduling guarantees webhook completion or update timing.
- `.github/automation/sync-greasyfork-links.py` uses the configured account's public
  API. Match exact namespace and default/localized source `@name`, never similarity.
  API failures or ambiguous matches must fail before any README writes.
- Each script README has exactly one `<!-- greasyfork-link:start -->` /
  `<!-- greasyfork-link:end -->` pair. Automation owns only these sections and
  root-index GF cells; keep bilingual links and unpublished states aligned.
- Discover listings only; do not publish or configure GF sync. Commit only needed
  README changes using the job-scoped `GITHUB_TOKEN`. Do not add credentials,
  force-push, or expand permissions to bypass branch rules.
- For automation changes, run
  `python3 -m unittest discover -s .github/automation -p 'test_*.py' -v`
  and a read-only `--dry-run` when network access permits. Test module filenames
  use underscores for discovery.

## Workflow and Git

1. Read applicable instructions and relevant code; inspect Git status, branch,
   remote, and existing changes. Preserve user customizations and other agents'
   work. Confirm a collaborating task has stopped editing before integrating it.
2. Keep edits scoped. Review the final diff, metadata, versions, licenses, icons,
   bilingual documentation, indexes, and links. Exclude credentials, temporary
   files, and unrelated changes.
3. Run appropriate syntax checks and existing focused tests. For UI changes,
   check relevant visual states where possible.
4. Commit, push, publish, or create releases only with authorization. A request
   to commit alone does not authorize pushing. Do not force-push or rewrite
   published history without explicit authorization. Report changes, validation,
   commit IDs, push target/status, and unresolved items concisely.

Commit format: `<type>(<scope>): <summary>`. For single-script changes, scope is
its kebab-case directory; repository-wide changes may omit it. Types: `feat`, `fix`, `docs`, `refactor`,
`perf`, `test`, `chore`. Use an English imperative summary, no trailing period,
ideally at most 72 characters. Keep each commit focused; include related code and
bilingual docs. Complex changes need a body explaining reason, compatibility,
validation, and limits. Breaking changes use `!` and a `BREAKING CHANGE:` footer
with impact and migration; this does not replace required confirmation.
