@echo off
REM Test password recovery backend

setlocal enabledelayedexpansion

set "apiUrl=https://script.google.com/macros/s/AKfycbx1Q5p4XfPYrBxx5wRnTaERo5E0ItQWB0jI-N13gxNZK88WUt-yiZfJurIQcpfUSVpdjw/exec"
set "account=%~1"
if "%account%"=="" set "account=admin"

echo === TEST 1: Ping Backend ===
curl -s "%apiUrl%?action=ping" | findstr /c:"sheets" && echo Test OK - Backend responding
echo.

echo === TEST 2: Try to request reset code for %account% ===
powershell -NoProfile -Command "$payload=[uri]::EscapeDataString((ConvertTo-Json @{ account = '%account%' } -Compress)); Invoke-WebRequest -Uri '%apiUrl%?action=authRequestReset&callback=cb&payload='$payload -UseBasicParsing | Select-Object -ExpandProperty Content"
echo.
echo.
echo === INFO ===
echo Backend URL: %apiUrl%
echo Please check if email was sent to the registered account email address
pause
