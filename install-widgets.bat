@echo off
REM Script de Instalación del Sistema de Widgets para Windows
REM Para crypto-search

echo ================================================
echo   Sistema de Widgets - Instalacion
echo ================================================
echo.

REM Paso 1: Instalar dependencias
echo Paso 1: Instalando dependencias...
call npm install

if %errorlevel% neq 0 (
    echo Error al instalar dependencias
    pause
    exit /b 1
)

echo.
echo Dependencias instaladas correctamente
echo.

REM Paso 2: Verificar instalación
echo Paso 2: Verificando instalacion...

if exist "node_modules\react-grid-layout\package.json" (
    echo [OK] react-grid-layout instalado
) else (
    echo [ERROR] react-grid-layout no encontrado
    pause
    exit /b 1
)

if exist "src\app\dashboard\page.tsx" (
    echo [OK] Pagina de dashboard creada
) else (
    echo [ERROR] Pagina de dashboard no encontrada
    pause
    exit /b 1
)

if exist "src\hooks\useWidgets.ts" (
    echo [OK] Hook useWidgets creado
) else (
    echo [ERROR] Hook useWidgets no encontrado
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Instalacion Completada con Exito
echo ================================================
echo.
echo Para iniciar el proyecto:
echo    npm run dev
echo.
echo Luego navega a:
echo    http://localhost:3000/dashboard
echo.
echo Documentacion:
echo    - INSTALL_WIDGETS.md
echo    - WIDGETS_README.md
echo    - WIDGETS_SUMMARY.md
echo.
echo ================================================
pause
