"""Synchronize verified public Greasy Fork listings without external dependencies."""

import argparse
import json
import re
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


START = '<!-- greasyfork-link:start -->'
END = '<!-- greasyfork-link:end -->'


def fetch_user(user_id):
    url = f'https://api.greasyfork.org/en/users/{user_id}.json'
    request = Request(url, headers={
        'Accept': 'application/json',
        'User-Agent': 'CycleDM-userscripts-readme-sync/1.0',
    })
    for attempt in range(3):
        try:
            with urlopen(request, timeout=30) as response:
                return json.load(response)
        except (HTTPError, URLError, TimeoutError):
            if attempt == 2:
                raise
            time.sleep(5 * (attempt + 1))


def metadata(text):
    block = re.match(r'// ==UserScript==\s*\n(.*?)// ==/UserScript==', text, re.S)
    if not block:
        raise ValueError('Missing userscript metadata block')
    fields = re.findall(r'^//\s+@(\S+)\s+(.+?)\s*$', block[1], re.M)
    names = {value for key, value in fields if key == 'name' or key.startswith('name:')}
    namespaces = [value for key, value in fields if key == 'namespace']
    if not names or len(namespaces) != 1:
        raise ValueError('Expected names and exactly one namespace')
    return names, namespaces[0]


def listing_url(script):
    script_id = script.get('id')
    if type(script_id) is not int or script_id <= 0:
        raise ValueError('Invalid Greasy Fork script ID')
    url = urlsplit(script.get('url', ''))
    if (url.scheme != 'https' or url.netloc != 'greasyfork.org'
            or url.query or url.fragment
            or not re.fullmatch(rf'/(?:[a-zA-Z-]+/)?scripts/{script_id}(?:-[^/]+)?', url.path)):
        raise ValueError('Invalid Greasy Fork listing URL')
    # Stable ID-only route, verified against the API listing's URL and ID.
    return f'https://greasyfork.org/scripts/{script_id}'


def update_index(text, directory, cell):
    lines = text.splitlines(keepends=True)
    matches = 0
    for index, line in enumerate(lines):
        if not line.startswith('|'):
            continue
        cells = line.rstrip('\r\n').split('|')
        if len(cells) != 6 or not re.search(rf'\]\({re.escape(directory)}/\)', cells[1]):
            continue
        matches += 1
        cells[4] = f' {cell} '
        newline = '\r\n' if line.endswith('\r\n') else '\n' if line.endswith('\n') else ''
        lines[index] = '|'.join(cells) + newline
    if matches != 1:
        raise ValueError(f'Expected one four-column index row for {directory}')
    return ''.join(lines)


def update_script_readme(text, cell):
    if text.count(START) != 1 or text.count(END) != 1:
        raise ValueError('Expected exactly one Greasy Fork marker pair')
    before, rest = text.split(START)
    _, after = rest.split(END)
    return f'{before}{START}\nGreasy Fork: {cell}\n{END}{after}'


def plan_sync(root, user, user_id):
    if not isinstance(user, dict) or user.get('id') != user_id or not isinstance(user.get('scripts'), list):
        raise ValueError('Unexpected Greasy Fork user API response')
    if not all(isinstance(script, dict) for script in user['scripts']):
        raise ValueError('Invalid Greasy Fork script records')
    scripts = sorted(root.glob('*/*.user.js'))
    if not scripts:
        raise ValueError('No userscripts found')
    originals = {}
    planned = {}

    def read(path):
        if path not in originals:
            originals[path] = path.read_text(encoding='utf-8')
        return planned.get(path, originals[path])

    for path in scripts:
        directory = path.parent.name
        if path.name != f'{directory}.user.js':
            raise ValueError(f'Unexpected entry filename: {path}')
        names, namespace = metadata(path.read_text(encoding='utf-8'))
        matches = [item for item in user['scripts']
                   if not item.get('deleted') and item.get('namespace') == namespace
                   and item.get('name') in names]
        if len(matches) > 1:
            raise ValueError(f'Ambiguous Greasy Fork listings for {directory}')
        url = listing_url(matches[0]) if matches else None
        print(f'{directory}: {url or "not published"}')
        for filename, unpublished in [('README.md', 'Not published'), ('README.zh-CN.md', '未发布')]:
            cell = f'[Greasy Fork]({url})' if url else unpublished
            index = root / filename
            planned[index] = update_index(read(index), directory, cell)
            readme = path.parent / filename
            planned[readme] = update_script_readme(read(readme), cell)
    # Validate every script and document before writing any file.
    return {path: text for path, text in planned.items() if text != originals[path]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--user-id', type=int, required=True)
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    if args.user_id <= 0:
        parser.error('--user-id must be positive')
    root = Path(__file__).resolve().parents[2]
    updates = plan_sync(root, fetch_user(args.user_id), args.user_id)
    for path, text in updates.items():
        print(f'{"Would update" if args.dry_run else "Updating"}: {path.relative_to(root)}')
        if not args.dry_run:
            path.write_text(text, encoding='utf-8')
    print(f'{len(updates)} README file(s) {"would change" if args.dry_run else "changed"}.')


if __name__ == '__main__':
    main()
