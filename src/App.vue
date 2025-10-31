<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Bienvenida from './components/Bienvenida.vue'
import InputLetra from './components/InputLetra.vue'
import BtnProbarSuerte from './components/BtnProbarSuerte.vue'
import InputPalabra from './components/InputPalabra.vue'
import { usePalabraAdivinarStore } from './stores/palabra';
import Teclado from './components/Teclado.vue'

let palabraCompleta = true
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


onMounted(() => {
  const checkWord = setInterval(() => {
    if (palabraAAdivinar.randomWord) {
      console.log(palabraAAdivinar.randomWord);
      appReady.value = true;
      clearInterval(checkWord);
    }
  }, 100);
});

function probarSuerte() {
  intentos.value = intentos.value - 1;
  fallidos.value = fallidos.value + 1;

  palabraCompleta = true;

  const intentoDiv = document.querySelector(".div-intento");
  const inputs = intentoDiv?.getElementsByClassName("input-letra") as HTMLCollectionOf<HTMLInputElement>;

  let palabraUsuarioAdivinar = "";

  for (let i = 0; i < inputs.length; i++) {
    const letraActual = inputs[i]?.value || '';
    palabraUsuarioAdivinar += letraActual;
    
    if (letraActual === "") {
      palabraCompleta = false;
    } else {
      if (!letrasUsadas.value.includes(letraActual)) {
        letrasUsadas.value.push(letraActual);
      }
    }
  }

  if (palabraCompleta) {
    palabraUsuario.value = palabraUsuarioAdivinar;
    comprobarPalabra(palabraUsuario.value);    
    resetKey.value += 1;
    setTimeout(() => {
      const nextInput = document.querySelector<HTMLInputElement>('.input-letra');
      nextInput?.focus();
    }, 0);
  } else {
    console.log("Por favor, rellene todos los espacios");
  }
}

function comprobarPalabra(palabraUsuarioEscrita: string) {
  if (palabraUsuarioEscrita.toLowerCase() == palabraAAdivinar.randomWord?.toLowerCase()) {
    palabraAcertada.value = true
  } else {
    intentosFallidos.value.push(palabraUsuarioEscrita)
  }
}

</script>

<template>
  <Bienvenida />

  <div v-if="!appReady" class="loading">
    <p>Cargando palabra...</p>
  </div>

  <div v-else-if="palabraAcertada" class="acertado">
    <h2>🎉 ¡Palabra acertada!</h2>
    <p>La palabra era: {{ palabraAAdivinar.randomWord }}</p>
  </div>
  

  <div v-else>

    <div class="div-fallidos">
      <InputPalabra v-for="(intento, index) in intentosFallidos" :key="index" :palabra="intento"
        :palabraAdivinar="palabraAAdivinar.randomWord || ''" />
    </div>

    <div class="div-intento" :key="resetKey">
      <InputLetra />
    </div>

    
    <div class="div-restantes" v-for="i in intentos" :key="i">
      <InputLetra :key="`${i}-${resetKey}`" />
    </div>

    <BtnProbarSuerte @click="probarSuerte" :key="resetKey"/>

    <Teclado :letrasUsadas="letrasUsadas"/>
  </div>
</template>



<style scoped>

.div-restantes :deep(.input-letra) {
  background-color: grey !important;
  color: black !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
  border-color: #e0e0e0 !important;
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
</style>