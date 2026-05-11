#!/usr/bin/env bash
# OPC 一键部署 ─ 在 Ubuntu 22.04 ECS（阿里云 / 火山云 / AWS）上跑
#
# 用法：
#   bash deploy.sh init    # 首次：装 docker + 配 swap + git clone + 启动
#   bash deploy.sh up      # 拉最新代码 → 重 build → 重启
#   bash deploy.sh logs    # 看实时日志
#   bash deploy.sh stop    # 停掉
#   bash deploy.sh status  # 看状态
#
# 前置：
#   - 当前是 root 或能 sudo
#   - 已 cp .env.production.template .env 并填好
#   - 默认对接火山方舟豆包大模型（国内可用，OpenAI 兼容）。
#     OPENAI_API_KEY + OPENAI_BASE_URL + OPENAI_MODEL 三个变量是必填。
#   - DOMAIN 可留空 → Caddy 走 :80 直接用 IP serve（无 SSL，仅 demo）
set -euo pipefail

REPO_URL="https://github.com/plwsdytcj/OPC-eCommerce.git"
APP_DIR="${HOME}/opc"
ACTION="${1:-up}"

log() { printf "\033[1;36m[deploy]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[error]\033[0m %s\n" "$*" >&2; }

ensure_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    log "Docker not found, installing..."
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER" || true
    log "Docker installed. You may need to logout/login for group to take effect."
  else
    log "Docker $(docker --version | cut -d' ' -f3 | tr -d ',') already installed"
  fi
  if ! docker compose version >/dev/null 2>&1; then
    err "docker compose v2 plugin is missing. Re-run docker install or apt install docker-compose-plugin."
    exit 1
  fi
}

ensure_swap() {
  # 4 GB 内存 + 2 GB swap 才能稳跑 6-8 个并发 codex agent。
  # 小机器上没 swap 一遇到峰值就 OOM kill。
  if swapon --show 2>/dev/null | grep -q .; then
    log "Swap already configured: $(swapon --show --noheadings | awk '{print $1, $3}')"
    return
  fi
  log "Configuring 2 GB swapfile..."
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile >/dev/null
  sudo swapon /swapfile
  if ! grep -q "^/swapfile" /etc/fstab; then
    echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab >/dev/null
  fi
  log "Swap ready: $(swapon --show --noheadings | awk '{print $3}')"
}

ensure_repo() {
  if [ ! -d "$APP_DIR/.git" ]; then
    log "Cloning $REPO_URL → $APP_DIR"
    git clone --recurse-submodules "$REPO_URL" "$APP_DIR"
  else
    log "Repo exists, pulling latest..."
    (cd "$APP_DIR" && git pull --ff-only && git submodule update --init --recursive)
  fi
}

ensure_env() {
  cd "$APP_DIR/deploy"
  if [ ! -f .env ]; then
    if [ -f .env.production.template ]; then
      err ".env not found. Copy .env.production.template → .env and fill it in:"
      err "    cp .env.production.template .env && \${EDITOR:-vim} .env"
      exit 1
    else
      err "Neither .env nor .env.production.template found. Repo broken?"
      exit 1
    fi
  fi

  # 自动生成 PAPERCLIP_BOARD_AUTH_TOKEN 如果还是占位符
  if grep -E "^PAPERCLIP_BOARD_AUTH_TOKEN=(请用|自动生成|$)" .env >/dev/null; then
    local token
    token=$(openssl rand -hex 32)
    sed -i.bak -E "s|^PAPERCLIP_BOARD_AUTH_TOKEN=.*|PAPERCLIP_BOARD_AUTH_TOKEN=${token}|" .env
    rm -f .env.bak
    log "Auto-generated PAPERCLIP_BOARD_AUTH_TOKEN"
  fi

  # 必填变量检查
  for VAR in OPENAI_API_KEY OPENAI_BASE_URL OPENAI_MODEL PAPERCLIP_BOARD_AUTH_TOKEN; do
    local val
    val=$(grep -E "^${VAR}=" .env | head -1 | cut -d= -f2-)
    if [ -z "$val" ] || [[ "$val" == 替换为* ]] || [[ "$val" == 自动生成* ]]; then
      err ".env missing/placeholder for: $VAR"
      err "  当前值: '$val'"
      err "  请编辑 $APP_DIR/deploy/.env 填好后重跑。"
      exit 1
    fi
  done

  # DOMAIN 可选；空时给个提示
  if ! grep -E "^DOMAIN=." .env >/dev/null; then
    log "DOMAIN 为空 → 走 IP 直连模式（http://<服务器 IP>），无 HTTPS。"
  else
    log "DOMAIN = $(grep -E '^DOMAIN=' .env | cut -d= -f2-)"
  fi

  log ".env 检查通过"
}

compose() {
  cd "$APP_DIR/deploy"
  docker compose --env-file .env "$@"
}

case "$ACTION" in
  init)
    ensure_docker
    ensure_swap
    ensure_repo
    ensure_env
    log "Building images (3-10 分钟，看机器 + 网速)..."
    compose build
    log "Starting up..."
    compose up -d
    sleep 5
    compose ps
    local_domain=$(grep -E "^DOMAIN=" "$APP_DIR/deploy/.env" | cut -d= -f2-)
    if [ -n "$local_domain" ]; then
      log "✓ Done. 打开 https://${local_domain} （等 SSL 签发 ~30s）"
    else
      ip=$(curl -fsS --max-time 5 https://ipinfo.io/ip 2>/dev/null || hostname -I | awk '{print $1}')
      log "✓ Done. 打开 http://${ip}/ 看 marketplace"
      log "        打开 http://${ip}/work/ 看 paperclip workbench"
    fi
    ;;
  up)
    ensure_repo
    ensure_env
    compose build
    compose up -d
    compose ps
    ;;
  logs)
    compose logs -f --tail 100
    ;;
  stop)
    compose stop
    ;;
  status)
    compose ps
    echo
    log "Disk usage of paperclip-home volume:"
    docker run --rm -v deploy_paperclip-home:/data alpine du -sh /data 2>/dev/null || true
    ;;
  *)
    err "Unknown action: $ACTION"
    echo "Usage: $0 {init|up|logs|stop|status}"
    exit 1
    ;;
esac
