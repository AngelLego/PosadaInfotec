# 🎮 Juego de Recolección INFOTEC

## 🚀 Descripción

Juego web interactivo diseñado para docentes de INFOTEC donde deben recolectar logos de programación mientras evitan objetos de carbón. El juego incluye un sistema completo de estadísticas, rankings y persistencia de datos.

## ✨ Características Principales

### 🎯 Gameplay
- **Cronómetro de 1 minuto** con dificultad progresiva
- **10+ logos de programación** con diferentes valores de puntos
- **Logo especial de INFOTEC** con bonus x2
- **Sistema de carbones** (máximo 5 antes de perder)
- **Niveles dinámicos** basados en puntaje
- **Controles intuitivos** (flechas o A/D)

### 📊 Sistema de Estadísticas
- **Estadísticas individuales** por jugador
- **Estadísticas por generación** (1-12)
- **Rankings globales** con medallas
- **Historial de partidas** completo
- **Persistencia de datos** en localStorage

### 🎨 Interfaz Moderna
- **Diseño responsivo** con gradientes y animaciones
- **Tipografía profesional** (Orbitron + Roboto)
- **Efectos visuales** avanzados
- **Pantalla de resultados** con logo institucional
- **Favicon personalizado** con logo INFOTEC

### 🛠️ Funcionalidades Administrativas
- **Registro de docentes** por generación
- **Restablecimiento de datos** con confirmación doble
- **Sistema de validación** robusto
- **Manejo de errores** completo

## 🎮 Cómo Jugar

1. **Registro**: Ingresa tu nombre y selecciona tu generación (6-12)
2. **Objetivo**: Recolecta logos de programación en 1 minuto
3. **Controles**: 
   - ← → o A/D para mover la canasta
   - Botón de pausa disponible
4. **Puntuación**:
   - Logos de programación: 6-20 puntos
   - Logo INFOTEC: Bonus x2
   - Evita el carbón (máximo 5)
5. **Bonus**: Tiempo restante = puntos extra

## 🏆 Sistema de Puntuación

| Logo | Puntos | Descripción |
|------|--------|-------------|
| HTML | 6 pts | Lenguaje de marcado |
| PHP | 8 pts | Lenguaje de servidor |
| CSS | 8 pts | Hojas de estilo |
| JavaScript | 10 pts | Lenguaje web |
| Java | 12 pts | Lenguaje orientado a objetos |
| Node.js | 14 pts | Runtime de JavaScript |
| Python | 15 pts | Lenguaje de programación |
| C# | 16 pts | Lenguaje de Microsoft |
| React | 18 pts | Librería de UI |
| C++ | 20 pts | Lenguaje de sistemas |
| **INFOTEC** | **50 pts x2** | **Logo institucional** |

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue Automático
1. Haz fork de este repositorio
2. Conecta tu cuenta de GitHub con Vercel
3. Importa el proyecto en Vercel
4. ¡Despliega automáticamente!

### Opción 2: Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Seguir las instrucciones en pantalla
```

### Opción 3: Drag & Drop
1. Comprime todos los archivos en un ZIP
2. Ve a [vercel.com](https://vercel.com)
3. Arrastra el ZIP a la interfaz
4. ¡Listo!

## 📁 Estructura del Proyecto

```
infotec-juego/
├── index.html              # Página principal
├── game.js                 # Lógica del juego
├── game.test.js           # Pruebas unitarias
├── imagenes/              # Recursos gráficos
│   └── Infotec-logo.png   # Logo institucional
├── vercel.json            # Configuración de Vercel
├── package.json           # Dependencias del proyecto
└── README.md              # Documentación
```

## 🛠️ Desarrollo Local

```bash
# Clonar repositorio
git clone [url-del-repo]
cd infotec-juego

# Instalar dependencias (opcional)
npm install

# Servidor local
npm run dev
# o simplemente abrir index.html en el navegador

# Ejecutar pruebas
npm test
```

## 🔧 Configuración

### Generaciones Disponibles
El juego está configurado para generaciones 6-12. Para modificar:

```javascript
// En index.html, línea ~320
<option value="1">Generación 1</option>
// Agregar más opciones según necesidad
```

### Personalización de Logos
Para agregar nuevos logos de programación:

```javascript
// En game.js, función createEnhancedSprites()
this.images.nuevoLogo = createSprite('#color', 'TEXTO', 'white', 14);

// En spawnObjects(), agregar al array objectTypes
{ type: 'programming', sprite: this.images.nuevoLogo, points: 15, weight: 10 }
```

## 📊 Datos Almacenados

El juego utiliza localStorage para persistir:
- **Docentes registrados** (`infotec_teachers`)
- **Resultados de partidas** (`infotec_game_results`)
- **Docente actual** (`infotec_current_teacher`)

## 🔒 Restablecimiento de Datos

El botón "Restablecer Datos" permite limpiar completamente:
- Todos los jugadores registrados
- Historial de partidas
- Estadísticas y rankings
- Configuración actual

**⚠️ Advertencia**: Esta acción es irreversible.

## 🎯 Próximas Mejoras

- [ ] Efectos de sonido
- [ ] Más power-ups especiales
- [ ] Modo multijugador
- [ ] Exportar estadísticas a CSV
- [ ] Temas visuales adicionales
- [ ] Integración con base de datos

## 📞 Soporte

Para soporte técnico o sugerencias:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo de INFOTEC

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para la comunidad educativa de INFOTEC**