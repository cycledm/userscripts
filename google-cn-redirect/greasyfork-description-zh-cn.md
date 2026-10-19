[English](https://github.com/cycledm/userscripts/blob/main/google-cn-redirect/greasyfork-description.md) | 简体中文

# Google 中国域名跳转

将 `google.cn` 和 `www.google.cn` 跳转到 `https://www.google.com`，保留必要的搜索参数，并显示跟随系统深浅色模式的过渡页。

- 保留搜索内容 `q` 和原有的 `client`。缺少其中任何一个都正常跳转，不强制指定 Safari 客户端。
- 保留语言、地区、安全搜索、分页、搜索类型及支持的筛选条件；使用允许列表移除其他参数和 URL 片段。
- 提供深浅色过渡卡片、加载动画和手动继续链接；遵守系统减少动态效果的设置。
- 使用在线 Tailwind 和本地兜底 CSS。跳转不等待 CDN，也不为播放动画人为延迟。
- 替换当前历史记录，后退不会再次进入跳转页。

## 实验性系统主题同步

在 `.com` 搜索结果页，系统主题变化时通过深色 `cs=1` 或浅色 `cs=0` 请求相应主题。这会重新加载结果页，可能打断阅读或未提交的输入。直接访问不带 `cs` 的 `.com` 搜索页时，从下一次系统主题变化开始同步。部分环境下 Google 可能忽略该参数。

将脚本顶部的 `SYNC_SYSTEM_THEME` 改为 `false` 即可关闭此兼容方案。它不会修改 Google 账户偏好或 Cookie。

## 范围与限制

- 仅处理 `google.cn` / `www.google.cn` 的顶层页面，以及用于主题同步的 `www.google.com/search` 页面。
- 移除未知参数可能影响非搜索路径或依赖其他参数的功能。清理 URL 不能阻止 Cookie、账户跟踪，也不能撤销已经发往 `.cn` 的原始请求。
- 过渡页从 jsDelivr 加载第三方 Tailwind JavaScript，使用 `no-referrer`；CDN 失败或被 CSP 阻止时仍可使用本地兜底样式。脚本不会在 `.com` 加载 CDN 代码。
- `client=safari` 抑制横幅的效果，以及 Safari/iOS/脚本管理器兼容性尚未独立验证。自动化测试和本地过渡页预览不能证明 Google 服务端行为。

[完整参数列表及使用说明](https://github.com/cycledm/userscripts/blob/main/google-cn-redirect/README.zh-CN.md) · [问题反馈](https://github.com/cycledm/userscripts/issues)

采用 **GPL-3.0-or-later** 许可证。Copyright (C) 2026 CycleDM.
