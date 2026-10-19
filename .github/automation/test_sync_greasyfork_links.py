import importlib.util
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import URLError


spec = importlib.util.spec_from_file_location('sync_links', Path(__file__).with_name('sync-greasyfork-links.py'))
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class SyncTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.script = self.root / 'example'
        self.script.mkdir()
        (self.script / 'example.user.js').write_text(
            '// ==UserScript==\n// @name Example\n// @name:zh-CN 示例\n'
            '// @namespace https://github.com/cycledm/userscripts\n// ==/UserScript==\n', encoding='utf-8')
        for filename, cell in [('README.md', 'Not published'), ('README.zh-CN.md', '未发布')]:
            (self.root / filename).write_text(
                f'Intro\n| [Example](example/) | Description | [Raw](https://example.org/example.user.js) | {cell} |\nFooter\n', encoding='utf-8')
            (self.script / filename).write_text(
                f'Intro\n{sync.START}\nGreasy Fork: {cell}\n{sync.END}\nFooter\n', encoding='utf-8')
        self.listing = {
            'id': 123, 'name': 'Example', 'namespace': 'https://github.com/cycledm/userscripts',
            'url': 'https://greasyfork.org/scripts/123-example', 'deleted': False,
        }

    def plan(self, scripts=None, user_id=42):
        return sync.plan_sync(self.root, {'id': user_id, 'scripts': scripts if scripts is not None else [self.listing]}, 42)

    def test_updates_all_four_readmes_and_preserves_other_content(self):
        changes = self.plan()
        self.assertEqual(len(changes), 4)
        for path, text in changes.items():
            self.assertIn('[Greasy Fork](https://greasyfork.org/scripts/123)', text)
            self.assertTrue(text.startswith('Intro\n'))
            self.assertTrue(text.endswith('Footer\n'))
            if path.parent == self.root:
                self.assertIn('| Description | [Raw](https://example.org/example.user.js) |', text)
        # Planning alone must not mutate the checkout.
        self.assertIn('Not published', (self.root / 'README.md').read_text())

    def test_idempotent_after_writing_the_plan(self):
        for path, text in self.plan().items():
            path.write_text(text, encoding='utf-8')
        self.assertEqual(self.plan(), {})

    def test_accepts_exact_localized_name(self):
        self.listing['name'] = '示例'
        self.assertEqual(len(self.plan()), 4)

    def test_rejects_same_name_in_other_namespace_and_fuzzy_name(self):
        self.listing['namespace'] = 'https://other.example'
        self.assertEqual(self.plan(), {})
        self.listing['namespace'] = 'https://github.com/cycledm/userscripts'
        self.listing['name'] = 'Example Plus'
        self.assertEqual(self.plan(), {})

    def test_deleted_or_missing_listing_becomes_unpublished(self):
        for path, text in self.plan().items():
            path.write_text(text, encoding='utf-8')
        self.listing['deleted'] = True
        changes = self.plan()
        self.assertEqual(len(changes), 4)
        self.assertIn('未发布', changes[self.root / 'README.zh-CN.md'])
        self.assertEqual(changes, self.plan([]))

    def test_ambiguous_match_and_wrong_account_fail(self):
        with self.assertRaises(ValueError):
            self.plan([self.listing, dict(self.listing, id=456)])
        with self.assertRaises(ValueError):
            self.plan(user_id=99)

    def test_invalid_api_records_and_urls_fail(self):
        for data in [None, {}, {'id': 42, 'scripts': 'not a list'}, {'id': 42, 'scripts': [None]}]:
            with self.subTest(data=data), self.assertRaises(ValueError):
                sync.plan_sync(self.root, data, 42)
        for url in ['http://greasyfork.org/scripts/123', 'https://evil.example/scripts/123',
                    'https://greasyfork.org/scripts/456', 'https://greasyfork.org/scripts/123?x=1',
                    'https://greasyfork.org:443/scripts/123', 'https://greasyfork.org/scripts/123/extra']:
            with self.subTest(url=url), self.assertRaises(ValueError):
                self.plan([dict(self.listing, url=url)])

    def test_missing_markers_or_index_row_fail_without_writes(self):
        readme = self.script / 'README.zh-CN.md'
        readme.write_text('No markers', encoding='utf-8')
        before = (self.root / 'README.md').read_bytes()
        with self.assertRaises(ValueError):
            self.plan()
        self.assertEqual((self.root / 'README.md').read_bytes(), before)
        with self.assertRaises(ValueError):
            sync.update_index('No row', 'example', 'Not published')

    @patch.object(sync.time, 'sleep')
    @patch.object(sync, 'urlopen', side_effect=URLError('offline'))
    def test_network_failure_is_retried_then_raised(self, open_url, sleep):
        with self.assertRaises(URLError):
            sync.fetch_user(42)
        self.assertEqual(open_url.call_count, 3)
        self.assertEqual(sleep.call_count, 2)


if __name__ == '__main__':
    unittest.main()
