@echo off
echo ====================================
echo LIMPIANDO Y RECREANDO ESTRUCTURA
echo ====================================

REM Ir a la carpeta correcta
cd crypto-search

echo.
echo [1/3] Eliminando ramas locales conflictivas...
git branch -D docs/update-readme 2>nul
git branch -D feature/widgets-personalizables 2>nul

echo.
echo [2/3] Traer cambios remotos...
git fetch origin

echo.
echo [3/3] Hacer push forzado de nuevas ramas...
git push origin develop --force
git push origin feature/authentication-system --force
git push origin feature/home-search --force
git push origin feature/social-network --force
git push origin feature/portfolio-management --force
git push origin feature/price-alerts --force
git push origin feature/user-profiles --force
git push origin feature/ui-terminal-design --force
git push origin feature/validations --force
git push origin docs/documentation --force
git push origin main --force
git push origin --tags --force

echo.
echo ====================================
echo COMPLETADO
echo ====================================
echo.
echo Todas las ramas nuevas subidas a GitHub!
echo Verifica en: https://github.com/Santiago13dev/crypto-search
echo.
pause
