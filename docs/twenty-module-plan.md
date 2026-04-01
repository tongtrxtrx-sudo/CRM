# Twenty 模块清单

## 目的

- 明确首版基于 Twenty 应该启用哪些模块、弱化哪些模块、禁用哪些模块。
- 避免上游模块一股脑导入后造成首版范围失控。
- 为后续 UI 裁剪、导航裁剪、权限配置和本地扩展提供一份直接可执行的清单。

## 结论摘要

- 首版应以 `Companies`、`People`、`Opportunities`、`Notes`、`Tasks`、Views、Permissions、Workflows、Emails、Files 为主干。
- `Opportunities` 不按 Twenty 默认销售漏斗全量启用，而是强约束为“成交/未成交”。
- `Calendar`、AI 高级能力、Apps、复杂协作或重运营模块不作为首版关键路径。
- 公海规则、未建档联系人策略、WhatsApp/网站聊天接入、ERP 映射属于本地扩展模块。

## 首版直接启用

### 1. Companies

- 作用：作为客户主体对象。
- 原因：本仓库已确认“客户以公司为主体”，Twenty 的 `Companies` 正好承载这一层。
- 首版要求：
  - 保留客户列表和详情页
  - 扩展 ERP 编号、来源渠道、重点标记、客户星级、最近获得时间、最近跟进时间、最近成交时间等字段
  - 第一批实际落地优先走 custom field metadata，而不是硬改缺失的标准对象源码

### 2. People

- 作用：作为联系人主体对象。
- 原因：Twenty 的 `People` 与本仓库“联系人”模型天然接近。
- 首版要求：
  - 扩展 WhatsApp、WeChat、阿里旺旺、Facebook ID 等字段
  - 支持与 Companies 关联
  - 后续为“未建档联系人”策略做本地扩展
  - 第一批实际落地优先走 custom field metadata，而不是硬改缺失的标准对象源码

### 3. Opportunities

- 作用：作为轻量商机对象。
- 原因：首版虽然只需要“成交/未成交”，但仍应复用 Twenty 的机会对象，不从零自建。
- 首版要求：
  - 阶段强约束为“成交/未成交”
  - 不启用完整销售漏斗
  - 保留与 Company 的关联

### 4. Notes

- 作用：承载手工跟进记录和上下文备注。
- 原因：本仓库明确需要手工跟进记录，Twenty 的 `Notes` 可直接承载这类自由文本。
- 首版要求：
  - 在客户、联系人、商机详情中保留
  - 作为跟进沉淀的一部分使用

### 5. Tasks

- 作用：承载销售待办和跟进动作。
- 原因：本仓库需要“谁来继续跟进”的动作分配能力，`Tasks` 是最低成本的落点。
- 首版要求：
  - 只保留基础待办，不扩展成完整项目协作

### 6. Views 与过滤能力

- 作用：用于客户列表、机会列表和分组视图。
- 原因：Twenty 已支持 table、kanban、group by、filters、sort。
- 首版要求：
  - 客户列表优先保留 table view
  - 机会视图按需要保留最简 kanban 或分组视图

### 7. Permissions

- 作用：承载角色和访问边界。
- 原因：本仓库首版就需要系统管理员、销售主管、销售专员、只读角色。
- 首版要求：
  - 优先通过上游权限体系配置落地
  - 特别关注“查看他人客户”“退公海”“分配/转移”等动作权限

### 8. Workflows

- 作用：承载自动提醒、规则触发和后续部分自动化。
- 原因：Twenty 已有工作流触发器和动作能力，适合作为公海提醒等自动化的第一落点。
- 首版要求：
  - 先用于提醒类和简单状态联动
  - 不把全部公海逻辑都押在工作流里

### 9. Emails

- 作用：作为首批重点渠道之一。
- 原因：本仓库已确认邮箱是首批范围，Twenty 文档也说明邮件可以自动关联到 People、Companies、Opportunities。
- 首版要求：
  - 启用邮件相关视图和关联能力
  - 但要增加本地“线索识别/去噪”策略，避免物流和系统邮件污染

### 10. Files

- 作用：承载附件和沟通文档。
- 原因：聊天记录和销售跟进会涉及附件，这类基础能力可以直接复用。
- 首版要求：
  - 仅保留基础文件能力
  - 不扩展成重文档管理系统

## 首版保留但弱化

### 1. Calendar

- 保留原因：Twenty 已有日历与会议历史能力，后续可能有价值。
- 弱化方式：
  - 首版不把它当主流程
  - 先隐藏或降低导航优先级

### 2. Opportunities Pipeline 视图

- 保留原因：上游 pipeline 能力有价值。
- 弱化方式：
  - 阶段数缩到最少
  - 不让它承载复杂跟单编排

### 3. Notes 与 Tasks 的扩展协作能力

- 保留原因：基础记录和待办仍需要。
- 弱化方式：
  - 不扩展复杂团队协作、项目管理或内部知识管理

## 首版隐藏或禁用

### 1. AI 高级能力

- 原因：本仓库已确认 AI 背调、智能话术、自动外呼属于第二阶段。
- 处理方式：
  - 导航隐藏
  - 不纳入 MVP 范围

### 2. Apps 扩展能力

- 原因：Twenty 文档将 Apps 标记为 alpha。
- 处理方式：
  - 不作为首版关键路径
  - 不将公海规则、归属逻辑、渠道接入建立在 Apps 上

### 3. 与前台 CRM 无关的重运营或重协作模块

- 原因：首版目标是前台 CRM，而不是大而全工作平台。
- 处理方式：
  - 只保留直接支撑客户、联系人、商机、跟进的部分
  - 其他非关键模块优先隐藏

## 必须本地扩展

### 1. 公海规则引擎

- 必须本地扩展。
- 原因：
  - 本仓库要参考询盘云实现自动退回、认领、提醒、排除规则
  - 这不是 Twenty 标准 CRM 的默认心智模型
  - 当前第一步已先落共享规则内核：`computeCrmCompanyPoolState`
  - 当前第二步已落服务端适配层：`CompanyPublicPoolService`

### 2. 未建档联系人策略

- 必须本地扩展。
- 原因：
  - 本仓库要求“未建档联系人不受归属保护”
  - 这需要在对象状态、归属规则和流程入口上做专门设计
  - 当前第一步已先落共享规则内核：`getCrmPersonProtectionState`
  - 当前第二步已落服务端适配层：`PersonProtectionService`

### 3. 渠道接入模块

- 必须本地扩展。
- 原因：
  - WhatsApp 和网站聊天不是 Twenty 当前文档里的现成标准主路径
  - 需要本地定义映射、归档和去噪策略

### 4. ERP 映射层

- 必须本地扩展。
- 原因：
  - 本仓库明确 CRM 只管成交前，ERP 仍是成交后事实源
  - 因此需要明确字段映射和最小同步边界

## 实施优先级

1. 启用并验证 `Companies`、`People`、`Permissions`
2. 启用并约束 `Opportunities`
3. 启用 `Notes`、`Tasks`、基础 Views
4. 启用 `Emails` 和 `Files`
5. 在上游基础上接入本地扩展：
   - 公海规则引擎
   - 未建档联系人策略
   - ERP 映射
   - 网站聊天和 WhatsApp
6. 最后再考虑 `Calendar`、AI 和其他高级能力

## 首版导航建议

- 保留：
  - Companies
  - People
  - Opportunities
  - Notes
  - Tasks
  - Workflows
  - Settings / Permissions
  - Emails
- 降级或隐藏：
  - Calendar
  - Apps
  - AI 相关入口
  - 非前台 CRM 必要的其他高阶模块

## 参考来源

- Twenty GitHub README
  - https://github.com/twentyhq/twenty
- Twenty 文档 - Objects
  - https://docs.twenty.com/user-guide/data-model/objects
- Twenty 文档 - Emails and Calendars
  - https://docs.twenty.com/user-guide/collaboration
- Twenty 文档 - Navigate Around Twenty
  - https://docs.twenty.com/user-guide/getting-started/how-tos/navigate-around-twenty
- Twenty 文档 - Permissions
  - https://docs.twenty.com/user-guide/permissions-access/capabilities/permissions
- Twenty 文档 - Workflow Triggers
  - https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers
- Twenty 文档 - Apps
  - https://docs.twenty.com/developers/extend/capabilities/apps
