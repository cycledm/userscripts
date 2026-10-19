const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../steam-store-region.user.js'), 'utf8');

function run({ url = 'https://store.steampowered.com/app/10/', state = 'guest',
    saved = 'cn', storage = new Map(), storageFails = false, saveFails = false,
    frame = false, info, account = false, header = false, collapsed,
    collapseReadFails = false } = {}) {
    class Element {
        constructor(tag) { this.tag = tag; this.children = []; this.attributes = {}; this.events = {}; }
        append(...children) { this.children.push(...children); }
        attachShadow() { this.shadowRoot = new Element('shadow'); return this.shadowRoot; }
        setAttribute(key, value) { this.attributes[key] = value; }
        addEventListener(name, handler) { this.events[name] = handler; }
    }
    const location = new URL(url);
    const navigations = [];
    location.replace = target => navigations.push(target);
    const body = new Element('body');
    const events = {};
    const userInfo = { getAttribute: () => info ?? JSON.stringify({ logged_in: state === 'member' }) };
    const document = {
        body, documentElement: { lang: 'zh-CN' }, visibilityState: 'visible',
        createElement: tag => new Element(tag),
        getElementById: () => null,
        querySelector: selector => selector === '[data-userinfo]'
            ? (state === 'unknown' && info === undefined ? null : userInfo)
            : account ? {} : null,
        querySelectorAll: () => header ? [{ href: 'https://store.steampowered.com/login/?redir=/' }] : [],
        addEventListener: (name, handler) => { events[name] = handler; },
    };
    const settings = [];
    const self = {};
    vm.runInNewContext(source, {
        window: { top: frame ? {} : self, self, addEventListener: (name, handler) => { events[name] = handler; } },
        document, location, navigator: { language: 'en' }, URL,
        GM_getValue: (key, fallback) => {
            if (key !== 'steam-store-region-collapsed') return saved;
            if (collapseReadFails) throw Error('blocked');
            return collapsed === undefined ? fallback : collapsed;
        },
        GM_setValue: (key, value) => { if (saveFails) throw Error('blocked'); settings.push([key, value]); },
        sessionStorage: {
            getItem: key => { if (storageFails) throw Error('blocked'); return storage.get(key); },
            setItem: (key, value) => { if (storageFails) throw Error('blocked'); storage.set(key, value); },
        },
    });
    const panel = body.children[0]?.shadowRoot.children[1];
    const collapsible = panel?.children[0];
    const controls = collapsible?.children[0].children[0];
    return { navigations, settings, events, panel, controls, collapsible,
        toggle: panel?.children[1], buttons: controls?.children.slice(1), storage };
}

test('default CN preserves unrelated raw query encoding and fragment', () => {
    assert.deepEqual(run({ url: 'https://store.steampowered.com/app/10/?x=a%20b&x=2#details' }).navigations,
        ['https://store.steampowered.com/app/10/?x=a%20b&x=2&cc=cn#details']);
});

test('honor existing, empty, repeated, encoded and case-variant cc', () => {
    for (const query of ['cc=us', 'cc=', 'CC=hk', '%63%63=us', 'cc=us&cc=hk']) {
        assert.deepEqual(run({ url: 'https://store.steampowered.com/?' + query }).navigations, []);
    }
});

test('saved preferences and invalid values', () => {
    for (const region of ['cn', 'hk', 'jp', 'us']) assert.equal(run({ saved: region }).navigations[0],
        'https://store.steampowered.com/app/10/?cc=' + region);
    assert.deepEqual(run({ saved: 'off' }).navigations, []);
    assert.equal(run({ saved: 'invalid' }).navigations[0], 'https://store.steampowered.com/app/10/?cc=cn');
});

test('all display paths are eligible', () => {
    for (const path of ['', 'app/10/', 'bundle/10', 'sub/10', 'search/', 'category/action',
        'genre/Free%20to%20Play/', 'tags/en/RPG/', 'specials', 'sale/test', 'charts/',
        'publisher/test', 'developer/test', 'franchise/test', 'curator/10', 'curators/',
        'wishlist/id/example', 'points/shop', 'explore/', 'steamdeck']) {
        assert.equal(run({ url: 'https://store.steampowered.com/' + path }).navigations.length, 1, path);
    }
});

test('sensitive, API, search results and unrelated paths never mount or navigate', () => {
    for (const path of ['search/results', 'search/results/', 'search/results/10', 'api/', 'ajax/',
        'actions/', 'dynamicstore/', 'account/', 'steamaccount/', 'login/', 'logout/',
        'cart/', 'checkout/', 'join/', 'openid/', 'news/', 'application/10', 'app.js']) {
        const result = run({ url: 'https://store.steampowered.com/' + path });
        assert.deepEqual(result.navigations, [], path);
        assert.equal(result.panel, undefined, path);
    }
});

test('top-frame and origin boundary', () => {
    assert.equal(run({ frame: true }).panel, undefined);
    assert.equal(run({ url: 'https://steamcommunity.com/app/10' }).panel, undefined);
});

test('signed-in and unknown state pause region buttons but permit Off', () => {
    for (const state of ['member', 'unknown']) {
        const result = run({ state });
        assert.deepEqual(result.navigations, []);
        assert.ok(result.buttons.slice(0, -1).every(button => button.disabled));
        assert.equal(result.buttons.at(-1).disabled, false);
        // Even an event dispatched on a disabled button cannot bypass the check.
        result.buttons[1].events.click();
        assert.deepEqual(result.settings, []);
    }
});

test('account UI overrides guest data; header fallback handles malformed data', () => {
    assert.deepEqual(run({ account: true }).navigations, []);
    assert.equal(run({ state: 'unknown', header: true }).navigations.length, 1);
    assert.equal(run({ info: 'broken', header: true }).navigations.length, 1);
    assert.deepEqual(run({ info: 'broken' }).navigations, []);
    assert.deepEqual(run({ info: '{"logged_in":true}', header: true }).navigations, []);
});

test('explicit button switches cc, removing all variants and preserving other bytes', () => {
    const result = run({ url: 'https://store.steampowered.com/?CC=cn&x=a%20b&%63c=cn#top' });
    result.buttons[1].events.click();
    assert.deepEqual(result.navigations, ['https://store.steampowered.com/?x=a%20b&cc=hk#top']);
    assert.equal(result.settings[0][1], 'hk');
    assert.equal(result.buttons[1].attributes['aria-pressed'], 'true');
});

test('Default removes all cc variants, preserves other bytes, and saves preference', () => {
    for (const [query, expected] of [
        ['cc=cn', ''], ['CC=', ''], ['%63%63=hk', ''],
        ['CC=cn&x=a%20b&%63c=us&x=2', '?x=a%20b&x=2'],
    ]) {
        const result = run({ url: 'https://store.steampowered.com/?' + query + '#top' });
        result.buttons.at(-1).events.click();
        assert.deepEqual(result.navigations, ['https://store.steampowered.com/' + expected + '#top']);
        assert.equal(result.settings[0][1], 'off');
    }
});

test('Default without cc saves preference without reloading; saved Default never auto-cleans URLs', () => {
    const result = run({ saved: 'off', url: 'https://store.steampowered.com/?x=a%20b#top' });
    result.buttons.at(-1).events.click();
    assert.deepEqual(result.navigations, []);
    assert.equal(result.settings[0][1], 'off');
    assert.deepEqual(run({ saved: 'off', url: 'https://store.steampowered.com/?cc=us' }).navigations, []);
});

test('explicit Default can remove cc even while login state pauses region rewriting', () => {
    for (const state of ['member', 'unknown']) {
        const result = run({ state, url: 'https://store.steampowered.com/?cc=cn&x=1' });
        result.buttons.at(-1).events.click();
        assert.deepEqual(result.navigations, ['https://store.steampowered.com/?x=1']);
    }
});

test('save failure does not switch or navigate', () => {
    const result = run({ url: 'https://store.steampowered.com/?cc=cn', saveFails: true });
    result.buttons[1].events.click();
    assert.deepEqual(result.navigations, []);
    assert.equal(result.controls.children[0].textContent, '无法保存设置');
});

test('loop guard stops the same destination after Steam strips cc', () => {
    const storage = new Map();
    assert.equal(run({ storage }).navigations.length, 1);
    assert.deepEqual(run({ storage }).navigations, []);
    // Different display pages are not suppressed.
    assert.equal(run({ storage, url: 'https://store.steampowered.com/app/20/' }).navigations.length, 1);
});

test('storage failure and malformed escapes fail open; explicit click still works without session storage', () => {
    const result = run({ storageFails: true });
    assert.deepEqual(result.navigations, []);
    result.buttons[1].events.click();
    assert.equal(result.navigations[0], 'https://store.steampowered.com/app/10/?cc=hk');
    assert.deepEqual(run({ url: 'https://store.steampowered.com/?%zz=value' }).navigations, []);
});

test('bfcache checks respect loop guard and Off preference', () => {
    const result = run();
    result.events.pageshow();
    assert.equal(result.navigations.length, 1);
    const off = run({ saved: 'off' });
    off.events.pageshow();
    assert.deepEqual(off.navigations, []);
});

test('Tailwind utilities are embedded, isolated, and require no remote runtime', () => {
    const result = run({ saved: 'off' });
    assert.ok(result.panel.className.includes('fixed'));
    assert.match(source, /\.fixed\{position:fixed\}/);
    assert.match(source, /:host\{all:initial\}/);
    assert.doesNotMatch(source, /@require|createElement\(['"]script|cdn\.jsdelivr/);
});

test('saved expanded toolbar persists collapse/expand independently of region', () => {
    const result = run({ saved: 'off', collapsed: false });
    assert.equal(result.toggle.attributes['aria-expanded'], 'true');
    result.toggle.events.click();
    assert.equal(result.toggle.attributes['aria-expanded'], 'false');
    assert.equal(result.collapsible.inert, true);
    assert.equal(result.collapsible.attributes['aria-hidden'], 'true');
    assert.equal(result.toggle.textContent, '🌐');
    assert.deepEqual(result.settings, [['steam-store-region-collapsed', true]]);
    result.toggle.events.click();
    assert.equal(result.collapsible.inert, false);
    assert.equal(result.toggle.attributes['aria-expanded'], 'true');
    assert.deepEqual(result.settings[1], ['steam-store-region-collapsed', false]);
    assert.deepEqual(result.navigations, []);
});

test('saved collapsed state restores while region rewriting remains active', () => {
    for (const [saved, flag] of [['cn', '🇨🇳'], ['hk', '🇭🇰'], ['jp', '🇯🇵'], ['us', '🇺🇸'], ['off', '🌐']]) {
        const restored = run({ collapsed: true, saved });
        assert.equal(restored.toggle.textContent, flag);
        restored.toggle.events.click();
        restored.buttons[1].events.click();
        restored.toggle.events.click();
        assert.equal(restored.toggle.textContent, '🇭🇰');
    }
    const result = run({ collapsed: true, saved: 'jp' });
    assert.equal(result.toggle.attributes['aria-expanded'], 'false');
    assert.equal(result.collapsible.inert, true);
    assert.equal(result.navigations[0], 'https://store.steampowered.com/app/10/?cc=jp');
    assert.match(source, /prefers-reduced-motion/);
});

test('failed collapse-state save keeps the toolbar expanded', () => {
    const result = run({ saveFails: true, collapsed: false });
    result.toggle.events.click();
    assert.equal(result.toggle.attributes['aria-expanded'], 'true');
    assert.equal(result.collapsible.inert, false);
    assert.equal(result.toggle.title, '无法保存折叠状态');
});

test('new installs and invalid or unreadable collapse preferences start collapsed', () => {
    for (const settings of [{}, { collapsed: null }, { collapsed: 'false' }, { collapseReadFails: true }]) {
        const result = run({ ...settings, saved: 'off' });
        assert.equal(result.toggle.attributes['aria-expanded'], 'false');
        assert.equal(result.collapsible.inert, true);
        result.toggle.events.click();
        assert.equal(result.toggle.attributes['aria-expanded'], 'true');
        assert.deepEqual(result.settings, [['steam-store-region-collapsed', false]]);
    }
});
