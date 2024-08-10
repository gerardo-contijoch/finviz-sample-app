$dataDir = "$((Get-Location).Path)\data"

if (-not (Test-Path -Path $dataDir)) {
    New-Item -Path $dataDir -ItemType Directory
}

& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath $dataDir