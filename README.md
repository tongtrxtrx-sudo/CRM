# CRM

## 项目简介

- 这是一个面向外贸销售团队的前台 CRM 定制仓库，聚焦线索接入、客户归属、跟进沉淀、公海规则和轻量商机。
- 当前决定不从零自研底层框架，而是采用成熟开源 CRM 项目 Twenty 作为上游基线，再按本仓库业务约束做裁剪和扩展。
- 成交前客户关系状态由 CRM 管理，成交后的订单与财务事实继续留在 ERP。

## 当前阶段

- 状态：Planning with upstream baseline selected
- 主要目标：
  - 将本仓库文档与 Twenty 基线对齐，明确保留模块、裁剪模块和本地定制点
  - 在导入或对接上游代码前先锁定差异清单和迁移步骤
- 当前不做：
  - 不继续推进此前的自定义 Next.js + NestJS 绿地框架方案
  - 不在未完成基线裁剪决策前直接开始业务代码实现

## 快速开始

### 安装

```bash
node .yarn/releases/yarn-4.9.2.cjs install
```

### 本地运行

```bash
node .yarn/releases/yarn-4.9.2.cjs nx run twenty-front:build
node .yarn/releases/yarn-4.9.2.cjs --cwd packages/twenty-front run start:mock-backend
node .yarn/releases/yarn-4.9.2.cjs run preview:front
```

### CRM 字段落地

```bash
node .yarn/releases/yarn-4.9.2.cjs run crm:fields:plan
node .yarn/releases/yarn-4.9.2.cjs run crm:fields:apply
node .yarn/releases/yarn-4.9.2.cjs run crm:views:plan
node .yarn/releases/yarn-4.9.2.cjs run crm:views:apply
```

### 测试

```bash
node .yarn/releases/yarn-4.9.2.cjs nx run twenty-shared:build
node .yarn/releases/yarn-4.9.2.cjs nx run twenty-ui:build
node .yarn/releases/yarn-4.9.2.cjs nx run twenty-front:build
```

## 仓库文档

- [仓库说明](AGENTS.md)
- [项目简报](docs/brief.md)
- [架构说明](docs/architecture.md)
- [Twenty 基线决策](docs/twenty-baseline.md)
- [Twenty 差异清单](docs/twenty-gap-analysis.md)
- [Twenty 模块清单](docs/twenty-module-plan.md)
- [Twenty 导入步骤](docs/twenty-import-plan.md)
- [实现规格](specs/mvp.md)
- [Codex 启动清单](docs/codex-kickoff.md)

## 目录概览

- `docs/`：简报、架构、流程和运维说明
- `specs/`：长期维护的实现规格
- `<upstream source>`：后续导入或对接的 Twenty 上游代码
- `<test directory>`：自动化测试

## 开发约定

- 优先在仓库根目录 `AGENTS.md` 中记录仓库特有规则。
- 只在确实需要本地覆盖时使用 `.codex/config.toml`。
- 当前前端 smoke test 推荐入口：
  - 先启动 `packages/twenty-front` 下的 `start:mock-backend`
  - 再从仓库根目录运行 `preview:front`
  - 该入口支持 SPA history fallback，可直接访问 `/welcome`
- 当前第一批 `Company` / `Person` CRM 字段通过 Twenty 的 object metadata custom field 流落地
- `Company` / `Person` 的默认详情页 `Home` 分组已改为吃默认 `Fields` widget 配置，而不是继续把所有 custom fields 统一塞进 `Other`
- `Company` / `Person` 的默认列表列通过 `INDEX` view 的 `viewFields` 脚本化落地，`crm:views:*` 负责 plan/apply
- 已新增第一批共享 CRM 规则内核，位置在 `packages/twenty-shared/src/utils/crm/`
  - `computeCrmCompanyPoolState` 负责退公海与提醒判定
  - `getCrmPersonProtectionState` 负责未建档联系人和公海客户联系人保护判定
