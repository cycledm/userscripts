const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(require("node:path").join(__dirname, "../steam-store-region.user.js"), "utf8");

function run({ url = "https://store.steampowered.com/app/10/", state = "guest",
    saved, storage = new Map(), storageFails = false, saveFails = false, readFails = false,
    frame = false, info, account = false, header = false } = {}) {
    class Element {
        constructor(tag) { this.tag = tag; this.children = []; this.attributes = {}; this.events = {}; }
        append(...children) { this.children.push(...children); }
        attachShadow() { this.shadowRoot = new Element("shadow"); return this.shadowRoot; }
        setAttribute(key, value) { this.attributes[key] = value; }
        addEventListener(name, handler) { this.events[name] = handler; }
    }
    const location = new URL(url);
    const navigations = [];
    location.replace = target => navigations.push(target);
    const body = new Element("body");
    const events = {};
    const userInfo = { getAttribute: () => info ?? JSON.stringify({ logged_in: state === "member" }) };
    const document = {
        body, documentElement: { lang: "zh-CN" }, visibilityState: "visible",
        createElement: tag => new Element(tag),
        getElementById: () => null,
        querySelector: selector => selector === "[data-userinfo]"
            ? (state === "unknown" && info === undefined ? null : userInfo)
            : account ? {} : null,
        querySelectorAll: () => header ? [{ href: "https://store.steampowered.com/login/?redir=/" }] : [],
        addEventListener: (name, handler) => { events[name] = handler; },
    };
    const settings = [];
    const reads = [];
    const deletions = [];
    const self = {};
    vm.runInNewContext(source, {
        window: { top: frame ? {} : self, self, addEventListener: (name, handler) => { events[name] = handler; } },
        document, location, navigator: { language: "en" }, URL,
        GM_getValue: key => {
            reads.push(key);
            if (readFails) throw Error("blocked");
            // Model an old saved expanded state; the new script must ignore it.
            return key === "steam-store-region-collapsed" ? false : saved;
        },
        GM_deleteValue: key => { deletions.push(key); saved = undefined; },
        GM_setValue: (key, value) => { if (saveFails) throw Error("blocked"); settings.push([key, value]); },
        sessionStorage: {
            getItem: key => { if (storageFails) throw Error("blocked"); return storage.get(key); },
            setItem: (key, value) => { if (storageFails) throw Error("blocked"); storage.set(key, value); },
        },
    });
    const panel = body.children[0]?.shadowRoot.children[1];
    const collapsible = panel?.children[0];
    const controls = collapsible?.children[0].children[0];
    return { host: body.children[0], navigations, settings, deletions, reads, events, panel, controls, collapsible,
        toggle: panel?.children[1], buttons: controls?.children.slice(1), storage,
        setLoginState: next => { state = next; } };
}

test("default CN preserves unrelated raw query encoding and fragment", () => {
    assert.deepEqual(run({ url: "https://store.steampowered.com/app/10/?x=a%20b&x=2#details" }).navigations,
        ["https://store.steampowered.com/app/10/?x=a%20b&x=2&cc=cn#details"]);
});

test("honor existing, empty, repeated, encoded and case-variant cc", () => {
    for (const query of ["cc=us", "cc=", "CC=hk", "%63%63=us", "cc=us&cc=hk"]) {
        assert.deepEqual(run({ url: "https://store.steampowered.com/?" + query }).navigations, []);
    }
});

test("saved preferences and invalid values", () => {
    for (const region of ["cn", "hk", "jp", "us"]) assert.equal(run({ saved: region }).navigations[0],
        "https://store.steampowered.com/app/10/?cc=" + region);
    assert.deepEqual(run({ saved: "off" }).navigations, []);
    assert.equal(run({ saved: "invalid" }).navigations[0], "https://store.steampowered.com/app/10/?cc=cn");
});

test("all display paths are eligible", () => {
    for (const path of ["", "app/10/", "bundle/10", "sub/10", "search/", "category/action",
        "genre/Free%20to%20Play/", "tags/en/RPG/", "specials", "sale/test", "charts/",
        "publisher/test", "developer/test", "franchise/test", "curator/10", "curators/",
        "wishlist/id/example", "points/shop", "explore/", "steamdeck"]) {
        assert.equal(run({ url: "https://store.steampowered.com/" + path }).navigations.length, 1, path);
    }
});

test("sensitive, API, search results and unrelated paths never mount or navigate", () => {
    for (const path of ["search/results", "search/results/", "search/results/10", "api/", "ajax/",
        "actions/", "dynamicstore/", "account/", "steamaccount/", "login/", "logout/",
        "cart/", "checkout/", "join/", "openid/", "news/", "application/10", "app.js"]) {
        const result = run({ url: "https://store.steampowered.com/" + path });
        assert.deepEqual(result.navigations, [], path);
        assert.equal(result.panel, undefined, path);
    }
});

test("top-frame and origin boundary", () => {
    assert.equal(run({ frame: true }).panel, undefined);
    assert.equal(run({ url: "https://steamcommunity.com/app/10" }).panel, undefined);
});

test("signed-in pages never create controls, access preferences or navigate", () => {
    for (const detection of [{ state: "member" }, { account: true }, { info: '{"logged_in":true}', header: true }]) {
        for (const saved of [undefined, "cn", "hk", "jp", "us", "off"]) {
            const result = run({ ...detection, saved });
            assert.equal(result.panel, undefined);
            assert.deepEqual(result.navigations, []);
            assert.deepEqual(result.reads, []);
            assert.deepEqual(result.settings, []);
            assert.deepEqual(result.deletions, []);
            assert.equal(result.storage.size, 0);
        }
    }
});

test("unknown login state defaults to CN and all buttons remain available", () => {
    const result = run({ state: "unknown" });
    assert.equal(result.navigations[0], "https://store.steampowered.com/app/10/?cc=cn");
    assert.ok(result.buttons.every(button => !button.disabled));
    assert.deepEqual(result.settings, []);
});

test("account UI and logged-in data disable the script; malformed data remains eligible", () => {
    assert.deepEqual(run({ account: true }).navigations, []);
    assert.equal(run({ state: "unknown", header: true }).navigations.length, 1);
    assert.equal(run({ info: "broken", header: true }).navigations.length, 1);
    assert.equal(run({ info: "broken" }).navigations.length, 1);
    assert.deepEqual(run({ info: '{"logged_in":true}', header: true }).navigations, []);
});

test("explicit button switches cc, removing all variants and preserving other bytes", () => {
    const result = run({ url: "https://store.steampowered.com/?CC=cn&x=a%20b&%63c=cn#top" });
    result.buttons[1].events.click();
    assert.deepEqual(result.navigations, ["https://store.steampowered.com/?x=a%20b&cc=hk#top"]);
    assert.equal(result.settings[0][1], "hk");
    assert.equal(result.buttons[1].attributes["aria-pressed"], "true");
});

test("Default removes all cc variants, preserves other bytes, and saves preference", () => {
    for (const [query, expected] of [
        ["cc=cn", ""], ["CC=", ""], ["%63%63=hk", ""],
        ["CC=cn&x=a%20b&%63c=us&x=2", "?x=a%20b&x=2"],
    ]) {
        const result = run({ url: "https://store.steampowered.com/?" + query + "#top" });
        result.buttons.at(-1).events.click();
        assert.deepEqual(result.navigations, ["https://store.steampowered.com/" + expected + "#top"]);
        assert.equal(result.settings[0][1], "off");
    }
});

test("Default without cc saves preference without reloading; saved Default never auto-cleans URLs", () => {
    const result = run({ saved: "off", url: "https://store.steampowered.com/?x=a%20b#top" });
    result.buttons.at(-1).events.click();
    assert.deepEqual(result.navigations, []);
    assert.equal(result.settings[0][1], "off");
    assert.deepEqual(run({ saved: "off", url: "https://store.steampowered.com/?cc=us" }).navigations, []);
});

test("explicit Default can remove cc when login state is unknown", () => {
    const result = run({ state: "unknown", url: "https://store.steampowered.com/?cc=cn&x=1" });
    result.buttons.at(-1).events.click();
    assert.deepEqual(result.navigations, ["https://store.steampowered.com/?x=1"]);
});

test("login detection hides existing controls and prevents later navigation or writes", () => {
    for (const event of ["pageshow", "visibilitychange"]) {
        const result = run({ url: "https://store.steampowered.com/?cc=cn" });
        result.setLoginState("member");
        result.events[event]();
        assert.equal(result.host.hidden, true);
        result.buttons[1].events.click();
        result.buttons.at(-1).events.click();
        result.toggle.events.click();
        assert.deepEqual(result.navigations, []);
        assert.deepEqual(result.settings, []);
        assert.deepEqual(result.deletions, []);
        result.setLoginState("guest");
        result.events[event]();
        assert.equal(result.host.hidden, false);
        assert.equal(result.panel.attributes["data-region"], "cn");
    }
});

test("clicks recheck login before saving, including without a visibility event", () => {
    const result = run({ url: "https://store.steampowered.com/?cc=cn" });
    result.setLoginState("member");
    result.buttons[1].events.click();
    assert.equal(result.host.hidden, true);
    assert.deepEqual(result.settings, []);
    assert.deepEqual(result.navigations, []);
});

test("stored choices win for signed-out and unknown sessions without automatic writes", () => {
    for (const state of ["guest", "unknown"]) {
        for (const saved of ["cn", "hk", "jp", "us", "off"]) {
            const result = run({ state, saved });
            assert.equal(result.panel.attributes["data-region"], saved);
            assert.deepEqual(result.settings, []);
            assert.deepEqual(result.deletions, []);
            assert.equal(result.navigations.length, saved === "off" ? 0 : 1);
        }
    }
});

test("missing, invalid and unreadable preferences default to CN without persisting it", () => {
    for (const state of ["guest", "unknown"]) {
        for (const options of [{}, { saved: null }, { saved: "" }, { saved: "invalid" }, { readFails: true }]) {
            const result = run({ state, ...options });
            assert.equal(result.panel.attributes["data-region"], "cn");
            assert.deepEqual(result.settings, []);
        }
    }
});

test("save failure does not switch or navigate", () => {
    const result = run({ url: "https://store.steampowered.com/?cc=cn", saveFails: true });
    result.buttons[1].events.click();
    assert.deepEqual(result.navigations, []);
    assert.equal(result.controls.children[0].textContent, "无法保存设置");
});

test("loop guard stops the same destination after Steam strips cc", () => {
    const storage = new Map();
    assert.equal(run({ storage }).navigations.length, 1);
    assert.deepEqual(run({ storage }).navigations, []);
    // Different display pages are not suppressed.
    assert.equal(run({ storage, url: "https://store.steampowered.com/app/20/" }).navigations.length, 1);
});

test("storage failure and malformed escapes fail open; explicit click still works without session storage", () => {
    const result = run({ storageFails: true });
    assert.deepEqual(result.navigations, []);
    result.buttons[1].events.click();
    assert.equal(result.navigations[0], "https://store.steampowered.com/app/10/?cc=hk");
    assert.deepEqual(run({ url: "https://store.steampowered.com/?%zz=value" }).navigations, []);
});

test("bfcache checks respect loop guard and Off preference", () => {
    const result = run();
    result.events.pageshow();
    assert.equal(result.navigations.length, 1);
    const off = run({ saved: "off" });
    off.events.pageshow();
    assert.deepEqual(off.navigations, []);
});

test("Tailwind utilities are embedded, isolated, and require no remote runtime", () => {
    const result = run({ saved: "off" });
    assert.ok(result.panel.className.includes("fixed"));
    assert.match(source, /\.fixed\{position:fixed\}/);
    assert.match(source, /:host\{all:initial\}/);
    assert.doesNotMatch(source, /@require|createElement\(['"]script|cdn\.jsdelivr/);
});

test("each new page starts collapsed even after expanding the previous page", () => {
    const result = run({ saved: "off" });
    assert.equal(result.toggle.attributes["aria-expanded"], "false");
    result.toggle.events.click();
    assert.equal(result.toggle.attributes["aria-expanded"], "true");
    assert.equal(result.collapsible.inert, false);
    assert.equal(result.collapsible.attributes["aria-hidden"], "false");
    const reloaded = run({ saved: "off" });
    assert.equal(reloaded.toggle.attributes["aria-expanded"], "false");
    assert.equal(reloaded.collapsible.inert, true);
    assert.equal(reloaded.collapsible.attributes["aria-hidden"], "true");
    result.toggle.events.click();
    assert.equal(result.toggle.attributes["aria-expanded"], "false");
    assert.equal(result.toggle.children[0].textContent, "◀️");
    assert.equal(result.toggle.children[1].textContent, "🔼");
    assert.deepEqual(result.settings, []);
    assert.deepEqual(result.navigations, []);
});

test("directional emoji switch with collapse state while selected region remains available in the label", () => {
    for (const [saved, flag] of [["cn", "🇨🇳"], ["hk", "🇭🇰"], ["jp", "🇯🇵"], ["us", "🇺🇸"], ["off", "🌐"]]) {
        const restored = run({ saved });
        assert.ok(restored.toggle.title.includes(flag));
        restored.toggle.events.click();
        assert.equal(restored.toggle.children[0].textContent, "▶️");
        assert.equal(restored.toggle.children[1].textContent, "🔽");
        restored.buttons[1].events.click();
        restored.toggle.events.click();
        assert.ok(restored.toggle.title.includes("🇭🇰"));
        assert.equal(restored.toggle.children[0].textContent, "◀️");
        assert.equal(restored.toggle.children[1].textContent, "🔼");
    }
    const result = run({ saved: "jp" });
    assert.equal(result.toggle.attributes["aria-expanded"], "false");
    assert.equal(result.collapsible.inert, true);
    assert.equal(result.navigations[0], "https://store.steampowered.com/app/10/?cc=jp");
    assert.match(source, /prefers-reduced-motion/);
});

test("collapse toggle works without writing settings, even if writes are blocked", () => {
    const result = run({ saveFails: true });
    result.toggle.events.click();
    assert.equal(result.toggle.attributes["aria-expanded"], "true");
    assert.equal(result.collapsible.inert, false);
    result.toggle.events.click();
    assert.equal(result.toggle.attributes["aria-expanded"], "false");
    assert.equal(result.collapsible.inert, true);
    assert.deepEqual(result.settings, []);
});

test("only region preference persists; legacy collapse state is never read or written", () => {
    const result = run({ url: "https://store.steampowered.com/?cc=cn" });
    assert.deepEqual(result.reads, ["steam-store-region"]);
    assert.equal(result.toggle.attributes["aria-expanded"], "false");
    result.toggle.events.click();
    result.buttons[2].events.click();
    assert.deepEqual(result.settings, [["steam-store-region", "jp"]]);
    const reloaded = run({ saved: "jp" });
    assert.equal(reloaded.toggle.attributes["aria-expanded"], "false");
    assert.equal(reloaded.panel.attributes["data-region"], "jp");
    assert.ok(reloaded.toggle.title.includes("🇯🇵"));
});

test("every region label retains a visible non-breaking space after its emoji", () => {
    for (const button of run().buttons) {
        assert.match(button.textContent, /^\S+\u00a0\S+$/u);
    }
});
