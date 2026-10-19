[English](README.md) | 简体中文

# Userscripts

由 CycleDM 个人开发和维护的油猴用户脚本集合，用于增强网站功能、改善网页使用体验，以及自动化常见网页操作。

脚本以个人需求为导向，可能并不适用于所有用户或环境。各脚本会根据已有的可靠依据，分别说明其与 Tampermonkey、Violentmonkey 等用户脚本管理器的兼容情况。

## 脚本列表

| 脚本 | 简介 | Raw | Greasy Fork |
| --- | --- | --- | --- |
| [Google 中国域名跳转](google-cn-redirect/) | 将 google.cn 跳转到 google.com，保留必要参数，过渡页跟随系统主题 | [Raw](https://raw.githubusercontent.com/cycledm/userscripts/main/google-cn-redirect/google-cn-redirect.user.js) | [Greasy Fork](https://greasyfork.org/scripts/601010) |
| [Steam 商店区域切换](steam-store-region/) | 为未登录的 Steam 商店网页默认添加国区参数，提供区域切换按钮 | [Raw](https://raw.githubusercontent.com/cycledm/userscripts/main/steam-store-region/steam-store-region.user.js) | [Greasy Fork](https://greasyfork.org/scripts/601020) |

## 开发

仓库结构、命名规范、开发及文档维护要求见 [AGENTS.md](AGENTS.md)。

## Greasy Fork 链接同步

[Sync Greasy Fork links](.github/workflows/sync-greasyfork-links.yml) 在每次推送至 `main` 后、每 15 分钟（每小时第 7、22、37、52 分钟）及 Actions 页面手动运行时执行。Push 触发时，在查询 Greasy Fork 前等待 30 秒，为 Webhook 处理预留时间；定时及手动运行不等待。定时任务用于补查上次 Push 之后才发布的条目。GitHub 可能延迟执行，因此不能保证在 15 分钟内更新；需要时可手动运行。Push 的延迟也不能保证 Webhook 已处理完成。

它读取 [cycledm（1647773）](https://greasyfork.org/users/1647773-cycledm) 的公开 API，精确匹配 namespace 及源码中的默认或本地化 `@name`，仅更新两份根索引中的 Greasy Fork 列，以及各脚本双语 README 中带 `greasyfork-link` 标记的区域。新增脚本时请保留这些标记。未匹配或已删除的条目显示“未发布”；重复匹配或 API 响应异常时，在写入任何 README 前失败退出。

工作流仅在同步任务中赋予仓库 `GITHUB_TOKEN` 的 `contents: write` 权限，无需 Greasy Fork 凭据或 Webhook Secret。有实际变化时才将 README 提交至 `main`。分支规则需要允许机器人推送；若同时有其他分支更新，会安全失败，不强制推送。通过 `GITHUB_TOKEN` 创建的提交不会再次触发 Push 工作流。

此任务只发现已经公开发布的链接，不负责发布脚本。Greasy Fork 的 [Webhook](https://greasyfork.org/zh-CN/users/webhook-info) 用于更新已关联匹配 Raw 同步 URL 的脚本，需先发布或导入脚本并配置同步 URL。Webhook 投递与 README 工作流相互独立，Ping 成功不等于脚本更新已成功。

本地检查（仅使用 Python 标准库）：

```sh
python3 -m unittest discover -s .github/automation -p 'test_*.py' -v
python3 .github/automation/sync-greasyfork-links.py --user-id 1647773 --dry-run
```

## 许可证

除非另有明确说明，本仓库采用 GNU 通用公共许可证第 3 版，或由您选择的任何后续版本（**GPL-3.0-or-later**）。GPL v3.0 完整正文见 [LICENSE](LICENSE)。

允许符合许可证要求的商业使用。分发受 GPL 约束的衍生作品时，必须遵守 GPL，包括适用的源代码提供和授权要求。

如果某个脚本使用不同的许可证，其独立的 `LICENSE`、中英文 README 和源码授权声明会说明适用条款。第三方代码保留其必要的版权及许可证声明。

Copyright (C) 2026 CycleDM
