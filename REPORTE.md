# Reporte del Proyecto: Lotería Digital del Centro-Norte de México

## Descripción General
Aplicación web educativa que simula el juego tradicional de lotería mexicana, enfocada en la cultura de Guanajuato, Zacatecas, San Luis Potosí y Aguascalientes. Los jugadores aprenden sobre sitios culturales mientras juegan.

## Arquitectura del Sistema

### Tecnologías Utilizadas
- **Framework**: React 18 con Vite
- **Lenguaje**: JavaScript (JSX)
- **Estilos**: CSS moderno con glassmorphism
- **Fuentes**: Poppins (títulos), Montserrat (cuerpo)
- **API**: Web Speech API para síntesis de voz

### Estructura de Componentes

1. **App.jsx** (Controlador principal)
   - Gestiona el estado global del juego
   - Controla la navegación entre pantallas
   - Estados: 'start', 'playing', 'won'

2. **StartScreen.jsx** (Pantalla de inicio)
   - Captura el nombre del jugador
   - Muestra instrucciones del juego
   - Botón para iniciar partida

3. **GameScreen.jsx** (Pantalla principal de juego)
   - **Funcionalidades principales**:
     - Genera tablero aleatorio de 4x4 cartas
     - Canta cartas automáticamente cada 4 segundos
     - Síntesis de voz en español (es-MX)
     - Valida que solo se marquen cartas cantadas
     - Detecta victoria automáticamente
     - Pausar/Continuar juego
     - Botón "Regresar al Inicio"
   
   - **Secciones visuales**:
     - Header: Nombre del jugador y controles
     - Carta actual: Muestra la carta siendo cantada
     - Info automática: Descripción de la carta actual
     - Historial: Últimas 8 cartas cantadas
     - Tablero: Grid 4x4 con las cartas del jugador

4. **Board.jsx** (Tablero de juego)
   - Renderiza el grid de 16 cartas
   - Gestiona clics para marcar cartas
   - Muestra botones de información por carta

5. **Card.jsx** (Componente de carta individual)
   - Muestra imagen, nombre y número de carta
   - Botón "i" para ver información detallada
   - Efecto visual "frijolito" al marcar

6. **WinScreen.jsx** (Pantalla de victoria)
   - Muestra mensaje de ganador
   - Botón "Jugar de Nuevo"

### Modelo de Datos

**Estructura de Carta** (`cards.js`):
```javascript
{
  id: 1,
  name: "Nombre del lugar",
  state: "Estado",
  description: "Descripción cultural",
  image: "URL de imagen"
}
```

**Estados del Juego** (React Hooks en GameScreen):
- `deck`: Array de 20 cartas barajeadas
- `boardCards`: 16 cartas aleatorias para el tablero
- `markedCards`: Set de IDs de cartas marcadas
- `currentCardIndex`: Índice de carta actual
- `isPlaying`: Estado de pausa/reproducción
- `selectedInfoCard`: Carta seleccionada para ver info

## Flujo de Funcionamiento

### 1. Inicio
- Usuario ingresa su nombre
- Click en "¡Jugar!"

### 2. Preparación del Juego
- Se barajan las 20 cartas para crear el mazo
- Se seleccionan 16 cartas aleatorias para el tablero
- Se inicia el contador automático

### 3. Ciclo de Juego
1. Una carta es cantada cada 4 segundos
2. Se reproduce el nombre con síntesis de voz
3. Se muestra la carta actual e información
4. Jugador marca la carta en su tablero (si la tiene)
5. Validación estricta: solo cartas cantadas pueden marcarse
6. Se actualiza el historial

### 4. Victoria
- Cuando las 16 cartas están marcadas
- Se muestra pantalla de victoria
- Opción para jugar de nuevo

## Características Especiales

### Diseño Visual
- **Glassmorphism**: Efectos de vidrio con blur
- **Gradientes vibrantes**: Rosa (#FF1493), Coral (#FF6B35), Teal (#00D4AA)
- **Animaciones suaves**: Transiciones en hover y estados
- **Responsive**: Adaptable a diferentes tamaños de pantalla

### Validación
- Sistema estricto que previene trampas
- Solo se pueden marcar cartas ya cantadas
- Alerta al intentar marcar cartas no cantadas

### UX/UI
- Síntesis de voz para accesibilidad
- Modal centrado para información de cartas
- Historial visual de cartas cantadas
- Feedback visual inmediato (hover, marcado)

## Estructura de Archivos

```
metallic-chromosphere/
├── src/
│   ├── components/
│   │   ├── StartScreen.jsx
│   │   ├── GameScreen.jsx
│   │   ├── Board.jsx
│   │   ├── Card.jsx
│   │   └── WinScreen.jsx
│   ├── data/
│   │   └── cards.js (20 cartas culturales)
│   ├── App.jsx (Controlador principal)
│   ├── index.css (Estilos globales)
│   └── main.jsx (Punto de entrada)
├── public/
└── package.json
```

## Personalización

### Cambiar Imagen de Fondo
Editar `src/index.css`, buscar el comentario:
```css
/* CAMBIA LA URL DE ABAJO PARA CAMBIAR LA IMAGEN DE FONDO */
```

### Agregar Nuevas Cartas
Editar `src/data/cards.js` siguiendo la estructura existente.

---

**Nota**: Este proyecto fue desarrollado con enfoque en diseño moderno, accesibilidad y experiencia educativa.
