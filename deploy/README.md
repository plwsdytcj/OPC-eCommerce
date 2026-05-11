# OPC 生产部署手册

> 目标：把 marketplace 和 paperclip 一起搬到阿里云 ECS，配上自有域名 +
> 自动 SSL，做出一份外部可访问、可点 Run Now 真跑 agent 的公网 demo。

---

## TL;DR（如果你已经买好 ECS 和域名）

```bash
# 在你的 Mac 上推 .env 模板（已在仓库里）
git pull
cd deploy
cat .env.production.template     # 看一眼有哪些字段

# SSH 上 ECS
ssh root@<你的-ECS-公网IP>

# 在 ECS 上跑（第一次）
curl -fsSL https://raw.githubusercontent.com/plwsdytcj/OPC-eCommerce/main/deploy/deploy.sh -o /tmp/deploy.sh
bash /tmp/deploy.sh init

# 跑到一半它会告诉你 .env 没填，按提示操作：
cd ~/opc/deploy
cp .env.production.template .env
nano .env                       # 把 DOMAIN / ACME_EMAIL / OPENAI_API_KEY 等填好
bash deploy.sh init             # 再跑一次完成 build + up
```

约 5-10 分钟后 https://你的-DOMAIN 就活了。

---

## 完整步骤

### 1. 阿里云购买清单（一次性 ≈ ¥150-200）

| 产品 | 配置 | 预算 |
|---|---|---|
| ECS 云服务器 | 2C4G（最小）或 4C8G（推荐），Ubuntu 22.04 LTS，40GB 系统盘 ESSD | ¥99-199 / 月 |
| 公网 IP | 跟 ECS 一起买，按使用流量计费 1-3 Mbps | ¥30-80 / 月 |
| 域名 | 自选（.com / .ai / .park），阿里云域名注册 | ¥60-200 / 年 |
| SSL 证书 | 阿里云免费 DV 证书；或让 Caddy 自动从 Let's Encrypt 申请 | ¥0 |

**地域选择**：
- 香港、新加坡 — 海外用户访问快，不用 ICP 备案，立即起服
- 杭州/北京/上海 — 国内访问快但要 ICP 备案（**域名必须在阿里云买**，备案需 7-20 天）

如果你想快出 demo，**先买香港**。

### 2. DNS 解析（域名买好后立刻做）

去阿里云控制台 → **云解析 DNS** → 添加 A 记录：

| 记录类型 | 主机记录 | 解析值 |
|---|---|---|
| A | `opc` | 你的 ECS 公网 IP（例如 `47.108.x.x`） |
| A | `work.opc` | 同一个公网 IP |

记录最长生效时间 10 分钟。可用 `dig opc.your-domain.com` 验证。

> 注：如果你用根域（裸 `your-domain.com` 不带前缀），把主机记录改成 `@`；
> `work` 改成 `work`。修改 `deploy/.env` 里的 `DOMAIN` 对齐。

### 3. SSH 进 ECS + 安装 Docker

```bash
ssh root@<你的-ECS-公网IP>

# Docker 一键安装（deploy.sh init 也会自动做）
curl -fsSL https://get.docker.com | sh
docker compose version              # 确认 v2 plugin 装好

# 如果是 root 之外的账号，加进 docker 组
usermod -aG docker $USER
# 重新登录使 group 生效
```

### 4. 拉代码 + 配置 .env

```bash
cd ~
git clone --recurse-submodules https://github.com/plwsdytcj/OPC-eCommerce.git opc
cd opc/deploy
cp .env.production.template .env
nano .env
```

`.env` 至少要填的字段：

```ini
DOMAIN=opc.your-domain.com
ACME_EMAIL=you@your-email.com
OPENAI_API_KEY=sk-...                        # 你的 OpenAI key
PAPERCLIP_BOARD_AUTH_TOKEN=<openssl rand -hex 32>
```

生成 token：

```bash
openssl rand -hex 32
# → 复制结果粘到 .env 里 PAPERCLIP_BOARD_AUTH_TOKEN=
```

### 5. 构建 + 启动

```bash
cd ~/opc/deploy
bash deploy.sh init
```

第一次会跑 5-10 分钟（pnpm install + esbuild + next build 都在 docker 内）。
出来三个容器在运行：

```
opc-paperclip       Up    (internal:3100)
opc-marketplace     Up    (internal:3200)
opc-caddy           Up    0.0.0.0:80→80, 0.0.0.0:443→443
```

Caddy 会自动找 Let's Encrypt 申请 SSL（首次 ≈ 30 秒）。

### 6. 验证

```bash
# 看实时日志
cd ~/opc/deploy && bash deploy.sh logs

# 测公网访问
curl -I https://opc.your-domain.com           # 200
curl -I https://work.opc.your-domain.com      # 200

# 浏览器打开
# https://opc.your-domain.com         → marketplace 8 张卡片
# https://work.opc.your-domain.com    → paperclip 工作台
```

第一次进 paperclip 用 `PAPERCLIP_BOARD_AUTH_TOKEN` 作为初始登录凭据。

### 7. 装 OPC 插件（首次部署后必做）

paperclip 起来后还是个空壳。OPC 的 3 个插件要手动安装一次：

```bash
# 在 ECS 上
docker exec -it opc-paperclip bash
cd /opc-plugins                                 # 这是 host 挂载进来的
# 这步等 paperclip 暴露公网后通过 UI 装更方便
```

或者用 paperclip 自带的 install REST endpoint：

```bash
PLUGIN_BASE=https://work.opc.your-domain.com
TOKEN=$(cat .env | grep PAPERCLIP_BOARD_AUTH_TOKEN | cut -d= -f2)

for PLUGIN in plugin-cross-border-agents plugin-cross-border-skills plugin-cross-border-tools; do
  curl -s -X POST "$PLUGIN_BASE/api/plugins/install" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d "{\"packageName\":\"/opc-plugins/$PLUGIN\",\"isLocalPath\":true}"
done
```

### 8. 日常运维

```bash
bash deploy.sh up        # 拉最新代码 + 重 build + 重启
bash deploy.sh logs      # 看实时日志
bash deploy.sh status    # 看容器 + 磁盘
bash deploy.sh stop      # 停服
```

---

## 故障排查

### Caddy 一直 SSL 失败

- DNS 没生效：`dig opc.your-domain.com` 看返回 IP 对不对
- 安全组没开 80/443：阿里云 ECS → 安全组 → 加入站规则 80/443 公网
- Let's Encrypt 限频：临时改用 staging CA（取消 Caddyfile 里 `acme_ca` 注释）

### paperclip 起不来

```bash
docker logs opc-paperclip --tail 100
```

常见：
- `OPENAI_API_KEY` 没填 → agent 跑不起来
- 数据卷权限不对 → `chown -R 1000:1000 /var/lib/docker/volumes/deploy_paperclip-home/_data`

### marketplace 卡片 sample 链接打不开

`.env` 里 `PUBLIC_PAPERCLIP_BASE` 没填 / 写错。改完重启：

```bash
bash deploy.sh up
```

### 想接 RDS Postgres（V0.5）

在 `.env` 里加：

```ini
DATABASE_URL=postgresql://opc:pwd@your-rds-endpoint:5432/paperclip
```

paperclip 启动时检测到 `DATABASE_URL` 会自动用 PG 替换 sqlite。

---

## 升级一个组件

```bash
# 改完代码，本地 commit + push 到 main
git push origin main

# ECS 上
cd ~/opc/deploy
bash deploy.sh up                # 自动拉 + build + 重启
```
