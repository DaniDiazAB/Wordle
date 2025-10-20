<script setup lang="ts">
import { ref } from 'vue'
import Bienvenida from './components/Bienvenida.vue'
import InputLetra from './components/InputLetra.vue'
import BtnProbarSuerte from './components/BtnProbarSuerte.vue'
import { usePalabraAdivinarStore } from './stores/palabra';

const palabraAAdivinar = usePalabraAdivinarStore();

console.log(palabraAAdivinar.randomWord)

const arraySize = ref(0)
let palabraCompleta = true
let vidas = ref(6)

const emit = defineEmits(['enviarPalabra'])

let palabraUsuario = ref("")
function probarSuerte() {
  palabraCompleta = true
  const inputs = document.getElementsByClassName("input-letra") as HTMLCollectionOf<HTMLInputElement>;
  
  let palabraUsuarioAdivinar = ""

  for (let i = 0; i < inputs.length; i++) {
    palabraUsuarioAdivinar = palabraUsuarioAdivinar + inputs[i]?.value
    if (inputs[i]?.value === ""){
      palabraCompleta = false
    }
  }

  if (palabraCompleta){
    palabraUsuario.value = palabraUsuarioAdivinar
    comprobarPalabra(palabraUsuario.value)
  }else{
    console.log("Por favor, rellene todos los espacios")
  }
}

function comprobarPalabra(palabraUsuarioEscrita: string){
  console.log('Palabra escrita por el usuario:', palabraUsuarioEscrita)

  if (palabraUsuarioEscrita.toLowerCase() == palabraAAdivinar.randomWord?.toLowerCase()){
   
    
    console.log("ACERTADO")
  }else{
    console.log("FALLADO")

  }

  
}

</script>

<template>
  <Bienvenida />

  <div class="div-intento" >
    <InputLetra />
  </div>

  <BtnProbarSuerte @click="probarSuerte" />
</template>

<style scoped></style>
