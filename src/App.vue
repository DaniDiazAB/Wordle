<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Bienvenida from './components/Bienvenida.vue'
import InputLetra from './components/InputLetra.vue'
import BtnProbarSuerte from './components/BtnProbarSuerte.vue'
import InputPalabra from './components/InputPalabra.vue'
import { usePalabraAdivinarStore } from './stores/palabra';
import Teclado from './components/Teclado.vue'
import BtnVolverJugar from './components/BtnVolverJugar.vue'

let intentos = ref(5)
let fallidos = ref(0)
let palabraUsuario = ref("")
const palabraAAdivinar = usePalabraAdivinarStore();
const emit = defineEmits(['enviarPalabra'])
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
  let palabraCompleta = true;

 
  for (let i = 0; i < inputs.length; i++) {
    const letraActual = inputs[i]?.value || '';
    palabraUsuarioAdivinar += letraActual;
    if (letraActual === "" || letraActual === " ") {
      palabraCompleta = false;
    }
  }

  for (let i = 0; i < inputs.length; i++) {
    const letraActual = inputs[i]?.value || '';
    if (!letrasUsadas.value.includes(letraActual) && palabraCompleta) {
        letrasUsadas.value.push(letraActual);
      }
  }

  if (palabraCompleta) {
    intentos.value = intentos.value - 1;
    fallidos.value = fallidos.value + 1;
    palabraUsuario.value = palabraUsuarioAdivinar;
    comprobarPalabra(palabraUsuario.value);
    resetKey.value += 1;
    setTimeout(() => {
      const nextInput = document.querySelector<HTMLInputElement>('.input-letra');
      nextInput?.focus();
      vidas.value--;
    }, 0);
  } else {
    alert("Por favor, rellene todos los espacios")
  }

}

function comprobarPalabra(palabraUsuarioEscrita: string) {
  
  if (palabraUsuarioEscrita.toLowerCase() == palabraLimpia.value?.toLowerCase()) {
    palabraAcertada.value = true
    vidas.value = 0
  } else {
    intentosFallidos.value.push(palabraUsuarioEscrita)
  }
  
}



function volverAJugar() {
  window.location.reload();
}

// Cambiar el input
function registrarInputFoco(e: Event) {
  ultimoInputFocalizado = e.target as HTMLInputElement;
}

// Funcion para escribir desde el teclado virtual
function insertarLetra(letra: string) {
  if (ultimoInputFocalizado) {
    ultimoInputFocalizado.value = letra;
    ultimoInputFocalizado.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    const inputs = document.querySelectorAll<HTMLInputElement>('.div-intento .input-letra');
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (!input) continue;
      if (input.value === "") {
        input.value = letra;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
        break;
      }
    }
  }
}

// Funcion para eliminar los acentos de la palabra que se elige
function limpiarPalabra(texto: string): string {
  let sinTildes = texto
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/Á/g, "A")
    .replace(/É/g, "E")
    .replace(/Í/g, "I")
    .replace(/Ó/g, "O")
    .replace(/Ú/g, "U");

  let resultado = sinTildes.replace(/[^a-zA-Z0-9 ñÑ]/g, "");

  return resultado;
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