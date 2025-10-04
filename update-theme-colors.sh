#!/bin/bash

# Script para actualizar todos los colores hardcodeados a variables de tema
# Ejecutar desde la raíz del proyecto

echo "🎨 Actualizando colores a variables de tema..."

# Función para reemplazar en todos los archivos .tsx y .ts
replace_in_files() {
    local search=$1
    local replace=$2
    echo "  Reemplazando: $search → $replace"
    
    find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s/$search/$replace/g" {} \;
}

# Reemplazos de clases de Tailwind
replace_in_files "bg-\[#0a0f1e\]" "bg-background"
replace_in_files "bg-\[#0d1420\]" "bg-background-secondary"
replace_in_files "bg-\[#111827\]" "bg-background-tertiary"

replace_in_files "text-\[#00ff00\]" "text-primary"
replace_in_files "border-\[#00ff00\]" "border-primary"

# Reemplazos en propiedades de estilo inline
replace_in_files "#00ff00" "var(--color-primary)"
replace_in_files "#00cc00" "var(--color-primary-dark)"
replace_in_files "#33ff33" "var(--color-primary-light)"

echo "✅ Actualización completada!"
echo "🔄 Reinicia el servidor: npm run dev"
