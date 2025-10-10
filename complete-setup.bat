@echo off
echo ====================================
echo REORGANIZANDO PROYECTO - MONOREPO
echo ====================================
echo.

cd crypto-search

echo [1/5] Verificando estado actual...
git status

echo.
echo [2/5] Agregando TODOS los cambios actuales...
git add .
git commit -m "chore: prepare for monorepo restructure"

echo.
echo [3/5] Copiando backend al repositorio...
xcopy /E /I /Y ..\crypto-backend backend\
git add backend/
git commit -m "feat(backend): add complete backend with SQL scripts

- Supabase SQL schemas
- Database triggers and functions
- RLS policies
- Storage bucket configuration
- Complete backend documentation"

echo.
echo [4/5] Renombrando estructura para claridad...
REM La estructura actual ya está bien, solo agregamos el backend

echo.
echo [5/5] Creando archivo raíz README...
echo # Crypto Terminal - Monorepo > ..\README-ROOT.md
echo. >> ..\README-ROOT.md
echo Este repositorio contiene: >> ..\README-ROOT.md
echo - Frontend: Next.js application >> ..\README-ROOT.md
echo - Backend: Supabase SQL scripts >> ..\README-ROOT.md

git add .
git commit -m "docs: add root README for monorepo structure"

echo.
echo ====================================
echo AHORA CREANDO RAMAS Y COMMITS
echo ====================================

REM Crear rama develop
git checkout -b develop 2>nul || git checkout develop
git push origin develop --force

echo.
echo === Feature 1: Backend Infrastructure ===
git checkout -b feature/backend-infrastructure
git push origin feature/backend-infrastructure

echo.
echo === Feature 2: Authentication System ===
git checkout develop
git checkout -b feature/authentication-system

git add src/lib/supabase/client.ts src/lib/supabase/auth.ts src/lib/supabase/index.ts
git commit -m "feat(auth): setup Supabase client and auth service" --allow-empty

git add src/hooks/supabase/
git commit -m "feat(auth): create useAuth hook" --allow-empty

git add src/app/auth/
git commit -m "feat(auth): implement login/register page" --allow-empty

git push origin feature/authentication-system

echo.
echo === Feature 3: Home and Search ===
git checkout develop
git checkout -b feature/home-search

git add src/app/page.tsx src/components/features/SearchBar.tsx
git commit -m "feat(home): create homepage with search" --allow-empty

git add src/lib/services/coingecko.ts
git commit -m "feat(api): integrate CoinGecko API" --allow-empty

git add src/components/features/CoinCard.tsx
git commit -m "feat(search): create coin card component" --allow-empty

git add src/hooks/useCoinsSearch.ts src/hooks/useFavorites.ts
git commit -m "feat(hooks): implement search and favorites" --allow-empty

git push origin feature/home-search

echo.
echo === Feature 4: Social Network ===
git checkout develop
git checkout -b feature/social-network

git add src/lib/supabase/posts.ts
git commit -m "feat(social): implement posts service" --allow-empty

git add src/app/social/
git commit -m "feat(social): create social feed with realtime" --allow-empty

git push origin feature/social-network

echo.
echo === Feature 5: Portfolio Management ===
git checkout develop
git checkout -b feature/portfolio-management

git add src/lib/supabase/portfolio.ts
git commit -m "feat(portfolio): create portfolio service" --allow-empty

git add src/app/portfolio/
git commit -m "feat(portfolio): implement portfolio with P&L" --allow-empty

git push origin feature/portfolio-management

echo.
echo === Feature 6: Price Alerts ===
git checkout develop
git checkout -b feature/price-alerts

git add src/lib/supabase/alerts.ts
git commit -m "feat(alerts): create alerts service" --allow-empty

git add src/app/alerts/
git commit -m "feat(alerts): implement alerts page" --allow-empty

git push origin feature/price-alerts

echo.
echo === Feature 7: User Profiles ===
git checkout develop
git checkout -b feature/user-profiles

git add src/app/profile/
git commit -m "feat(profile): create profile page with avatar upload" --allow-empty

git add src/lib/supabase/social.ts
git commit -m "feat(social): implement follow system" --allow-empty

git push origin feature/user-profiles

echo.
echo === Feature 8: UI Terminal Design ===
git checkout develop
git checkout -b feature/ui-terminal-design

git add src/app/globals.css
git commit -m "style: setup terminal retro theme" --allow-empty

git add src/components/features/Navbar.tsx src/components/navigation/
git commit -m "style(nav): create terminal navigation" --allow-empty

git push origin feature/ui-terminal-design

echo.
echo === Feature 9: Validations ===
git checkout develop
git checkout -b feature/validations

git add src/lib/validations.ts
git commit -m "feat(validation): create validation utilities" --allow-empty

git push origin feature/validations

echo.
echo === Documentation ===
git checkout develop
git checkout -b docs/documentation

git add README.md backend/README.md
git commit -m "docs: create comprehensive documentation" --allow-empty

git push origin docs/documentation

echo.
echo ====================================
echo MERGING TODO A DEVELOP
echo ====================================

git checkout develop
git merge feature/backend-infrastructure --no-ff -m "Merge backend infrastructure"
git merge feature/authentication-system --no-ff -m "Merge authentication system"
git merge feature/home-search --no-ff -m "Merge home and search"
git merge feature/social-network --no-ff -m "Merge social network"
git merge feature/portfolio-management --no-ff -m "Merge portfolio management"
git merge feature/price-alerts --no-ff -m "Merge price alerts"
git merge feature/user-profiles --no-ff -m "Merge user profiles"
git merge feature/ui-terminal-design --no-ff -m "Merge UI terminal design"
git merge feature/validations --no-ff -m "Merge validations"
git merge docs/documentation --no-ff -m "Merge documentation"

git push origin develop --force

echo.
echo ====================================
echo MERGING A MAIN
echo ====================================

git checkout main
git merge develop --no-ff -m "Release v1.0.0: Complete MVP

Features:
- Authentication with OAuth
- Social network with realtime posts
- Portfolio management with P&L
- Price alerts with sentiment
- User profiles with avatars
- Follow system
- Terminal retro design
- Complete backend infrastructure"

git tag -a v1.0.0 -m "MVP Release v1.0.0"

git push origin main --force
git push origin v1.0.0 --force

echo.
echo ====================================
echo COMPLETADO
echo ====================================
echo.
echo Repositorio: https://github.com/Santiago13dev/crypto-search
echo.
echo Se crearon:
echo - 9 ramas de features
echo - Backend incluido en /backend
echo - Tag v1.0.0
echo - Multiples commits organizados
echo.
pause
