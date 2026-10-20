// ==UserScript==
// @name         Google CN Redirect
// @name:zh-CN   Google 中国域名跳转
// @namespace    https://github.com/cycledm/userscripts
// @version      0.2.2
// @description  Redirect google.cn to google.com with selected search parameters and a system-themed transition page.
// @description:zh-CN 将 google.cn 跳转到 google.com，保留必要搜索参数，提供跟随系统主题的过渡页。
// @author       CycleDM
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/cycledm/userscripts/tree/main/google-cn-redirect
// @supportURL   https://github.com/cycledm/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/google-cn-redirect.user.js
// @downloadURL  https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/google-cn-redirect.user.js
// @icon          data:image/png;base64,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
// @icon64        data:image/png;base64,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
// @match        *://google.cn/*
// @match        *://www.google.cn/*
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

    const TAILWIND_CDN = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
    const TRANSITION_ICON = "data:image/png;base64,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";
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
    if (!["google.cn", "www.google.cn"].includes(source.hostname)) return;

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
        return target;
    }

    function coverSourcePage() {
        const root = document.documentElement || document.appendChild(document.createElement("html"));
        const head = document.createElement("head");
        const body = document.createElement("body");
        const style = document.createElement("style");
        const meta = document.createElement("meta");
        meta.name = "referrer";
        meta.content = "no-referrer";
        style.textContent = `
            :root { color-scheme: light dark; background: #f5f7fc; }
            @media (prefers-color-scheme: dark) { :root { background: #10141c; } }
            body { margin: 0; }
        `;
        head.append(meta, style);
        root.removeAttribute("style");
        root.replaceChildren(head, body);
    }

    function renderTransition(target) {
        // Navigation is already pending. Do not call window.stop() here.
        const chinese = /^zh\b/i.test(navigator.language);
        const head = document.createElement("head");
        const body = document.createElement("body");
        const root = document.documentElement || document.appendChild(document.createElement("html"));
        root.lang = chinese ? "zh-CN" : "en";
        root.replaceChildren(head, body);
        const meta = document.createElement("meta");
        meta.name = "referrer";
        meta.content = "no-referrer";
        const viewport = document.createElement("meta");
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1";
        const style = document.createElement("style");
        // Keep final geometry and typography identical with or without Tailwind.
        style.textContent = `
            @layer theme, base, components, utilities, redirect-fallback;
            @layer redirect-fallback {
                :root { color-scheme: light dark; line-height: 1.5; -webkit-text-size-adjust: 100%;
                    --bg: #f5f7fc; --card: #ffffff;
                    --ink: #182235; --muted: #657189; --line: #dde5f2; --accent: #2563eb; }
                @media (prefers-color-scheme: dark) {
                    :root { --bg: #10141c; --card: #191f2b; --ink: #edf2fc;
                        --muted: #a4afc3; --line: #303d53; --accent: #93b4ff; }
                }
                * { box-sizing: border-box; }
                body { margin: 0; min-height: 100vh; min-height: 100dvh; display: grid;
                    place-items: center; padding: 24px; background: var(--bg);
                    color: var(--ink); font-family: system-ui, -apple-system, sans-serif;
                    font-weight: 400; letter-spacing: normal; }
                main { width: 100%; max-width: 440px; padding: 40px 28px; text-align: center;
                    border: 1px solid var(--line); border-radius: 28px; background: var(--card);
                    box-shadow: 0 24px 80px #0000000a; }
                .route { display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
                    column-gap: 12px; row-gap: 4px; margin: 12px 0 28px; color: var(--muted); font-size: 13px;
                    line-height: 20px; letter-spacing: .025em; }
                .destination { color: var(--ink); font-weight: 650; }
                .indicator { position: relative; margin: 0 auto 24px; width: 52px; height: 52px;
                    display: grid; place-items: center; }
                .indicator::before { content: ""; position: absolute; inset: 0; border-radius: 50%;
                    border: 2px solid var(--line); border-top-color: var(--accent);
                    animation: orbit 1.2s linear infinite; }
                .indicator img { display: block; width: 28px; height: 28px; object-fit: contain; }
                h1 { margin: 0; font-size: 24px; font-weight: 650; line-height: 32px;
                    letter-spacing: -.035em; }
                a { display: inline-flex; align-items: center; justify-content: center;
                    min-height: 44px; padding: 10px 18px; border: 1px solid var(--line);
                    border-radius: 12px; color: var(--accent); font-size: 14px; font-weight: 500;
                    line-height: 20px; text-decoration: none; transition: color .15s, background-color .15s; }
                a:hover { background: var(--bg); }
                a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
            }
            @media (width < 360px) {
                @layer redirect-fallback {
                    body { padding: 16px; }
                    main { padding: 32px 20px; }
                }
            }
            @keyframes orbit { to { transform: rotate(360deg); } }
            @media (prefers-reduced-motion: reduce) {
                .indicator::before { animation: none; }
                a { transition: none; }
            }
        `;
        head.append(meta, viewport, style);
        document.title = chinese ? "正在前往 Google" : "Continuing to Google";
        // Static markup only: search text and URL parameters are never HTML.
        body.innerHTML = `
            <main class="w-full max-w-110 rounded-[28px] border border-(--line) bg-(--card) px-7 py-10 text-center shadow-[0_24px_80px_#0000000a] max-[360px]:px-5 max-[360px]:py-8">
                <div class="indicator" aria-hidden="true"><img alt="" width="28" height="28"></div>
                <div role="status" aria-live="polite">
                    <h1 class="text-2xl leading-8 font-[650] tracking-[-.035em]"></h1>
                </div>
                <div class="route mt-3 mb-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] leading-5 tracking-wide">
                    <span>google.cn</span><span aria-hidden="true">→</span>
                    <span class="destination font-[650]">google.com</span>
                </div>
                <a class="inline-flex min-h-11 items-center justify-center rounded-xl border border-(--line) px-4.5 py-2.5 text-sm leading-5 font-medium text-(--accent) transition-colors hover:bg-(--bg) motion-reduce:transition-none"></a>
            </main>`;
        body.querySelector(".indicator img").src = TRANSITION_ICON;
        body.querySelector("h1").textContent = chinese ? "正在前往 Google" : "Continuing to Google";
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

    const target = redirectTarget(source);
    // Stop only the source page, before starting the destination request.
    try {
        window.stop();
    } catch {
        // A failure to stop the source must not prevent navigation.
    }
    try {
        coverSourcePage();
    } catch {
        // Covering the source is best effort; navigation still takes priority.
    }
    try {
        renderTransition(target);
    } finally {
        // Let document rebuilding finish before requesting navigation.
        // Schedule even if rendering fails; never wait for Tailwind or animation.
        setTimeout(() => location.replace(target.href), 0);
    }
})();
