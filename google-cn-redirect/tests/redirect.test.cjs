const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");

const source = readFileSync(join(__dirname, "../google-cn-redirect.user.js"), "utf8");

function run(href, options = {}) {
    const callbacks = {};
    const navigations = [];
    const timers = [];
    const elements = [];
    const actions = [];
    function element(tag) {
        const node = {
            tag, children: [],
            append(...nodes) {
                this.children.push(...nodes);
                if (nodes.some(node => node.tag === "script")) actions.push("cdn");
            },
            replaceChildren(...nodes) {
                this.children = nodes;
                if (this.tag === "html") actions.push("cover");
            },
            removeAttribute() {},
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
        createElement(tag) {
            if (options.renderError) throw new Error("Render failed");
            return element(tag);
        },
        addEventListener: (name, fn) => { callbacks[name] = fn; },
        appendChild(node) { this.documentElement = node; return node; },
    };
    const location = {
        href,
        replace(url) {
            actions.push("navigate");
            if (options.navigationError) throw new Error("Navigation failed");
            navigations.push(url);
        },
    };
    const window = {
        stop() {
            actions.push("stop");
            if (options.stopError) throw new Error("Stop failed");
        },
        addEventListener: (name, fn) => { callbacks[name] = fn; },
    };
    const context = {
        URL, location, document, window,
        navigator: { language: options.language || "en-US" },
        setTimeout: (fn, delay) => timers.push({ fn, delay }),
    };
    let error;
    try { vm.runInNewContext(source, context); } catch (caught) { error = caught; }
    return {
        callbacks, navigations, timers, actions, document, elements, root, location, error,
        flush() { while (timers.length) timers.shift().fn(); },
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
    const body = result.elements.findLast(node => node.tag === "body");
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
    assert.match(broken.error.message, /Render failed/);
    assert.equal(broken.target().hostname, "www.google.com");
    assert.equal(run("https://google.cn/search?q=test").target().hostname, "www.google.com");
});

test("creates the immediate fallback without a document root and schedules navigation", () => {
    const result = run("https://google.cn/?q=test", { noRoot: true });
    assert.equal(result.navigations.length, 0);
    assert.equal(result.document.documentElement.tag, "html");
    assert.equal(result.elements.findLast(node => node.tag === "body").a.href,
        "https://www.google.com/search?q=test");
    assert.equal(result.target().href, "https://www.google.com/search?q=test");
});

test("does not touch google.com or other hosts, including their search state", () => {
    for (const href of [
        "https://www.google.com/search?q=test&cs=0#section",
        "https://www.google.com/search/", "https://www.google.com/searching?q=test",
        "https://www.google.com/", "https://mail.google.cn/search?q=test",
        "https://example.com/search?q=test",
    ]) {
        const result = run(href);
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

test("renders immediately and requests navigation once on the next task without waiting for CDN", () => {
    const result = run("https://google.cn/search?q=test");
    assert.equal(result.error, undefined);
    assert.deepEqual(result.actions, ["stop", "cover", "cover", "cdn"]);
    assert.equal(result.navigations.length, 0);
    assert.ok(result.root.children[1].innerHTML.includes('class="indicator"'));
    assert.equal(result.timers.length, 1);
    assert.equal(result.timers[0].delay, 0);
    result.flush();
    assert.deepEqual(result.actions, ["stop", "cover", "cover", "cdn", "navigate"]);
    assert.equal(result.navigations.length, 1);
    result.flush();
    assert.equal(result.navigations.length, 1);
    assert.equal(result.elements.findLast(node => node.tag === "body").a.href, result.navigations[0]);
});

test("source-stop failures do not block navigation and navigation failures retain a manual link", () => {
    const stopFailure = run("https://google.cn/search?q=test", { stopError: true });
    assert.equal(stopFailure.error, undefined);
    assert.equal(stopFailure.target().hostname, "www.google.com");
    const navigationFailure = run("https://google.cn/search?q=test", { navigationError: true });
    assert.equal(navigationFailure.error, undefined);
    assert.throws(() => navigationFailure.flush(), /Navigation failed/);
    assert.equal(navigationFailure.elements.findLast(node => node.tag === "body").a.href,
        "https://www.google.com/search?q=test");
});
