# Install dependencies and start the app
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  GEOLOGIX - Frontend Setup" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan

Set-Location "C:\SIH\access-ai"

Write-Host "
[1/2] Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "
[2/2] Starting development server..." -ForegroundColor Green
Write-Host "Server will run at: http://localhost:5173" -ForegroundColor Yellow
npm run dev
