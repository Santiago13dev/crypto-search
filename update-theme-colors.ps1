# Script PowerShell para actualizar todos los colores a variables de tema
# Ejecutar: .\update-theme-colors.ps1

Write-Host "🎨 Actualizando colores a variables de tema..." -ForegroundColor Green

$replacements = @{
    'bg-\[#0a0f1e\]' = 'bg-background'
    'bg-\[#0d1420\]' = 'bg-background-secondary'
    'bg-\[#111827\]' = 'bg-background-tertiary'
    'text-\[#00ff00\]' = 'text-primary'
    'border-\[#00ff00\]' = 'border-primary'
}

# Obtener todos los archivos .tsx y .ts
$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($search in $replacements.Keys) {
        if ($content -match $search) {
            $content = $content -replace $search, $replacements[$search]
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  ✓ Actualizado: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "`n✅ Actualización completada!" -ForegroundColor Green
Write-Host "🔄 Reinicia el servidor: npm run dev" -ForegroundColor Yellow
