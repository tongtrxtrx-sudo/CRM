# Codex 启动清单：CRM

把这个文件当作前几次会话的操作者检查清单。

## 推荐会话顺序

1. 在 `planning` 中做头脑风暴
2. 在 `planning` 中确认工作方向
3. 将结果整理成 `docs/brief.md`
4. 编写 `specs/mvp.md` 和 `docs/architecture.md`
5. 生成仓库级 `AGENTS.md` 和 `.codex/config.toml`
6. 使用 `@build` 开始分阶段实现

## 可直接复制的提示词

### 会话 1 - 头脑风暴

```text
使用 planning profile，帮我为 CRM 做头脑风暴。识别目标用户、核心场景、MVP 范围、非目标、主要风险和待确认问题。
```

### 会话 2 - 确认方向

```text
使用 planning profile，为 CRM 比较 2 到 3 个可行方向。帮助我在编写实现计划前确认方向、MVP 边界和非目标。
```

### 会话 3 - 简报

```text
使用 planning profile，把确认后的方向写成 docs/brief.md，包含问题、用户、期望结果、范围内、范围外、约束、验收标准、风险、假设和待确认问题。
```

### 会话 4 - 规格

```text
基于 docs/brief.md，创建 specs/mvp.md 和 docs/architecture.md。覆盖架构边界、核心流程、安全约束、验证方式和风险。
```

### 会话 5 - 仓库初始化

```text
基于 docs/brief.md 和 specs/mvp.md，生成仓库级 AGENTS.md 和 .codex/config.toml，只保留仓库特有约束和最小本地覆盖项。
```

### 会话 6 - 构建

```text
@build 基于 docs/brief.md 和 specs/mvp.md，将实现拆分为多个阶段；只有在这个仓库本身采用 continuity 工作流时才创建连续性文件，然后从第一个最高价值切片开始。
```

## 使用说明

- 日常开发默认使用 `default`
- 只有在任务需要实时外部资料和更强来源校验时使用 `research`
- 只有在推理本身明显更难时使用 `deepthink`
- 保持 `AGENTS.md` 简短且仓库专属
- 仓库本地 MCP 配置保持最小化，只添加项目确实需要的服务器
