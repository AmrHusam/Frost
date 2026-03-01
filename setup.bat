@echo off
REM Frost Dialer Setup Wrapper
REM This script runs the PowerShell setup with execution policy bypass automatically.
powershell -ExecutionPolicy Bypass -File "%~dp0setup_frost.ps1"
pause
