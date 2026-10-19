# Steam 商店区域切换

在使用代理浏览时，为未登录的 Steam 商店网页默认添加国区参数，并提供可记忆偏好的区域切换工具栏。

## 功能

- 初始选择为国区（`cc=cn`）。右下角依次提供 **🇨🇳 国区、🇭🇰 港区、🇯🇵 日区、🇺🇸 美区、🌐 默认**，
  分别对应 `cn`、`hk`、`jp`、`us` 和不改写。非中文页面显示两位大写区域代码，区域偏好跨页面保存。
- 自动处理只在没有 `cc` 参数时添加偏好区域；已有值优先，包括空值、编码名称、重复和大小写变体。
  主动点击区域按钮会替换全部 `cc` 变体并重新加载，保留其他查询参数与片段。
- **🌐 默认**停止后续改写，保留当前网址及已有的 `cc`。如需重新由 Steam 选择区域，请手动删除
  `cc`；此选项不会重置 Steam 自身的区域 Cookie。
- 页面数据或顶部登录链接明确表明未登录时才改写。已登录或无法判断时暂停，并禁用区域按钮，
  “默认”仍可使用。登录检测采用尽力判断，Steam 页面结构变化时可能需要更新。
- 可折叠为所选区域的国旗，“默认”显示 **🌐**，再次点击展开。折叠状态与区域偏好分别持久化。
  宽度与透明度采用 200 毫秒过渡，遵循系统“减少动态效果”设置。折叠不影响改写；国旗及高亮区域
  表示保存的偏好，不保证 Steam 实际使用该价格区域。
- 使用预编译的 Tailwind CSS，通过 Shadow DOM 隔离样式，运行时不加载 CDN、外部字体或额外脚本。

## 范围与限制

仅处理 `https://store.steampowered.com/` 的顶层页面：首页以及 `app`、`bundle`、`sub`、
`search`、`category`、`genre`、`tags`、`specials`、`sale`、`charts`、`publisher`、
`developer`、`franchise`、`curator`、`curators`、`wishlist`、`points`、`explore`、
`steamdeck` 路径族；排除 `/search/results`。不改写账号、登录、购物车、结账、API、其他路径、
iframe 或后台请求，也不拦截 SPA 的同文档导航。

首次请求会先到达 Steam，再检测登录状态并视情况二次导航，因此可能短暂显示原区域。每个标签页对同一
自动目标设置 15 秒防循环保护，防止 Steam 删除 `cc` 后重复跳转。会话存储不可用时跳过自动导航，
主动点击区域按钮仍可使用；查询键包含无效编码时保留原页面。

脚本请求的是商店展示区域，不会更改账号国家。Steam 可能忽略 `cc` 或保留区域 Cookie。
脚本不会改变购买资格、代理路由或搜索结果动态加载的价格，不能绕过区域限制，也不能修复无法加载的页面。
不拦截 Steam 客户端流量，无需 Surge 或 MITM；如果已有 Steam 区域 Surge 模块，请另行关闭，
避免两套独立改写同时生效。

仅使用 `GM_getValue`、`GM_setValue` 保存偏好，不读取 Cookie 或凭据，不保存账号标识；
除商店页面导航外，不发起外部请求。

已通过自动化模拟浏览器测试及本地预览检查网址处理与工具栏行为，并检查公开 Steam HTML 的未登录标记；
一次 `cc=cn` 请求返回了 `country_code: CN`。这些检查不证明真实账号行为、实际区域价格，
或 Tampermonkey、Violentmonkey、Safari/iOS 的端到端兼容性。

[源码及完整使用说明](https://github.com/cycledm/userscripts/blob/main/steam-store-region/README.zh-CN.md)
 · [问题反馈](https://github.com/cycledm/userscripts/issues)

CycleDM 的代码采用 **GPL-3.0-or-later** 许可证。Copyright (C) 2026 CycleDM.
内嵌 Tailwind CSS 工具样式保留 MIT 许可证及 Tailwind Labs, Inc. 的版权声明，见脚本与
[第三方许可证文件](https://github.com/cycledm/userscripts/blob/main/steam-store-region/src/tailwind-LICENSE)。
