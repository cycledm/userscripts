# Google 中国域名跳转

将 `google.cn` 和 `www.google.cn` 跳转到 `https://www.google.com`，保留必要的搜索参数，并显示跟随系统深浅色模式的过渡页。

- 保留搜索内容 `q` 和原有的 `client`。缺少其中任何一个都正常跳转，不强制指定 Safari 客户端。
- 保留语言、地区、安全搜索、分页、搜索类型及支持的筛选条件；使用允许列表移除其他参数和 URL 片段。
- 提供深浅色过渡卡片、围绕内嵌静止 Google G 图标旋转的加载圆环、标题下方的域名路线和手动继续链接；在线与兜底样式保持一致，遵守系统减少动态效果的设置。
- 先立即用跟随系统主题的纯色背景覆盖原页，再请求跳转；150 毫秒后才显示完整兜底卡片并加载在线 Tailwind，导航不等待。脚本运行前已绘制的内容仍可能短暂出现。本地 CSS 保证 CDN 不可用时仍可显示。
- 替换当前历史记录，后退不会再次进入跳转页。

## 范围与限制

- 仅处理 `google.cn` / `www.google.cn` 的顶层页面。
- 移除未知参数可能影响非搜索路径或依赖其他参数的功能。清理 URL 不能阻止 Cookie、账户跟踪，也不能撤销已经发往 `.cn` 的原始请求。
- 过渡页从 jsDelivr 加载第三方 Tailwind JavaScript，使用 `no-referrer`；CDN 失败或被 CSP 阻止时仍可使用本地兜底样式。
- `client=safari` 抑制横幅的效果，以及 Safari/iOS/脚本管理器兼容性尚未独立验证。自动化测试和本地过渡页预览不能证明 Google 服务端行为。

[完整参数列表及使用说明](https://github.com/cycledm/userscripts/blob/main/google-cn-redirect/README.zh-CN.md) · [问题反馈](https://github.com/cycledm/userscripts/issues)

脚本代码采用 **GPL-3.0-or-later** 许可证。Copyright (C) 2026 CycleDM.
