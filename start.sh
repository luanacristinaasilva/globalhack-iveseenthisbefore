#!/bin/bash
# ============================================================
# I've Seen This Before — Script de Inicialização
# ============================================================
# Uso: bash start.sh
# ============================================================

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "🌟 I've Seen This Before — BrasilIA Hackaton"
echo "============================================="

# Mata processos anteriores nas portas 3001 e 3000
echo "🔪 Liberando portas 3000 e 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Abre o backend em uma nova janela do Terminal
echo "🚀 Iniciando backend na porta 3001..."
osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT/backend' && npm run dev\""

sleep 3

# Abre o frontend em outra janela do Terminal
echo "🎨 Iniciando frontend na porta 3000..."
osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT/frontend' && npm run dev\""

sleep 3

# Verifica se o backend está respondendo
echo ""
echo "⏳ Aguardando backend iniciar..."
for i in {1..10}; do
  if curl -s --max-time 1 http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend OK em http://localhost:3001"
    break
  fi
  sleep 1
done

echo ""
echo "============================================="
echo "🌐 Frontend: http://localhost:3000"
echo "📡 Backend:  http://localhost:3001/api/health"
echo "============================================="
echo ""
echo "Pressione Ctrl+C para encerrar esse script."
echo "(Os servidores continuam rodando nas janelas do Terminal)"
