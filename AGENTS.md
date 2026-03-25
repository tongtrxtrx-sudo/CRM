# 仓库说明

这个仓库用于 CRM 产品的前期规划与后续实现。保持这个文件只描述仓库自身，不重复 `~/.codex/AGENTS.md` 已经覆盖的全局偏好。

## 项目摘要

- 当前仓库处于 greenfield 阶段，先做需求、范围、架构和 MVP 拆解，再进入实现。
- 目标是基于成熟 CRM 上游基线做二次开发和裁剪，而不是从零搭一套自定义框架。
- 当前已确认采用 Twenty 作为上游基线，后续工程结构、模块组织和实现约定优先遵循上游项目，再在本仓库内落业务定制。
- 当前最重要的事实来源是仓库内文档，而不是对话里的临时描述。

## 入口信息

- 安装：
  - 待定。确认技术栈后立即补全。
- 本地运行：
  - 待定。确认应用形态后立即补全。
- 测试：
  - 待定。至少定义一个可执行验证入口后再进入稳定实现阶段。
- Lint / typecheck：
  - 待定。技术栈确定后补全。

## 仓库地图

- [README.md](/D:/work/CRM/README.md)：项目入口说明和启动信息。
- [AGENTS.md](/D:/work/CRM/AGENTS.md)：仓库级工作规则、路由和完成门槛。
- [brief.md](/D:/work/CRM/docs/brief.md)：产品问题、范围、验收标准和待确认问题。
- [architecture.md](/D:/work/CRM/docs/architecture.md)：系统边界、组件划分和关键集成点。
- [codex-kickoff.md](/D:/work/CRM/docs/codex-kickoff.md)：前几次会话的启动清单。
- [guided-project-flow.md](/D:/work/CRM/docs/guided-project-flow.md)：推荐推进顺序。
- [twenty-baseline.md](/D:/work/CRM/docs/twenty-baseline.md)：为何选择 Twenty 作为上游基线，以及本仓库的裁剪策略。
- [mvp.md](/D:/work/CRM/specs/mvp.md)：实现规格和验证要求。

## 规范产物

- 将以下文件视为当前仓库的事实来源：
- [brief.md](/D:/work/CRM/docs/brief.md)
- [architecture.md](/D:/work/CRM/docs/architecture.md)
- [twenty-baseline.md](/D:/work/CRM/docs/twenty-baseline.md)
- [mvp.md](/D:/work/CRM/specs/mvp.md)
- 当 CRM 的实体模型、关键流程、权限模型、集成边界或上游基线策略发生变化时，先更新这些文档，再改代码。

## 仓库级路由

- 需求澄清、MVP 边界、流程拆解：
  - 优先使用 `Planner`
  - 优先使用 `defining-requirements`
- 规格整理、长期文档沉淀：
  - 优先使用 `Planner`
  - 优先使用 `spec-document-format`
- 仓库结构梳理、调用链确认、影响面分析：
  - 优先使用 `Explorer`
- 具体实现、测试补齐、局部修复：
  - 优先使用 `Worker`
- 风险扫描、回归检查、缺测试审查：
  - 优先使用 `Reviewer`
- 浏览器流程、前端页面、E2E 验证：
  - 优先使用 `BrowserDebugger`
  - 需要时使用 `e2e-testing`
- API 契约、资源设计、分页、过滤、错误模型：
  - 优先使用 `api-design`
- Bug、异常行为、失败测试：
  - 先使用 `systematic-debugging`
- 对外系统、真实账号、真实数据、危险验证动作：
  - 先使用 `testing-safe-protocol`
- Git 提交整理、分组 stage、提交信息：
  - 默认在每次回答结束后，如当前轮产生仓库文件更新，自动使用 `Committer` 完成一次非交互提交
  - 若已配置 GitHub 远端，则在提交成功后默认继续推送到远端分支
  - 只有在用户明确表示不要提交/不要推送，或当前轮没有文件更新时才跳过
  - 默认采用轻量流程：主代理先做一次 `git status --short` 边界检查，再交给 `Committer`
  - 若提交范围已明确且无异常文件，不再额外做 `git diff` 级预检查；只有范围不清或存在可疑文件时才升级检查

## 流程矩阵

- 阶段 1 - 头脑风暴：
  - profile：`planning`
  - subagent：`Planner`
  - skills：`defining-requirements`
- 阶段 2 - 确认方向：
  - profile：`planning`
  - subagent：`Planner`，需要本地结构信息时加 `Explorer`
  - skills：`defining-requirements`、`repo-analyser`
- 阶段 3 - 简报：
  - profile：`planning`
  - subagent：`Planner`
  - skills：`defining-requirements`
- 阶段 4 - 规格与架构：
  - profile：`default`
  - subagent：`Planner`、`Explorer`，需要外部事实时加 `DocsResearcher`
  - skills：`spec-document-format`、`api-design`
- 阶段 5 - 仓库初始化：
  - profile：`default`
  - subagent：`Worker`
  - skills：`setup-fresh-project`
- 阶段 6 - 实现：
  - profile：`default`
  - subagent：`Worker`，必要时并行 `Explorer`
  - skills：bug 修复前先 `systematic-debugging`，行为变更优先 `tdd-workflow`
- 阶段 7 - 浏览器与前端验证：
  - profile：`default`
  - subagent：`BrowserDebugger`
  - skills：`e2e-testing`、`testing-safe-protocol`，视觉要求高时加 `frontend-skill`
- 阶段 8 - 审查与加固：
  - profile：`review`
  - subagent：`Reviewer`
  - skills：`security-review`、`verification-before-completion`
- 阶段 9 - 提交整理：
  - profile：`default`
  - subagent：`Committer`
  - skills：无强制 skill，保持 git 操作最小化

## Subagent 技能偏好

- `Planner`：
  - 优先 `defining-requirements`
  - 规格沉淀时加 `spec-document-format`
- `Explorer`：
  - 优先 `repo-analyser`
  - API 边界分析时加 `api-design`
- `Worker`：
  - bug 修复前先 `systematic-debugging`
  - 行为变更优先 `tdd-workflow`
  - 完成前必须走 `verification-before-completion`
- `Reviewer`：
  - 风险审查优先 `security-review`
  - 需要验证 API 契约时加 `api-design`
- `BrowserDebugger`：
  - 优先 `e2e-testing`
  - 涉及真实外部状态时先 `testing-safe-protocol`
  - 页面质量要求高时加 `frontend-skill`
- `DocsResearcher`：
  - 优先官方文档
  - OpenAI 相关优先 `openai-docs`
- `Committer`：
  - 不绑定 skill
  - 负责整理 stage、commit message、非交互提交和必要的远端推送
  - 优先走快速路径：单次状态检查后直接 stage、commit、push；只有提交范围不清时才展开更多检查
- `Monitor`：
  - 不绑定 skill
  - 只负责等待、轮询、读日志和汇报状态

## 上下文优先级

- 在当前 greenfield 阶段，开始任何非平凡工作前，优先读取：
- [brief.md](/D:/work/CRM/docs/brief.md)
- [architecture.md](/D:/work/CRM/docs/architecture.md)
- [twenty-baseline.md](/D:/work/CRM/docs/twenty-baseline.md)
- [mvp.md](/D:/work/CRM/specs/mvp.md)
- [codex-kickoff.md](/D:/work/CRM/docs/codex-kickoff.md)
- 如果后续新增了数据模型、权限模型、集成清单或迁移文档，把它们加入这里。

## 安全边界

- 在系统边界、权限边界、客户数据边界未明确前，不要假设可以访问任何生产系统或真实客户数据。
- 所有外部 CRM、邮件、支付、消息、身份认证和第三方集成都视为高风险边界，接入前必须先写清楚约束。
- 不要把 secrets、账号、真实 API token 或导出的客户数据提交进仓库。

## 完成门槛

- 当新增或调整实体、流程、权限、集成时，必须同步更新：
  - [brief.md](/D:/work/CRM/docs/brief.md)
  - [architecture.md](/D:/work/CRM/docs/architecture.md)
  - [twenty-baseline.md](/D:/work/CRM/docs/twenty-baseline.md)
  - [mvp.md](/D:/work/CRM/specs/mvp.md)
- 当本仓库对 Twenty 的采用方式、裁剪范围或上游同步策略变化时，必须先更新 [twenty-baseline.md](/D:/work/CRM/docs/twenty-baseline.md)。
- 在声称任务完成前，必须提供真实验证证据；如果验证命令尚未建立，需要明确说明缺口。
- 需要提交 git 历史时，优先保持提交小而清晰。
- 若当前轮对仓库文件有更新，回答完成前默认调用 `Committer` 提交一次逻辑清晰的 commit。
- 若仓库已配置 GitHub 远端，自动提交完成后默认推送到对应远端分支。
- 自动提交只覆盖本轮相关修改；无关文件或用户未要求纳入的噪音文件不得顺带提交。
- 默认自动提交流程以速度优先，但保留误提交保护；若工作区只有明确目标文件和已知噪音文件，避免重复复核。
