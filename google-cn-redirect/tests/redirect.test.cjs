const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");

const source = readFileSync(join(__dirname, "../google-cn-redirect.user.js"), "utf8");

function run(href, options = {}) {
    const callbacks = {};
    const timers = [];
    const navigations = [];
    const elements = [];
    function element(tag) {
        const node = {
            tag, children: [],
            append(...nodes) { this.children.push(...nodes); },
            replaceChildren(...nodes) { this.children = nodes; },
            querySelector(selector) {
                if (!this[selector]) this[selector] = element(selector);
                return this[selector];
            },
        };
        elements.push(node);
        return node;
    }
    const root = element("html");
    const document = {
        documentElement: options.noRoot ? null : root,
        createElement: element,
        addEventListener: (name, fn) => { callbacks[name] = fn; },
    };
    const location = {
        href,
        replace: url => navigations.push(url),
    };
    const window = {
        stop() { if (options.renderError) throw new Error("Render failed"); },
        addEventListener: (name, fn) => { callbacks[name] = fn; },
    };
    const context = {
        URL, location, document, window,
        navigator: { language: options.language || "en-US" },
        setTimeout: fn => timers.push(fn),
        MutationObserver: class {
            constructor(fn) { callbacks.root = fn; }
            observe() {}
            disconnect() { callbacks.disconnected = true; }
        },
    };
    let error;
    try { vm.runInNewContext(source, context); } catch (caught) { error = caught; }
    return {
        callbacks, navigations, document, elements, root, location, error,
        flush() { while (timers.length) timers.shift()(); },
        target() { this.flush(); return new URL(navigations.at(-1)); },
    };
}

test("retains exact decoded query/client, drops tracking and fragments, upgrades HTTPS", () => {
    const result = run("http://google.cn/search?q=C%2B%2B+%E4%B8%AD%E6%96%87%26%3Cscript%3E&client=safari&ved=x&ei=y&rlz=z&utm_source=test#tracking");
    const url = result.target();
    assert.equal(url.origin, "https://www.google.com");
    assert.equal(url.pathname, "/search");
    assert.deepEqual([...url.searchParams], [["q", "C++ 中文&<script>"], ["client", "safari"]]);
    assert.equal(url.hash, "");
    assert.equal(result.error, undefined);
    const body = result.elements.find(node => node.tag === "body");
    assert.ok(!body.innerHTML.includes("<script>"));
    assert.equal(body.a.href, url.href);
    assert.equal(result.elements.find(node => node.tag === "script").referrerPolicy, "no-referrer");
});

test("redirects without client, without query, and with an empty query", () => {
    assert.equal(run("https://www.google.cn/?q=hello").target().pathname, "/search");
    assert.equal(run("https://google.cn/").target().href, "https://www.google.com/");
    assert.equal(run("https://google.cn/search?client=safari").target().searchParams.get("client"), "safari");
    assert.equal(run("https://google.cn/?q=").target().searchParams.get("q"), "");
});

test("preserves useful filters and first duplicate values, drops unknown values", () => {
    const input = "q=first&q=second&client=safari&hl=zh-CN&lr=lang_zh-CN&gl=us&cr=countryUS&safe=active&start=20&num=10&tbm=isch&udm=2&tbs=qdr:d&as_q=advanced&as_sitesearch=example.com&unknown=123";
    const url = run(`https://google.cn/search?${input}`).target();
    assert.equal(url.searchParams.get("q"), "first");
    assert.equal(url.searchParams.getAll("q").length, 1);
    for (const key of ["client", "hl", "lr", "gl", "cr", "safe", "start", "num", "tbm", "udm", "tbs", "as_q", "as_sitesearch"]) {
        assert.equal(url.searchParams.get(key), new URLSearchParams(input).get(key));
    }
    assert.equal(url.searchParams.has("unknown"), false);
});

test("preserves non-search paths and pins the target origin for double-slash paths", () => {
    assert.equal(run("https://google.cn/maps?q=park").target().pathname, "/maps");
    const url = run("https://google.cn//example.org/path?q=test").target();
    assert.equal(url.origin, "https://www.google.com");
    assert.equal(url.pathname, "//example.org/path");
});

test("navigation still happens if rendering fails or Tailwind never loads", () => {
    const broken = run("https://google.cn/search?q=test", { renderError: true });
    assert.ok(broken.error);
    assert.equal(broken.target().hostname, "www.google.com");
    assert.equal(run("https://google.cn/search?q=test").target().hostname, "www.google.com");
});

test("waits for a missing document root and then redirects", () => {
    const result = run("https://google.cn/?q=test", { noRoot: true });
    result.flush();
    assert.equal(result.navigations.length, 0);
    result.document.documentElement = result.root;
    result.callbacks.root();
    assert.equal(result.callbacks.disconnected, true);
    assert.equal(result.target().pathname, "/search");
});

test("does not touch google.com or other hosts, including their search state", () => {
    for (const href of [
        "https://www.google.com/search?q=test&cs=0#section",
        "https://www.google.com/search/", "https://www.google.com/searching?q=test",
        "https://www.google.com/", "https://mail.google.cn/search?q=test",
        "https://example.com/search?q=test",
    ]) {
        const result = run(href);
        result.flush();
        assert.equal(result.error, undefined);
        assert.equal(result.location.href, href);
        assert.equal(result.navigations.length, 0);
        assert.deepEqual(result.callbacks, {});
        assert.equal(result.elements.length, 1);
    }
});

test("does not forward or generate search-appearance parameters", () => {
    const result = run("https://google.cn/search?q=test&client=safari&cs=1");
    assert.deepEqual([...result.target().searchParams], [["q", "test"], ["client", "safari"]]);
    assert.deepEqual(result.callbacks, {});
});

test("metadata matches only the two China hosts", () => {
    const matches = [...source.matchAll(/^\/\/ @match\s+(\S+)/gm)].map(match => match[1]);
    assert.deepEqual(matches, ["*://google.cn/*", "*://www.google.cn/*"]);
});
