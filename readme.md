# 🍅 Pomodoro App con p5.js, Vite y Capacitor

Una aplicación móvil de Pomodoro Timer desarrollada con **p5.js**, **Vite** y **Capacitor**, optimizada para dispositivos móviles con haptic feedback y entrada de tareas.

![Pomodoro App Preview](https://img.shields.io/badge/Status-Production_Ready-success)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-blue)
![Tech Stack](https://img.shields.io/badge/Tech-p5.js%20%7C%20Vite%20%7C%20Capacitor-orange)

---

## 🚀 Características Principales

### ✨ Nuevas Funcionalidades (v2.0)

- **📱 Input de Tarea Mobile-Optimized**: Campo de texto siempre visible en footer
- **🟢 Botón Enter Móvil**: Botón verde con icono ↵ para confirmar tareas
- **⚡ Feedback Inmediato**: El título de la tarea se muestra instantáneamente
- **📐 Diseño Responsive**: Posicionamiento con viewport units (`6vh`)
- **🎯 Compatibilidad Android**: Sin solapamiento con la barra de navegación
- **🔄 Vibración Haptic**: Feedback táctil en todas las interacciones

### 🎨 Interfaz
- **Cubo 3D animado** que flota durante la ejecución
- **Timer visual** con fuente Orbitron personalizada
- **Controles intuitivos**: Start/Pause/Reset
- **Diseño minimalista** con esquema de colores oscuro

---

## 📦 Requisitos Previos

- **Node.js** (v16 o superior)
- **Android Studio** (para desarrollo Android)
- **Xcode** (para desarrollo iOS - solo macOS)
- **Dispositivo físico** (recomendado para haptics)

---

## 🛠️ Instalación y Setup

### 1. Clonar y Setup Inicial

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd pomodoro-vite

# Instalar dependencias
npm install
```

### 2. Desarrollo Local

```bash
# Servidor de desarrollo (puerto 5173)
npm run dev

# Abrir en navegador
open http://localhost:5173
```

### 3. Build para Producción

```bash
# Generar build optimizado
npm run build

# Sincronizar con Capacitor
npx cap sync

# Previsualizar build
npm run preview
```

---

## 📱 Desarrollo Móvil

### Setup Android

#### 1. Configurar Android Studio

```bash
# Instalar Android Studio desde: https://developer.android.com/studio
# Durante la instalación, asegúrate de incluir:
# - Android SDK
# - Android SDK Platform-Tools
# - Android Emulator (opcional)
```

#### 2. Habilitar Depuración USB

**En tu dispositivo Android:**

1. **Activar Opciones de Desarrollador:**
   - Ve a `Configuración > Acerca del teléfono`
   - Toca `Número de compilación` 7 veces
   - Aparecerá "Ahora eres desarrollador"

2. **Habilitar Depuración USB:**
   - Ve a `Configuración > Opciones de desarrollador`
   - Activa `Depuración USB`
   - Activa `Instalación vía USB` (si está disponible)

3. **Conectar Dispositivo:**
   - Conecta el teléfono via USB
   - Acepta el mensaje de "¿Permitir depuración USB?"
   - **Importante:** Marca "Confiar siempre en este equipo"

#### 3. Verificar Conexión

```bash
# Verificar que el dispositivo es detectado
adb devices

# Deberías ver algo como:
# List of devices attached
# ABC123XYZ    device
```

#### 4. Abrir en Android Studio

```bash
# Build del proyecto
npm run build

# Sincronizar archivos
npx cap sync

# Abrir proyecto en Android Studio
npx cap open android
```

#### 5. Ejecutar en Dispositivo

1. En Android Studio, selecciona tu dispositivo en la lista
2. Presiona el botón **Run** (▶️) o `Shift + F10`
3. La app se instalará y ejecutará automáticamente

---

### Setup iOS (Solo macOS)

```bash
# Instalar CocoaPods (si no está instalado)
sudo gem install cocoapods

# Abrir proyecto en Xcode
npx cap open ios
```

**En Xcode:**
1. Selecciona tu dispositivo/simulador
2. Configura el Team/Bundle ID
3. Presiona Run (⌘ + R)

---

## 🎯 Cómo Usar la App

### Interfaz Principal

1. **Campo de Entrada (Footer):**
   - Input siempre visible en la parte inferior
   - Toca para activar el teclado
   - Escribe el título de tu tarea

2. **Botón Verde (↵):**
   - Confirma el título de la tarea
   - Feedback haptic al presionar
   - Cierra el teclado automáticamente

3. **Botón START:**
   - Inicia el timer de 10 segundos (demo)
   - Cambia a PAUSA durante ejecución

4. **Visualización:**
   - Cubo 3D animado durante ejecución
   - Timer numérico grande
   - Título de tarea debajo del timer

---

## 🏗️ Arquitectura del Proyecto

```
pomodoro-vite/
├── index.html              # Página principal
├── src/
│   ├── main.js             # Entry point Vite
│   └── sketch.js           # Lógica p5.js + Pomodoro
├── css/
│   └── style.css           # Estilos principales
├── public/
│   ├── p5.js               # Librería p5.js core
│   ├── p5.sound.min.js     # Librería p5.sound
│   ├── fonts/              # Fuente Orbitron
│   └── sounds/             # Archivos de audio (futuro)
├── android/                # Proyecto Android (Capacitor)
├── www/                    # Build de producción
├── package.json
├── capacitor.config.json   # Configuración Capacitor
└── vite.config.js         # Configuración Vite
```

---

## 🔧 Configuración Técnica

### Carga de Librerías (p5.js)

A diferencia de un setup estándar de Vite/React/Vue, este proyecto carga **p5.js** y **p5.sound** como scripts globales directamente desde el directorio `public/`.

- **Ubicación**: `/public/p5.js` y `/public/p5.sound.min.js`
- **Carga**: Etiquetas `<script>` en `index.html` antes del módulo principal.
- **Ventaja**: Evita problemas de compatibilidad con módulos ES6 y facilita el acceso global a las funciones de p5.

### Capacitor Setup

El proyecto usa **Capacitor 7.x** con la siguiente configuración:

```json
{
  "appId": "com.getcapacitor.myapp",
  "appName": "PomodoroApp",
  "webDir": "www",
  "plugins": {
    "Haptics": {
      "enabled": true
    }
  }
}
```

### Dependencias Clave

```json
{
  "dependencies": {
    "@capacitor/core": "^7.4.4",
    "@capacitor/android": "^7.4.4",
    "@capacitor/haptics": "^7.0.2"
  },
  "devDependencies": {
    "vite": "^7.2.2"
  }
}
```

---

## 🎨 Personalización

### Modificar Timer

```javascript
// En src/sketch.js
let timer = 10; // Cambiar duración (segundos)
```

### Personalizar Colores

```css
/* En css/style.css */
#enterBtn {
    background: #1db954; /* Verde principal */
}

#taskInput:focus {
    border-color: #1db954; /* Color de foco */
}
```

### Ajustar Posición Footer

```css
#task-input-footer {
    bottom: 6vh; /* Cambiar altura responsive */
}
```

---

## ⚠️ Problemas Conocidos

### 🎵 Audio con p5.sound

**Estado Actual:** La integración de `p5.sound` funciona correctamente cargando la librería como script global.

**Configuración Exitosa:**
```html
<!-- En index.html -->
<script src="/p5.js"></script>
<script src="/p5.sound.min.js"></script>
```

**Notas Importantes:**
- Es necesario interactuar con la página (click/tap) antes de que el navegador permita reproducir audio (política de autoplay).
- En Android, asegúrate de que el volumen multimedia esté activado.

---

## 🐛 Solución de Problemas

### Problemas Comunes

#### 1. **Dispositivo no detectado**
```bash
# Verificar drivers ADB
adb devices

# Reiniciar servidor ADB
adb kill-server
adb start-server
```

#### 2. **App no se instala**
- Verifica que la depuración USB esté habilitada
- Confirma que "Instalar apps desconocidas" esté permitido
- Prueba con `adb install -r path/to/app.apk`

#### 3. **Haptics no funcionan**
- **Usar dispositivo real** (emuladores no soportan haptics)
- Verificar que las notificaciones/vibración estén habilitadas

#### 4. **Build falla**
```bash
# Limpiar cache
npm run clean
rm -rf node_modules
npm install

# Rebuild
npm run build
npx cap sync
```

### Debug en Tiempo Real

#### Chrome DevTools (Android)
1. Conecta dispositivo con depuración USB
2. Abre Chrome y ve a `chrome://inspect`
3. Selecciona tu app bajo "Remote Target"
4. Inspeccionar elemento para debug

#### Safari DevTools (iOS)
1. Conecta dispositivo iOS
2. Habilita "Web Inspector" en Safari settings
3. Abre Safari > Develop > [Tu dispositivo]

---

## 📊 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor local (puerto 5173)
npm run build        # Build de producción
npm run preview      # Preview del build

# Capacitor
npx cap sync         # Sincronizar cambios
npx cap open android # Abrir Android Studio
npx cap open ios     # Abrir Xcode (macOS)
npx cap run android  # Build y ejecutar en Android
npx cap run ios      # Build y ejecutar en iOS

# Utilidades
npx cap doctor       # Diagnosticar problemas
npx cap ls           # Listar platforms/plugins
```

---

## 🔄 Flujo de Desarrollo

### Desarrollo Típico

1. **Hacer cambios** en `src/` o `css/`
2. **Probar localmente**: `npm run dev`
3. **Build**: `npm run build`
4. **Sync**: `npx cap sync`
5. **Probar en móvil**: `npx cap run android`

### Para Production

1. **Build optimizado**: `npm run build`
2. **Sync**: `npx cap sync`
3. **Build APK/AAB**: Desde Android Studio
4. **Firmar y publicar**: Google Play Store / App Store

---

## 🌟 Características Técnicas Avanzadas

### Mobile Optimization

- **Responsive Design**: Viewport units para adaptación automática
- **Touch-friendly**: Botones optimizados para pantallas táctiles  
- **Performance**: Bundle optimizado con Vite
- **Native Feel**: Haptic feedback integration

### Cross-Platform Features

- **Unified Codebase**: Una sola base de código para ambas platforms
- **Native APIs**: Acceso a características nativas via Capacitor
- **Progressive Enhancement**: Funciona en navegador y como app nativa

---

## 📚 Referencias y Recursos

### Documentación Oficial
- [📖 Capacitor Documentation](https://capacitorjs.com/docs)
- [🎨 p5.js Reference](https://p5js.org/reference/)
- [⚡ Vite Guide](https://vitejs.dev/guide/)

### APIs Utilizadas
- [📳 Capacitor Haptics](https://capacitorjs.com/docs/apis/haptics)
- [🎵 p5.js Sound](https://p5js.org/reference/#/libraries/p5.sound)

### Herramientas de Desarrollo
- [🔧 Android Studio](https://developer.android.com/studio)
- [🍎 Xcode](https://developer.apple.com/xcode/) (macOS)
- [🌐 Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

---

## 👨‍💻 Autor

**Carles Gutiérrez**
- 📧 Email: [tu-email@example.com]
- 🔗 LinkedIn: [tu-linkedin]
- 🐙 GitHub: [tu-github]

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 🔮 Roadmap Futuro

- [x] 🎵 **Audio notifications (Implementado con p5.sound)**
- [ ] ⏰ Múltiples duraciones de Pomodoro (25min, 15min, 5min)
- [ ] 📊 Estadísticas de productividad
- [ ] 🌙 Modo oscuro/claro
- [ ] 💾 Persistencia de tareas completadas
- [ ] 🔔 Notificaciones push
- [ ] ☁️ Sincronización en la nube

---

**¡Feliz Pomodoro! 🍅⏰**
