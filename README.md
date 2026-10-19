English | [简体中文](README.zh-CN.md)

# Userscripts

A collection of userscripts developed and maintained by CycleDM to enhance
website functionality, improve browsing, and automate common web tasks.

Scripts are driven by personal needs and may not suit every user or environment.
Compatibility with Tampermonkey, Violentmonkey, and other userscript managers is
documented per script based on available evidence.

## Scripts

| Script | Description | Raw | Greasy Fork |
| --- | --- | --- | --- |
| [Google CN Redirect](google-cn-redirect/) | Redirect google.cn to google.com with selected parameters and system-themed transitions | [Raw](https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/google-cn-redirect.user.js) | [Greasy Fork](https://greasyfork.org/scripts/601010) |

## Development

See [AGENTS.md](AGENTS.md) for repository structure, naming conventions, and
development and documentation requirements.

## Greasy Fork link synchronization

[Sync Greasy Fork links](.github/workflows/sync-greasyfork-links.yml) runs after
every push to `main`, every 15 minutes (minutes 7, 22, 37, and 52 of each hour),
and manually from the Actions tab. Push runs wait 30 seconds before querying
Greasy Fork to give its webhook time to process; scheduled and manual runs do
not wait. Scheduled runs catch listings published after the last push. GitHub
may delay scheduled runs, so this is not a guaranteed 15-minute response time;
use manual dispatch when needed. The push delay does not guarantee webhook
completion either.
It reads the public API for [cycledm (1647773)](https://greasyfork.org/users/1647773-cycledm),
matches the exact namespace and any source `@name` / localized `@name`, and
updates only the Greasy Fork columns in both root indexes and the marked
`greasyfork-link` sections in both READMEs of each script. Preserve these markers
when adding a script. Unmatched or deleted listings remain `Not published`;
duplicate matches or invalid API responses fail before any README is written.

The workflow uses the repository's `GITHUB_TOKEN` with `contents: write` only in
the sync job; no Greasy Fork credentials or webhook secret are needed. It commits
README changes to `main` only when necessary. Branch rules must permit that bot
push; a concurrent branch update fails safely without force-pushing. Commits
made with `GITHUB_TOKEN` do not trigger another push workflow run.

This discovers existing public listings; it does not publish scripts. Greasy
Fork's [webhook](https://greasyfork.org/en/users/webhook-info) updates scripts
already associated with a matching Raw sync URL. Publish/import a script and
configure its sync URL first. Webhook delivery and this README workflow are
independent; a successful Ping does not prove a script update succeeded.

Local checks (Python standard library only):

```sh
python3 -m unittest discover -s .github/automation -p 'test_*.py' -v
python3 .github/automation/sync-greasyfork-links.py --user-id 1647773 --dry-run
```

## License

Unless explicitly stated otherwise, this repository is licensed under the
GNU General Public License, version 3 or (at your option) any later version
(**GPL-3.0-or-later**). See [LICENSE](LICENSE) for the full GPL v3.0 text.

Commercial use is permitted when the license requirements are met. Distribution
of covered derivative works must comply with the GPL, including applicable
source code and licensing requirements.

If a script uses a different license, its own `LICENSE`, READMEs, and source
notices specify the applicable terms. Third-party code retains its required
copyright and license notices.

Copyright (C) 2026 CycleDM
