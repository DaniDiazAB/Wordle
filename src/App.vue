<script setup lang="ts">
import { ref } from 'vue'
import Bienvenida from './components/Bienvenida.vue'
import InputLetra from './components/InputLetra.vue'
import BtnProbarSuerte from './components/BtnProbarSuerte.vue'
import InputPalabra from './components/InputPalabra.vue'
import { usePalabraAdivinarStore } from './stores/palabra';

const palabraAAdivinar = usePalabraAdivinarStore();
console.log(palabraAAdivinar.randomWord)

let palabraCompleta = true
let intentos = ref(5)
let fallidos = ref(0)

const emit = defineEmits(['enviarPalabra'])
const intentosFallidos = ref<string[]>([]) // guarda los intentos fallidos


let palabraUsuario = ref("")
function probarSuerte() {
  intentos.value = intentos.value - 1;
  fallidos.value = fallidos.value + 1;

  palabraCompleta = true;

  const intentoDiv = document.querySelector(".div-intento");
  const inputs = intentoDiv?.getElementsByClassName("input-letra") as HTMLCollectionOf<HTMLInputElement>;

  let palabraUsuarioAdivinar = "";

  for (let i = 0; i < inputs.length; i++) {
    palabraUsuarioAdivinar += inputs[i]?.value;
    if (inputs[i]?.value === "") {
      palabraCompleta = false;
    }
  }

  if (palabraCompleta) {
    palabraUsuario.value = palabraUsuarioAdivinar;
    comprobarPalabra(palabraUsuario.value);
  } else {
    console.log("Por favor, rellene todos los espacios");
  }
  
}


function comprobarPalabra(palabraUsuarioEscrita: string) {
  let palabraMedias = ""


  if (palabraUsuarioEscrita.toLowerCase() == palabraAAdivinar.randomWord?.toLowerCase()) {
    alert("Palabra acertada")
  } else {
    console.log("FALLADO")
    const letrasAdivinar = palabraAAdivinar.randomWord
      ? palabraAAdivinar.randomWord.toLocaleUpperCase().split("")
      : []
    const letrasIntentada = palabraUsuarioEscrita.split("")

    for (let i = 0; i < palabraUsuarioEscrita.length; i++) {
      if (letrasAdivinar[i] === letrasIntentada[i]) {
        palabraMedias += letrasAdivinar[i]
      } else {
        palabraMedias += "_"
      }
    }

    intentosFallidos.value.push(palabraUsuarioEscrita)
  }
}

</script>

<template>
  <Bienvenida />

  <div class="div-fallidos">
    <InputPalabra
      v-for="(intento, index) in intentosFallidos"
      :key="index"
      :palabra="intento"
       :palabraAdivinar="palabraAAdivinar.randomWord || ''"
    />
  </div>

  <div class="div-intento">
    <InputLetra />
  </div>


  <div class="div-restantes" v-for="i in intentos" :key="i">
    <InputLetra />
  </div>


  <BtnProbarSuerte @click="probarSuerte" />
</template>



<style scoped>
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
