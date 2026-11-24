# Distribución de NutriApp

Guía para compilar, empaquetar y publicar la landing page de descarga del APK.

## Pasos de despliegue

1. **Generar APK con EAS Build**:
   ```bash
   eas build --platform android --profile preview
   ```
   *(O el perfil configurado para generar archivo `.apk` descargable directo en lugar de `.aab`).*

2. **Subir el APK**:
   Subir el archivo `.apk` generado a tu hosting de descargas (por ejemplo: GitHub Releases, Cloudflare R2 o almacenamiento estático) y obtener la URL pública directa de descarga.

3. **Generar QR y HTML final**:
   Ejecuta el script `generar-qr.sh` pasando la URL donde se publicará esta página, la URL del APK y el número de versión:
   ```bash
   cd distribucion
   ./generar-qr.sh "https://tudominio.com/descarga" "https://tudominio.com/nutriapp-v1.0.0.apk" "1.0.0"
   ```
   Esto generará:
   - `qr.svg`: Código QR vectorial apuntando a la URL de la página.
   - `index.generado.html`: Landing page con los enlaces y versión reemplazados.

4. **Publicar la carpeta**:
   Renombra o sirve `index.generado.html` como `index.html` junto con `qr.svg` en tu servidor web o servicio estático (Cloudflare Pages, Vercel, Nginx, etc.):
   ```bash
   mv index.generado.html index.html
   ```
