#!/usr/bin/env bash
set -euo pipefail

# Script para generar el código QR y la página final con los marcadores reemplazados.
# Uso: ./generar-qr.sh <URL_DE_LA_PAGINA> <URL_DEL_APK> <VERSION>

if [ "$#" -ne 3 ]; then
  echo "Uso: $0 <URL_DE_LA_PAGINA> <URL_DEL_APK> <VERSION>" >&2
  exit 1
fi

PAGE_URL="$1"
APK_URL="$2"
VERSION="$3"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Verificar existencia de qrencode
if ! command -v qrencode >/dev/null 2>&1; then
  echo "Error: 'qrencode' no está instalado en el sistema." >&2
  echo "Instálalo ejecutando: sudo apt install qrencode" >&2
  exit 1
fi

# 2. Verificar que index.html base exista
if [ ! -f "index.html" ]; then
  echo "Error: no se encontró 'index.html' en $SCRIPT_DIR" >&2
  exit 1
fi

# 3. Generar qr.svg con qrencode
echo "Generando qr.svg para '$PAGE_URL'..."
qrencode -t SVG -o qr.svg -s 8 -m 2 "$PAGE_URL"

# 4. Función para escapar valores para el reemplazo en sed
# Escapa backslashes (\), ampersands (&) y la barra delimitadora (/)
escape_sed() {
  printf '%s\n' "$1" | sed -e 's/[\\/&]/\\&/g'
}

ESC_APK_URL="$(escape_sed "$APK_URL")"
ESC_VERSION="$(escape_sed "$VERSION")"

# 5. Generar index.generado.html reemplazando __APK_URL__ y __VERSION__
echo "Generando index.generado.html..."
sed -e "s/__APK_URL__/${ESC_APK_URL}/g" \
    -e "s/__VERSION__/${ESC_VERSION}/g" \
    index.html > index.generado.html

echo "Listo. Se generó qr.svg e index.generado.html exitosamente."
