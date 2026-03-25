# 项目引导流程

新产品或重大功能建议按这个顺序推进。

## 阶段 1 - 头脑风暴

目标：
- 澄清用户、任务、约束、非目标和主要风险

建议提示词：
- 帮我为这个项目做头脑风暴。识别目标用户、核心场景、MVP 范围、非目标、主要风险和待确认问题。

推荐 Codex 模式：
- `planning`

推荐 subagent：
- `Planner`

推荐 skill：
- `defining-requirements`

## 阶段 2 - 确认方向

目标：
- 在编写详细计划或实现规格之前，先确定工作方向

建议提示词：
- 基于头脑风暴，给出 2 到 3 个可行方向，比较权衡，并帮助我确认方向、MVP 边界和非目标，再开始实现规划。

推荐 Codex 模式：
- `planning`

推荐 subagent：
- `Planner`
- 需要本地结构信息时加 `Explorer`

推荐 skill：
- `defining-requirements`
- `repo-analyser`

## 阶段 3 - 简报

目标：
- 将确认后的方向整理成一份简短、可执行的实现简报

建议提示词：
- 把确认后的方向整理成一份简报，包含问题、用户、期望结果、范围内、范围外、约束、验收标准和待确认问题。

推荐产物：
- 使用 `project-brief.template.md` 生成 `docs/brief.md`

推荐 Codex 模式：
- `planning`

推荐 subagent：
- `Planner`

推荐 skill：
- `defining-requirements`

## 阶段 4 - 规格

目标：
- 将架构、流程、需求和验证方式沉淀成一份可持续维护的文档

建议提示词：
- 为这个项目创建一份面向实现的长期规格文档，覆盖架构边界、关键流程、安全约束、验证方式和风险。

推荐产物：
- `specs/mvp.md`
- `specs/security.md`
- `docs/architecture.md`

推荐 Codex 模式：
- `default`
- 只有在需要实时外部资料时切到 `research`
- 只有在推理本身很难时切到 `deepthink`

推荐 subagent：
- `Planner`
- `Explorer`
- 需要外部事实或官方文档时加 `DocsResearcher`

推荐 skill：
- `spec-document-format`
- `api-design`

## 阶段 5 - 仓库初始化

目标：
- 添加仓库级说明和最小本地配置

建议提示词：
- 基于已确认的简报和规格，为这个项目生成最小化的仓库级 `AGENTS.md` 和 `.codex/config.toml`。

推荐产物：
- `AGENTS.md`
- `.codex/config.toml`

推荐 Codex 模式：
- `default`

推荐 subagent：
- `Worker`

推荐 skill：
- `setup-fresh-project`

## 阶段 6 - 构建

目标：
- 按阶段执行已确认的计划，并跟踪任务推进

建议提示词：
- `@build` 基于已确认的简报和规格拆分阶段；只有在这个仓库确实采用 continuity 工作流时才创建连续性文件，然后开始实现。

推荐 Codex 模式：
- `build`

推荐 subagent：
- `Worker`
- 需要影响面分析时加 `Explorer`

推荐 skill：
- bug 修复前先 `systematic-debugging`
- 行为变更优先 `tdd-workflow`

## 阶段 7 - 验证与加固

目标：
- 验证行为、权限、迁移和上线准备情况

建议提示词：
- 对照简报和规格验证实现结果。先给出问题清单，再修复最高风险缺口，并重新运行相关检查。

推荐 Codex 模式：
- 常规验证使用 `default`
- 只读审查使用 `review`

推荐 subagent：
- `Reviewer`
- UI 或浏览器验证时加 `BrowserDebugger`
- 长任务或轮询时加 `Monitor`

推荐 skill：
- `verification-before-completion`
- 风险敏感场景加 `security-review`
- 浏览器场景加 `e2e-testing`
- 真实外部状态验证前先 `testing-safe-protocol`
