[English](README.md) | [简体中文](README.zh-CN.md)

# Steam 商店区域切换

通过紧凑的毛玻璃工具栏选择未登录 Steam 商店网页的展示区域，并记住手动选择。

## 区域选择

- 检测到已登录时直接退出，不创建控件、不读取或修改偏好、不改写网址。
- 其他情况下优先使用有效的保存偏好；没有有效偏好时初始为 **🇨🇳 国区**。登录状态未知按未登录处理。
- 通过 Steam 的 `data-userinfo` 和账号入口尽力检测登录状态，页面结构变化时可能需要更新。
  页面恢复、标签页恢复可见或操作控件前若检测到登录，则隐藏已有控件并停止改写。
- 选项依次为 **🇨🇳 国区、🇭🇰 港区、🇯🇵 日区、🇺🇸 美区、🌐 自动**；非中文页面使用 `CN`、`HK`、
  `JP`、`US` 和 `Auto`。
- 只有点击区域或“自动”按钮才通过 `GM_setValue` 保存偏好，页面加载和展开/折叠不会保存。
  其他标签页在刷新后读取最新偏好；已登录时保留原有偏好。
- 自动导航仅在没有 `cc` 时添加偏好区域。已有 `cc` 优先，包括空值、重复键、编码名称与大小写变体。
  主动选择区域会替换全部 `cc` 变体并重新加载，保留其他参数的原始编码及片段。
- 点击 **🌐 自动**会保存“自动”、移除当前全部 `cc` 变体，必要时重新加载。之后不再处理网址，包括自带
  `cc` 的链接。它不会重置 Steam 的区域 Cookie，也不保证实际价格区域。
- 高亮选项及展开按钮提示说明的是偏好，不证明服务器实际使用该价格区域。已登录时的货币显示不在脚本处理范围内。

## 控件与动画

每次完整加载页面都默认折叠，展开/折叠只保存在当前页面内存中，不读取旧版折叠记录。右下角固定锚点
在展开/折叠过程中始终为 **54 × 54 像素**，按钮触控区域为 **44 × 44 像素**。选项托盘独立展开：
宽度至少为 640 像素时向左横向展开，窄屏时向上紧凑竖向展开。短屏可内部滚动，并预留屏幕安全区。

| 布局 | 展开 | 折叠 |
| --- | --- | --- |
| 横版 | ◀️ | ▶️ |
| 竖版 | 🔼 | 🔽 |

区域按钮从靠近锚点的一端向外依次显现，带方向位移和轻微回弹；折叠时反序向锚点依次隐去。
展开约 0.6 秒，折叠约 0.36 秒；CSS 过渡可在中途反向，遵循系统“减少动态效果”设置，关闭位移和延迟。
折叠控件禁用交互，不进入辅助功能导航。

提高透光程度的深色毛玻璃表面使用 24 像素模糊与饱和度增强，搭配更深的按钮底色、白色文字和轻微文字
阴影保证对比度。不支持模糊时使用更高不透明度背景，支持系统“减少透明度”时改用不透明背景。
样式由 Tailwind CSS 3.4.17 预编译，通过 Shadow DOM 隔离；运行时无需 CDN、外部字体或下载编译器。

## 范围与限制

仅匹配 `https://store.steampowered.com/` 顶层页面：首页及 `app`、`bundle`、`sub`、`search`、
`category`、`genre`、`tags`、`specials`、`sale`、`charts`、`publisher`、`developer`、
`franchise`、`curator`、`curators`、`wishlist`、`points`、`explore`、`steamdeck` 路径族。
排除 `/search/results`，不改写账号、登录、购物车、结账、API、其他路径、iframe 或后台请求，
不拦截 SPA 的同文档导航。

脚本在 `document-end` 运行，原始请求已到达 Steam，二次导航前可能短暂显示原区域。每个标签页使用
15 秒的会话存储防循环保护，避免 Steam 移除 `cc` 后重复导航到同一目标。此会话值只用于防循环，
并非保存的区域偏好。会话存储不可用时跳过自动导航，主动点击按钮仍有效；查询键包含无效编码时保留原网址。

脚本改变的是展示区域请求，不会改变账号国家、购买资格、代理路由或搜索结果动态加载的价格，无法绕过
区域限制或修复无法加载的页面。不拦截 Steam 客户端流量，无需 Surge/MITM；已有 Steam 区域 Surge
模块需另行关闭，避免两套独立改写。

## 安装与发布

将 [steam-store-region.user.js](steam-store-region.user.js) 导入用户脚本管理器，或使用
[Raw 安装链接](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/steam-store-region.user.js)。
尚未推送的本地修改在发布前只能通过本地导入使用。

<!-- greasyfork-link:start -->
Greasy Fork: [Greasy Fork](https://greasyfork.org/scripts/601020)
<!-- greasyfork-link:end -->

附加信息同步请将[英文说明源](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/greasyfork-description.md)
用于**默认条目**，将[中文说明源](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/greasyfork-description-zh-cn.md)
用于一个与 `@name:zh-CN` 对应的**中文（中国），`zh-CN`** 本地化条目，两者格式均选 **Markdown**，
不要额外添加重复的英文本地化条目。需在 Greasy Fork 分别配置这两个 URL；提交文件不会自动配置同步或发布。

仅申请区域偏好所需的 `GM_getValue`、`GM_setValue` 权限。不读取 Cookie 或凭据，不保存账号标识，
除商店页面导航外不发起外部请求。

## 开发与验证

修改工具类或 `src/tailwind.css` 后重新编译内嵌 CSS：

```sh
python3 steam-store-region/src/build-styles.py
node --check steam-store-region/steam-store-region.user.js
node --test steam-store-region/tests/region.test.cjs
```

编译需要 Python 3、Node.js/npm，以及访问 npm 下载固定版本 Tailwind CLI 的网络或已有缓存；安装和使用
脚本无需这些工具，无需仓库级包清单。

模拟浏览器测试覆盖已登录时直接退出、后续检测到登录时隐藏控件、保存偏好优先级、仅手动写入偏好、网址保留、“自动”清理、
防循环及折叠辅助功能状态。本地浏览器预览检查响应式布局和动画；这些检查不证明真实账号价格变化，
或 Tampermonkey、Violentmonkey、手机实机、Safari/iOS 的端到端行为。

## 许可证

CycleDM 代码采用 **GPL-3.0-or-later**：GNU 通用公共许可证第 3 版，或由您选择的任何后续版本，
见 [LICENSE](../LICENSE)。内嵌 Tailwind 工具样式保留 MIT 许可证及 Tailwind Labs, Inc. 版权声明，
见脚本与 [src/tailwind-LICENSE](src/tailwind-LICENSE)。

Copyright (C) 2026 CycleDM
