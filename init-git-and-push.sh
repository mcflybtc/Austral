#!/usr/bin/env bash
set -euo pipefail

REMOTE_URL="${1:-}"
if [[ -z "$REMOTE_URL" ]]; then
  echo "Uso: bash init-git-and-push.sh <remote-url>"
  echo "Ex.:  bash init-git-and-push.sh git@github.com:SEU_USER/lyra-orrery.git"
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "[ERRO] Git não encontrado. Instale o Git e rode novamente."
  exit 1
fi

git init -b main
git add .
git commit -m "feat: initial commit (lyra-orrery)"
git remote add origin "$REMOTE_URL"
git push -u origin main
echo "[OK] Repositório criado e push enviado para $REMOTE_URL"
