@echo off
echo uninst...

reg delete HKCU\Software\aipai\mcbox /v Debug /f

echo uninst successfully
pause