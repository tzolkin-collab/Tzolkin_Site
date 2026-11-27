param(
  [Parameter(Mandatory = $true)]
  [string]$InputVideo,

  [string]$MobileVideo = "",

  [int]$Fps = 24,
  [int]$DesktopWidth = 1600,
  [int]$MobileWidth = 720,
  [int]$Quality = 82
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
              [System.Environment]::GetEnvironmentVariable("Path", "User") + ";" +
              "$env:LOCALAPPDATA\Microsoft\WinGet\Links"
}

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  throw "ffmpeg not found in PATH. Restart your terminal or install Gyan.FFmpeg via winget."
}

$resolvedDesktop = (Resolve-Path -Path $InputVideo).Path
$hasCustomMobile = -not [string]::IsNullOrWhiteSpace($MobileVideo)
$resolvedMobile = if ($hasCustomMobile) { (Resolve-Path -Path $MobileVideo).Path } else { $resolvedDesktop }

$framesRoot = Join-Path $PSScriptRoot "frames"
$desktopDir = Join-Path $framesRoot "desktop"
$mobileDir = Join-Path $framesRoot "mobile"

foreach ($dir in @($desktopDir, $mobileDir)) {
  if (Test-Path $dir) {
    Remove-Item -Path $dir -Recurse -Force
  }
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "Extracting Desktop sequence ($Fps fps @ ${DesktopWidth}px WebP q=$Quality)..."
& ffmpeg -y -i $resolvedDesktop `
  -vf "fps=$Fps,scale=${DesktopWidth}:-2:flags=lanczos" `
  -c:v libwebp -quality $Quality -compression_level 4 -preset picture -an `
  (Join-Path $desktopDir "frame-%04d.webp")

if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg failed while generating Desktop frames."
}

if ($hasCustomMobile) {
  Write-Host "Extracting dedicated iPhone sequence ($Fps fps @ ${MobileWidth}px WebP q=$Quality)..."
  $mobileFilter = "fps=$Fps,scale=${MobileWidth}:-2:flags=lanczos"
} else {
  Write-Host "Extracting center-cropped 9:16 iPhone sequence ($Fps fps @ ${MobileWidth}px WebP q=$Quality)..."
  $mobileFilter = "fps=$Fps,crop=ih*9/16:ih,scale=${MobileWidth}:-2:flags=lanczos"
}

& ffmpeg -y -i $resolvedMobile `
  -vf $mobileFilter `
  -c:v libwebp -quality $Quality -compression_level 4 -preset picture -an `
  (Join-Path $mobileDir "frame-%04d.webp")

if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg failed while generating Mobile frames."
}

$desktopFiles = Get-ChildItem -Path $desktopDir -Filter "frame-*.webp"
$mobileFiles = Get-ChildItem -Path $mobileDir -Filter "frame-*.webp"

$desktopCount = $desktopFiles.Count
$mobileCount = $mobileFiles.Count

$desktopBytes = ($desktopFiles | Measure-Object -Property Length -Sum).Sum
$mobileBytes = ($mobileFiles | Measure-Object -Property Length -Sum).Sum
$totalMb = [math]::Round((($desktopBytes + $mobileBytes) / 1MB), 2)

$manifestPath = Join-Path $framesRoot "manifest.js"
$manifestContent = @"
window.TZOLKIN_FRAMES = {
  desktop: {
    count: $desktopCount,
    pattern: "assets/frames/desktop/frame-{index}.webp"
  },
  mobile: {
    count: $mobileCount,
    pattern: "assets/frames/mobile/frame-{index}.webp"
  }
};
"@

[System.IO.File]::WriteAllText(
  $manifestPath,
  $manifestContent,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host "Done: Desktop=$desktopCount frames, Mobile=$mobileCount frames (${totalMb} MB total)."
Write-Host "Manifest updated: $manifestPath"
