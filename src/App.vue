<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Bienvenida from './components/Bienvenida.vue'
import InputLetra from './components/InputLetra.vue'
import BtnProbarSuerte from './components/BtnProbarSuerte.vue'
import InputPalabra from './components/InputPalabra.vue'
import { usePalabraAdivinarStore } from './stores/palabra';
import Teclado from './components/Teclado.vue'
import BtnVolverJugar from './components/BtnVolverJugar.vue'

interface PalabraObjeto {
  traduccion_palabra: string;
  ingles_palabra?: string;
}

const palabraAAdivinar = usePalabraAdivinarStore();

let intentos = ref(5)
let fallidos = ref(0)
let palabraUsuario = ref("")
const intentosFallidos = ref<string[]>([])
const resetKey = ref(0)
const appReady = ref(false);
const palabraAcertada = ref(false)
const letrasUsadas = ref<string[]>([])
let ultimoInputFocalizado: HTMLInputElement | null = null;
const vidas = ref(6)
const palabraLimpia = ref("")

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Tab" || e.key === " ") {
      e.preventDefault();
    }
  });

  const checkWord = setInterval(() => {
    if (palabraAAdivinar.randomWord) {
      palabraLimpia.value = limpiarPalabra(palabraAAdivinar.randomWord)
      appReady.value = true;
      clearInterval(checkWord);
    }
  }, 100);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    probarSuerte();
  }
});

function probarSuerte() {
  const intentoDiv = document.querySelector(".div-intento");
  const inputs = intentoDiv?.getElementsByClassName("input-letra") as HTMLCollectionOf<HTMLInputElement>;
  
  let palabraUsuarioAdivinar = "";
  let isPalabraCompleta = true;

  for (let i = 0; i < inputs.length; i++) {
    const letraActual = inputs[i]?.value || '';
    palabraUsuarioAdivinar += letraActual;
    if (letraActual.trim() === "") {
      isPalabraCompleta = false;
    }
  }

  const lista = (palabraAAdivinar.listaPalabras as unknown as PalabraObjeto[]) || [];
  
  const palabraEnDiccionario = lista.some(item => 
    limpiarPalabra(item.traduccion_palabra).toUpperCase() === limpiarPalabra(palabraUsuarioAdivinar).toUpperCase()
  );

  if (!isPalabraCompleta) {
    alert("Por favor, rellene todos los espacios");
    return;
  }

  if (!palabraEnDiccionario) {
    alert("La palabra no está en el diccionario");
    return;
  }

  actualizarEstadoJuego(inputs, palabraUsuarioAdivinar);
}

function actualizarEstadoJuego(inputs: HTMLCollectionOf<HTMLInputElement>, palabraUsuarioAdivinar: string) {
  for (let i = 0; i < inputs.length; i++) {
    const letraActual = inputs[i]?.value || '';
    if (!letrasUsadas.value.includes(letraActual)) {
      letrasUsadas.value.push(letraActual);
    }
  }

  intentos.value--;
  fallidos.value++;
  palabraUsuario.value = palabraUsuarioAdivinar;
  
  comprobarPalabra(palabraUsuario.value);
  
  resetKey.value += 1;
  vidas.value--;

  setTimeout(() => {
    const nextInput = document.querySelector<HTMLInputElement>('.input-letra');
    nextInput?.focus();
  }, 0);
}

function comprobarPalabra(palabraUsuarioEscrita: string) {
  if (limpiarPalabra(palabraUsuarioEscrita).toLowerCase() === palabraLimpia.value?.toLowerCase()) {
    palabraAcertada.value = true
    vidas.value = 0
  } else {
    intentosFallidos.value.push(palabraUsuarioEscrita)
  }
}

function volverAJugar() {
  window.location.reload();
}

function registrarInputFoco(e: Event) {
  ultimoInputFocalizado = e.target as HTMLInputElement;
}

function insertarLetra(letra: string) {
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('.div-intento .input-letra'));
  
  if (letra === "DEL") {
    for (let i = inputs.length - 1; i >= 0; i--) {
      const el = inputs[i];
      if (el && el.value !== "") {
        el.value = "";
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.focus();
        break;
      }
    }
  } else {
    if (ultimoInputFocalizado && ultimoInputFocalizado.value === "") {
      ultimoInputFocalizado.value = letra;
      ultimoInputFocalizado.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      const primerVacio = inputs.find(input => input.value === "");
      if (primerVacio) {
        primerVacio.value = letra;
        primerVacio.dispatchEvent(new Event('input', { bubbles: true }));
        primerVacio.focus();
      }
    }
  }
}

function limpiarPalabra(texto: string): string {
  if (!texto) return "";
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos de forma global
    .replace(/[^a-zA-Z0-9 ñÑ]/g, ""); // Mantiene solo alfanuméricos y eñes
}
</script>

<template>
  <Bienvenida />

  <div v-if="!appReady" class="loading">
    <p>Cargando palabra...</p>
  </div>


  <div v-else-if="palabraAcertada || vidas === 0" class="acertado">
    <h2 v-if="vidas != 0">🎉 ¡Palabra acertada!</h2>
    <h2 v-else> Palabra fallada... :( </h2>
    <p>La palabra era: {{ palabraLimpia }}</p>
    <BtnVolverJugar v-if="vidas === 0 || palabraAcertada" @click="volverAJugar" />
  </div>

  <div v-else>
    <div class="div-fallidos">
      <InputPalabra v-for="(intento, index) in intentosFallidos" :key="index" :palabra="intento"
        :palabraAdivinar="palabraLimpia || ''" />
    </div>

    <div class="div-intento" :key="resetKey">
      <InputLetra @update:focus="registrarInputFoco" />
    </div>

    <div class="div-restantes" v-for="i in intentos" :key="i" disable>
      <InputLetra :key="`${i}-${resetKey}`" />
    </div>

    <BtnProbarSuerte @click="probarSuerte" :key="resetKey" />
    <Teclado :letrasUsadas="letrasUsadas" @letraPulsada="insertarLetra" />

  </div>
</template>

<style scoped>
.div-restantes :deep(.input-letra) {
  pointer-events: none;
  background-color: grey !important;
  color: black !important;

}

.div-restantes .input-letra {
  user-select: none;
  pointer-events: none;
}

.intento-fallido {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
}

.letra {
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: grey;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.acertado {
  position: relative;
  animation: fadeZoomIn 0.6s ease forwards;
  overflow: visible;
}

/* Fade + Zoom */
@keyframes fadeZoomIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  60% {
    opacity: 1;
    transform: scale(1.05);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Fuegos artificiales */
.acertado::before,
.acertado::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: transparent;
  box-shadow:
    0 -40px #ff2, 28px -28px #f06, 40px 0 #0f0, 28px 28px #09f,
    0 40px #f90, -28px 28px #f0f, -40px 0 #0ff, -28px -28px #f00,
    0 -60px #ff0, 42px -42px #f0a, 60px 0 #0f9, 42px 42px #09a,
    0 60px #fa0, -42px 42px #f09, -60px 0 #0ff, -42px -42px #f0f;
  opacity: 0;
  transform: scale(0);
  animation: fireworks 1s ease-out forwards;
}

.acertado::after {
  animation-delay: 0.15s;
}

/* Animación de la explosión */
@keyframes fireworks {
  0% {
    opacity: 1;
    transform: scale(0);
  }

  50% {
    transform: scale(2);
  }

  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}
</style>