[English](README.md) | [简体中文](README.zh-CN.md)

# Steam 商店区域切换

为未登录的 Steam 商店网页默认添加国区参数，并提供可记忆偏好的区域切换按钮。

## 使用方式

- 初始选择为**国区（`cc=cn`）**。右下角依次提供**🇨🇳 国区、🇭🇰 港区（`hk`）、🇯🇵 日区（`jp`）、🇺🇸 美区（`us`）、🌐 默认**，
  中文页面显示中文，其他页面使用两个大写字母的区域代码（`CN`、`HK`、`JP`、`US`）。高亮表示已保存的偏好，不代表服务器当前的实际价格区域。
  偏好保存在用户脚本管理器中；其他已打开标签页在下次页面加载时读取新设置。
- 点击工具栏最右侧按钮可折叠为所选区域的国旗（**🇨🇳、🇭🇰、🇯🇵、🇺🇸**），选择“默认”时显示 **🌐**。
  图标表示已保存的偏好，不代表 Steam 的实际价格区域。再次点击展开。折叠状态与区域偏好分别保存，
  后续加载页面时恢复；折叠不会停用区域改写。宽度与透明度采用 200 毫秒过渡，遵循系统的
  “减少动态效果”设置。折叠后，隐藏控件不会进入键盘焦点或辅助功能导航。
- 自动处理仅在网址没有 `cc` 时添加偏好区域。已有的 `cc` 优先，包括空值、编码名称、重复和大小写变体。
  主动点击区域按钮会替换所有 `cc` 变体并重新加载当前页面，其他查询参数与片段保留原有编码。
- **🌐 默认**表示不改写，停止后续自动处理，保留当前网址，包括已有的 `cc`。若希望当前页面重新由 Steam
  决定区域，请手动删除 `cc`；此选项不会重置 Steam 自身的 Cookie。
- 页面通过 `data-userinfo` 或顶部全局菜单中的登录链接明确表明未登录后才处理。
  检测到账号入口或已登录数据时暂停；无法判断时也暂停。暂停时区域按钮禁用，“默认”仍可使用。
  这是基于页面 DOM 的尽力检测，并非 Steam 官方认证接口；页面结构变化时可能需要更新。
  每次改写前及页面从缓存恢复时重新判断，标签页恢复可见时也刷新工具栏状态。
- 使用 `document-end` 等待登录状态可读取；首次请求已经到达 Steam，因此可能短暂显示原区域，
  随后再导航。每个标签页对同一自动目标设置 15 秒防循环保护，防止 Steam 移除 `cc` 后反复加载。
  会话存储不可用时跳过自动导航，仍可主动点击区域按钮。查询键包含无效编码时保留原页面。

## 范围与限制

仅匹配 `https://store.steampowered.com/` 的顶层页面。支持首页以及 `app`、`bundle`、`sub`、
`search`、`category`、`genre`、`tags`、`specials`、`sale`、`charts`、`publisher`、
`developer`、`franchise`、`curator`、`curators`、`wishlist`、`points`、`explore`、
`steamdeck` 路径族；排除 `/search/results`。不改写账号、登录、购物车、结账、API、其他路径、
iframe 或后台请求。不拦截 SPA 的同文档导航；再次完整加载受支持页面时重新运行。

脚本通过 `cc` 请求商店展示区域，Steam 可能忽略它或保留区域 Cookie。它不会改变账号国家、
购买资格、代理路由，也不会直接修改搜索结果动态加载的价格。无法绕过区域限制，也无法修复代理下
根本无法加载的页面。无需 Surge 模块或 MITM，不拦截 Steam 客户端流量。
如果用本脚本替代所提供的 Surge 模块，请另行关闭该模块，避免两套独立改写同时生效；
本脚本无法撤销 Surge 的网络改写或主机级 MITM 设置。

## 安装

将 [steam-store-region.user.js](steam-store-region.user.js) 的内容导入用户脚本管理器，
并允许脚本访问匹配的 Steam 网站。
[Raw 安装链接](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/steam-store-region.user.js)
直接指向仓库 `main` 分支中的此脚本文件。

<!-- greasyfork-link:start -->
Greasy Fork: [Greasy Fork](https://greasyfork.org/scripts/601020)
<!-- greasyfork-link:end -->

Greasy Fork 附加信息同步请使用[英文说明源](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/greasyfork-description.md)
作为**默认条目**，另添加一个与 `@name:zh-CN` 对应的**中文（中国），`zh-CN`** 本地化条目，
使用[中文说明源](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/greasyfork-description-zh-cn.md)。
两者格式均选择 **Markdown**，不要额外添加重复的英文本地化条目。需在 Greasy Fork 分别配置两个同步 URL；
提交文件不会自动配置同步，也不会发布脚本。

仅申请保存区域偏好及折叠状态所需的 `GM_getValue`、`GM_setValue` 权限。不读取 Cookie 或凭据，
不保存账号标识；除导航到商店网页外，脚本不发起外部请求。

## 样式与开发

工具栏使用 **Tailwind CSS 3.4.17**，预编译后内嵌到 `.user.js`，通过 Shadow DOM
隔离工具类与商店页面样式。运行时无需 CDN、外部字体或 Tailwind 浏览器编译器，采用 Tailwind
的[静态 CSS 编译方式](https://v3.tailwindcss.com/docs/installation)。

修改工具类或 `src/tailwind.css` 后运行：

```sh
python3 steam-store-region/src/build-styles.py
node --check steam-store-region/steam-store-region.user.js
node --test steam-store-region/tests/region.test.cjs
```

重新编译需要 Python 3、Node.js/npm，以及访问 npm 下载固定版本 Tailwind CLI 的网络
（或已有 npm 缓存）。安装和使用脚本无需这些工具，也无需仓库级包清单或依赖安装。

## 验证

Node 模拟浏览器测试覆盖路径边界、查询参数保留、偏好、主动切换、已登录和未知状态跳过、
存储失败、折叠状态持久化、辅助功能状态及重定向防循环。已检查 Steam 当前公开 HTML 中未登录的 `data-userinfo` 和顶部
登录链接标记；一次公开商品页 `cc=cn` 请求返回了 `country_code: CN`。临时本地浏览器预览
使用模拟的管理器存储，确认了工具栏布局、切换到 `cc=hk` 及关闭改写后保留当前网址。
另已在本地浏览器确认工具栏折叠、展开及刷新后恢复折叠状态。
这不证明真实账号登录后的行为，也不证明 Tampermonkey、Violentmonkey、
Safari/iOS 的端到端兼容性，或 Steam 实际返回各区域价格的效果。

## 许可证

CycleDM 的代码使用 **GPL-3.0-or-later**：GNU 通用公共许可证第 3 版，或由您选择的任何后续版本，
详见仓库 [LICENSE](../LICENSE)。内嵌 Tailwind CSS 工具样式使用 MIT 许可证，
Copyright (c) Tailwind Labs, Inc.，声明已保留于脚本及
[src/tailwind-LICENSE](src/tailwind-LICENSE)。

Copyright (C) 2026 CycleDM
