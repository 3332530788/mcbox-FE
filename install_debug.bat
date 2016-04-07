@echo off
echo install...

reg add HKCU\Software\aipai\mcbox /v Debug /t REG_SZ /d 1 /f

echo successfully
pause