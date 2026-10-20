// ==UserScript==
// @name         Steam Store Region
// @name:zh-CN   Steam 商店区域切换
// @namespace    https://github.com/cycledm/userscripts
// @version      0.1.8
// @description  Switch signed-out Steam storefront regions with remembered choices and compact glass controls.
// @description:zh-CN 为未登录的 Steam 商店网页切换展示区域并记住手动选择，提供紧凑毛玻璃控件。
// @icon         data:image/png;base64,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
// @icon64       data:image/png;base64,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
// @author       CycleDM
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/cycledm/userscripts/tree/main/steam-store-region
// @supportURL   https://github.com/cycledm/userscripts/issues
// @match        https://store.steampowered.com/*
// @run-at       document-end
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// Copyright (C) 2026 CycleDM
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, either version 3, or (at your option) any later version.

/* Embedded Tailwind CSS utilities: MIT License
 * Copyright (c) Tailwind Labs, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(() => {
    "use strict";

    const OPTIONS = [["cn", "🇨🇳 国区", "🇨🇳 CN"], ["hk", "🇭🇰 港区", "🇭🇰 HK"],
        ["jp", "🇯🇵 日区", "🇯🇵 JP"], ["us", "🇺🇸 美区", "🇺🇸 US"],
        ["off", "🌐 自动", "🌐 Auto"]];
    const SETTING = "steam-store-region";
    const LOOP_KEY = "cycledm-steam-region-last-navigation";
    // Generated by src/build-styles.py from Tailwind CSS 3.4.17 (MIT).
    // tailwind:start
    const STYLES = ":host{all:initial}.visible{visibility:visible}.fixed{position:fixed}.bottom-4{bottom:1rem}.right-4{right:1rem}.m-0{margin:0}.box-border{box-sizing:border-box}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.h-10{height:2.5rem}.min-h-0{min-height:0}.w-10{width:2.5rem}.w-max{width:-moz-max-content;width:max-content}.min-w-0{min-width:0}.shrink-0{flex-shrink:0}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.justify-center{justify-content:center}.gap-1{gap:.25rem}.overflow-hidden{overflow:hidden}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.border{border-width:1px}.border-0{border-width:0}.border-solid{border-style:solid}.border-slate-600{--tw-border-opacity:1;border-color:rgb(71 85 105/var(--tw-border-opacity,1))}.bg-slate-700{--tw-bg-opacity:1;background-color:rgb(51 65 85/var(--tw-bg-opacity,1))}.bg-slate-900{--tw-bg-opacity:1;background-color:rgb(15 23 42/var(--tw-bg-opacity,1))}.p-0{padding:0}.p-1{padding:.25rem}.p-2{padding:.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.font-sans{font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-5{line-height:1.25rem}.leading-none{line-height:1}.text-slate-100{--tw-text-opacity:1;color:rgb(241 245 249/var(--tw-text-opacity,1))}.text-slate-300{--tw-text-opacity:1;color:rgb(203 213 225/var(--tw-text-opacity,1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.opacity-100{opacity:1}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-lg{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.duration-200{transition-duration:.2s}.ease-in{transition-timing-function:cubic-bezier(.4,0,1,1)}.ease-in-out{transition-timing-function:cubic-bezier(.4,0,.2,1)}.region-panel{z-index:2147483647;box-sizing:border-box;display:flex;height:54px;width:54px;align-items:center;justify-content:center;padding:.25rem;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:.875rem;line-height:1.25rem;--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1));bottom:calc(1rem + env(safe-area-inset-bottom, 0px));right:calc(1rem + env(safe-area-inset-right, 0px))}.region-controls,.region-panel{border-radius:.75rem;border:1px solid hsla(0,0%,100%,.25);--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.region-panel:before{content:\"\";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none}.region-controls,.region-panel:before{background-color:rgba(15,23,42,.95)}.region-collapsible{--pull-x:0px;--pull-y:14px;position:absolute;right:0;bottom:calc(100% + 8px);width:-moz-max-content;width:max-content;opacity:1;visibility:visible;transform:translate(0);transform-origin:bottom right;transition:opacity .18s ease-out,transform .44s cubic-bezier(.16,1,.3,1.12),visibility 0s}.region-collapsible[data-collapsed=true]{opacity:0;visibility:hidden;pointer-events:none;transform:translate(var(--pull-x),var(--pull-y));transition:opacity .14s ease-in .22s,transform .26s ease-in .1s,visibility 0s .36s}.region-controls{box-sizing:border-box;display:flex;width:-moz-max-content;width:max-content;flex-direction:column;align-items:stretch;gap:.25rem;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding:.25rem;max-width:calc(100vw - 2rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px));max-height:calc(100vh - 7rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));max-height:calc(100dvh - 7rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))}.region-status{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.region-button,.region-toggle{margin:0;box-sizing:border-box;display:inline-flex;height:44px;flex-shrink:0;cursor:pointer;align-items:center;justify-content:center;border-radius:.5rem;border-width:0;border-style:solid;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:.875rem;line-height:1.25rem;--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1));background:rgba(15,23,42,.58);text-shadow:0 1px 2px rgba(0,0,0,.45);-webkit-tap-highlight-color:transparent;touch-action:manipulation}.region-button{white-space:nowrap;padding:0 .5rem;font-weight:500;opacity:1;transform:translate(0);transition:opacity .24s ease-out,transform .44s cubic-bezier(.16,1,.3,1.28),background-color .12s;transition-delay:calc((4 - var(--order))*38ms),calc((4 - var(--order))*38ms),0s}.region-collapsible[data-collapsed=true] .region-button{opacity:0;transform:translate(var(--pull-x),var(--pull-y));transition-timing-function:ease-in,cubic-bezier(.4,0,.8,.2),ease;transition-duration:.18s,.2s,.12s;transition-delay:calc(var(--order)*30ms),calc(var(--order)*30ms),0s}.region-toggle{width:44px;padding:0;font-size:20px;line-height:1}.region-icon-horizontal{display:none}.region-icon-vertical{display:inline}.region-button:hover,.region-toggle:hover{background:rgba(15,23,42,.76)}.region-button[aria-pressed=true]{background-color:rgba(3,105,161,.95)}.region-button:focus-visible,.region-toggle:focus-visible{outline-style:solid;outline-width:2px;outline-offset:2px;outline-color:#7dd3fc}@media (min-width:640px){.region-collapsible{--pull-x:14px;--pull-y:0px;top:0;right:calc(100% + 8px);bottom:auto;transform-origin:center right}.region-controls{flex-direction:row;overflow:visible;max-height:none}.region-icon-horizontal{display:inline}.region-icon-vertical{display:none}}@supports ((-webkit-backdrop-filter:blur(24px)) or (backdrop-filter:blur(24px))){.region-controls,.region-panel:before{background:rgba(15,23,42,.46);-webkit-backdrop-filter:blur(24px) saturate(140%);backdrop-filter:blur(24px) saturate(140%)}}@media (prefers-reduced-motion:reduce){.region-button,.region-collapsible,.region-collapsible[data-collapsed=true],.region-collapsible[data-collapsed=true] .region-button{transition:none;transform:none}}@media (prefers-reduced-transparency:reduce){.region-controls,.region-panel:before{--tw-bg-opacity:1;background-color:rgb(15 23 42/var(--tw-bg-opacity,1));-webkit-backdrop-filter:none;backdrop-filter:none}}";
    // tailwind:end

    if (window.top !== window.self || location.origin !== "https://store.steampowered.com") return;
    const allowed = /^\/(?:$|(?:app|bundle|sub|search|category|genre|tags|specials|sale|charts|publisher|developer|franchise|curators?|wishlist|points|explore|steamdeck)(?:\/|$))/;
    if (!allowed.test(location.pathname) || /^\/search\/results(?:\/|$)/i.test(location.pathname)) return;

    if (isSignedIn()) return;

    const chinese = /^zh\b/i.test(document.documentElement.lang || navigator.language);
    let region = "cn";
    try {
        const saved = GM_getValue(SETTING, null);
        if (OPTIONS.some(([value]) => value === saved)) region = saved;
    } catch (_) { /* Retain CN when settings cannot be read. */ }

    function isSignedIn() {
        if (document.querySelector("#account_pulldown, #account_dropdown, #global_actions .user_avatar")) return true;
        const info = document.querySelector("[data-userinfo]");
        if (info) {
            try {
                return JSON.parse(info.getAttribute("data-userinfo")).logged_in === true;
            } catch (_) { /* Unrecognized page data is not evidence of a signed-in session. */ }
        }
        return false;
    }

    function regionURL(force) {
        // Preserve the original spelling/order of unrelated parameters and the hash.
        const raw = location.href;
        const hashAt = raw.indexOf("#");
        const base = hashAt < 0 ? raw : raw.slice(0, hashAt);
        const hash = hashAt < 0 ? "" : raw.slice(hashAt);
        const queryAt = base.indexOf("?");
        const parts = queryAt < 0 ? [] : base.slice(queryAt + 1).split("&");
        const isCC = part => decodeURIComponent(part.split("=")[0].replace(/\+/g, " ")).toLowerCase() === "cc";
        if (!force && parts.some(isCC)) return null;
        if (region === "off" && !parts.some(isCC)) return null;
        const kept = force ? parts.filter(part => !isCC(part)) : parts;
        const prefix = queryAt < 0 ? base : base.slice(0, queryAt);
        const query = kept.join("&");
        if (region === "off") return prefix + (query ? "?" + query : "") + hash;
        return prefix + "?" + query + (query && !query.endsWith("&") ? "&" : "") + "cc=" + region + hash;
    }

    function navigate(force = false) {
        if (isSignedIn() || (region === "off" && !force)) return;
        try {
            const target = regionURL(force);
            if (!target || target === location.href) return;
            // If Steam strips cc, avoid repeatedly reloading the same destination.
            // Without session storage, skip automatic navigation conservatively.
            if (!force) {
                const previous = JSON.parse(sessionStorage.getItem(LOOP_KEY) || "null");
                if (previous && previous.url === target && Date.now() - previous.time < 15000) return;
                sessionStorage.setItem(LOOP_KEY, JSON.stringify({ url: target, time: Date.now() }));
            }
            location.replace(target);
        } catch (_) { /* Malformed URLs or unavailable storage: leave the page alone. */ }
    }

    function mount() {
        if (!document.body || document.getElementById("cycledm-steam-store-region")) return;
        const host = document.createElement("div");
        host.id = "cycledm-steam-store-region";
        const shadow = host.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        style.textContent = STYLES;
        const panel = document.createElement("nav");
        panel.className = "fixed region-panel";
        panel.setAttribute("aria-label", chinese ? "Steam 商店区域" : "Steam store region");
        let collapsed = true;
        const collapsible = document.createElement("div");
        collapsible.id = "region-controls";
        collapsible.className = "region-collapsible";
        const clip = document.createElement("div");
        clip.className = "region-clip";
        const controls = document.createElement("div");
        controls.className = "region-controls";
        clip.append(controls);
        collapsible.append(clip);
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "region-toggle";
        toggle.setAttribute("aria-controls", collapsible.id);
        const horizontalIcon = document.createElement("span");
        horizontalIcon.className = "region-icon-horizontal";
        horizontalIcon.setAttribute("aria-hidden", "true");
        const verticalIcon = document.createElement("span");
        verticalIcon.className = "region-icon-vertical";
        verticalIcon.setAttribute("aria-hidden", "true");
        toggle.append(horizontalIcon, verticalIcon);
        function renderCollapsed() {
            panel.setAttribute("data-collapsed", String(collapsed));
            panel.setAttribute("data-region", region);
            toggle.setAttribute("data-collapsed", String(collapsed));
            collapsible.setAttribute("data-collapsed", String(collapsed));
            collapsible.setAttribute("aria-hidden", String(collapsed));
            collapsible.inert = collapsed;
            toggle.setAttribute("aria-expanded", String(!collapsed));
            horizontalIcon.textContent = collapsed ? "◀️" : "▶️";
            verticalIcon.textContent = collapsed ? "🔼" : "🔽";
            const label = OPTIONS.find(([value]) => value === region)[chinese ? 1 : 2];
            toggle.title = (collapsed ? (chinese ? "展开区域工具栏" : "Expand region toolbar")
                : (chinese ? "折叠区域工具栏" : "Collapse region toolbar")) + " · " + label;
            toggle.setAttribute("aria-label", toggle.title);
        }
        renderCollapsed();
        const status = document.createElement("span");
        status.className = "region-status";
        status.setAttribute("role", "status");
        const buttons = [];
        function refresh() {
            host.hidden = isSignedIn();
            if (host.hidden) return false;
            renderCollapsed();
            status.textContent = chinese ? "商店区域" : "Store region";
            for (const [button, value] of buttons) {
                button.setAttribute("aria-pressed", String(value === region));
            }
            return true;
        }
        controls.append(status);
        for (const [index, [value, zh, en]] of OPTIONS.entries()) {
            const button = document.createElement("button");
            button.type = "button";
            // A non-breaking space keeps the emoji/label separator visibly intact.
            button.textContent = (chinese ? zh : en).replace(" ", "\u00a0");
            button.className = "region-button";
            button.setAttribute("style", "--order: " + index);
            button.title = value === "off"
                ? (chinese ? "移除当前网址的 cc 参数并停止后续改写" : "Remove cc from this URL and stop future rewrites")
                : (chinese ? "保存区域并重新加载当前页面" : "Save region and reload this page");
            button.addEventListener("click", () => {
                if (!refresh()) return;
                try { GM_setValue(SETTING, value); }
                catch (_) {
                    status.textContent = chinese ? "无法保存设置" : "Could not save preference";
                    return;
                }
                region = value;
                renderCollapsed();
                refresh();
                navigate(true);
            });
            buttons.push([button, value]);
            controls.append(button);
        }
        toggle.addEventListener("click", () => {
            if (!refresh()) return;
            collapsed = !collapsed;
            renderCollapsed();
        });
        panel.append(collapsible, toggle);
        refresh();
        shadow.append(style, panel);
        document.body.append(host);
        window.addEventListener("pageshow", () => { refresh(); navigate(); });
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") refresh();
        });
    }

    mount();
    navigate();
})();
