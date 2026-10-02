param(
  [string]$Pasta = "uploads\pets",
  [int]$LarguraMaxima = 720,
  [int]$Qualidade = 72
)

Add-Type -AssemblyName System.Drawing

$arquivos = Get-ChildItem -LiteralPath $Pasta -Include *.jpg,*.png,*.jpeg -Recurse -File
$totalAntes = 0L
$totalDepois = 0L

$codigo = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }

foreach ($arquivo in $arquivos) {
  $totalAntes += $arquivo.Length

  $origem = [System.Drawing.Image]::FromFile($arquivo.FullName)
  $larguraOriginal = $origem.Width
  $alturaOriginal = $origem.Height
  $escala = [Math]::Min(1.0, $LarguraMaxima / [double]$larguraOriginal)
  $novoW = [int][Math]::Round($larguraOriginal * $escala)
  $novoH = [int][Math]::Round($alturaOriginal * $escala)
  $origem.Dispose()

  $bitmap = New-Object System.Drawing.Bitmap($novoW, $novoH)
  $grafico = [System.Drawing.Graphics]::FromImage($bitmap)
  $grafico.InterpolationMode = 'HighQualityBicubic'
  $grafico.SmoothingMode = 'HighQuality'
  $grafico.PixelOffsetMode = 'HighQuality'
  $origem = [System.Drawing.Image]::FromFile($arquivo.FullName)
  $grafico.DrawImage($origem, 0, 0, $novoW, $novoH)
  $grafico.Dispose()
  $origem.Dispose()

  $parametros = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $parametros.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]$Qualidade
  )

  $temp = [System.IO.Path]::GetTempFileName() + ".jpg"
  $bitmap.Save($temp, $codigo, $parametros)
  $bitmap.Dispose()

  $tempTamanho = (Get-Item $temp).Length
  if ($tempTamanho -lt $arquivo.Length) {
    [System.IO.File]::Copy($temp, $arquivo.FullName, $true)
  }
  Remove-Item -LiteralPath $temp -Force

  $totalDepois += (Get-Item $arquivo.FullName).Length
}

"{0} arquivos: {1} MB -> {2} MB" -f $arquivos.Count,
  [math]::Round($totalAntes / 1MB, 1),
  [math]::Round($totalDepois / 1MB, 1)