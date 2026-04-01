# Twenty 导入实施步骤

## 目的

- 将当前仓库从“仅有规划文档的定制仓库”推进到“基于 Twenty 上游基线的实际开发仓库”。
- 在保留本仓库现有文档、业务约束和 GitHub 地址的前提下，引入 Twenty 上游代码和上游规则。
- 为后续的裁剪、扩展和上游同步建立稳定路径。

## 推荐路径

- 推荐保留当前仓库 `tongtrxtrx-sudo/CRM` 作为定制仓库。
- 推荐为当前仓库新增 `upstream` 指向 `twentyhq/twenty`，而不是强依赖 GitHub 的 fork UI。
- 推荐以“上游稳定 release/tag 导入 + 本地小步定制”的方式推进，而不是一次性把上游主分支全部揉进本地长期开发。

## 当前执行状态

- 已完成：
  - 已为当前仓库增加 `upstream -> https://github.com/twentyhq/twenty.git`
  - 已选定首次导入基线版本为 `v1.16.0`
  - 已创建导入分支 `codex/twenty-import-v1.16.0`
  - 已将 Twenty `v1.16.0` 上游代码导入当前导入分支，同时保留本地治理文件
  - 已完成第一轮最小模块裁剪
- 当前推荐下一步：
  - 先补齐 Yarn 4.9.2 可用环境，再完成最小启动验证
  - 启动验证通过后再进入第二轮裁剪和本地扩展模块设计

## 为什么推荐这条路径

- 能保留当前仓库已经沉淀的业务文档、提交历史和远端地址。
- 能明确区分：
  - `origin`：你自己的 CRM 定制仓库
  - `upstream`：Twenty 官方仓库
- 便于后续按 release 或 tag 做受控同步，而不是被上游日常变化牵着走。
- 对 Codex 更友好：
  - 日常开发仍在你的仓库完成
  - 但代码结构、模块组织和实现方式直接贴近上游

## 非目标

- 不在导入第一步就完成所有业务定制。
- 不在导入前先写大量本地框架代码。
- 不在 MVP 阶段把公海规则、联系人归属和渠道接入全部重写成独立系统。

## 实施步骤

### 阶段 0 - 冻结当前规划基线

- 目标：
  - 确保当前仓库文档已经足够表达业务约束。
- 当前状态：
  - 已完成 `brief`、`architecture`、`mvp`、`twenty-baseline`、`twenty-gap-analysis`、`twenty-module-plan`。
- 通过标准：
  - 后续所有 Twenty 导入和裁剪都必须先对照这些文档执行。

### 阶段 1 - 建立上游关系

- 操作：
  - 在当前仓库增加 `upstream` remote，指向 `https://github.com/twentyhq/twenty.git`
  - 拉取上游 tags 和主要分支
- 目标：
  - 让当前仓库具备明确的上游同步来源
- 结果：
  - `origin` 继续指向你的 GitHub 仓库
  - `upstream` 指向 Twenty 官方仓库

### 阶段 2 - 选择导入基线版本

- 推荐：
  - 不直接跟 `upstream/main`
  - 选一个明确的稳定 release/tag 作为第一次导入基线
- 原因：
  - 首次导入需要稳定性，而不是最新变化
  - 便于记录“我们从哪个上游版本开始定制”
- 结果：
  - 在文档中记录所选 tag 或 release 版本号

### 当前选择

- 首次导入版本：`v1.16.0`
- 远端 tag 引用：`refs/tags/v1.16.0`
- 当前查询到的 tag 哈希：`4c94e650a74822215d36460eb9c96ddbd049ffad`
- 选择理由：
  - 采用稳定 release/tag，而不是直接跟随 `upstream/main`
  - 便于后续记录“从哪个上游版本开始本地定制”

### 阶段 3 - 以集成分支完成第一次导入

- 推荐分支：
  - `codex/twenty-import-<version>`
- 操作：
  - 从当前仓库新建集成分支
  - 导入选定的 Twenty 上游代码到仓库根目录
  - 保留本仓库已有 `docs/`、`specs/`、`AGENTS.md`、`.codex/` 等本地治理文件
- 目标：
  - 让仓库同时具备：
    - 上游真实代码
    - 本地事实文档和治理规则

### 当前状态

- 该阶段已完成：
  - 上游代码已导入当前分支
  - `docs/`、`specs/`、`AGENTS.md`、`.codex/`、本地 `README.md` 已保留

### 阶段 4 - 保持本地治理文件优先

- 本地优先保留：
  - `AGENTS.md`
  - `.codex/`
  - `docs/`
  - `specs/`
  - `README.md` 中与本仓库业务相关的部分
- 原因：
  - 上游代码提供工程与产品基线
  - 本地文档提供业务裁剪约束
- 原则：
  - 不要让导入过程覆盖本地治理文件

### 阶段 5 - 第一轮裁剪

- 按 `docs/twenty-module-plan.md` 执行首轮裁剪：
  - 启用：
    - Companies
    - People
    - Opportunities
    - Notes
    - Tasks
    - Views
    - Permissions
    - Workflows
    - Emails
    - Files
  - 弱化：
    - Calendar
    - Opportunities Pipeline
    - Notes/Tasks 的扩展协作能力
  - 禁用或隐藏：
    - Apps
    - AI 高级能力
    - 非前台 CRM 必要的重运营模块

### 阶段 6 - 第一轮适配

- 按 `docs/twenty-gap-analysis.md` 做第一轮本地适配：
  - 客户与联系人字段扩展
  - 机会阶段约束为“成交/未成交”
  - 权限角色落地
  - 邮件相关基础能力启用
- 这阶段先不做：
  - 公海规则完整引擎
  - WhatsApp 接入
  - 网站聊天接入
  - ERP 双向同步

### 阶段 7 - 第一轮验证

- 验证重点：
  - 仓库能够基于 Twenty 成功启动
  - 核心对象和列表页可用
  - 权限和模块显隐符合首版策略
  - 本地治理文件未被导入过程破坏
- 验证类型：
  - 安装与启动验证
  - 上游原生命令验证
  - 首版手工 smoke test

### 当前验证结论

- 已确认：
  - 上游代码结构完整导入
  - `packages/twenty-front`、`packages/twenty-server` 等关键工作区存在
  - 本机 `node -v` 为 `v24.13.1`，满足上游 `^24.5.0` 要求
  - 已可通过本地 `.yarn/releases/yarn-4.9.2.cjs` 使用 `yarn@4.9.2`
  - `yarn install` 已可在项目内缓存模式下完成
  - `nx show project twenty-front` 和 `nx show project twenty-ui` 均已可运行
- 当前阻塞：
  - 第一次上游导入不完整，曾缺失 `twenty-shared`、`twenty-ui` 等工作区及根配置文件
  - 经过本地修复后，依赖和项目图已恢复，但 `generateBarrels` 前置脚本运行极慢
  - 当前 `twenty-ui:build` 未能在合理时间内进入 `dist` 产物输出阶段
- 当前结论：
  - 不能声称“已完成最小构建验证”
  - 当前已完成“依赖安装验证”和“Nx 项目图验证”
  - 下一步应聚焦 `generateBarrels` 的性能/执行路径，而不是继续盲等整体 build

### 阶段 8 - 第二轮本地扩展

- 这时再进入本仓库真正的差异化扩展：
  - 公海规则引擎
  - 未建档联系人策略
  - ERP 映射层
  - 网站聊天与 WhatsApp 接入

## 分支策略

- `master`
  - 当前仓库主分支
- `codex/twenty-import-<version>`
  - 首次上游导入分支
- `codex/twenty-trim-<topic>`
  - 模块裁剪分支
- `codex/twenty-local-<topic>`
  - 本地扩展分支

## 上游同步策略

- 不按天追上游。
- 推荐在以下时机同步：
  - 上游重要 release
  - 安全修复
  - 本仓库准备进入下一阶段时
- 同步步骤：
  1. 拉取 `upstream`
  2. 选定目标 tag/release
  3. 新建同步分支
  4. 先处理上游变化
  5. 再回放本地小规模定制
- 关键原则：
  - 本地改动尽量保持小而集中
  - 避免把本地业务规则散落到大量上游文件中

## 成功标准

- 当前仓库能在不丢失本地治理文档的前提下引入 Twenty 上游代码。
- 导入后能明确区分“上游能力”“本地裁剪”“本地扩展”三类内容。
- 导入后的第一个运行版本可以承载：
  - Companies
  - People
  - Opportunities
  - 权限
  - 基础视图
- 后续公海规则和未建档联系人策略可以在真实上游代码基础上继续设计。

## 风险与应对

- 风险：第一次导入过大，导致本地文档与代码失配。
  - 应对：先导入，再做最小裁剪，不在首次导入里叠加太多业务修改。
- 风险：过早跟随上游主分支，导致集成不稳定。
  - 应对：首次导入只选定稳定 release/tag。
- 风险：本地定制过散，后续同步困难。
  - 应对：优先通过配置、字段扩展、导航裁剪和薄层适配解决。
- 风险：把 Apps 当成关键扩展路径。
  - 应对：MVP 不把 Apps 作为关键路径。

## 下一步建议

1. 在 `codex/twenty-import-v1.16.0` 分支执行首次上游代码导入
2. 导入后立即校验本地治理文件未被覆盖
3. 按 `docs/twenty-module-plan.md` 做首轮模块裁剪
4. 跑一次最小启动验证
5. 再进入本地扩展模块设计与实现
