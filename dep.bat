@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

set LOGFILE=deploy_prepare.log
echo ============================================== > "%LOGFILE%"
echo   Подготовка к деплою — %date% %time% >> "%LOGFILE%"
echo ============================================== >> "%LOGFILE%"
echo. >> "%LOGFILE%"

call :log "Запуск скрипта подготовки к деплою..."
call :log "Текущая папка: %cd%"

:: 1. Проверка Node.js
call :log "Проверка Node.js..."
where node >nul 2>&1
if errorlevel 1 (
    call :log "ОШИБКА: Node.js не найден. Установите Node.js 18+."
    pause
    exit /b 1
)
call :log "OK: Node.js найден"

:: 2. Проверка npm
call :log "Проверка npm..."
where npm >nul 2>&1
if errorlevel 1 (
    call :log "ОШИБКА: npm не найден."
    pause
    exit /b 1
)
call :log "OK: npm найден"

:: 3. Проверка наличия package.json
if not exist "package.json" (
    call :log "ОШИБКА: package.json не найден. Скрипт должен выполняться в корне проекта."
    pause
    exit /b 1
)

:: 4. Создание .env с DATABASE_URL (строка из памяти)
call :log "Создание .env файла..."
if exist ".env" (
    call :log ".env уже существует, перезаписываем..."
)
(
echo DATABASE_URL=postgresql://neondb_owner:npg_y0LztGY6NFni@ep-withered-haze-ax60q8g2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require^&channel_binding=require
) > ".env"
call :log "OK: .env создан"

:: 5. Установка зависимостей
call :log "Установка зависимостей (npm install)..."
call npm install >> "%LOGFILE%" 2>&1
if errorlevel 1 (
    call :log "ОШИБКА: npm install завершился с ошибкой."
    pause
    exit /b 1
)
call :log "OK: зависимости установлены"

:: 6. Проверка наличия drizzle.config.json
if not exist "drizzle.config.json" (
    call :log "ОШИБКА: drizzle.config.json не найден."
    pause
    exit /b 1
)

:: 7. Генерация миграций
call :log "Генерация миграций..."
npx drizzle-kit generate >> "%LOGFILE%" 2>&1
if errorlevel 1 (
    call :log "ОШИБКА: drizzle-kit generate не удался."
    pause
    exit /b 1
)
call :log "OK: миграции сгенерированы"

:: 8. Применение миграций
call :log "Применение миграций..."
npx drizzle-kit migrate >> "%LOGFILE%" 2>&1
if errorlevel 1 (
    call :log "ОШИБКА: drizzle-kit migrate не удался."
    pause
    exit /b 1
)
call :log "OK: миграции применены"

:: 9. Проверка наличия Git и удалённого репозитория
call :log "Проверка Git..."
where git >nul 2>&1
if errorlevel 1 (
    call :log "ПРЕДУПРЕЖДЕНИЕ: Git не найден, пропускаем коммит и пуш."
    goto :end
)
if not exist ".git" (
    call :log "ПРЕДУПРЕЖДЕНИЕ: не инициализирован Git-репозиторий, пропускаем коммит и пуш."
    goto :end
)

:: Проверка наличия удалённого репозитория
git remote -v | findstr "origin" >nul 2>&1
if errorlevel 1 (
    call :log "ПРЕДУПРЕЖДЕНИЕ: удалённый репозиторий (origin) не настроен, пропускаем коммит и пуш."
    goto :end
)

:: 10. Добавление изменений в Git
call :log "Добавление файлов в Git..."
git add . >> "%LOGFILE%" 2>&1
call :log "OK: файлы добавлены"

:: 11. Коммит
call :log "Создание коммита..."
git commit -m "Prepare for deploy: env, migrations" >> "%LOGFILE%" 2>&1
if errorlevel 1 (
    call :log "Предупреждение: коммит не создан (возможно, нет изменений)."
) else (
    call :log "OK: коммит создан"
)

:: 12. Пуш
call :log "Отправка изменений в удалённый репозиторий..."
git push origin main >> "%LOGFILE%" 2>&1
if errorlevel 1 (
    call :log "ОШИБКА: git push не удался. Возможно, нужно настроить ветку или авторизацию."
    pause
    exit /b 1
)
call :log "OK: изменения отправлены на GitHub"

:end
call :log "=============================================="
call :log "Подготовка завершена."
call :log "Теперь перейдите в Vercel и запустите деплой (если не автоматический)."
call :log "Лог-файл: %LOGFILE%"
call :log "=============================================="
echo.
echo Лог-файл: %LOGFILE%
pause
exit /b 0

:log
echo %*
echo %* >> "%LOGFILE%"
exit /b 0