# PRD｜跨境 OPC 园区 AI 孵化平台

## Cross-border OPC AI Workforce & Incubation Platform

版本：V0.3  
文档类型：产品需求文档 PRD  
适用对象：产品团队、技术团队、外包团队、园区合作方、潜在客户  
核心定位：面向跨境专题 OPC 园区的一人公司 AI 员工平台

---

# 1. 产品一句话定位

**为跨境 OPC 园区提供一套“AI 员工市场 + 一人公司工作台 + 园区运营管理台 + ArkClaw 员工运行时”的 AI 孵化平台，让每个入驻的一人公司都能拥有一支跨境 AI 员工团队。**

更口语化表达：

> 入驻园区，不只是拿到工位和政策，而是直接拥有一支 AI 跨境团队。

---

# 2. 产品背景

## 2.1 OPC 是什么

OPC，即 One Person Company，可以理解为一人公司、超级个体、个人创业公司。

跨境 OPC 常见类型包括：

- Amazon 卖家
- Shopify 独立站卖家
- TikTok Shop 卖家
- Etsy / eBay 卖家
- 外贸 SOHO
- 工厂出海个人销售
- 内容电商创业者
- 跨境代运营个人团队

这些用户通常具备一个共同特点：

> 业务链条很长，但人手很少。

他们需要完成：

```text
选品
找供应商
做利润测算
写 Listing
做内容
做广告
回复客服
处理订单
复盘数据
合规申报
```

但现实中，一个人很难同时承担这么多角色。

---

## 2.2 跨境 OPC 园区的痛点

跨境专题 OPC 园区通常希望吸引跨境创业者、外贸 SOHO、个人卖家和小团队入驻。

但园区常见问题是：

### 对园区运营方

1. 招商卖点不足  
   很多园区仍停留在空间、政策、补贴、培训层面，缺乏差异化。

2. 服务难标准化  
   选品、供应链、财税、物流、合规、店铺运营等服务依赖人工顾问，难复制。

3. 入驻项目进度不可视  
   园区不知道每个 OPC 到底卡在哪一步。

4. 培训和服务脱节  
   培训讲完后，创业者不会落地执行。

5. 园区服务商价值难沉淀  
   财税、物流、知识产权、报关、海外仓等服务商通常是线下对接，缺少平台化承载。

---

### 对入驻 OPC / 一人公司

1. 不知道从哪里开始  
   有想法，但缺少选品、供应链、店铺、内容、广告等完整路径。

2. 不具备完整团队能力  
   一个人需要扮演选品经理、运营、内容、客服、财务、供应链等多个角色。

3. 执行效率低  
   大量时间花在资料整理、文案生成、表格、邮件、调研和重复性操作上。

4. 缺少标准工作流  
   很多 OPC 没有 SOP，靠感觉推进。

5. 缺少低成本专业服务  
   请全职员工或服务商成本高，但完全自己做又不专业。

---

# 3. 产品目标

## 3.1 园区侧目标

为跨境 OPC 园区提供一套 AI 基础设施，帮助园区实现：

- 提升招商吸引力
- 标准化孵化流程
- 可视化入驻项目进度
- 沉淀园区服务数据
- 提升服务商资源转化
- 建立园区差异化品牌

核心价值主张：

> 园区从“提供办公空间和政策服务”，升级为“提供 AI 创业生产力”。

---

## 3.2 OPC 用户侧目标

为入驻的一人公司提供一个 AI 工作台，让用户可以：

- 拥有自己的 AI 员工团队
- 给 AI 员工分配经营任务
- 使用标准跨境创业 Workflow
- 生成结构化交付物
- 管理产品、供应商、店铺、内容等业务资产
- 从 AI 员工库中雇佣更多专业员工

核心价值主张：

> 一个人开公司，一组 AI 员工干活。

---

# 4. 产品整体架构

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    跨境 OPC 园区 AI 孵化平台                         │
│        Cross-border OPC AI Workforce & Incubation Platform           │
└─────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────┐        ┌──────────────────────────────┐
│        园区运营方              │        │        入驻 OPC / 一人公司      │
│  园区管理者 / 孵化器 / 服务商    │        │  跨境卖家 / 外贸 SOHO / 创业者   │
└───────────────┬──────────────┘        └───────────────┬──────────────┘
                │                                       │
                ▼                                       ▼

┌────────────────────────────────┐      ┌────────────────────────────────┐
│        园区运营管理台             │      │        OPC 一人公司工作台         │
│                                │      │                                │
│  - 入驻项目总览                  │      │  - 我的 AI 员工                   │
│  - 活跃 OPC / 项目进度            │      │  - 我的经营任务                   │
│  - 常见需求与卡点                 │      │  - 我的新品项目                   │
│  - 服务商介入提醒                 │      │  - 我的店铺 / 产品 / 供应商资产     │
│  - 园区政策 / 服务使用情况         │      │  - 我的交付物 / 经营日报            │
│  - 成功案例沉淀                  │      │                                │
└───────────────┬────────────────┘      └───────────────┬────────────────┘
                │                                       │
                └──────────────────┬────────────────────┘
                                   ▼

┌─────────────────────────────────────────────────────────────────────┐
│                     AI 员工与任务工作台层                             │
│                    Multica 改造版 / Workforce OS                      │
│                                                                     │
│  Workspace：园区 / 入驻公司 / 店铺 / 品牌                              │
│  Task：经营任务 / 新品任务 / 内容任务 / 客服任务 / 供应商任务             │
│  Agent：AI 员工                                                       │
│  Workflow：标准孵化流程                                                │
│  Output：结构化交付物                                                  │
│                                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ 任务看板     │ │ 员工列表     │ │ 工作流中心   │ │ 交付物中心   │        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼

┌─────────────────────────────────────────────────────────────────────┐
│                         园区 AI 员工库 / Marketplace                  │
│                                                                     │
│  平台官方员工        园区定制员工        服务商员工        第三方认证员工 │
│                                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ 选品经理     │ │ 供应商开发   │ │ Listing专员 │ │ 内容运营     │        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│                                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ 客服专员     │ │ 广告投手     │ │ 财务分析师   │ │ 合规/政策助理 │        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                     雇佣 / 安装 / 实例化到用户工作台
                                │
                                ▼

┌─────────────────────────────────────────────────────────────────────┐
│                         标准 Workflow 模板层                          │
│                                                                     │
│  - 7 天跨境新品冷启动 Workflow                                         │
│  - 30 天 OPC 入驻孵化 Workflow                                         │
│  - 供应商开发 Workflow                                                │
│  - 店铺运营复盘 Workflow                                              │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼

┌─────────────────────────────────────────────────────────────────────┐
│                      ArkClaw 员工运行时层                             │
│                                                                     │
│  每个 AI 员工 = Soul / Role + Skills + Tools + Memory + Permission    │
│                                                                     │
│  - 员工角色 Soul                                                       │
│  - 自定义 Skills                                                       │
│  - 工具调用 / API 调用                                                  │
│  - 定时任务                                                            │
│  - 消息渠道接入                                                         │
│  - 任务执行日志                                                         │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼

┌─────────────────────────────────────────────────────────────────────┐
│                         Skills / Tools 能力层                         │
│                                                                     │
│  跨境业务 Skills + 执行工具 Tools                                      │
│  API Connector / n8n / RPA / Playwright / File Reader / Sheet Writer  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼

┌─────────────────────────────────────────────────────────────────────┐
│                         外部业务系统 / 数据源                          │
│                                                                     │
│  Amazon / Shopify / TikTok Shop / Etsy / eBay                         │
│  1688 / Alibaba.com / 供应商资料 / 物流 / 海外仓                        │
│  TikTok / 小红书 / Instagram / YouTube / Facebook                      │
│  Gmail / Google Sheets / Notion / Airtable / 飞书 / 企微                 │
│  政策库 / 服务商库 / 财税 / 法务 / 知产 / 报关 / 培训资料                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 5. 核心用户角色

## 5.1 园区运营方

包括：

- 园区管理者
- 孵化器运营团队
- 招商团队
- 园区服务商管理人员
- 园区导师 / 顾问

他们关心：

- 入驻企业活跃度
- 项目孵化进度
- 服务需求分布
- 常见卡点
- 政策使用情况
- 成功案例
- 服务商转化

---

## 5.2 入驻 OPC / 一人公司

包括：

- 跨境卖家
- 外贸 SOHO
- TikTok Shop 创业者
- Shopify 独立站创业者
- Amazon 新手卖家
- 内容电商创业者
- 小型跨境团队

他们关心：

- 怎么快速开始
- 怎么选品
- 怎么找供应商
- 怎么写 Listing
- 怎么做内容
- 怎么回复客户
- 怎么算利润
- 怎么复盘运营数据

---

## 5.3 园区服务商

包括：

- 物流服务商
- 报关服务商
- 海外仓服务商
- 财税服务商
- 法务服务商
- 知识产权服务商
- 平台代运营服务商
- 培训机构
- 支付 / 收款服务商

他们关心：

- 如何触达到入驻 OPC
- 如何把服务标准化
- 如何获得精准需求
- 如何通过 AI 员工形式提供服务入口

---

## 5.4 平台管理员

包括：

- 产品运营人员
- 技术运维人员
- AI 员工配置人员
- Skill 管理人员
- 审核人员

他们关心：

- 员工模板管理
- Skill 上架审核
- 用户权限
- 园区配置
- 数据安全
- 系统可用性

---

# 6. 核心产品概念

## 6.1 Workspace

Workspace 是用户的一人公司空间。

可以对应：

- 园区
- 入驻公司
- 店铺
- 品牌
- 项目

例如：

```text
园区：杭州跨境 OPC 园区
入驻公司：CJ Global Studio
店铺：PetCare Shopify Store
项目：美国宠物饮水机新品项目
```

---

## 6.2 Agent / AI 员工

AI 员工是平台的核心对象。

一个 AI 员工不是单个 Prompt，而是一个完整配置包：

```text
AI 员工 = Soul / Role + Skills + Tools + Workflow + Memory + Permission + Output Template
```

例如：

```text
员工：Amazon Listing 专员

Soul：
你是一个面向跨境 OPC 卖家的 Amazon Listing 优化专家。

Skills：
- 竞品 Listing 拆解
- 关键词提取
- 标题生成
- 五点描述生成
- 合规词检查

Tools：
- 文件读取
- 表格写入
- Web 查询
- 可选 Amazon SP-API
- 可选 RPA Worker

Output：
- Listing 优化报告
- 标题方案
- 五点描述
- Search Terms
- 风险词提醒
```

---

## 6.3 Skill

Skill 是 AI 员工的专业能力单元。

例如：

- 市场机会分析 Skill
- 竞品拆解 Skill
- 供应商筛选 Skill
- 询盘话术 Skill
- Listing 生成 Skill
- 内容日历 Skill
- 客服回复 Skill
- 利润测算 Skill
- 园区政策问答 Skill

---

## 6.4 Tool

Tool 是员工真正执行任务的工具接口。

例如：

- API Connector
- n8n Workflow
- RPA / Playwright Worker
- File Reader
- Sheet Writer
- OCR / Vision
- Browser Automation
- Gmail API
- Shopify API

---

## 6.5 Workflow

Workflow 是多个 AI 员工协作完成的标准业务流程。

例如：

```text
7 天跨境新品冷启动 Workflow
├── 选品经理：市场机会分析
├── 供应商开发专员：供应商筛选与询盘
├── 财务分析师：利润测算
├── Listing 专员：商品页文案
├── 内容运营：内容日历
└── 广告投手：广告启动建议
```

---

## 6.6 Marketplace / 员工库

员工库不是普通插件市场，而是园区的 AI 员工供给中心。

员工来源包括：

- 平台官方员工
- 园区定制员工
- 服务商员工
- 第三方认证员工

第一阶段建议只开放官方员工和园区定制员工，不开放任意第三方上传。

---

# 7. 核心用户流程

## 7.1 OPC 用户入驻流程

```text
用户注册 / 园区邀请
        ↓
选择业务类型
        ↓
创建一人公司 Workspace
        ↓
系统自动推荐 AI 员工团队
        ↓
用户进入工作台
        ↓
启动第一个 Workflow
```

业务类型包括：

- Amazon 卖家
- Shopify 独立站
- TikTok Shop
- 外贸 SOHO
- 多平台卖家

---

## 7.2 用户雇佣 AI 员工流程

```text
进入园区 AI 员工库
        ↓
查看员工能力、示例交付物、所需权限
        ↓
点击“雇佣 / 安装”
        ↓
系统将员工模板实例化到用户 Workspace
        ↓
绑定用户数据、权限和工具
        ↓
员工出现在“我的 AI 员工”列表
```

注意：

Marketplace 中的是员工模板。  
用户雇佣后，必须生成用户自己的员工实例。

```text
员工模板：Listing 专员
用户 A 雇佣后：用户 A 的 Listing 专员
用户 B 雇佣后：用户 B 的 Listing 专员
```

不同用户的数据、记忆、授权必须隔离。

---

## 7.3 用户创建任务流程

```text
用户进入任务看板
        ↓
创建经营任务
        ↓
选择任务类型
        ↓
选择 AI 员工
        ↓
填写任务信息 / 上传资料
        ↓
提交任务
        ↓
AI 员工执行
        ↓
返回结构化交付物
        ↓
用户确认 / 修改 / 派生新任务
```

---

## 7.4 Workflow 执行流程

```text
用户选择 Workflow
        ↓
填写项目基础信息
        ↓
系统自动拆解子任务
        ↓
分配给不同 AI 员工
        ↓
员工逐步执行
        ↓
需要人工确认时提醒用户
        ↓
全部任务完成
        ↓
生成项目完整交付包
```

---

## 7.5 园区查看项目进度流程

```text
园区运营方进入管理台
        ↓
查看入驻 OPC 总览
        ↓
查看各项目当前阶段
        ↓
识别卡点和服务需求
        ↓
安排服务商 / 导师介入
        ↓
沉淀成功案例
```

---

# 8. 功能需求

---

# 8.1 园区运营管理台

## 8.1.1 入驻项目总览

### 功能说明

园区运营方可以查看所有入驻 OPC 的项目情况。

### 页面内容

- 入驻 OPC 数量
- 活跃 OPC 数量
- 新增项目数
- 正在执行的 Workflow 数
- 已完成交付物数
- 高风险 / 卡点项目数

### 数据字段

| 字段 | 说明 |
|---|---|
| OPC 名称 | 入驻一人公司名称 |
| 所属行业 | 跨境电商 / 外贸 / 内容电商等 |
| 当前阶段 | 选品 / 供应链 / Listing / 内容 / 广告 / 复盘 |
| 活跃度 | 最近 7 天任务数 |
| 已雇佣员工 | 用户安装的 AI 员工数量 |
| 当前卡点 | 系统识别或用户标记的卡点 |
| 需要介入 | 是否需要园区服务商介入 |

---

## 8.1.2 项目进度看板

### 功能说明

按项目查看孵化进度。

### 阶段示例

```text
第 1 阶段：定位与选品
第 2 阶段：供应链与店铺准备
第 3 阶段：Listing / 内容 / 广告冷启动
第 4 阶段：数据复盘与优化
```

### 状态

- 未开始
- 进行中
- 等待用户确认
- 等待服务商介入
- 已完成
- 已暂停

---

## 8.1.3 常见需求与卡点分析

### 功能说明

统计入驻 OPC 高频需求和卡点，帮助园区优化服务。

### 示例指标

- 最常被使用的 AI 员工
- 最常启动的 Workflow
- 最常见卡点
- 最多用户咨询的问题
- 高频服务商需求
- 高频政策问题

---

## 8.1.4 服务商介入提醒

### 功能说明

当系统发现项目需要人工服务时，自动提醒园区。

### 触发条件示例

- 用户多次询问报关问题
- 用户需要海外仓推荐
- 用户需要注册公司 / 财税服务
- 用户需要知识产权检索
- 用户需要 TikTok Shop 入驻辅导
- 用户需要物流报价

---

## 8.1.5 园区政策 / 服务使用情况

### 功能说明

统计园区政策、服务商资源和培训资料的使用情况。

### 数据示例

- 政策问答调用次数
- 财税服务咨询次数
- 物流服务咨询次数
- 知识产权服务咨询次数
- 培训资料阅读次数
- 服务商线索转化数

---

# 8.2 OPC 一人公司工作台

## 8.2.1 我的 AI 员工

### 功能说明

展示当前用户已雇佣的 AI 员工。

### 员工卡片字段

| 字段 | 说明 |
|---|---|
| 员工名称 | 如选品经理、Listing 专员 |
| 员工类型 | 官方 / 园区定制 / 服务商 / 第三方 |
| 擅长任务 | 该员工能执行的任务 |
| 当前状态 | 空闲 / 执行中 / 等待确认 / 停用 |
| 已完成任务数 | 历史执行情况 |
| 所需权限 | 该员工可访问的数据和工具 |
| 最近输出 | 最近一次交付物 |

---

## 8.2.2 我的经营任务

### 功能说明

用户可以创建、分配、查看和管理经营任务。

### 任务状态

- 待分配
- 待执行
- 执行中
- 等待确认
- 已完成
- 已取消
- 执行失败

### 任务类型

- 新品任务
- 内容任务
- Listing 任务
- 供应商任务
- 客服任务
- 广告任务
- 财务任务
- 园区服务任务

---

## 8.2.3 我的新品项目

### 功能说明

以项目为单位管理跨境新品冷启动。

### 项目信息

| 字段 | 说明 |
|---|---|
| 项目名称 | 如美国宠物饮水机项目 |
| 目标市场 | 美国 / 欧洲 / 东南亚等 |
| 目标平台 | Amazon / Shopify / TikTok Shop |
| 预算 | 启动预算 |
| 产品方向 | 用户输入或 AI 推荐 |
| 当前阶段 | 选品 / 供应商 / Listing / 内容 / 广告 |
| 项目负责人 | 用户本人 |
| 协作 AI 员工 | 参与该项目的员工 |

---

## 8.2.4 我的资产

### 功能说明

沉淀用户的一人公司业务资产。

### 资产类型

- 店铺资产
- 产品资料
- 供应商资料
- 竞品链接
- 内容素材
- Listing 文案
- 客服话术
- 财务测算表
- 园区服务资料

---

## 8.2.5 我的交付物

### 功能说明

展示 AI 员工生成的结构化交付物。

### 交付物类型

- 市场机会报告
- 竞品分析表
- 供应商对比表
- 利润测算表
- Listing 优化报告
- 内容日历
- 客服回复模板
- 广告启动建议
- 经营日报
- 项目复盘报告

---

# 8.3 AI 员工库 / Marketplace

## 8.3.1 员工分类

### 第一阶段员工分类

```text
平台官方员工
园区定制员工
服务商员工
```

### 第二阶段扩展

```text
第三方认证员工
个人创作者员工
行业专家员工
```

---

## 8.3.2 首批 AI 员工

### 1. 跨境选品经理

职责：

- 分析市场机会
- 评估竞争强度
- 判断产品潜力
- 输出选品评分

Skills：

- 市场机会分析 Skill
- 竞品拆解 Skill
- 利润初算 Skill
- 平台适配 Skill

输出：

- 选品机会报告
- 产品评分表
- 风险提醒
- 下一步建议

---

### 2. 供应商开发专员

职责：

- 生成供应商筛选标准
- 生成 1688 / Alibaba 搜索关键词
- 生成询盘话术
- 整理供应商对比表

Skills：

- 供应商筛选 Skill
- 询盘话术 Skill
- 供应商风险分析 Skill
- 表格生成 Skill

输出：

- 供应商开发清单
- 询盘邮件 / 私信
- 供应商对比表
- 采购风险提醒

---

### 3. Listing 专员

职责：

- 优化 Amazon / Shopify 商品页
- 生成标题、五点描述、产品描述
- 生成关键词和 Search Terms
- 提醒风险词

Skills：

- 竞品 Listing 拆解 Skill
- 关键词提取 Skill
- 标题生成 Skill
- 五点描述生成 Skill
- 合规检查 Skill

输出：

- Listing 优化报告
- 标题方案
- 五点描述
- Search Terms
- A+ 页面建议

---

### 4. 内容运营

职责：

- 生成 TikTok / 小红书 / Instagram 内容计划
- 生成短视频脚本
- 生成内容日历
- 生成社媒文案

Skills：

- 内容日历 Skill
- 短视频脚本 Skill
- 爆款 Hook Skill
- 多平台文案 Skill

输出：

- 30 天内容日历
- 短视频脚本
- 社媒文案
- 达人合作私信

---

### 5. 客服专员

职责：

- 生成英文客服回复
- 处理差评回复
- 处理退款 / 退货沟通
- 判断是否需要人工介入

Skills：

- 客服回复 Skill
- 退款政策判断 Skill
- 差评安抚 Skill
- 人工升级 Skill

输出：

- 客服回复建议
- 风险等级
- 处理动作建议
- 人工介入提醒

---

### 6. 广告投手

职责：

- 生成冷启动广告建议
- 分析广告数据
- 提出优化方向
- 生成测试计划

Skills：

- 广告结构建议 Skill
- 预算分配 Skill
- 关键词广告 Skill
- 数据复盘 Skill

输出：

- 广告启动计划
- 预算建议
- 测试方案
- 优化建议

---

### 7. 财务利润分析师

职责：

- 测算售价、成本、毛利
- 计算盈亏平衡点
- 分析物流、平台佣金、广告成本影响

Skills：

- 利润测算 Skill
- 成本拆解 Skill
- 定价建议 Skill
- 盈亏平衡分析 Skill

输出：

- 利润测算表
- 定价建议
- 成本结构
- 风险提醒

---

### 8. 合规 / 园区政策助理

职责：

- 回答园区政策
- 匹配服务商资源
- 提醒商标、知识产权、报关、财税问题
- 引导服务商介入

Skills：

- 园区政策问答 Skill
- 服务商推荐 Skill
- 合规风险提醒 Skill
- 政策资料检索 Skill

输出：

- 政策解释
- 服务商推荐
- 合规提醒
- 办理材料清单

---

## 8.3.3 员工详情页

每个员工详情页需要展示：

- 员工名称
- 员工头像 / 图标
- 员工介绍
- 适合用户
- 能做什么
- 不能做什么
- 所需权限
- 示例输入
- 示例输出
- 可用 Skills
- 价格 / 套餐
- 评分 / 使用次数
- 安装按钮

---

# 8.4 Workflow 模板

## 8.4.1 7 天跨境新品冷启动 Workflow

### 目标

帮助用户从一个产品方向出发，在 7 天内完成市场判断、供应商开发、利润测算、Listing 和内容计划。

### 输入

- 产品方向
- 目标市场
- 目标平台
- 启动预算
- 目标售价
- 已有资料 / 竞品链接

### 流程

```text
第 1 步：市场机会分析
负责员工：选品经理

第 2 步：竞品拆解
负责员工：选品经理 / Listing 专员

第 3 步：供应商筛选与询盘
负责员工：供应商开发专员

第 4 步：利润测算
负责员工：财务利润分析师

第 5 步：Listing 生成
负责员工：Listing 专员

第 6 步：内容日历生成
负责员工：内容运营

第 7 步：广告启动建议
负责员工：广告投手
```

### 输出

- 市场机会报告
- 竞品分析表
- 供应商筛选标准
- 询盘话术
- 利润测算表
- Listing 草稿
- 30 天内容日历
- 广告启动建议
- 下一步行动计划

---

## 8.4.2 30 天 OPC 入驻孵化 Workflow

### 目标

帮助园区对入驻 OPC 进行标准化孵化。

### 流程

```text
第 1 周：定位与选品
第 2 周：供应链与店铺准备
第 3 周：Listing / 内容 / 广告冷启动
第 4 周：数据复盘与优化
```

### 园区侧价值

- 可查看每个入驻者当前阶段
- 可识别卡点
- 可安排服务商介入
- 可沉淀成功案例

---

## 8.4.3 供应商开发 Workflow

### 输入

- 产品关键词
- 目标价格
- 采购数量
- 目标市场
- 平台要求

### 输出

- 供应商筛选标准
- 搜索关键词
- 询盘话术
- 供应商对比表模板
- 风险提醒

---

## 8.4.4 店铺运营复盘 Workflow

### 输入

- 店铺数据
- 广告数据
- 订单数据
- 内容数据
- 客服问题

### 输出

- 经营复盘报告
- 问题诊断
- 优先级建议
- 下周行动计划

---

# 8.5 ArkClaw 员工运行时

## 8.5.1 定位

ArkClaw 不作为普通 ECS 使用，而作为 AI 员工运行时。

```text
Multica / 工作台：负责任务、员工、进度、交付物
ArkClaw：负责员工执行、Skill 调用、工具调用、消息渠道
外部服务：负责复杂业务执行、API、RPA、数据处理
```

---

## 8.5.2 员工构成

每个 ArkClaw 员工由以下内容组成：

```text
Soul / Role：员工身份和行为边界
Skills：员工专业能力
Tools：外部工具和 API
Memory：用户偏好、项目上下文
Permission：权限边界
Output Template：结构化交付物模板
```

---

## 8.5.3 ArkClaw 二次开发方式

### 方式一：角色配置

用于定义员工身份。

例如：

```text
你是一个面向跨境 OPC 卖家的供应商开发专员。
你的目标是帮助用户找到合适的中国供应商。
你不能承诺供应商真实性，必须提醒用户人工复核。
输出必须包含供应商筛选标准、询盘话术和风险提醒。
```

---

### 方式二：Skill 开发

用于封装专业能力。

例如：

```text
supplier_sourcing_skill
listing_generation_skill
profit_calculation_skill
content_calendar_skill
customer_reply_skill
```

---

### 方式三：Tool / API 调用

用于连接外部系统。

例如：

```text
ArkClaw Skill
    ↓
你的业务中间服务 API
    ↓
Shopify / Amazon / 1688 / Gmail / Sheets / RPA
```

---

### 方式四：终端深度定制

ArkClaw 可理解为带 OpenClaw 环境的专属 Agent ECS。

可用于：

- 开发 Skill
- 调试脚本
- 安装依赖
- 查看日志
- 连接 TOS
- 做轻量任务

不建议用于：

- 主业务后端
- 多租户数据库
- 大规模 RPA 集群
- 长期对外暴露服务
- SaaS 核心服务

---

# 8.6 Skills / Tools 能力层

## 8.6.1 跨境业务 Skills

### 市场机会分析 Skill

输入：

- 产品方向
- 目标市场
- 价格区间
- 平台

输出：

- 市场需求判断
- 竞争强度
- 用户画像
- 机会评分
- 风险提醒

---

### 竞品拆解 Skill

输入：

- 竞品链接
- 产品关键词
- 平台类型

输出：

- 竞品标题
- 卖点拆解
- 定价区间
- 评论痛点
- 差异化机会

---

### 供应商筛选 Skill

输入：

- 产品需求
- 目标价格
- 采购数量
- 质量要求

输出：

- 供应商筛选标准
- 搜索关键词
- 询盘问题清单
- 风险提醒

---

### Listing 生成 Skill

输入：

- 产品资料
- 竞品资料
- 目标关键词
- 平台

输出：

- 标题
- 五点描述
- 产品描述
- Search Terms
- A+ 页面建议
- 风险词提醒

---

### 内容日历 Skill

输入：

- 产品
- 目标平台
- 用户画像
- 品牌风格

输出：

- 30 天内容日历
- 短视频标题
- 脚本
- Hook
- CTA

---

### 利润测算 Skill

输入：

- 采购价
- 运费
- 平台佣金
- 广告预算
- 售价

输出：

- 毛利率
- 净利率
- 盈亏平衡点
- 定价建议
- 风险项

---

### 园区政策问答 Skill

输入：

- 用户问题
- 园区政策库
- 服务商资料

输出：

- 政策解释
- 材料清单
- 适用条件
- 推荐服务商
- 下一步动作

---

## 8.6.2 执行 Tools

### API Connector

用于连接：

- Shopify API
- Amazon SP-API
- TikTok Shop API
- Gmail API
- Google Sheets API
- 园区内部系统 API

---

### n8n Workflow

用于自动化：

- 邮件发送
- 表格写入
- 通知提醒
- 数据同步
- CRM 记录
- 服务商线索流转

---

### RPA / Playwright Worker

用于没有稳定 API 的平台操作。

适合：

- 浏览器自动化
- 后台页面操作
- 截图留痕
- 表单填写
- 信息抓取

注意：高风险操作必须人工确认。

---

### File Reader / Sheet Writer

用于读取和写入：

- Excel
- CSV
- Google Sheets
- PDF
- Markdown
- Word

---

# 9. 权限与安全设计

## 9.1 权限原则

所有 AI 员工必须遵循最小权限原则。

```text
员工只能访问完成任务所需的数据和工具。
员工不能默认执行高风险操作。
员工不能默认修改店铺、发邮件、付款、下单。
```

---

## 9.2 员工权限声明

每个员工详情页必须展示：

- 需要读取哪些数据
- 需要写入哪些数据
- 是否会调用外部 API
- 是否会使用 RPA
- 是否会发送消息 / 邮件
- 是否需要人工确认

---

## 9.3 高风险操作

以下操作必须用户确认：

- 修改商品 Listing
- 发送客户邮件
- 发送供应商询盘
- 提交退款
- 调整广告预算
- 下单采购
- 提交财务 / 法务资料
- 操作店铺后台

---

## 9.4 日志与审计

必须记录：

- 谁创建了任务
- 哪个员工执行
- 调用了哪些 Skill
- 调用了哪些 Tool
- 访问了哪些数据
- 输出了什么结果
- 用户是否确认执行
- 执行是否成功

---

## 9.5 多租户隔离

不同园区、不同 OPC、不同员工实例的数据必须隔离。

要求：

```text
园区 A 不能访问园区 B 数据
OPC A 不能访问 OPC B 数据
用户 A 的 Listing 专员不能访问用户 B 的资料
第三方员工不能默认访问用户敏感数据
```

---

# 10. MVP 范围

## 10.1 MVP 目标

验证以下核心假设：

> 跨境 OPC 用户愿意在一个工作台中使用 AI 员工完成新品冷启动任务；园区方愿意将其作为孵化和招商工具。

---

## 10.2 MVP 必做模块

### 用户侧

- OPC 注册 / 登录
- 创建 Workspace
- 我的 AI 员工
- 任务看板
- 新品项目
- Workflow 启动
- 交付物中心

### 园区侧

- 园区项目总览
- 入驻 OPC 列表
- 项目进度看板
- 常见卡点统计
- 服务商介入提醒，MVP 可先做手动标记

### 员工库

- 5 个官方员工
- 员工详情页
- 雇佣 / 安装
- 员工实例化

### Workflow

- 7 天跨境新品冷启动 Workflow
- 供应商开发 Workflow

### ArkClaw 集成

- 至少打通 1 个 ArkClaw 员工执行链路
- 支持任务发送
- 支持结果返回
- 支持日志记录

### Skills

MVP 先做：

- 市场机会分析 Skill
- 供应商筛选 Skill
- Listing 生成 Skill
- 内容日历 Skill
- 利润测算 Skill

---

## 10.3 MVP 首批 AI 员工

第一版建议只做 5 个：

```text
1. 选品经理
2. 供应商开发专员
3. Listing 专员
4. 内容运营
5. 财务利润分析师
```

暂不做：

- 客服 RPA
- 广告自动投放
- 自动上架
- 自动发邮件
- 自动下单采购

原因：

这些操作风险较高，需要 API、权限、平台合规和人工确认机制。

---

## 10.4 MVP 不做内容

第一阶段不做：

- 完整开放第三方 Marketplace
- 创作者分成
- 多园区复杂分账
- 自动支付结算
- Amazon / Shopify 深度写入
- 大规模 RPA 自动化
- 多语言复杂客服自动执行
- 私有化部署

---

# 11. 技术架构建议

## 11.1 推荐开源组合

```text
用户工作台：Multica fork / 改造
员工运行时：ArkClaw / OpenClaw
员工库：自研 Marketplace + AgentRegistry 思路
工作流：自研简单 Workflow / 后续接 n8n
RPA：Playwright Worker
任务队列：Redis / BullMQ / Celery
数据库：PostgreSQL
文件存储：MinIO / TOS
权限系统：Logto / Keycloak / 自研
LLM 观测：Langfuse
系统监控：Grafana / OpenTelemetry
```

---

## 11.2 系统模块

```text
frontend-app
admin-dashboard
marketplace-service
workspace-service
task-service
agent-service
workflow-service
arkclaw-bridge-service
skill-service
tool-service
asset-service
permission-service
audit-log-service
notification-service
```

---

## 11.3 ArkClaw Bridge

这是核心服务。

职责：

```text
Multica Task
    ↓
ArkClaw Bridge
    ↓
ArkClaw Employee
    ↓
Skill Execution
    ↓
Result Callback
    ↓
Task Output
```

需要支持：

- 创建 ArkClaw 任务
- 传入员工配置
- 传入任务上下文
- 接收执行日志
- 接收执行结果
- 写回任务状态
- 处理失败和重试

---

# 12. 数据模型草案

## 12.1 users

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 用户 ID |
| name | string | 用户名 |
| email | string | 邮箱 |
| role | string | 用户角色 |
| created_at | datetime | 创建时间 |

---

## 12.2 parks

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 园区 ID |
| name | string | 园区名称 |
| type | string | 跨境专题园区 |
| owner_id | string | 园区管理员 |
| created_at | datetime | 创建时间 |

---

## 12.3 workspaces

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | Workspace ID |
| park_id | string | 所属园区 |
| owner_id | string | OPC 用户 |
| name | string | 一人公司名称 |
| business_type | string | Amazon / Shopify / TikTok |
| created_at | datetime | 创建时间 |

---

## 12.4 agent_templates

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 员工模板 ID |
| name | string | 员工名称 |
| category | string | 员工类别 |
| description | text | 员工介绍 |
| soul_prompt | text | 角色设定 |
| skills | json | Skill 列表 |
| tools | json | Tool 列表 |
| permissions | json | 权限声明 |
| output_schema | json | 输出模板 |
| source_type | string | 官方 / 园区 / 服务商 |
| status | string | 上架 / 下架 / 审核中 |

---

## 12.5 agent_instances

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 员工实例 ID |
| template_id | string | 来源模板 |
| workspace_id | string | 所属 Workspace |
| name | string | 员工实例名称 |
| config | json | 用户级配置 |
| memory | json | 员工记忆 |
| status | string | 启用 / 停用 |
| created_at | datetime | 创建时间 |

---

## 12.6 tasks

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 任务 ID |
| workspace_id | string | 所属 Workspace |
| project_id | string | 所属项目 |
| title | string | 任务标题 |
| type | string | 任务类型 |
| assigned_agent_id | string | 分配员工 |
| status | string | 状态 |
| input | json | 输入内容 |
| output | json | 输出结果 |
| created_by | string | 创建人 |
| created_at | datetime | 创建时间 |

---

## 12.7 workflows

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | Workflow ID |
| name | string | 名称 |
| description | text | 描述 |
| steps | json | 步骤 |
| required_agents | json | 所需员工 |
| output_schema | json | 输出模板 |

---

## 12.8 task_runs

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 执行 ID |
| task_id | string | 任务 ID |
| agent_id | string | 员工 ID |
| arkclaw_run_id | string | ArkClaw 执行 ID |
| status | string | 执行状态 |
| logs | json | 执行日志 |
| started_at | datetime | 开始时间 |
| finished_at | datetime | 完成时间 |

---

# 13. 页面结构

## 13.1 OPC 用户端

```text
首页 / Dashboard
├── 我的 AI 员工
├── 我的任务
├── 我的新品项目
├── 我的 Workflow
├── 员工库
├── 交付物中心
├── 我的资产
└── 设置 / 授权
```

---

## 13.2 园区运营端

```text
园区管理台
├── 总览 Dashboard
├── 入驻 OPC 管理
├── 项目进度
├── 服务需求
├── AI 员工使用情况
├── Workflow 使用情况
├── 服务商管理
├── 政策知识库
└── 成功案例
```

---

## 13.3 平台管理端

```text
平台后台
├── 园区管理
├── 用户管理
├── 员工模板管理
├── Skill 管理
├── Tool 管理
├── Workflow 管理
├── 审核管理
├── 日志审计
└── 系统配置
```

---

# 14. 商业模式

## 14.1 园区 SaaS 订阅

按园区收取平台费用。

示例：

```text
基础版：
- 100 个 OPC 账号
- 5 个官方员工
- 2 个 Workflow
- 基础园区看板

专业版：
- 500 个 OPC 账号
- 10 个官方员工
- 5 个 Workflow
- 服务商管理
- 园区知识库

定制版：
- 白标部署
- 园区定制员工
- 私有化部署
- 定制 Workflow
- 服务商系统集成
```

---

## 14.2 AI 员工增值

用户或园区可以购买高级员工。

例如：

- 高级广告投手
- 客服自动化专员
- 供应商开发高级版
- Shopify 转化率顾问
- Amazon 账号健康顾问

---

## 14.3 服务商 Marketplace

后期可开放服务商员工。

例如：

- 物流顾问 Agent
- 财税顾问 Agent
- 知识产权顾问 Agent
- 报关合规 Agent
- 海外仓顾问 Agent

平台可按线索、成交或订阅收费。

---

## 14.4 私有化 / 项目制

针对大型园区、政府园区、产业园：

- 私有化部署
- 数据隔离
- 本地政策库
- 定制员工
- 园区系统对接
- 培训和运营服务

---

# 15. 关键指标

## 15.1 园区侧指标

- 入驻 OPC 数量
- 活跃 OPC 比例
- 启动 Workflow 数量
- 项目完成率
- 服务商介入次数
- 服务需求转化率
- 成功案例数量

---

## 15.2 用户侧指标

- 每用户雇佣 AI 员工数
- 每用户创建任务数
- 任务完成率
- 交付物下载 / 使用次数
- Workflow 完成率
- 用户留存率

---

## 15.3 AI 员工侧指标

- 员工安装次数
- 员工任务完成数
- 员工失败率
- 用户评分
- 平均执行时间
- 人工确认率
- 高风险操作拦截数

---

# 16. 开发阶段规划

## Phase 0：产品验证

目标：

- 明确园区客户需求
- 完成产品原型
- 完成 Demo 流程
- 确定首批 AI 员工

交付：

- PRD
- 产品架构图
- 页面原型
- 5 个员工设定
- 2 个 Workflow 设计

---

## Phase 1：MVP

目标：

实现基础可用产品。

范围：

- OPC 工作台
- 园区管理台基础版
- 员工库
- 5 个官方员工
- 7 天新品冷启动 Workflow
- ArkClaw 执行链路
- 基础交付物中心

---

## Phase 2：试点园区版

目标：

支持真实园区试点。

新增：

- 园区服务商管理
- 园区政策知识库
- 服务商介入提醒
- 任务日志审计
- 用户反馈
- 运营看板增强

---

## Phase 3：执行型员工

目标：

从“建议型员工”升级到“执行型员工”。

新增：

- Shopify API
- Google Sheets
- Gmail
- n8n
- Playwright Worker
- 人工确认机制
- 高风险操作审计

---

## Phase 4：Marketplace

目标：

开放认证服务商和第三方员工。

新增：

- 员工上架审核
- 服务商员工
- 评分评价
- 订单支付
- 分成结算
- 安全扫描
- 权限审批

---

# 17. 风险与应对

## 17.1 技术风险

### 风险

ArkClaw 开放能力不足，无法完全满足多员工、多任务、多租户需求。

### 应对

- ArkClaw 只作为员工运行时
- 工作台、任务、权限、交付物由自研系统承载
- 复杂执行通过外部 API / Worker 实现

---

## 17.2 安全风险

### 风险

第三方 Skill / 员工可能访问用户敏感数据。

### 应对

- 第一阶段只开放官方员工
- 员工权限声明
- Skill 审核
- 高风险操作人工确认
- 日志审计
- 多租户隔离

---

## 17.3 产品风险

### 风险

用户觉得 AI 员工只是聊天机器人，不够实用。

### 应对

- 强调结构化交付物
- 以 Workflow 驱动任务
- 每个员工必须有明确岗位和输出
- 优先做“新品冷启动”这种可验收场景

---

## 17.4 商业风险

### 风险

园区不愿意为平台付费。

### 应对

- 绑定园区招商价值
- 做园区白标
- 提供园区运营看板
- 打包成“AI 孵化服务能力”
- 提供成功案例包装

---

# 18. 第一版 Demo 脚本

## Demo 场景

用户是跨境 OPC 新手，想做美国市场宠物饮水机。

### Step 1：进入园区平台

用户看到：

```text
欢迎来到跨境 OPC 园区 AI 孵化平台
入驻即拥有 AI 跨境团队
```

---

### Step 2：创建一人公司

填写：

```text
公司名称：CJ Pet Global
业务类型：Shopify + TikTok Shop
目标市场：美国
启动预算：5000 美元
```

---

### Step 3：系统推荐 AI 员工

推荐：

```text
选品经理
供应商开发专员
Listing 专员
内容运营
财务利润分析师
```

用户点击“一键组建我的 AI 团队”。

---

### Step 4：启动 7 天新品冷启动 Workflow

输入：

```text
我想做美国市场的宠物饮水机，目标售价 29.99-39.99 美元。
```

系统自动拆任务：

```text
任务 1：市场机会分析 → 选品经理
任务 2：供应商筛选 → 供应商开发专员
任务 3：利润测算 → 财务分析师
任务 4：Listing 生成 → Listing 专员
任务 5：内容日历 → 内容运营
```

---

### Step 5：查看任务进度

用户看到：

```text
选品经理：已完成市场机会分析
供应商开发专员：执行中
财务分析师：等待供应商成本输入
Listing 专员：等待产品卖点确认
内容运营：待开始
```

---

### Step 6：查看交付物

系统输出：

```text
市场机会报告
供应商开发清单
利润测算表
Listing 草稿
30 天内容日历
下一步行动计划
```

---

### Step 7：园区运营方查看后台

园区看到：

```text
CJ Pet Global 当前处于供应链准备阶段
卡点：需要物流报价和知识产权检索
建议介入服务商：物流顾问、知识产权顾问
```

---

# 19. 产品核心卖点总结

## 面向园区

```text
1. 让园区从空间服务升级为 AI 创业基础设施
2. 为入驻 OPC 提供标准化 AI 孵化流程
3. 可视化入驻项目进度和服务需求
4. 把园区服务商资源平台化、产品化
5. 提升招商差异化和成功案例沉淀
```

---

## 面向 OPC

```text
1. 一个人也能拥有跨境 AI 团队
2. 从选品到供应链、Listing、内容、财务都有 AI 员工协助
3. 不只是聊天，而是生成可使用的交付物
4. 可以按需雇佣员工和启动 Workflow
5. 降低跨境创业启动门槛
```

---

## 面向服务商

```text
1. 获得更精准的园区 OPC 需求
2. 服务可以封装成 AI 员工或 Workflow
3. 从线下服务转为平台化服务入口
4. 提高线索转化和服务效率
```

---

# 20. 最终产品定义

本产品不是普通 AI 聊天工具，也不是单一跨境电商工具。

它是：

> **面向跨境 OPC 园区的一人公司 AI 员工操作系统。**

其核心结构是：

```text
园区管理台
+ OPC 一人公司工作台
+ AI 员工库
+ 标准 Workflow
+ ArkClaw 员工运行时
+ 跨境 Skills / Tools
+ 外部业务系统连接
```

最终目标是：

> **让跨境园区里的每一个一人公司，都能像拥有一支专业团队一样启动和运营业务。**


---

# 附录 A：开源参考方案 / GitHub 技术选型

> 本章节用于说明本产品在开源方案上的参考来源，以及每个项目在本平台中的定位。注意：以下项目不是直接拼起来即可上线的完整产品，而是分别对应“工作台、公司编排、员工运行时、员工市场、Skill 管理、任务执行、安全治理”等不同模块的参考与二次开发基础。

---

## A.1 总体判断

本产品不建议寻找一个“完整开源版 Accio / 完整开源版 MuleRun”直接改造，因为目前开源生态中尚没有一个项目能完整覆盖：

```text
OPC 用户工作台
+ AI 员工管理
+ Agent Marketplace
+ Skill/Tool 注册
+ Workflow 编排
+ 跨境电商业务模板
+ ArkClaw/OpenClaw 员工运行时
+ RPA/API 执行层
+ 园区运营管理台
```

更现实的方式是：

```text
Multica / Paperclip 参考工作台与 AI 公司管理
+ ArkClaw / OpenClaw 作为员工运行时
+ OpenMule / Agent Exchange 参考 Agent Marketplace 机制
+ AgentRegistry / AI Agent Marketplace 参考员工与 Skill 注册中心
+ n8n / Playwright / 自研 Worker 承接真实执行
+ 自研跨境员工模板、Workflow、园区管理台
```

---

## A.2 参考项目总表

| 项目 | GitHub / 官网 | 原始定位 | 在本产品中的参考价值 | 是否建议直接使用 |
|---|---|---|---|---|
| Multica | https://github.com/multica-ai/multica | Managed agents platform，把 coding agents 变成可分配任务、追踪进度的 teammate | 作为 OPC 一人公司工作台 / AI 员工任务看板的核心参考 | 建议重点参考 / 可 fork 改造 |
| Paperclip | https://github.com/paperclipai/paperclip | 面向 zero-human company 的 AI agent orchestration，带 org chart、goals、budgets、governance | 参考“AI 公司 / AI 员工组织结构 / 成本治理 / 目标管理” | 建议重点参考产品形态 |
| Paperclip Companies | https://github.com/paperclipai/companies | 可导入的 agent company catalog，包含 org chart、skills、governance | 参考“行业员工包 / 一键导入 AI 团队模板” | 建议参考员工包设计 |
| ArkClaw | 火山 ArkClaw 控制台 / 文档 | 火山托管版 OpenClaw，Agent 云端运行环境 | 作为 AI 员工运行时，承载 Soul、Skill、Tool 调用 | 建议作为核心运行时之一 |
| OpenClaw | https://github.com/openclaw/openclaw | 开源 AI assistant / agent 底座 | 参考 Skill、Soul、消息渠道、工具调用机制 | 可参考，不建议裸露给终端用户 |
| OpenMule | https://github.com/James4Ever0/openmule | 开源 MuleRun，对标 AI Agent Marketplace | 参考 Agent 服务市场、任务撮合、评价、结算思路 | 早期项目，建议参考机制 |
| MuleRun / MuleTeam | https://github.com/openmule | Agent Native Collaboration Platform / AI Agent 市场相关项目 | 参考“雇佣 Agent / Agent 服务市场”的商业模式 | 参考，不直接依赖 |
| Agent Exchange | https://github.com/open-experiments/agent-exchange | 关注 agent marketplace、economic incentives、trust scoring、automated settlement | 参考后期第三方员工市场的信任评分、结算机制 | 后期参考 |
| AgentRegistry | https://github.com/agentregistry-dev/agentregistry | MCP servers、AI agents、skills 的注册、发现、运行平台 | 参考“员工 / Skill / MCP 工具注册中心” | 可参考架构 |
| AI Agent Marketplace | https://github.com/aiagenta2z/ai-agent-marketplace | AI Agent / MCP / Skill 搜索与注册市场 | 参考员工市场的目录、分类、搜索、元数据 | 可参考，不直接作为主系统 |
| OpenViking | https://github.com/volcengine/OpenViking | 面向 AI Agents 的 context database，管理 memory/resources/skills | 参考员工记忆、上下文、资源管理 | 可作为后期 context/memory 方向参考 |
| n8n | https://github.com/n8n-io/n8n | 开源 workflow automation | 作为工具自动化层，连接 Gmail、Sheets、Webhook、CRM 等 | 推荐接入 |
| Playwright | https://github.com/microsoft/playwright | 浏览器自动化框架 | 作为 RPA / UI Automation Worker 底座 | 推荐接入 |
| Langfuse | https://github.com/langfuse/langfuse | LLM observability | 记录 Agent 调用、Prompt、Token、成本、质量 | 推荐接入 |
| Logto | https://github.com/logto-io/logto | 开源身份认证 / IAM | 做用户登录、多租户权限、企业账号 | 可选 |
| Keycloak | https://github.com/keycloak/keycloak | 企业级 IAM | 园区私有化、企业客户权限体系 | 可选 |
| Spree | https://github.com/spree/spree | 开源 headless eCommerce platform | 如果后期要做交易/商品/店铺底座可参考 | 非 MVP 必需 |
| Mercur | https://github.com/mercurjs/mercur | 开源 multi-vendor marketplace platform | 如果后期要做供应商/服务商市场可参考 | 非 MVP 必需 |

---

## A.3 Multica：OPC 一人公司工作台参考

### 原始定位

Multica 是一个 open-source managed agents platform，核心是把 coding agents 变成可以接任务、报进度、沉淀 skills 的 AI teammates。

### 在本产品中的定位

Multica 最适合参考为：

```text
OPC 一人公司工作台
AI 员工任务看板
AI 员工协作管理
任务状态追踪
工作进度汇报
交付物沉淀
```

### 改造方向

| Multica 原概念 | 本产品改造后概念 |
|---|---|
| Workspace | 园区 / 入驻公司 / 店铺 / 品牌 |
| Issue | 经营任务 / 新品任务 / 内容任务 / 供应商任务 |
| Agent | AI 员工 |
| Skill | 员工技能 |
| Runtime | 员工运行时 / ArkClaw 实例 |
| Progress | 任务进度 |
| Comment | 员工汇报 / 用户反馈 |
| Output | 结构化交付物 |

### 推荐使用方式

第一阶段可以 fork 或参考 Multica 的核心结构，但不建议完全保留 coding agent 语义。应该将 UI、数据模型、任务模板和角色体系全部改成跨境 OPC 场景。

---

## A.4 Paperclip：AI 公司 / AI 组织管理参考

### 原始定位

Paperclip 的核心表达是：如果 OpenClaw 是 employee，那么 Paperclip 是 company。它是一个 Node.js server + React UI，用于编排一组 AI agents 来运行一个 business，强调 org charts、goals、budgets、governance、agent coordination。

### 在本产品中的定位

Paperclip 对本产品非常重要，因为它不是单纯“任务看板”，而是更接近：

```text
AI 公司操作系统
AI 员工组织结构
目标管理
预算与成本治理
AI 员工协作与治理
```

### 对本产品的启发

本产品应该吸收 Paperclip 的“公司化”表达：

```text
OPC 用户不是在使用工具，
而是在经营自己的 AI 公司。
```

也就是说，用户界面不应该只有“任务”和“聊天”，还应该有：

```text
我的 AI 团队
我的组织结构
我的业务目标
我的任务进度
我的成本消耗
我的交付物
我的风险提醒
```

### Paperclip Companies 的启发

Paperclip Companies 提供 ready-to-deploy agent companies 的目录，每个 company 可以包含 org chart、skills、governance。

这非常适合本产品的“行业员工包”设计：

```text
跨境新品冷启动 AI 团队
├── 选品经理
├── 供应商开发专员
├── Listing 专员
├── 内容运营
└── 财务利润分析师
```

未来可以做成：

```text
一键安装：跨境 OPC 冷启动团队
一键安装：TikTok Shop 内容电商团队
一键安装：外贸 SOHO 获客团队
一键安装：Shopify DTC 增长团队
```

---

## A.5 ArkClaw / OpenClaw：AI 员工运行时参考

### ArkClaw 定位

ArkClaw 可以理解为火山托管的 OpenClaw 云端运行环境。对于本产品而言，它不是普通 ECS，也不是完整业务后端，而是：

```text
AI 员工运行时
员工工位
Agent 执行环境
Skill 调用环境
消息渠道与定时任务入口
```

### 在本产品中的用法

```text
Multica / OPC 工作台
        ↓ 创建任务 / 分配员工
ArkClaw 员工运行时
        ↓ 调用 Skill
Skills / Tools / 外部 API / RPA
        ↓
跨境业务系统
```

### 员工构成

```text
ArkClaw 员工
= Soul / Role
+ Skills
+ Tools
+ Memory
+ Permission
+ Output Template
```

### 不建议用法

不建议把 ArkClaw 当成普通 ECS 来承载：

```text
主业务后端
多租户数据库
大型 SaaS 服务
长期 RPA 集群
对公网暴露的业务服务
```

更合理的方式是：

```text
ArkClaw 负责员工大脑和调度；
复杂业务服务、RPA、API Connector 独立部署；
ArkClaw 通过 Skill 调用这些外部服务。
```

---

## A.6 OpenMule / MuleRun：Agent Marketplace 参考

### 原始定位

OpenMule 是开源 MuleRun 的早期尝试，方向是 AI Agent Marketplace。它关注：

```text
Agent 服务提供方
Agent 任务购买方
任务执行
服务评价
费用结算
执行成本
服务状态
```

MuleRun / MuleTeam 方向上更像“AI Agent 服务市场”，即用户可以按任务雇佣 Agent。

### 在本产品中的定位

本产品不是一开始做通用 Agent Marketplace，而是做：

```text
跨境 OPC 园区 AI 员工库
```

后期再演进为：

```text
垂直版 MuleRun：跨境 AI 员工市场
```

### 参考点

OpenMule / MuleRun 对本产品的参考价值在于：

```text
员工上架
任务购买
任务评价
服务质量
服务商结算
失败退款
Agent 可信度
执行成本计量
```

### 不建议一开始照搬

MVP 阶段不建议开放第三方 Marketplace，因为 Agent 员工一旦涉及用户店铺、邮箱、供应商资料、客户数据，安全和质量风险非常高。

建议路线：

```text
第一阶段：官方员工库
第二阶段：园区定制员工
第三阶段：认证服务商员工
第四阶段：第三方员工市场
```

---

## A.7 AgentRegistry / AI Agent Marketplace：员工与 Skill 注册中心参考

### AgentRegistry 参考价值

AgentRegistry 的定位是集中发现、管理和运行 MCP servers、AI agents、skills。它适合参考为本产品的：

```text
员工注册中心
Skill 注册中心
Tool / MCP 管理中心
版本管理
权限声明
部署治理
```

### AI Agent Marketplace 参考价值

AI Agent Marketplace 类项目更适合参考：

```text
Agent 分类
Agent 搜索
Agent 元数据
Agent 详情页
Agent 标签
Agent 评分
Agent 安装
```

### 本产品中的落地

本产品员工库需要维护这些元数据：

```text
员工名称
员工类型
适合对象
能做什么
不能做什么
所需权限
绑定 Skills
绑定 Tools
示例输入
示例输出
价格
评分
版本
审核状态
```

---

## A.8 n8n / Playwright：真实执行层参考

### n8n

n8n 适合做低代码业务自动化：

```text
Gmail 发送草稿
Google Sheets 写入
Webhook 通知
CRM 记录
服务商线索流转
任务完成通知
```

适合用在：

```text
员工完成任务后，自动写入表格
供应商询盘草稿生成后，通知用户确认
园区发现服务需求后，通知服务商
```

### Playwright

Playwright 适合做浏览器自动化和 RPA：

```text
打开网页
读取页面信息
填写表单
截图留痕
模拟用户操作
```

适合用在：

```text
1688 / Alibaba 信息辅助抓取
非 API 平台的后台操作
客服后台辅助操作
表单填写和截图审计
```

但高风险操作必须人工确认。

---

## A.9 OpenViking：员工记忆 / Context 管理参考

OpenViking 是火山开源的面向 AI Agents 的 context database，强调统一管理 memory、resources、skills 等上下文。

本产品后期可以参考其思想，做：

```text
员工长期记忆
项目上下文
店铺资料上下文
供应商资料上下文
园区政策上下文
用户偏好上下文
```

例如：

```text
用户 A 的 Listing 专员记住：
- 目标市场是美国
- 偏好价格区间 29.99-39.99 美元
- 品牌语气偏专业但亲和
- 不希望使用夸张营销词
```

---

## A.10 安全参考：OpenClaw Skill 生态的风险提醒

Agent Skill / Marketplace 最大风险不是功能，而是安全。

OpenClaw / ClawHub 生态曾被安全社区指出存在恶意 Skill 风险：恶意 Skill 可能通过脚本、文件访问、Shell 执行等方式窃取用户敏感信息。对于本产品来说，这个风险更严重，因为跨境 OPC 的 AI 员工可能接触：

```text
店铺数据
供应商资料
客户对话
邮箱权限
财务测算
广告数据
物流信息
API Key
```

因此本产品必须从 MVP 阶段设计安全边界：

```text
1. 第一阶段只开放官方员工，不开放任意第三方 Skill。
2. 每个员工必须声明权限。
3. 每个 Skill 必须经过审核。
4. 高风险操作必须人工确认。
5. API Key 加密保存。
6. 任务执行过程必须有日志。
7. RPA 操作必须截图留痕。
8. 第三方员工不得默认执行 Shell。
9. 每个用户的员工实例、记忆、工具授权必须隔离。
10. 服务商员工必须经过园区或平台认证。
```

---

## A.11 推荐的开源拼装路线

### MVP 阶段

```text
Multica 思路 / fork
+ ArkClaw 员工运行时
+ 自研员工库
+ 自研 5 个跨境员工模板
+ 自研 2 个 Workflow
+ 简单 ArkClaw Bridge
+ PostgreSQL
+ 文件上传 / 交付物中心
```

不建议 MVP 阶段引入过多开源系统，否则集成复杂度过高。

---

### 试点阶段

```text
加入 n8n
加入 Playwright Worker
加入 Langfuse
加入基础权限系统
加入园区政策知识库
加入服务商员工雏形
```

---

### 平台化阶段

```text
参考 AgentRegistry 做员工/Skill 注册中心
参考 OpenMule / Agent Exchange 做 Marketplace 交易机制
参考 Paperclip Companies 做行业员工包
参考 OpenViking 做 Context/Memory 管理
```

---

## A.12 本产品与各参考项目的关系总结

```text
Multica：像员工任务看板
Paperclip：像 AI 公司操作系统
ArkClaw：像员工运行时 / 员工工位
OpenClaw：像底层 agent / skill 生态参考
OpenMule / MuleRun：像员工市场 / Agent 交易市场参考
AgentRegistry：像员工与 Skill 注册中心
n8n：像员工调用的自动化工具箱
Playwright：像员工的浏览器操作手
OpenViking：像员工记忆和上下文系统
```

最终本产品不是简单复制其中任何一个，而是将它们组合成：

```text
面向跨境 OPC 园区的一人公司 AI 员工操作系统
```

---

## A.13 对外表达建议

对技术团队：

> 我们参考 Multica 的 agent task management、Paperclip 的 AI company orchestration、OpenMule 的 agent marketplace、AgentRegistry 的 skill registry，并用 ArkClaw 作为员工运行时，做一个面向跨境 OPC 园区的 AI Workforce OS。

对园区客户：

> 我们不是单纯提供聊天机器人，而是为园区搭建一个 AI 员工库和一人公司工作台，让每个入驻的跨境创业者都能拥有选品、供应商、Listing、内容、财务等 AI 员工。

对投资人/合作方：

> 这是一个垂直版 AI Workforce Marketplace。短期从跨境 OPC 园区切入，长期可扩展到内容创业、外贸获客、AI 咨询、教育培训等一人公司场景。


---

# 附录 A｜开源参考方案 / GitHub 技术选型

本章节用于明确本产品可参考、可复用或可二次开发的开源项目。原则上，本产品不是直接复制某一个开源项目，而是采用“工作台 + 员工市场 + 员工运行时 + Skill/Tool 执行层”的组合式架构。

## A.1 开源方案总览

| 模块 | 参考项目 | GitHub / 官网 | 在本产品中的定位 | 建议使用方式 |
|---|---|---|---|---|
| OPC 一人公司工作台 / AI 员工任务看板 | Multica | https://github.com/multica-ai/multica | 用户侧工作台、员工列表、任务看板、执行进度、交付物中心 | 可 fork 改造 |
| AI 公司操作系统 / AI 组织治理 | Paperclip | https://github.com/paperclipai/paperclip | AI 公司、组织结构、目标、预算、治理、成本管理的产品参考 | 参考架构与概念 |
| AI 公司模板 / 员工模板库 | Paperclip Companies | https://github.com/paperclipai/companies | 预置 AI 团队、员工模板、技能模板的参考 | 参考模板化方式 |
| 员工运行时 | OpenClaw / ArkClaw | https://github.com/openclaw/openclaw | 员工运行时、Soul、Skill、Tool、消息渠道、任务执行 | ArkClaw 托管 + OpenClaw 参考 |
| Agent Marketplace / MuleRun 参考 | OpenMule | https://github.com/James4Ever0/openmule | AI 员工市场、按任务购买、执行任务市场机制参考 | 参考机制，不建议直接依赖 |
| Agent 交易 / 信任 / 结算机制 | Agent Exchange | https://github.com/open-experiments/agent-exchange | 后期第三方员工市场中的信任评分、经济激励、自动结算参考 | 后期参考 |
| Agent / Skill / MCP 注册中心 | AgentRegistry | https://github.com/agentregistry-dev/agentregistry | 员工、Skill、MCP、Tool 的注册、发现、治理、审核 | 可参考或集成 |
| Agent 目录 / 搜索 / 元数据 | AI Agent Marketplace | https://github.com/aiagenta2z/ai-agent-marketplace | 员工市场的分类、搜索、元数据、目录结构参考 | 参考 UI 与数据模型 |
| 多 Agent Workspace | OpenAgents | https://github.com/openagents-org/openagents | 多 Agent 工作区、Agent 状态、Agent 协作产品参考 | 参考交互 |
| Agent 市场机制模拟 | Microsoft Multi-agent Marketplace | https://github.com/microsoft/multi-agent-marketplace | Buyer / Seller Agent 市场机制、任务撮合模拟参考 | 研究参考 |
| 电商 Agent Workflow | Enthusiast | https://github.com/upsidelab/enthusiast | 电商场景 agentic workflow、RAG、向量检索、工作流编排参考 | 参考执行层 |
| 电商底座 | Spree | https://github.com/spree/spree | 后期做商品、订单、跨境独立站、B2B 批发、Marketplace 的参考底座 | 非 MVP，可后期参考 |
| 多商户 Marketplace | Mercur | https://github.com/mercurjs/mercur | 后期做供应商、服务商、商品 Marketplace 的参考底座 | 非 MVP，可后期参考 |
| 工作流自动化 | n8n | https://github.com/n8n-io/n8n | 邮件、表格、通知、CRM、服务商线索流转等自动化 | 推荐集成 |
| 浏览器自动化 / RPA | Playwright | https://github.com/microsoft/playwright | 无 API 场景下的浏览器自动化、后台操作、截图留痕 | 推荐作为 Worker |
| LLM 观测 | Langfuse | https://github.com/langfuse/langfuse | Prompt、任务执行、模型调用、成本和日志观测 | 推荐集成 |
| 身份与权限 | Logto | https://github.com/logto-io/logto | 用户登录、多租户、权限、组织管理 | 可选 |
| 身份与权限 | Keycloak | https://github.com/keycloak/keycloak | 企业级身份认证、SSO、权限管理 | 可选 |
| 对象存储 | MinIO | https://github.com/minio/minio | 文件、交付物、素材、报告存储 | 可选 |

---

## A.2 Multica：OPC 一人公司工作台参考

### 项目地址

https://github.com/multica-ai/multica

### 项目定位

Multica 是一个开源 managed agents platform，核心理念是把 coding agents 变成可以被分配任务、追踪进度、沉淀技能的 AI teammates。

### 在本产品中的映射

| Multica 原概念 | 本产品改造后概念 |
|---|---|
| Workspace | 园区 / 一人公司 / 店铺 / 品牌 |
| Issue / Task | 经营任务 / 新品任务 / 内容任务 / 供应商任务 |
| Agent | AI 员工 |
| Runtime | ArkClaw / OpenClaw 员工运行时 |
| Skills | 跨境业务 Skills |
| Progress | 任务进度 |
| Output | 结构化交付物 |

### 使用建议

MVP 阶段可以 fork Multica，优先保留：

- Workspace
- Agent Profile
- Task Assignment
- Progress Tracking
- Output / Logs
- Runtime 管理

需要改造：

- 将 coding agent 语义改成 OPC / 跨境业务语义
- 将 issue 改成经营任务
- 将 repository 相关概念弱化或移除
- 增加店铺、产品、供应商、交付物等业务资产

---

## A.3 Paperclip：AI 公司操作系统参考

### 项目地址

https://github.com/paperclipai/paperclip

### 项目定位

Paperclip 的定位是 open-source orchestration for zero-human companies。它更强调“公司级别”的 AI agents 管理，包括 org chart、budget、governance、goal alignment、agent coordination 等。

### 对本产品的启发

Multica 更像“任务看板”，Paperclip 更像“AI 公司管理系统”。

本产品可以借鉴 Paperclip 的：

- AI 公司组织结构
- AI 员工岗位设计
- 目标管理
- 成本管理
- 预算控制
- 员工治理
- 多员工协同

### 使用建议

不建议第一版直接 fork Paperclip。建议把它作为“OPC 一人公司操作系统”的产品参考，特别是：

- 我的 AI 公司
- 我的 AI 员工组织架构
- AI 员工成本 / 使用量
- 员工治理和权限边界

---

## A.4 Paperclip Companies：AI 团队模板库参考

### 项目地址

https://github.com/paperclipai/companies

### 项目定位

Paperclip Companies 提供预构建 AI 公司、专业 agents 和技能模板。

### 对本产品的启发

本产品也需要类似的“行业员工包”：

- 跨境新品冷启动团队
- Amazon 卖家团队
- Shopify DTC 团队
- TikTok Shop 团队
- 外贸 SOHO 团队
- 园区服务商团队

### 本产品可设计的员工包

```text
跨境新品冷启动团队
├── 选品经理
├── 供应商开发专员
├── Listing 专员
├── 内容运营
└── 财务利润分析师
```

```text
园区服务商团队
├── 财税顾问
├── 物流顾问
├── 知识产权顾问
├── 报关合规顾问
└── 海外仓顾问
```

---

## A.5 ArkClaw / OpenClaw：员工运行时参考

### OpenClaw 项目地址

https://github.com/openclaw/openclaw

### ArkClaw 定位

ArkClaw 可以理解为火山托管版 OpenClaw，是本产品中 AI 员工的运行时。

### 在本产品中的定位

```text
Multica 改造版：负责用户工作台、任务、员工列表、交付物
ArkClaw：负责员工实际执行、Skill 调用、Tool 调用、消息渠道
外部服务：负责 API、RPA、数据处理、复杂业务逻辑
```

### 员工构成

```text
ArkClaw 员工
= Soul / Role
+ Skills
+ Tools
+ Memory
+ Permission
+ Output Template
```

### 使用建议

第一阶段不要把 ArkClaw 当普通 ECS 部署全部业务。建议把它作为“AI 员工运行时”：

- Soul 定义员工身份
- Skill 定义员工能力
- Tool/API 连接外部系统
- Workflow 由工作台编排
- 复杂执行放在外部服务或 Worker

---

## A.6 OpenMule / MuleRun：Agent Marketplace 参考

### 项目地址

https://github.com/James4Ever0/openmule

### 项目定位

OpenMule 是一个开源 MuleRun 方向的项目，核心思想是 AI Agent Marketplace，即用户可以购买、调用、执行某类 Agent 任务。

### 对本产品的启发

本产品后期可以从“园区员工库”演进为“跨境 AI 员工市场”：

```text
用户需求
    ↓
选择 AI 员工 / Workflow
    ↓
提交任务
    ↓
员工执行
    ↓
交付结果
    ↓
评分 / 复购 / 结算
```

### 使用建议

MVP 不建议直接做开放 marketplace。建议先做：

- 平台官方员工
- 园区定制员工
- 服务商员工

后期再开放第三方认证员工。

---

## A.7 Agent Exchange：信任、评分、结算机制参考

### 项目地址

https://github.com/open-experiments/agent-exchange

### 项目定位

Agent Exchange 关注 agent marketplace 中的 economic incentives、trust scoring、automated settlement。

### 对本产品的启发

后期开放第三方员工市场后，需要解决：

- 员工是否可信
- Skill 是否安全
- 任务失败怎么算
- 用户如何评分
- 服务商如何结算
- 平台如何抽佣
- 高风险员工如何审核

### 使用建议

MVP 阶段只做内部员工，不做复杂结算。Phase 4 以后再参考 Agent Exchange 的机制。

---

## A.8 AgentRegistry：员工 / Skill / MCP 注册中心参考

### 项目地址

https://github.com/agentregistry-dev/agentregistry

### 项目定位

AgentRegistry 是一个开源平台，用于发现、管理和运行 MCP servers、AI agents 和 skills。

### 在本产品中的定位

可用于建设“园区 AI 员工库”和“Skill 注册中心”。

核心能力可参考：

- Agent 注册
- Skill 注册
- MCP Server 注册
- 版本管理
- 权限审核
- 信任治理
- 安装与运行

### 本产品中的映射

```text
AgentRegistry
    ↓
园区 AI 员工库
    ↓
员工模板 / Skill 模板 / Tool 模板
    ↓
安装到 OPC Workspace
```

---

## A.9 AI Agent Marketplace：目录与搜索参考

### 项目地址

https://github.com/aiagenta2z/ai-agent-marketplace

### 项目定位

AI Agent Marketplace 更像 Agent 目录、Agent Store、Agent Search Engine。

### 对本产品的启发

可参考：

- 员工分类
- 员工搜索
- 元数据字段
- 标签体系
- 员工详情页
- 安装入口

本产品员工详情页建议包含：

- 员工名称
- 适合谁
- 能做什么
- 不能做什么
- 所需权限
- 示例输入
- 示例输出
- 可用 Skills
- 价格 / 套餐
- 评分

---

## A.10 OpenAgents：多 Agent 工作区参考

### 项目地址

https://github.com/openagents-org/openagents

### 项目定位

OpenAgents 是一个多 Agent workspace，用于统一管理不同运行位置的 agents，并支持状态查看、聊天和协作。

### 对本产品的启发

可参考：

- 我的 AI 员工工作区
- 多员工状态
- 员工之间协作
- Agent URL / endpoint 管理
- Agent 在线状态

---

## A.11 Microsoft Multi-agent Marketplace：市场机制模拟参考

### 项目地址

https://github.com/microsoft/multi-agent-marketplace

### 项目定位

Magentic Marketplace 是一个 Python framework，用于模拟 AI-powered markets，配置 buyer/seller agents，研究市场机制。

### 对本产品的启发

适合研究：

- 多个员工竞争接单
- 任务如何匹配最优员工
- 服务商员工如何报价
- 买家/卖家 Agent 如何协商
- 市场效率与公平性

不建议作为产品底座。

---

## A.12 Spree / Mercur：后期业务 Marketplace 底座参考

### Spree

https://github.com/spree/spree

适合参考：

- Headless eCommerce
- Cross-border storefront
- B2B wholesale
- Multi-vendor marketplace
- Multi-tenant SaaS

### Mercur

https://github.com/mercurjs/mercur

适合参考：

- 多商户 marketplace
- 供应商入驻
- 服务商入驻
- 订单与交易机制

### 使用建议

MVP 不需要接入 Spree 或 Mercur。后期如果要做园区服务商市场、供应商撮合市场、商品交易市场，再考虑。

---

## A.13 n8n / Playwright / Langfuse / Logto 等基础设施

### n8n

https://github.com/n8n-io/n8n

用于：

- 邮件自动化
- 表格写入
- 通知提醒
- 服务商线索流转
- CRM 记录
- 简单业务工作流

### Playwright

https://github.com/microsoft/playwright

用于：

- 浏览器自动化
- 无 API 平台操作
- 截图留痕
- 表单填写
- RPA Worker

### Langfuse

https://github.com/langfuse/langfuse

用于：

- LLM 调用日志
- Prompt 版本管理
- 成本观测
- 任务执行追踪
- 质量评估

### Logto

https://github.com/logto-io/logto

用于：

- 用户认证
- 组织管理
- 权限管理
- 多租户登录

### Keycloak

https://github.com/keycloak/keycloak

用于：

- 企业级 SSO
- 权限管理
- 园区 / 企业客户私有化部署

### MinIO

https://github.com/minio/minio

用于：

- 文件存储
- 交付物存储
- 用户上传资料
- 内容素材库

---

## A.14 推荐落地路线

### MVP 阶段

建议优先采用：

```text
Multica fork
+ ArkClaw 员工运行时
+ 自研员工库
+ 5 个官方跨境员工
+ 7 天新品冷启动 Workflow
+ 基础 Skill 服务
```

暂不直接集成复杂 Marketplace、结算、第三方员工上传。

### Phase 2

加入：

```text
AgentRegistry 思路
+ Skill 注册中心
+ 园区定制员工
+ 服务商员工
+ n8n / Playwright Worker
```

### Phase 3

加入：

```text
OpenMule / Agent Exchange 思路
+ 第三方认证员工
+ 评分评价
+ 交易订单
+ 服务商分成
+ 员工安全审核
```

### Phase 4

视业务需要接入：

```text
Spree / Mercur
+ 服务商市场
+ 商品 / 供应商 Marketplace
+ 跨境交易撮合
```

---

## A.15 关键判断

本产品不应简单复制某一个开源项目，而应组合使用：

```text
Multica = OPC 用户工作台 / 任务系统
Paperclip = AI 公司操作系统参考
Paperclip Companies = AI 员工模板库参考
ArkClaw / OpenClaw = 员工运行时
AgentRegistry = 员工 / Skill 注册中心
OpenMule = Agent Marketplace 机制参考
Agent Exchange = 信任 / 评分 / 结算参考
n8n / Playwright = 执行工具层
Langfuse = LLM 观测
Logto / Keycloak = 权限体系
```

最终产品不是“开源项目大杂烩”，而是：

> 面向跨境 OPC 园区的 AI 员工操作系统。

