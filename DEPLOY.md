# 🚀 Guía de Despliegue en Vercel

## 📋 Requisitos Previos
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en GitHub (opcional pero recomendado)

## 🎯 Método 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Subir a GitHub
```bash
# Inicializar repositorio Git
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "🎮 Juego INFOTEC - Versión inicial"

# Conectar con repositorio remoto
git remote add origin https://github.com/tu-usuario/infotec-juego.git

# Subir código
git push -u origin main
```

### Paso 2: Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "New Project"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `infotec-juego`
5. Configura el proyecto:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (dejar vacío)
   - **Output Directory**: (dejar vacío)
6. Haz clic en "Deploy"

### Paso 3: Configuración Automática
Vercel detectará automáticamente:
- `vercel.json` para configuración
- `index.html` como página principal
- Carpeta `imagenes/` para recursos estáticos

## 🎯 Método 2: Vercel CLI

### Instalación
```bash
npm install -g vercel
```

### Despliegue
```bash
# En la carpeta del proyecto
vercel

# Seguir las instrucciones:
# ? Set up and deploy "~/infotec-juego"? [Y/n] y
# ? Which scope do you want to deploy to? [tu-usuario]
# ? Link to existing project? [y/N] n
# ? What's your project's name? infotec-juego
# ? In which directory is your code located? ./
```

### Despliegue a Producción
```bash
vercel --prod
```

## 🎯 Método 3: Drag & Drop

### Preparación
1. Asegúrate de tener todos los archivos:
   ```
   ├── index.html
   ├── game.js
   ├── imagenes/Infotec-logo.png
   ├── vercel.json
   └── package.json
   ```

2. Comprime todos los archivos en un ZIP

### Despliegue
1. Ve a [vercel.com](https://vercel.com)
2. Arrastra el archivo ZIP a la interfaz
3. Espera a que se complete el despliegue
4. ¡Listo!

## ⚙️ Configuración Avanzada

### Variables de Entorno (Opcional)
Si necesitas configurar variables:

```bash
# Agregar variable
vercel env add GAME_VERSION production

# Listar variables
vercel env ls
```

### Dominios Personalizados
1. En el dashboard de Vercel
2. Ve a tu proyecto
3. Pestaña "Domains"
4. Agregar dominio personalizado

### Configuración de Headers
El archivo `vercel.json` ya incluye configuración básica:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## 🔍 Verificación del Despliegue

### Checklist Post-Despliegue
- [ ] La página principal carga correctamente
- [ ] El logo de INFOTEC se muestra
- [ ] El favicon aparece en la pestaña
- [ ] El juego funciona completamente
- [ ] Las estadísticas se guardan
- [ ] Los botones responden correctamente
- [ ] La pantalla de resultados funciona
- [ ] El restablecimiento de datos funciona

### URLs de Prueba
Después del despliegue, prueba estas funcionalidades:
- `https://tu-app.vercel.app/` - Página principal
- Registro de usuario
- Inicio de juego
- Sistema de estadísticas
- Restablecimiento de datos

## 🐛 Solución de Problemas

### Error: "Build Failed"
- Verifica que `vercel.json` esté presente
- Asegúrate de que `index.html` esté en la raíz

### Error: "Images not loading"
- Confirma que la carpeta `imagenes/` esté incluida
- Verifica las rutas en el código: `imagenes/Infotec-logo.png`

### Error: "JavaScript not working"
- Revisa la consola del navegador
- Verifica que `game.js` esté en la raíz del proyecto

### LocalStorage no funciona
- Verifica que el sitio se sirva por HTTPS
- Comprueba la configuración de cookies del navegador

## 📊 Monitoreo

### Analytics de Vercel
1. Ve al dashboard de tu proyecto
2. Pestaña "Analytics"
3. Revisa métricas de uso

### Logs de Función
```bash
vercel logs [deployment-url]
```

## 🔄 Actualizaciones

### Despliegue Automático (GitHub)
Cada push a la rama `main` desplegará automáticamente.

### Despliegue Manual
```bash
# Desde la carpeta del proyecto
vercel --prod
```

## 🎉 ¡Listo!

Tu juego INFOTEC ahora está disponible en:
- URL de producción: `https://tu-proyecto.vercel.app`
- Panel de control: `https://vercel.com/dashboard`

### Próximos Pasos
1. Comparte la URL con los docentes
2. Monitorea el uso y feedback
3. Implementa mejoras basadas en estadísticas
4. Considera agregar un dominio personalizado

---

**¿Necesitas ayuda?** Consulta la [documentación oficial de Vercel](https://vercel.com/docs) o crea un issue en el repositorio.