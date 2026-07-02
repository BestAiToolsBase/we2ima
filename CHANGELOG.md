# Changelog

本项目所有重要变更记录于本文件。
All notable changes to this project will be documented in this file.

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/),版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/).

---

## [1.0.2] - 2026-07-02

本次更新聚焦本地客户端导入效率、部分结构文章导入稳定性、导入模式灵活性、扫描可靠性、调试流程、全量重试可靠性和新用户上手体验提示。
This update focuses on local-client import efficiency, WeChat article import stability, import mode flexibility, favorites scanning reliability, debugging workflows, full reprocessing reliability, and first-run onboarding.

### ✨ 新增 / Added

- 快速导入实验功能，可减少单篇文章导入等待时间，同时保留必要等待与重试机制。
  Experimental Fast Import to reduce per-article import waiting time while retaining necessary waits and retries.
- 仅浏览器打开模式：关闭 "启用IMA 导入"功能后，可测试文章定位与浏览器打开链路，不会把文章标记为“已导入 IMA”。
  Browser Open Mode for testing article locating and browser opening without marking articles as imported into IMA when IMA import is disabled.
- 仅浏览器打开模式配置独立历史记录、统计展示与调试额度支持，方便区分“已打开到浏览器”和“已导入 IMA”的文章状态。
  Browser Open Mode configuration separate history, statistics, and debug quota support to distinguish browser-opened articles from real IMA imports.
- 首次启动上手提示弹窗，在使用引导前提示环境准备和首次配置注意事项，并提供飞书使用沟通群入口。
  First-run onboarding readiness dialog with setup reminders and a Feishu user community entry before the usage guide.

### 💡 优化 / Improved

- 快速导入、正常 IMA 导入、仅浏览器打开模式按独立语义运行，减少状态混淆。
  Fast Import, normal IMA import, and Browser Open Mode now run with clearer state separation to reduce mixed records.
- 导入模式拆分为“导入范围”和“处理方式”，可组合“从头开始、从指定位置开始、指定日期范围”、与“跳过已处理和全部处理”等策略。
  Import mode settings now separate import range from processing behavior, allowing combinations of From Top, From Position, Date Range, Skip Processed, and Process All.
- “仅处理新文章”改为独立开关，“从上次中断处继续”改为独立恢复按钮和弹窗，减少模式含义混淆。
  Only New is now an independent switch, while Resume From Last Stop is a separate recovery button and dialog to reduce mode ambiguity.
- 定时任务和全自动任务的启动模式展示与保存逻辑优化，新旧任务配置会按实际执行策略展示。
  Scheduled-task and full-auto-task start mode display and persistence now show both new and legacy task settings according to the actual execution strategy.
- 优化微信公众号部分结构文章导入不稳定问题，降低导入失败概率。
  Optimize the instability of the structure import of some articles on WeChat official account, and reduce the probability of import failure.
- 优化 Chrome 文章窗口识别，减少窗口标题自动定位失败。
  Optimize Chrome article window recognition to reduce automatic window title localization failures.
- 收藏标签扫描逻辑优化，仅包含视频、图片等非文章收藏的标签页会正常结束并继续后续标签，不再误报断连。
  Improved favorites scanning so tags containing only videos, images, or other non-article items finish normally and continue to later tags instead of reporting a disconnect.

### 🐛 修复 / Fixed

- 修复临时导入失败被误标记为永久 Skip 的问题，后续任务可重新尝试。
  Fixed transient import failures being incorrectly saved as permanent Skip states, allowing later retries.
- 修复“从头开始（全部处理）”模式，确保所有历史状态文章都可重新尝试处理，并保持数据库状态归一化。
  Fixed “From Top (Process All)” mode so all historical article states can be retried, and maintain the normalization of the database status.
- 修复“从指定位置开始 + 全部处理”和“指定日期范围 + 全部处理”无法稳定表达或执行的问题。
  Fixed From Position + Process All and Date Range + Process All so these combinations can be represented and executed reliably.
- 修复旧版定时任务、全自动任务和中断恢复记录在新版启动模式下可能展示不一致或执行范围错误的问题。
  Fixed legacy scheduled tasks, full-auto tasks, and resume records that could otherwise display inconsistently or run with the wrong import range after the new start mode model.
- 修复“仅处理新文章”在反向导入、日期范围游标和仅浏览器打开模式下可能提前停止或方向错误的问题。
  Fixed Only New edge cases with reverse direction, date-range cursors, and Browser Open Mode that could stop too early or use the wrong direction.
- 修复全自动子任务空 limit 或非正数参数可能保存后到执行阶段才崩溃的问题。
  Fixed full-auto subtasks saving empty or non-positive limit values that could otherwise fail later during execution.
- 修复导入任务报告弹窗可能被浏览器窗口遮挡的问题，现在弹窗默认置顶显示。
  Fixed the import task report dialog possibly being hidden behind browser windows; it now opens topmost by default.
- 修复多Tag导入模式下，“批次数量”计算层级问题。
  Fixed the issue of calculating the hierarchy of "batch quantity" in multi Tag import mode.
- 修复ima自动定位点击时，鼠标漂移或异常移动导致任务中断。
  Fixed the task interruption caused by mouse drift or abnormal movement during ima automatic positioning and clicking.

### 📝 提示 / Notes

- 仅浏览器打开不代表文章已导入 IMA 知识库。
  Browser Open Mode does not mean the article has been imported into the IMA knowledge base.
- “从上次中断处继续”现在是恢复动作，不再作为普通启动模式保存到定时任务或全自动任务中；旧任务会自动按兼容规则迁移。
  Resume From Last Stop is now a recovery action, not a normal saved start mode for scheduled or full-auto tasks. Legacy tasks are migrated automatically.
- 如需重新处理已导入、Skip、Deleted 或仅浏览器打开过的文章，请在对应导入范围下选择“全部处理”。
  To retry imported, skipped, deleted, or browser-opened-only articles, choose Process All under the desired import range.
- 快速导入属于实验功能，慢加载网页或扩展响应较慢时仍可能触发额外等待或重试。
  Fast Import is experimental; slow-loading pages or delayed extension responses may still trigger extra waits or retries.
- 微信公众号部分结构文章如果遇到插件或页面状态临时超时，会作为本次失败记录，不再默认变成永久跳过；后续可重新运行任务尝试。
  If a newer WeChat article temporarily times out during import, it is treated as a retryable failure instead of a permanent skip.
- 首次使用如果遇到环境配置或插件安装问题，可根据启动提示加入飞书使用沟通群求助。
  If first-time setup or plugin installation is difficult, use the startup prompt to join the Feishu user community for help.
---

## [1.0.1] - 2026-06-12

v1.0 系列首个优化迭代,聚焦扫描稳定性、按日期范围扫描、用户体验及bug修复。
First post-release iteration focused on scan stability, date-range scanning, user experience and bug fixes.

### ✨ 扩展 / Added

- 按日期范围扫描
  Date-range scanning
- 未完成扫描查看与继续(中断后可一键续扫剩余标签)
  Resume incomplete scans (one-click continue on remaining tags)
- 导入任务完成弹出详细报告
  Detailed import-task report on completion
- 支付成功页与种子用户活动新增飞书用户社群二维码
  Lark (Feishu) community QR code on payment success page and seed-user activity
- 软件版本升级提示功能
  Software version upgrade notification feature

### 💡 优化 / Improved

- 扫描延迟可在设置页自由调整(白天/夜间双档)
  Scan delays configurable in Settings (day/night dual-tier)
- 扫描任务中快捷键 (Alt+P 暂停 / Alt+Q 停止)响应优化
  Optimization of shortcut key responses (Alt+P to Pause / Alt+Q to Stop) in scanning tasks
- 设置页布局重构
  Set page layout refactoring
- 慢速扫描延迟随机化
  Slow-scan delays randomized

### 🐛 修复 / Fixed

- 修复“自定义快捷键”即时生效问题
  The issue of "custom shortcut keys" taking immediate effect
- 修复“恢复默认设置”问题
  The issue of 'restoring default settings'
- 修复"按日期范围"模式的 3 类边界判定问题
  3 boundary issues in date-range scanning mode
- 修复多标签增量扫描场景下的早停回归
  Early-stop regression in incremental multi-tag scanning
- 修复"链接"标签在 ima 目录匹配徽章上的显示异常
  "Link" tag's ima-folder matching badge display anomaly
- 修复微信异常退出后任务被误判为"扫描完成"的问题
  Tasks incorrectly marked "scan complete" after abnormal WeChat exit

---

## [1.0.0] - 2026-05-05

首次公开发布 / Initial public release.

- 支持 6 种导入模式
  6 import modes (skip processed, full, resume, position, date range, new only)
- 收藏夹快速扫描与去重
  Fast favorites scan with deduplication
- 智能断点续传,支持暂停/恢复
  Smart resume from breakpoint with pause/resume
- 日期范围筛选导入
  Date-range filtering
- 统计面板与导入历史
  Statistics dashboard and import history
- 中英文双语界面
  Bilingual UI (Chinese / English)
- 纯本地运行,零数据收集
  Pure local operation, zero data collection
