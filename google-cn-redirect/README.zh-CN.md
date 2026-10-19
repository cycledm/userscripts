[English](README.md) | 简体中文

# Google 中国域名跳转

将 `google.cn` 跳转到 `https://www.google.com`，选择性保留搜索参数，并显示跟随系统深浅色模式的过渡页。

## 功能与规则

- 处理 `google.cn` 和 `www.google.cn` 的 HTTP / HTTPS 顶层页面，不含其他子域名。保留路径；根路径 `/` 带有 `q` 时转为 `/search`，没有查询时前往 `.com` 首页。
- 保留 `q`（包括空查询）和原有 `client`；缺少其中任何一个都正常跳转，不补写或强制指定 `client`。
- 使用允许列表，丢弃其他参数及 URL 片段。常见移除项包括 `ved`、`ei`、`sei`、`oq`、`aqs`、`source`、`sourceid`、`sclient`、`rlz`、`gs_lcrp`、`sca_esv`、`utm_*`。
- 使用 `location.replace`，后退不会再次进入跳转页。在下一个计时器轮次发起导航，不为动画或 CDN 人为延迟；跳转很快时过渡页可能一闪而过。
- 提供简洁卡片、加载动画及手动继续链接，界面根据浏览器语言显示中文或英文。CSS 媒体查询随系统主题实时变化，遵守减少动态效果的系统设置。

从 `.cn` 保留的参数：

| 用途 | 参数 |
| --- | --- |
| 搜索内容与客户端 | `q`、`client` |
| 语言与地区 | `hl`、`lr`、`gl`、`cr` |
| 安全搜索 | `safe` |
| 分页 | `start`、`num` |
| 搜索类型与筛选 | `tbm`、`udm`、`tbs` |
| 高级搜索 | `as_q`、`as_epq`、`as_oq`、`as_eq`、`as_sitesearch`、`as_filetype`、`as_rights`、`as_qdr`、`as_nlo`、`as_nhi` |

重复参数保留第一个值。允许列表优先服务普通搜索；非搜索路径及依赖其他参数的搜索功能可能受影响。这只能清理目标 URL，不能清除 Cookie、账户跟踪，也不能撤销已经到达 `.cn` 的原始请求。`client` 本身也可能传递客户端归因信息，此处按需求特意保留。用户提供的 `client=safari` 抑制横幅效果尚未在本次环境独立验证。

脚本需要网页提供运行机会，无法拦截更早发生的 HTTP 服务端跳转，也无法修复导致网页无法加载的网络错误。

## 实验性搜索页主题同步

默认启用；将脚本顶部的 `SYNC_SYSTEM_THEME` 改为 `false` 即可关闭，无需设置存储或 GM 权限。

从 `.cn` 跳转搜索时，根据系统主题添加深色 `cs=1` 或浅色 `cs=0`。在 `https://www.google.com/search`（含 `/search/`）监听 `prefers-color-scheme` 变化，以对应的 `cs` 参数重新加载结果页；从后台标签或页面缓存返回时也会检查变化。保留 `.com` 页面原有的全部参数和 URL 片段，参数清理仅发生在 `.cn` 跳转时。`.com` 不加载 Tailwind，也不注入过渡页。

加载时会修正已有但与系统不符的 `cs`。直接访问不带 `cs` 的 `.com` 搜索页时，从下一次系统主题变化开始同步；不会在每次加载时反复补写缺失的 `cs`，以免 Google 移除参数后形成循环。主题切换需要重载结果页，可能打断阅读或未提交的输入。启用后会请求使用系统主题，即使 Google 外观偏好与其不同；不修改账户设置、Cookie，也不使用影响图片颜色的整页滤镜。

`cs` 的取值可见于 [Chromium 自身的 URL 构造代码](https://chromium.googlesource.com/chromium/src/+/328fd587ff59399a3c3c6ea2781e2bc52482bc1b%5E%21/)。这是尽力而为的兼容方案，并非 Google Search 承诺支持的公开接口；部分布局、账户或浏览器可能忽略它。Google 本身也提供[外观 → 设备默认设置](https://support.google.com/websearch/answer/2539428?co=GENIE.Platform%3DAndroid&hl=zh-Hans)。

## 安装与样式

打开 [google-cn-redirect.user.js](google-cn-redirect.user.js)，将内容导入用户脚本管理器，并允许脚本访问匹配的网站。也可使用已确认的 `main` 分支上的 [Raw 安装链接](https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/google-cn-redirect.user.js)。

<!-- greasyfork-link:start -->
Greasy Fork: [Greasy Fork](https://greasyfork.org/scripts/601010)
<!-- greasyfork-link:end -->

元数据已提供源码目录和仓库问题反馈链接。Greasy Fork 的附加说明可分别使用[英文 Markdown 说明源](https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/greasyfork-description.md)和[简体中文 Markdown 说明源](https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/greasyfork-description-zh-cn.md)同步。两份文件均为使用绝对链接的 Markdown 文件，由 GF 选择对应语言的说明，发布正文不再提供语言切换入口。

在 GF 脚本管理页面，将英文源填入**默认附加说明**（当前脚本默认语言为英语），再添加一个**汉语（中国）`zh-CN`** 本地化条目，填入中文源，与 `@name:zh-CN` 对应。不要另建与默认条目重复的英文条目。两项内容格式均选择 **Markdown**。若此前已配置 HTML，请将 `.html` 地址替换为上述 `.md` 地址，并把格式改为 Markdown；提交文件不会自动更改 GF 的设置。

过渡页使用在线 [Tailwind Play CDN](https://tailwindcss.com/docs/installation/play-cdn)（jsDelivr 的 `@tailwindcss/browser@4`），并提供完整的本地兜底 CSS。Tailwind 官方将此运行时定位为开发用途；此处为满足在线 Tailwind 的需求采用它，不引入构建工具。CDN 失败或被页面 CSP 限制时，兜底样式仍可用，且不影响导航时机。CDN 会在 `.cn` 过渡页运行第三方 JavaScript；页面不展示搜索内容，资源请求使用 `no-referrer`，不加载外部 Logo 或字体。

## 验证

无需额外依赖，可执行：

```sh
node --check google-cn-redirect/google-cn-redirect.user.js
node --test google-cn-redirect/tests/redirect.test.cjs
```

测试在模拟浏览器中覆盖 URL 选择、跟踪参数移除、缺失及编码参数、主题事件、后台恢复、防循环和关闭同步。它们不能证明 Google 服务端行为或脚本管理器兼容性。Safari/iOS、Tampermonkey、Violentmonkey 的端到端安装、横幅抑制及 Google 的实际主题响应仍待实测。

另在应用内浏览器检查了临时本地预览，覆盖 Tailwind 正常加载及被 CSP 阻止两种情况。深色配色通过预览强制启用，未进行真实系统主题切换或 Google 结果页实测。

## 许可证

GNU 通用公共许可证第 3 版，或由您选择的任何后续版本（**GPL-3.0-or-later**）。完整正文见仓库 [LICENSE](../LICENSE)。

Copyright (C) 2026 CycleDM
