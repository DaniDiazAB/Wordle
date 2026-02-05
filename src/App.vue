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
  palabra_wordle_palabra: string;
}

const errorShake = ref(false)
const palabraAAdivinar = usePalabraAdivinarStore();
let intentos = ref(5)
let fallidos = ref(0)
let palabraUsuario = ref("")
const intentosFallidos = ref<string[]>([])
const resetKey = ref(0)
const appReady = ref(false);
const palabraAcertada = ref(false)

const acertadas = ref<string[]>([]);
const desubicadas = ref<string[]>([]);
const fallidas = ref<string[]>([]);

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
    limpiarPalabra(item.palabra_wordle_palabra).toUpperCase() === limpiarPalabra(palabraUsuarioAdivinar).toUpperCase()
  );

  if (!isPalabraCompleta) {
    mostrarError()
    return
  }

  if (!palabraEnDiccionario) {
    mostrarError()
    return
  }


  actualizarEstadoJuego(palabraUsuarioAdivinar);
}

function actualizarEstadoJuego(palabraUsuarioAdivinar: string) {
  const objetivo = palabraLimpia.value.toUpperCase();
  const intento = palabraUsuarioAdivinar.toUpperCase();

  intento.split('').forEach((letra, i) => {
    if (letra === objetivo[i]) {
      if (!acertadas.value.includes(letra)) acertadas.value.push(letra);
      desubicadas.value = desubicadas.value.filter(l => l !== letra); // Sube de nivel
    } else if (objetivo.includes(letra)) {
      if (!acertadas.value.includes(letra) && !desubicadas.value.includes(letra)) desubicadas.value.push(letra);
    } else {
      if (!fallidas.value.includes(letra)) fallidas.value.push(letra);
    }
  });

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

function mostrarError() {
  errorShake.value = true
  setTimeout(() => errorShake.value = false, 400)
}
</script>

<template>
  <Bienvenida />
  <div class="fila-intento" :class="{ shake: errorShake }">

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
      <Teclado :acertadas="acertadas" :desubicadas="desubicadas" :fallidas="fallidas" @letraPulsada="insertarLetra" />

    </div>
  </div>
</template>

<style scoped>
.fila-intento {
  min-height: 100vh;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  transform-origin: top center;
}

.loading {
  margin-top: 120px;
  font-size: 18px;
  color: #d7dadc;
}

.acertado {
  margin-top: 100px;
  text-align: center;
}

.acertado h2 {
  margin-bottom: 10px;
  font-size: 26px;
}

.acertado p {
  font-size: 18px;
  color: #d7dadc;
}

.div-fallidos {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.div-intento,
.div-restantes {
  margin-bottom: 8px;
}

.div-restantes {
  opacity: 0.4;
}

.shake {
  animation: shake 0.4s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-6px); }
  100% { transform: translateX(0); }
}

</style>
