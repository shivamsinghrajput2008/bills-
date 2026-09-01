# SUPER BACHAT BAZZAR - HTTP Web Server
param(
    [int]$Port = 8080
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "SUPER BACHAT BAZZAR POS SERVER is running at: http://localhost:$Port/" -ForegroundColor Green
} catch {
    Write-Host "Error starting listener on port $Port : $_" -ForegroundColor Red
    exit 1
}

$root = $PSScriptRoot
if (-not $root) {
    $root = (Get-Location).Path
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq '/' -or $urlPath -eq '') {
            $urlPath = '/index.html'
        }

        $cleanPath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = [System.IO.Path]::Combine($root, $cleanPath)

        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = 'text/plain'
            switch ($ext) {
                '.html' { $contentType = 'text/html; charset=utf-8' }
                '.css'  { $contentType = 'text/css; charset=utf-8' }
                '.js'   { $contentType = 'application/javascript; charset=utf-8' }
                '.json' { $contentType = 'application/json; charset=utf-8' }
                '.png'  { $contentType = 'image/png' }
                '.jpg'  { $contentType = 'image/jpeg' }
                '.jpeg' { $contentType = 'image/jpeg' }
                '.svg'  { $contentType = 'image/svg+xml' }
                '.ico'  { $contentType = 'image/x-icon' }
            }

            $response.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }

        $response.OutputStream.Close()
    } catch {
        # Continue loop on connection error
    }
}
