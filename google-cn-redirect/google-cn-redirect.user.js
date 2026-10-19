// ==UserScript==
// @name         Google CN Redirect
// @name:zh-CN   Google 中国域名跳转
// @namespace    https://github.com/cycledm/userscripts
// @version      0.1.2
// @description  Redirect google.cn to google.com with selected search parameters and a system-themed transition page; optionally sync Search's theme.
// @description:zh-CN 将 google.cn 跳转到 google.com，保留必要搜索参数，提供跟随系统主题的过渡页，并可同步搜索页主题。
// @author       CycleDM
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/cycledm/userscripts/tree/main/google-cn-redirect
// @supportURL   https://github.com/cycledm/userscripts/issues
// @match        *://google.cn/*
// @match        *://www.google.cn/*
// @match        https://www.google.com/search*
// @run-at       document-start
// @noframes
// @grant        none
// ==/UserScript==

// Copyright (C) 2026 CycleDM
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, either version 3, or (at your option) any later version.

(() => {
    "use strict";

    // Experimental: use Google's cs parameter to request the system theme.
    // Set to false to leave google.com and Google's appearance preference alone.
    const SYNC_SYSTEM_THEME = true;
    const TAILWIND_CDN = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
    const SEARCH_PARAMETERS = [
        "q", "client",
        "hl", "lr", "gl", "cr", // Language and region.
        "safe", // Preserve explicit SafeSearch choices.
        "start", "num", // Pagination.
        "tbm", "udm", "tbs", // Search type and filters.
        "as_q", "as_epq", "as_oq", "as_eq", "as_sitesearch", "as_filetype",
        "as_rights", "as_qdr", "as_nlo", "as_nhi", // Advanced search.
    ];
    const source = new URL(location.href);
    const isChinaHost = ["google.cn", "www.google.cn"].includes(source.hostname);
    const theme = typeof matchMedia === "function"
        ? matchMedia("(prefers-color-scheme: dark)") : null;

    function setThemeParameter(url) {
        if (SYNC_SYSTEM_THEME && theme) {
            url.searchParams.set("cs", theme.matches ? "1" : "0");
        }
    }

    function redirectTarget(url) {
        // Home-page queries also become searches. Other paths retain their path,
        // but intentionally lose unknown parameters and fragments.
        const path = url.pathname === "/" && url.searchParams.has("q")
            ? "/search" : url.pathname;
        const target = new URL("https://www.google.com");
        target.pathname = path;
        for (const key of SEARCH_PARAMETERS) {
            if (url.searchParams.has(key)) {
                target.searchParams.set(key, url.searchParams.get(key));
            }
        }
        if (target.pathname === "/search" || target.pathname === "/search/") {
            setThemeParameter(target);
        }
        return target;
    }

    function renderTransition(target) {
        // Stop the old document before replacing it, so its styles/parser cannot
        // overwrite the transition. Navigation does not wait for the CDN.
        window.stop();
        const chinese = /^zh\b/i.test(navigator.language);
        const head = document.createElement("head");
        const body = document.createElement("body");
        const root = document.documentElement;
        root.lang = chinese ? "zh-CN" : "en";
        root.replaceChildren(head, body);
        const meta = document.createElement("meta");
        meta.name = "referrer";
        meta.content = "no-referrer";
        const viewport = document.createElement("meta");
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1";
        const style = document.createElement("style");
        // A complete offline fallback; Tailwind utilities can enhance it later.
        style.textContent = `
            @layer theme, base, redirect-fallback, components, utilities;
            @layer redirect-fallback {
                :root { color-scheme: light dark; --bg: #f5f7fc; --card: #ffffff;
                    --ink: #182235; --muted: #657189; --line: #dde5f2; --accent: #2563eb; }
                @media (prefers-color-scheme: dark) {
                    :root { --bg: #10141c; --card: #191f2b; --ink: #edf2fc;
                        --muted: #a4afc3; --line: #303d53; --accent: #93b4ff; }
                }
                * { box-sizing: border-box; }
                body { margin: 0; min-height: 100vh; min-height: 100dvh; display: grid;
                    place-items: center; padding: 24px; background: var(--bg);
                    color: var(--ink); font-family: system-ui, -apple-system, sans-serif; }
                main { width: 100%; max-width: 440px; padding: 40px 28px; text-align: center;
                    border: 1px solid var(--line); border-radius: 28px; background: var(--card);
                    box-shadow: 0 24px 80px #0000000a; }
                .route { display: flex; align-items: center; justify-content: center; gap: 12px;
                    color: var(--muted); font-size: 13px; letter-spacing: .025em; }
                .destination { color: var(--ink); font-weight: 650; }
                .indicator { margin: 32px auto 24px; width: 52px; height: 52px;
                    display: grid; place-items: center; border-radius: 50%;
                    border: 2px solid var(--line); border-top-color: var(--accent);
                    animation: orbit 1.2s linear infinite; }
                h1 { margin: 0; font-size: 24px; font-weight: 650; letter-spacing: -.035em; }
                p { margin: 12px 0 28px; color: var(--muted); font-size: 14px; line-height: 1.7; }
                a { display: inline-block; padding: 10px 18px; border: 1px solid var(--line);
                    border-radius: 12px; color: var(--accent); font-size: 14px; text-decoration: none; }
                a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
            }
            @keyframes orbit { to { transform: rotate(360deg); } }
            @media (prefers-reduced-motion: reduce) { .indicator { animation: none; } }
        `;
        head.append(meta, viewport, style);
        document.title = chinese ? "正在前往 Google" : "Continuing to Google";
        // Static markup only: search text and URL parameters are never HTML.
        body.innerHTML = `
            <main class="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--card)] px-7 py-10 text-center shadow-xl shadow-black/5">
                <div class="route flex items-center justify-center gap-3 text-sm">
                    <span>google.cn</span><span aria-hidden="true">→</span>
                    <span class="destination font-semibold">google.com</span>
                </div>
                <div class="indicator" aria-hidden="true"></div>
                <div role="status" aria-live="polite">
                    <h1 class="text-2xl font-semibold tracking-tight"></h1>
                    <p class="mt-3 mb-7 text-sm leading-7 text-[var(--muted)]"></p>
                </div>
                <a class="inline-flex rounded-xl border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--bg)]"></a>
            </main>`;
        body.querySelector("h1").textContent = chinese ? "正在前往 Google" : "Continuing to Google";
        body.querySelector("p").textContent = chinese
            ? "即将打开 google.com，请稍候。" : "Opening google.com. One moment, please.";
        const link = body.querySelector("a");
        link.textContent = chinese ? "立即继续 →" : "Continue now →";
        link.href = target.href;
        link.rel = "noreferrer";
        const tailwind = document.createElement("script");
        tailwind.src = TAILWIND_CDN;
        tailwind.async = true;
        tailwind.referrerPolicy = "no-referrer";
        head.append(tailwind);
    }

    if (isChinaHost) {
        const target = redirectTarget(source);
        const start = () => {
            // Even an unexpected rendering error must not break redirection.
            try {
                renderTransition(target);
            } finally {
                setTimeout(() => location.replace(target.href), 0);
            }
        };
        if (document.documentElement) {
            start();
        } else {
            const observer = new MutationObserver(() => {
                if (!document.documentElement) return;
                observer.disconnect();
                start();
            });
            observer.observe(document, { childList: true });
        }
        return;
    }

    // google.com is matched only for this optional search-theme workaround.
    if (!SYNC_SYSTEM_THEME || !theme || source.hostname !== "www.google.com"
        || !["/search", "/search/"].includes(source.pathname)) return;

    let lastSystemTheme = theme.matches;
    let navigating = false;
    function syncSearchTheme() {
        if (navigating || document.visibilityState === "hidden") return;
        const current = new URL(location.href);
        if (!["/search", "/search/"].includes(current.pathname)) return;
        const changed = lastSystemTheme !== theme.matches;
        lastSystemTheme = theme.matches;
        // Do not re-add a missing parameter on every load: Google may strip it.
        // Direct .com visits without cs start syncing on the next system change.
        if (!changed && !current.searchParams.has("cs")) return;
        const expected = theme.matches ? "1" : "0";
        if (current.searchParams.get("cs") === expected) return;
        current.searchParams.set("cs", expected);
        // Preserve all existing .com search state. This is not URL cleaning.
        navigating = true;
        location.replace(current.href);
    }

    if (typeof theme.addEventListener === "function") {
        theme.addEventListener("change", syncSearchTheme);
    } else {
        theme.addListener(syncSearchTheme);
    }
    document.addEventListener("visibilitychange", syncSearchTheme);
    window.addEventListener("pageshow", () => {
        navigating = false;
        syncSearchTheme();
    });
    syncSearchTheme();
})();
