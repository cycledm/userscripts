# Repository Guidelines

## Project Overview

This repository contains independent userscripts developed and maintained by
CycleDM to enhance websites, improve browsing, and automate common web tasks.
Scripts serve personal needs; suitability and compatibility depend on each
script and its environment. The default license is GPL-3.0-or-later. English is
the default documentation language; Simplified Chinese is maintained alongside it.

## Repository Structure and Naming

- Place each script in its own directory directly under the repository root.
  Do not add a `scripts/` container directory.
- Use lowercase kebab-case for directory and file names. Preserve conventional
  names such as `README.md`, `README.zh-CN.md`, `LICENSE`, `AGENTS.md`,
  `.gitignore`, and names required by tools or ecosystems.
- A script directory named `<script-name>` must contain
  `<script-name>.user.js`, `README.md`, and `README.zh-CN.md`.
- Keep version numbers in `@version`, never in file names.
- Both root READMEs index all actual scripts in four columns: script name,
  description, Raw, and Greasy Fork. Link each script name to its directory and
  use a short description in the README's language. The Raw column must link
  directly to the actual `.user.js` file on GitHub Raw. The Greasy Fork column
  must link to the script's verified public listing on Greasy Fork; use
  `Not published` in English and `未发布` in Chinese if it is not published.
  Never invent listing URLs. When empty, retain the four-column header and use
  a brief empty-state message without placeholder script entries.
- Add `assets/`, `src/`, `tests/`, or other supporting directories inside a
  script directory only when needed. Do not create speculative directories or
  example scripts without a real purpose.
- Use **CycleDM** for the project author's name and copyright notices.
  Use **cycledm** for the GitHub username and repository URLs:
  `https://github.com/cycledm/userscripts`.

## Userscript Development

- Prefer native JavaScript and simple, readable implementations. Avoid unnecessary
  dependencies; do not introduce build tools, package manifests, configuration,
  or automation without a concrete need within the task's scope.
- Keep scripts independent and avoid polluting the page's global namespace.
- Understand existing behavior before editing. Preserve existing functionality
  and configuration compatibility where possible. Avoid unrelated refactors or
  behavior changes based on personal preference.
- Apply least privilege to URL matching and API permissions. Evaluate broad URL
  patterns before using them. Treat cross-origin requests, remote resources, and
  sensitive data carefully. Never commit keys, tokens, cookies, or credentials.
- These are defaults; document justified exceptions for a script's actual needs.

### Metadata and Source Notices

Every entry file must begin with a standard `// ==UserScript==` metadata block
ending with `// ==/UserScript==`. Include meaningful fields:

| Field | Requirement |
| --- | --- |
| `@name` | Accurate script name |
| `@namespace` | Default: `https://github.com/cycledm/userscripts` |
| `@version` | A sensible version, updated when releasing script changes |
| `@description` | Accurate description of actual functionality |
| `@author` | Default: `CycleDM` |
| `@license` | Default: `GPL-3.0-or-later` |
| `@match` | Only the sites and paths actually required |
| `@grant` | Declare the permissions for the GM APIs actually used; use `none` when none are needed |

Do not add metadata without a purpose. Add compatibility-related metadata only
when justified. Retain an appropriate copyright notice outside the metadata,
using `Copyright (C) <year or year range> CycleDM` for CycleDM's code. Keep
license and copyright notices consistent with actual ownership and licensing.
An additional `SPDX-License-Identifier` comment is optional; `@license` provides
the userscript license identifier.

## Licensing and Attribution

- The repository default is GNU General Public License version 3 or, at the
  recipient's option, any later version: **GPL-3.0-or-later**, not
  `GPL-3.0-only`. Keep this grant explicit in documentation and script metadata.
- Root `LICENSE` contains the official GPL v3.0 full text. Do not alter,
  abridge, or rewrite that text, including its original notices.
- Commercial use is permitted subject to the GPL. Do not add conflicting
  restrictions, including a prohibition on commercial use. Distribution of
  covered derivative works must comply with applicable GPL source and
  licensing requirements.
- A script with a different license must have its own `LICENSE` and clearly
  state its license in both READMEs and source metadata/notices.
- Check license compatibility before incorporating third-party code. Preserve
  its required copyright, attribution, and license information. Do not replace
  third-party author names with CycleDM or relicense third-party code without
  confirmation of permission. Do not change existing licenses without
  authorization; document any authorized exceptions explicitly.

## Documentation Maintenance

Maintain `README.md` in English and `README.zh-CN.md` in Simplified Chinese,
both at the root and in each script directory. Keep their content aligned and
put reciprocal Markdown language links at the top. Never update only one
language when the same information affects both.

Each script's READMEs should describe its name, one-sentence purpose, features,
installation, supported sites or URL ranges, license, and any relevant usage
notes. Include compatibility claims only when supported by reliable evidence,
and distinguish tested behavior from expectations for Tampermonkey,
Violentmonkey, browsers, or other environments. Merge or omit sections that have
no useful content. Keep names, descriptions, and any version information in
sync with the source.

Prefer installation links to the actual `.user.js` in this repository. If using
GitHub Raw, verify the repository, actual branch/ref, path, and file; do not
guess a branch or publish broken links.

Keep Raw and Greasy Fork links aligned in both root indexes. When a script is
published on Greasy Fork or its public listing changes, update both indexes
and any affected script documentation. Do not publish externally merely to
populate an index link; publication requires authorization.

If a script provides `greasyfork-description.html` and
`greasyfork-description-zh-cn.html`, keep both aligned with its bilingual READMEs
when behavior or usage changes. Use absolute public links in these descriptions
so they work on Greasy Fork. Use HTML fragments containing only Greasy Fork's
allowed elements and attributes, without document wrappers, scripts, or external
styles. Configure English and Simplified Chinese as separate localized entries;
HTML does not provide automatic language switching. Their sync format must be
HTML, and their additional-information sync URLs must be
configured separately on Greasy Fork; committing the files does not configure
that setting.

| Change | Required maintenance |
| --- | --- |
| Add a script | Create its directory, matching `.user.js`, and both READMEs; add its entry to both root indexes. |
| Delete a script | Remove its entries from both root indexes and clean up broken documentation links. |
| Rename a script | Update directory, entry filename, links, and documentation references together. Assess installed copies and update mechanisms; obtain confirmation before changing published identifiers or URLs that may disrupt updates. |
| Change functionality | Check and update both script READMEs, root descriptions, and metadata where affected. |
| Change a license | Update affected bilingual READMEs and metadata; check whether a separate `LICENSE` is required. Never change third-party licensing without confirmation. |

Any code change that affects documentation accuracy requires a documentation
review. Internal fixes without user-visible effects do not require mechanical
README edits.

### Greasy Fork Link Automation

- `.github/workflows/sync-greasyfork-links.yml` runs on every push to `main`,
  every 15 minutes (minutes 7, 22, 37, and 52), and manual dispatch. Keep this
  short polling interval unless the user requests a change. Scheduled runs catch
  listings published after the last push, but GitHub may delay their execution.
  Push runs wait 30 seconds before querying Greasy Fork; this is a grace period,
  not proof that its webhook has finished. Scheduled and manual runs do not wait.
- `.github/automation/sync-greasyfork-links.py` uses the public API for the
  configured Greasy Fork account. Match the exact namespace and a default or
  localized source `@name`; never infer a listing from a similar name or purpose.
  This automation discovers public listings; it does not publish scripts or
  configure their Raw sync URLs.
- Keep exactly one `<!-- greasyfork-link:start -->` / `<!-- greasyfork-link:end -->`
  pair in each script's English and Chinese READMEs. The automation owns only
  these sections and the Greasy Fork cells in the two root indexes. Keep both
  languages aligned and retain localized unpublished states when no match exists.
- Keep API failures and ambiguous matches fatal before writing READMEs. Commit
  only README changes, only when needed, using the job-scoped `GITHUB_TOKEN`.
  Do not add credentials, force-push, or expand permissions to bypass branch rules.
- Validate changes with
  `python3 -m unittest discover -s .github/automation -p 'test_*.py' -v` and a
  read-only `--dry-run` where network access is available. Python test module
  filenames use underscores so `unittest` discovery can import them.

## Commit Messages

Use `<type>(<scope>): <summary>`. The scope is optional; use
`<type>(<scope>)!: <summary>` or `<type>!: <summary>` for breaking changes.

- Use lowercase types: `feat` (new functionality), `fix` (bug fix), `docs`
  (documentation), `refactor` (code restructuring without behavior changes),
  `perf` (performance), `test` (tests), or `chore` (repository maintenance).
- For changes to one script, use its kebab-case directory name as the scope.
  Repository-wide changes may omit the scope.
- Write the summary in English, start with an imperative verb, and omit the
  trailing period. Aim for a complete subject line of at most 72 characters.
- For complex changes, add a body after a blank line explaining the reason,
  compatibility impact, and validation performed, including any limitations.
- Mark breaking changes with `!` and include a `BREAKING CHANGE:` footer
  describing the impact and migration steps. This does not replace required
  confirmation for changes to published identifiers or update URLs.
- Keep each commit focused on one purpose. Include related code and bilingual
  documentation together; exclude unrelated changes.

For example, repository setup can use
`chore: initialize repository guidelines and documentation`.
These conventions do not require commit tooling or dependencies.

## AI Agent Workflow

1. Read applicable `AGENTS.md` instructions, relevant files, and existing
   conventions before editing. Follow these repository guidelines alongside
   applicable higher-priority instructions.
2. Understand existing code and keep changes scoped to the task. Preserve user
   customizations and avoid touching unrelated files or adding unnecessary tools.
3. Implement the change and perform the documentation maintenance above.
4. Check naming, metadata, licenses, copyright, links, and both languages for
   consistency. Review the final diff for unintended changes.
5. Run appropriate syntax checks or focused tests when available. For script
   behavior, validate in relevant environments when possible. Report exactly
   what was checked and any limitations; never invent test results.
6. Do not publish versions, create GitHub Releases, or push to a remote without
   authorization. Finish with a brief account of changes, validation, and
   unresolved issues.

### Validation Checklist

- [ ] Names, directory layout, and `.user.js` entry filenames follow conventions.
- [ ] Metadata matches behavior and requests only necessary scope/permissions.
- [ ] Licenses, copyright, and third-party attribution are accurate.
- [ ] English and Simplified Chinese READMEs are synchronized where affected.
- [ ] Both root indexes list exactly the actual scripts, with correct directory,
  Raw, and verified public Greasy Fork links (or localized unpublished status).
- [ ] Documentation and installation links point to the intended files.
- [ ] No unnecessary dependencies, tools, or directories were introduced.
- [ ] No obvious security/privacy issues or credentials were introduced.
- [ ] Appropriate validation was completed and its limits are reported.
