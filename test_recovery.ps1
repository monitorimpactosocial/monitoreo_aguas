# Test password recovery flow

function Get-SHA256Hash {
    param([string]$Text)
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    $hash = [System.Security.Cryptography.HashAlgorithm]::Create('SHA256').ComputeHash($bytes)
    return -join ($hash | ForEach-Object { '{0:x2}' -f $_ })
}

$apiUrl = 'https://script.google.com/macros/s/AKfycbwbucoyKXmCqeFWXft6BhOsSbB0jCO7pOiOm2XnDwqAbWGPUfs5a4ZOFqxGljgGfqiJrQ/exec'

# Test 1: Ping backend
Write-Host "=== TEST 1: Ping Backend ===" -ForegroundColor Cyan
$pingUrl = [System.Uri]::EscapeUriString("$apiUrl`?action=ping")
Write-Host "URL: $pingUrl" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $pingUrl -UseBasicParsing -TimeoutSec 15
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response (first 500 chars):"
    Write-Host $response.Content.Substring(0, [Math]::Min(500, $response.Content.Length)) -ForegroundColor Magenta
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Request reset code
Write-Host "=== TEST 2: Request Reset Code ===" -ForegroundColor Cyan
$account = "admin"
$payload = [System.Web.HttpUtility]::UrlEncode('{"account":"' + $account + '"}')
$requestUrl = "$apiUrl`?action=authRequestReset&callback=testCb&payload=$payload"
Write-Host "URL: $requestUrl" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $requestUrl -UseBasicParsing -TimeoutSec 15
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response (first 500 chars):"
    Write-Host $response.Content.Substring(0, [Math]::Min(500, $response.Content.Length)) -ForegroundColor Magenta
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== INFO ===" -ForegroundColor Cyan
$hash = Get-SHA256Hash "prueba1234"
Write-Host "SHA256(prueba1234) = $hash"
