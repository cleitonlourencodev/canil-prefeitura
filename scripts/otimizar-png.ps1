param(
  [string]$Pasta = "image",
  [int]$LarguraMaxima = 900
)

Add-Type -AssemblyName System.Drawing

$arquivos = Get-ChildItem -LiteralPath $Pasta -Recurse -File |
  Where-Object { $_.Extension -eq '.png' }

if (-not $arquivos) {
  "nenhum PNG em $Pasta"
  return
}

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

  # 32bppArgb e obrigatorio: e o formato que preserva o canal alfa do original.
  $bitmap = New-Object System.Drawing.Bitmap($novoW, $novoH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
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

  # Verificacao de seguranca: um PNG transparente nao pode virar opaco.
  $verificacao = [System.Drawing.Bitmap]::FromFile($temp)
  $canto = $verificacao.GetPixel(0, 0)
  $formato = $verificacao.PixelFormat
  $verificacao.Dispose()

  if ($formato -notmatch 'Argb|PArgb' -and $canto.A -eq 0) {
    "ERRO: $($arquivo.Name) ficou sem canal alfa (formato $formato). Descartado."
    Remove-Item -LiteralPath $temp -Force
    $totalDepois += $arquivo.Length
    continue
  }

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