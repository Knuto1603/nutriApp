---
type: nota
tags: [despliegue, instalacion, eas, expo, nutriapp]
created: 2026-07-02
links: [[../01-Arquitectura/Stack-Tecnologico]]
---

# Despliegue e Instalación en Móvil

## Etapas del ciclo de despliegue

```
Desarrollo → Pruebas internas → Distribución académica → Producción
   Expo Go      APK / EAS           APK por enlace        Google Play
```

---

## Etapa 1 — Desarrollo diario (Expo Go)

**Para qué:** probar cambios al instante durante el desarrollo.

```bash
npx expo start          # inicia el servidor de desarrollo
# Escanear QR con la app "Expo Go" desde el celular (misma red WiFi)
```

| Ventaja | Desventaja |
|---------|-----------|
| Sin compilar, instantáneo | Requiere Expo Go instalado |
| Ver cambios en tiempo real | No soporta módulos nativos personalizados |
| Gratis | Requiere misma red WiFi |

---

## Etapa 2 — APK para pruebas y demo académica

**Para qué:** compartir la app con compañeros, docentes o en la presentación del proyecto.

### Configurar EAS

```bash
npm install -g eas-cli
eas login                          # cuenta Expo (gratuita)
eas build:configure                # genera eas.json
```

### Generar APK (Android)

```bash
eas build --platform android --profile preview
```

El archivo `.apk` se genera en la nube de Expo (no necesitas Android Studio). Se descarga y comparte por:
- Enlace directo (Expo Dashboard)
- WhatsApp / Telegram
- Google Drive / correo

**Instalación en Android:**
1. Abrir el `.apk` en el celular
2. Activar "Fuentes desconocidas" si lo pide (Ajustes → Seguridad)
3. Instalar

---

### Compartir el APK con un QR (carpeta `distribucion/`)

1. `eas build --platform android --profile preview` y descargar el `.apk`.
2. Subir el APK a un enlace estable (GitHub Releases, Drive o Cloudflare Pages).
3. `cd distribucion && ./generar-qr.sh <URL_DE_LA_PAGINA> <URL_DEL_APK> <VERSION>` genera `qr.svg` e `index.generado.html` (requiere `qrencode`).
4. Publicar la carpeta `distribucion/` y compartir el QR.

> Solo Android. En iPhone un APK no instala; harían falta TestFlight (99 USD/año) o una versión web.

---

## Etapa 3 — Actualizaciones OTA (Over The Air)

**Para qué:** actualizar la app sin que el usuario reinstale.

```bash
eas update --branch preview --message "corrección de menús"
```

La app descarga el cambio automáticamente en el próximo inicio.

---

## Etapa 4 — Producción en Google Play

**Para qué:** distribución oficial pública.

```bash
eas build --platform android --profile production    # genera .aab
eas submit --platform android                        # sube a Play Console
```

**Requisitos:**
- Cuenta de desarrollador Google Play: $25 USD (pago único)
- Tiempo de revisión: 1-3 días hábiles
- Iconos, screenshots y descripción de la app

---

## Configuración eas.json

```json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": { "buildType": "apk" },
      "distribution": "internal"
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## Resumen de costos

| Etapa | Costo | Herramienta |
|-------|-------|-------------|
| Desarrollo | Gratis | Expo Go |
| APK interno | Gratis (15 builds/mes) | EAS Build |
| Actualización OTA | Gratis | EAS Update |
| Google Play | $25 USD (único) | Play Console |
| Apple App Store | $99 USD/año | App Store Connect |

---

## Requisitos en la PC del desarrollador

| Herramienta | ¿Requerida? |
|-------------|------------|
| Node.js 18+ | ✅ Sí |
| Expo CLI / EAS CLI | ✅ Sí |
| Android Studio | ❌ No (compila en nube) |
| Xcode | ❌ No (compila en nube) |
| Cuenta Expo | ✅ Sí (gratuita) |

---

## Referencias

- [[../01-Arquitectura/Stack-Tecnologico]] — Expo SDK y EAS como parte del stack
- [[../05-Roadmap/Roadmap]] — en qué fase del proyecto se realiza cada etapa
