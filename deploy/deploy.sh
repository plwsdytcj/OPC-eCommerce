#!/usr/bin/env bash
# OPC 一键部署 ─ 在阿里云 ECS Ubuntu 22.04 上跑
#
# 用法：
#   bash deploy.sh init    # 首次：装 docker + git clone + 启动
#   bash deploy.sh up      # 拉最新代码 → 重 build → 重启
#   bash deploy.sh logs    # 看实时日志
#   bash deploy.sh stop    # 停掉
#   bash deploy.sh status  # 看状态
#
# 假设：
#   - 当前用户能 sudo
#   - 域名的 A 记录已经指向本机公网 IP
#   - 已 cp .env.production.template .env 并填好
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
    sudo usermod -aG docker "$USER"
    log "Docker installed. You may need to logout/login for group to take effect."
  else
    log "Docker $(docker --version | cut -d' ' -f3 | tr -d ',') already installed"
  fi
  if ! docker compose version >/dev/null 2>&1; then
    err "docker compose v2 plugin is missing. Re-run docker install or apt install docker-compose-plugin."
    exit 1
  fi
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
      err "    cp .env.production.template .env && nano .env"
      exit 1
    else
      err "Neither .env nor .env.production.template found. Repo broken?"
      exit 1
    fi
  fi
  # 简单 sanity 检查
  for VAR in DOMAIN ACME_EMAIL OPENAI_API_KEY PAPERCLIP_BOARD_AUTH_TOKEN; do
    if ! grep -E "^${VAR}=." .env >/dev/null; then
      err ".env missing or empty: $VAR"
      exit 1
    fi
  done
  log ".env looks ok"
}

compose() {
  cd "$APP_DIR/deploy"
  docker compose --env-file .env "$@"
}

case "$ACTION" in
  init)
    ensure_docker
    ensure_repo
    ensure_env
    log "Building images (this takes 3-10 minutes on a 2C4G ECS)..."
    compose build
    log "Starting up..."
    compose up -d
    sleep 5
    compose ps
    log "Done. Hit https://\$DOMAIN once SSL is issued (≈30s)"
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
