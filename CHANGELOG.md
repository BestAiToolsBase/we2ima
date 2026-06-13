# Changelog

本项目所有重要变更记录于本文件。
All notable changes to this project will be documented in this file.

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/),版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/).

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
