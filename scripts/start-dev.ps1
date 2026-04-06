$projectRoot = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $projectRoot 'backend'
$backendLog = Join-Path $backendDir 'backend-restart.log'
$backendPort = 8081
$frontendDir = Join-Path $projectRoot 'frontend'
$authDir = Join-Path $projectRoot 'server'
$authPort = 4000
$authLog = Join-Path $projectRoot 'auth-restart.log'
$frontendPort = 5173
$frontendUrl = 'http://localhost:5173/FSDA-PROJECT/'
$backendWaitTimeoutSeconds = 45

function Test-TcpPort {
    param(
        [string]$HostName,
        [int]$Port
    )

    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $asyncResult = $client.BeginConnect($HostName, $Port, $null, $null)
        $connected = $asyncResult.AsyncWaitHandle.WaitOne(1000, $false)
        if (-not $connected) {
            return $false
        }

        $client.EndConnect($asyncResult)
        return $true
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

function Show-BackendLogTail {
    if (Test-Path $backendLog) {
        Write-Host ''
        Write-Host 'Last lines from backend-restart.log:' -ForegroundColor Yellow
        Get-Content $backendLog -Tail 40
    }
}

function Show-AuthLogTail {
    if (Test-Path $authLog) {
        Write-Host ''
        Write-Host 'Last lines from auth-restart.log:' -ForegroundColor Yellow
        Get-Content $authLog -Tail 40
    }
}

$backendListening = Test-TcpPort -HostName '127.0.0.1' -Port $backendPort

if (-not $backendListening) {
    Write-Host "Starting Spring Boot backend on http://localhost:$backendPort ..."
    Start-Process -FilePath 'cmd.exe' `
        -ArgumentList '/c', 'mvn spring-boot:run > backend-restart.log 2>&1' `
        -WorkingDirectory $backendDir

    $deadline = (Get-Date).AddSeconds($backendWaitTimeoutSeconds)
    do {
        Start-Sleep -Seconds 2
        $backendListening = Test-TcpPort -HostName '127.0.0.1' -Port $backendPort
        if ($backendListening) {
            break
        }
    } while ((Get-Date) -lt $deadline)

    if (-not $backendListening) {
        Write-Host "Backend did not become ready on port $backendPort within $backendWaitTimeoutSeconds seconds." -ForegroundColor Red
        Show-BackendLogTail
        exit 1
    }

    Write-Host "Backend is reachable on http://localhost:$backendPort ." -ForegroundColor Green
} else {
    Write-Host "Backend already running on port $backendPort." -ForegroundColor Green
}

$authListening = Test-TcpPort -HostName '127.0.0.1' -Port $authPort

if (-not $authListening) {
    Write-Host "Starting Node auth server on http://localhost:$authPort ..."
    Start-Process -FilePath 'cmd.exe' `
        -ArgumentList '/c', 'npm run dev > ..\auth-restart.log 2>&1' `
        -WorkingDirectory $authDir

    $authDeadline = (Get-Date).AddSeconds($backendWaitTimeoutSeconds)
    do {
        Start-Sleep -Seconds 2
        $authListening = Test-TcpPort -HostName '127.0.0.1' -Port $authPort
        if ($authListening) {
            break
        }
    } while ((Get-Date) -lt $authDeadline)

    if (-not $authListening) {
        Write-Host "Auth server did not become ready on port $authPort within $backendWaitTimeoutSeconds seconds." -ForegroundColor Red
        Show-AuthLogTail
        exit 1
    }

    Write-Host "Auth server is reachable on http://localhost:$authPort ." -ForegroundColor Green
} else {
    Write-Host "Auth server already running on port $authPort." -ForegroundColor Green
}

Write-Host "Starting Vite frontend on $frontendUrl ..."
$frontendWatcher = @"
$frontendUrl = '$frontendUrl'
$frontendPort = $frontendPort

function Test-TcpPort {
    param(
        [string]`$HostName,
        [int]`$Port
    )

    `$client = New-Object System.Net.Sockets.TcpClient
    try {
        `$asyncResult = `$client.BeginConnect(`$HostName, `$Port, `$null, `$null)
        `$connected = `$asyncResult.AsyncWaitHandle.WaitOne(1000, `$false)
        if (-not `$connected) {
            return `$false
        }

        `$client.EndConnect(`$asyncResult)
        return `$true
    } catch {
        return `$false
    } finally {
        `$client.Dispose()
    }
}

for (`$attempt = 0; `$attempt -lt 30; `$attempt++) {
    if (Test-TcpPort -HostName '127.0.0.1' -Port `$frontendPort) {
        Start-Process `$frontendUrl
        break
    }

    Start-Sleep -Seconds 1
}
"@

Start-Process -FilePath 'powershell.exe' `
    -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', $frontendWatcher `
    -WindowStyle Hidden

Start-Process -FilePath 'cmd.exe' `
    -ArgumentList '/c', 'npm run dev:frontend' `
    -WorkingDirectory $frontendDir `
    -Wait
