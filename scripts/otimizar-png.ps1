param(
  [string]$Pasta = "image",
  [int]$LarguraMaxima = 900
)

Add-Type -AssemblyName System.Drawing

$arquivos = Get-ChildItem -LiteralPath $Pasta -Include *.png -Recurse -File
$codigoPng = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/png' }

$totalAntes = 0L
$totalDepois = 0L

foreach ($arquivo in $arquivos) {
  $totalAntes += $arquivo.Length

  $origem = [System.Drawing.Image]::FromFile($arquivo.FullName)
  $largura = $origem.Width
  $altura = $origem.Height
  $escala = [Math]::Min(1.0, $LarguraMaxima / [double]$largura)
  $novoW = [int][Math]::Round($largura * $escala)
  $novoH = [int][Math]::Round($altura * $escala)
  $origem.Dispose()

  $bitmap = New-Object System.Drawing.Bitmap($novoW, $novoH)
  $bitmap.SetResolution(96, 96)

  $grafico = [System.Drawing.Graphics]::FromImage($bitmap)
  $grafico.InterpolationMode = 'HighQualityBicubic'
  $grafico.SmoothingMode = 'HighQuality'
  $grafico.PixelOffsetMode = 'HighQuality'
  $grafico.Clear([System.Drawing.Color]::Transparent)
  $origem = [System.Drawing.Image]::FromFile($arquivo.FullName)
  $grafico.DrawImage($origem, 0, 0, $novoW, $novoH)
  $grafico.Dispose()
  $origem.Dispose()

  $parametros = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $parametros.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Compression, [long]9
  )

  $temp = [System.IO.Path]::GetTempFileName() + ".png"
  $bitmap.Save($temp, $codigoPng, $parametros)
  $bitmap.Dispose()

  $tamanhoTemp = (Get-Item $temp).Length
  if ($tamanhoTemp -lt $arquivo.Length) {
    [System.IO.File]::Copy($temp, $arquivo.FullName, $true)
  }
  Remove-Item -LiteralPath $temp -Force

  $totalDepois += (Get-Item $arquivo.FullName).Length
}

"{0} PNG: {1} MB -> {2} MB" -f $arquivos.Count,
  [math]::Round($totalAntes / 1MB, 2),
  [math]::Round($totalDepois / 1MB, 2)