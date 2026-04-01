# Twenty 差异清单

## 目的

- 明确本仓库当前 CRM 需求与 Twenty 上游能力之间的差异。
- 指导后续实现时优先复用上游能力，而不是直接本地重写。
- 为导入 Twenty、裁剪模块和安排开发顺序提供依据。

## 结论摘要

- Twenty 已经具备大量可直接复用的 CRM 通用能力，例如标准对象、列表与看板视图、角色权限、工作流、邮件与文件能力。
- 本仓库当前最需要本地定制的并不是“CRM 基础框架”，而是前台业务规则，尤其是公海规则、未建档联系人策略、轻量商机和渠道接入顺序。
- Twenty 的 `Apps` 扩展能力目前仍处于 alpha，MVP 阶段不应把关键业务能力建立在 Apps 之上，而应优先复用标准能力、配置能力和必要的本地代码改造。

## 可直接复用的上游能力

- 标准对象模型：
  - Twenty 文档显示其标准对象至少包括 `People`、`Company`、`Opportunities`、`Notes`、`Tasks`。
  - 对本仓库而言，`People` 可映射联系人，`Company` 可映射客户，`Opportunities` 可作为轻量商机基础。
- 列表与视图能力：
  - Twenty README 明确支持 filters、sort、group by、kanban 和 table views。
  - 这足以覆盖客户列表、机会列表和基础视图切换需求。
- 权限与角色：
  - Twenty 文档支持对象级、字段级、设置级和动作级权限。
  - 这与本仓库的“系统管理员、销售主管、销售专员、只读角色”方向一致。
- 工作流与自动化：
  - Twenty 文档支持 record created、updated、deleted、manual、schedule、webhook 等触发器。
  - 这为公海扫描、提醒和后续 ERP/Webhook 集成提供了上游基础。
- 邮件、文件和活动相关能力：
  - Twenty README 已明确包含 emails、calendar events、files 等能力。
  - 这说明本仓库不必从零建设活动流基础设施。

## 可通过配置完成的适配

- 联系人与客户的对象命名和字段扩展：
  - Twenty 已支持自定义对象与字段。
  - 本仓库可以优先通过字段扩展补充 ERP 编号、来源渠道、重点标记、客户星级、最近获得时间等字段。
  - 第一批 `Company` / `Person` CRM 字段已决定优先作为 custom fields 落在标准对象上。
- 角色权限细化：
  - 本仓库需要的“谁能看、谁能分配、谁能退公海、谁能发邮件”优先通过 Twenty 的角色权限配置落地。
- 工作流配置：
  - “客户即将退公海前提醒负责人”这类行为优先先尝试用上游工作流实现。
- 标准对象裁剪：
  - 若首版不需要 Notes、Tasks 以外的复杂模块，优先通过导航和权限隐藏，而不是直接删代码。

## 必须本地定制的能力

- 公海规则模型：
  - 本仓库需要的是参考询盘云的可配置公海逻辑，而不是普通 CRM 的线索池。
  - 重点包括自动退回、认领、提前提醒、排除规则，以及按成交状态或客户类型差异化处理。
  - 这部分很可能需要在 Twenty 的对象模型和工作流之上增加本地规则层。
- 未建档联系人策略：
  - 本仓库明确要求“未建档联系人不受归属保护，任何业务员可继续跟进”。
  - Twenty 标准对象本身并不天然表达这一业务边界，需要本地在流程或对象层面加约束。
- 轻量商机：
  - Twenty 的 `Opportunities` 天然偏标准销售漏斗。
  - 本仓库首版只需要“成交/未成交”，因此需要对上游机会阶段做强约束或简化。
- 渠道接入优先级：
  - 本仓库首批只聚焦 `WhatsApp + 邮箱 + 网站聊天 + 手工录入`。
  - Twenty 虽然具备邮件和活动能力，但 WhatsApp 和网站聊天的接入方式、数据映射和归档策略仍需本地定制。
- ERP 映射：
  - 本仓库要保留成交前后边界，成交后事实仍在 ERP。
  - 因此需要本地定义 ERP 编号、同步状态和最小映射字段。

## 首版建议禁用或延后的上游能力

- 复杂销售漏斗与完整机会阶段：
  - 首版只保留“成交/未成交”，不跟随上游完整销售阶段体系。
- 与前台 CRM 范围无关的重运营能力：
  - 非必要的大量营销自动化、复杂 BI、大而全的协作模块都应在首版禁用或隐藏。
- AI 相关高级能力：
  - Twenty 文档已有 AI 能力，但本仓库已经确认这些属于第二阶段，不应进入首版交付。
- Apps 扩展能力：
  - Twenty 文档将 Apps 标记为 alpha。
  - 因此首版不要把关键业务建立在 Apps 之上，尤其不要把公海规则和核心归属逻辑压在 Apps 上。

## 实施优先级

1. 先验证上游对象与权限能否承载本仓库的客户、联系人和角色模型。
2. 再验证工作流能力是否足以承载“退公海提醒”和部分规则触发。
3. 明确轻量商机如何限制为“成交/未成交”。
4. 再处理渠道接入，优先顺序为：
   - 手工录入
   - 邮箱
   - 网站聊天
   - WhatsApp
5. 最后再处理 ERP 映射与第二阶段 AI 能力。

## 对本仓库的直接建议

- 首先不要急着导入所有 Twenty 模块，先做模块对照和禁用清单。
- 首先验证的不是 UI，而是对象模型、权限模型和工作流扩展点。
- 如果上游工作流无法优雅表达公海规则，就将“公海规则引擎”定义为本仓库首个明确的本地扩展模块。
- 在 Apps 仍为 alpha 的前提下，MVP 阶段优先使用上游现有能力与本地代码修改，不把 Apps 作为关键路径。
- 第一批业务实现优先不碰缺失的标准对象源码，而是用元数据脚本把 `Company` / `Person` 的 CRM 字段落到真实对象上。

## 参考来源

- Twenty GitHub README
  - https://github.com/twentyhq/twenty
- Twenty 文档 - Objects
  - https://docs.twenty.com/user-guide/data-model/objects
- Twenty 文档 - Permissions
  - https://docs.twenty.com/user-guide/permissions-access/capabilities/permissions
- Twenty 文档 - Workflow Triggers
  - https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers
- Twenty 文档 - Apps Getting Started
  - https://docs.twenty.com/developers/extend/capabilities/apps
