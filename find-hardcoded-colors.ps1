# Script para buscar archivos con colores hardcodeados
Write-Host "🔍 Buscando archivos con colores hardcodeados..." -ForegroundColor Cyan

$patterns = @(
    '#00ff00',
    '#00cc00', 
    '#33ff33',
    '#0a0f1e',
    '#0d1420',
    '#111827',
    'bg-\[#',
    'text-\[#',
    'border-\[#'
)

$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts | Where-Object {
    $_.FullName -notmatch 'node_modules'
}

$filesWithHardcodedColors = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    foreach ($pattern in $patterns) {
        if ($content -match $pattern) {
            $filesWithHardcodedColors += $file.FullName
            break
        }
    }
}

if ($filesWithHardcodedColors.Count -eq 0) {
    Write-Host "✅ No se encontraron colores hardcodeados!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Archivos con colores hardcodeados:" -ForegroundColor Yellow
    $filesWithHardcodedColors | ForEach-Object {
        $relativePath = $_.Replace((Get-Location).Path, "").TrimStart('\')
        Write-Host "   - $relativePath" -ForegroundColor Red
    }
    Write-Host "`nTotal: $($filesWithHardcodedColors.Count) archivos" -ForegroundColor Yellow
}
