# Frost Project Setup & Restoration Script
# This script automates the fixes performed to restore the landing page and configure the environment.

$ProjectRoot = Get-Location
Write-Host "--- Frost Project Setup ---" -ForegroundColor Cyan

# 1. Restore Static Assets (Landing Page Fix)
Write-Host "[1/4] Checking static assets..." -ForegroundColor Yellow
$FrostCss = Join-Path $ProjectRoot "frost\css"
$FrostJs = Join-Path $ProjectRoot "frost\js"
$RootCss = Join-Path $ProjectRoot "css"
$RootJs = Join-Path $ProjectRoot "js"

if (Test-Path $FrostCss) {
    Write-Host "Moving CSS from frost/ top root..."
    Move-Item -Path $FrostCss -Destination $RootCss -Force -ErrorAction SilentlyContinue
}
if (Test-Path $FrostJs) {
    Write-Host "Moving JS from frost/ top root..."
    Move-Item -Path $FrostJs -Destination $RootJs -Force -ErrorAction SilentlyContinue
}
Write-Host "Static assets restored." -ForegroundColor Green

# 2. Ensure Web Public Directory & Assets
Write-Host "[2/4] Verifying web public assets..." -ForegroundColor Yellow
$WebPublic = Join-Path $ProjectRoot "web\public"
$ViteSvg = Join-Path $WebPublic "vite.svg"

if (!(Test-Path $WebPublic)) {
    New-Item -ItemType Directory -Path $WebPublic -Force | Out-Null
    Write-Host "Created web/public directory."
}

if (!(Test-Path $ViteSvg)) {
    $SvgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#646CFF" d="M18 3L4 18h8l-2 11L28 14h-8l2-11z"/></svg>'
    Set-Content -Path $ViteSvg -Value $SvgContent
    Write-Host "Restored missing vite.svg placeholder."
}

# 3. Environment Configuration Check
Write-Host "[3/4] Checking environment files..." -ForegroundColor Yellow
$ApiEnv = Join-Path $ProjectRoot "api\.env"
$ApiEnvExample = Join-Path $ProjectRoot "api\.env.example"

if (!(Test-Path $ApiEnv)) {
    Write-Host "WARNING: api/.env is missing. Copying from .env.example..." -ForegroundColor Red
    Copy-Item -Path $ApiEnvExample -Destination $ApiEnv
} else {
    Write-Host "api/.env is present." -ForegroundColor Green
}

# 4. Tooling Check
Write-Host "[4/4] Verifying development tools..." -ForegroundColor Yellow
$tools = @("node", "npm", "git", "python")
foreach ($tool in $tools) {
    if (Get-Command $tool -ErrorAction SilentlyContinue) {
        $version = & $tool --version
        Write-Host "$tool is installed ($version)" -ForegroundColor Green
    } else {
        Write-Host "CRITICAL: $tool is NOT found in PATH." -ForegroundColor Red
    }
}

Write-Host "`n--- Setup Complete ---" -ForegroundColor Cyan
Write-Host "To start the project:"
Write-Host "1. cd web; npm install; npm run dev"
Write-Host "2. cd api; npm install; npm run dev"
