@echo off
REM Test password recovery backend

setlocal enabledelayedexpansion

set "apiUrl=https://script.google.com/macros/s/AKfycbwbucoyKXmCqeFWXft6BhOsSbB0jCO7pOiOm2XnDwqAbWGPUfs5a4ZOFqxGljgGfqiJrQ/exec"

echo === TEST 1: Ping Backend ===
curl -s "%apiUrl%?action=ping" | findstr /c:"sheets" && echo Test OK - Backend responding
echo.

echo === TEST 2: Try to request reset code for admin user ===
curl -s "%apiUrl%?action=authRequestReset&callback=cb&payload={\"account\":\"admin\"}"
echo.
echo.
echo === INFO ===
echo Backend URL: %apiUrl%
echo Please check if email was sent to the admin account email address
pause
