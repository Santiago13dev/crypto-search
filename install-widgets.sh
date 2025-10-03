#!/bin/bash

# 🚀 Script de Instalación del Sistema de Widgets
# Para crypto-search

echo "================================================"
echo "  🎯 Instalando Sistema de Widgets"
echo "================================================"
echo ""

# Paso 1: Instalar dependencias
echo "📦 Paso 1: Instalando dependencias..."
npm install

echo ""
echo "✅ Dependencias instaladas correctamente"
echo ""

# Paso 2: Verificar instalación
echo "🔍 Paso 2: Verificando instalación..."

if [ -f "node_modules/react-grid-layout/package.json" ]; then
    echo "✅ react-grid-layout instalado"
else
    echo "❌ Error: react-grid-layout no encontrado"
    exit 1
fi

if [ -f "src/app/dashboard/page.tsx" ]; then
    echo "✅ Página de dashboard creada"
else
    echo "❌ Error: Página de dashboard no encontrada"
    exit 1
fi

if [ -f "src/hooks/useWidgets.ts" ]; then
    echo "✅ Hook useWidgets creado"
else
    echo "❌ Error: Hook useWidgets no encontrado"
    exit 1
fi

echo ""
echo "================================================"
echo "  ✨ Instalación Completada con Éxito"
echo "================================================"
echo ""
echo "🚀 Para iniciar el proyecto:"
echo "   npm run dev"
echo ""
echo "🌐 Luego navega a:"
echo "   http://localhost:3000/dashboard"
echo ""
echo "📚 Documentación:"
echo "   - INSTALL_WIDGETS.md"
echo "   - WIDGETS_README.md"
echo "   - WIDGETS_SUMMARY.md"
echo ""
echo "================================================"
