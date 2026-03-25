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
# fill this with the real install command
```

### 本地运行

```bash
# fill this with the real run command
```

### 测试

```bash
# fill this with the real test command
```

## 仓库文档

- [仓库说明](AGENTS.md)
- [项目简报](docs/brief.md)
- [架构说明](docs/architecture.md)
- [Twenty 基线决策](docs/twenty-baseline.md)
- [Twenty 差异清单](docs/twenty-gap-analysis.md)
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
- 在真实命令和目录结构明确后，及时替换本文档中的占位内容。
