# 🟩 Wordle v0.2 — Proyecto en Vue 3.5.22

Este es un proyecto personal desarrollado con **Vue.js v3.5.22**, inspirado en el clásico juego **Wordle**.  
El objetivo principal ha sido **aprender y practicar el funcionamiento interno de Vue**, sus componentes, reactividad y comunicación entre ellos.

LIVE DEMO: https://danidiaz.eu/wordle/

---

## 🚀 Descripción general

En esta primera versión (v0.2) el juego es totalmente funcional:  
puedes escribir una palabra, probar suerte e ir viendo tus intentos previos con colores que indican si las letras son correctas o no.

> ⚙️ Este proyecto **no busca ser un clon comercial**, sino un **proyecto educativo** para entender el ciclo de vida y el flujo de datos en Vue 3.

---

## 🧠 Uso de Inteligencia Artificial

Durante el desarrollo se ha utilizado **IA como herramienta de apoyo** en distintas fases del proyecto:
- Para generar y mejorar el **estilo CSS**.
- Para redactar y estructurar este **README**.
- Para resolver **pequeñas dudas de código** y depuración de errores.

---

## 🎯 Objetivo del proyecto

> Este proyecto ha sido creado **únicamente con fines de aprendizaje**, para entender el mecanismo de trabajo de **Vue 3**,  
su sistema de componentes, propiedades reactivas (`ref`, `computed`), y el flujo entre padre-hijo.

En el futuro se añadirá una **demostración en vivo (LIVE DEMO)** accesible públicamente para probar el juego sin instalación local.

---

## 🧩 Funcionalidades actuales (v0.2)

- Juego base completamente funcional.
- Control de intentos fallidos y visualización de palabras anteriores.
- Colores tipo Wordle:
  - 🟩 Verde → Letra correcta y en la posición correcta.
  - 🟨 Amarillo → Letra correcta pero en posición distinta.
  - ⬛ Gris → Letra no presente.
- Reinicio de los inputs al probar suerte.
- Estructura de componentes reutilizables (`InputLetra`, `InputPalabra`, `BtnProbarSuerte`, etc.).
- Uso de Pinia para almacenar la palabra a adivinar.
- Teclado con las letras usadas

---

## 🔮 Próximas mejoras (v1.0)

Estas son las funcionalidades planificadas para la versión **v0.2**:

- 🎨 **Mejoras visuales** y ajustes generales en el CSS.  
- 🌐 **Crear una API propia en español** para obtener una palabra aleatoria.  
- 📖 **Verificación de palabras reales**: antes de comprobar, se validará que la palabra exista en el diccionario.  
- ✏️ **Mejoras en el teclado**: se podrá ver que letras están y cuales no, además de que se podrá escribir letras pulsando en sobre ellas
---

## 🧰 Instalación y uso libre

Este proyecto es **de uso libre** y puede ser instalado o modificado por cualquier persona.  
Para instalarlo en tu propia máquina o página web:

### 1️⃣ Clona el repositorio
```bash
git clone https://github.com/DaniDiazAB/wordle.git
cd wordle-vue
