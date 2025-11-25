<script setup lang="ts">

import { watch } from 'vue'
const emit = defineEmits(['letraPulsada'])


const fila1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const fila2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
const fila3 = ["Z", "X", "C", "V", "B", "N", "M"];

function letraClick(letra: string) {
  console.log("Has pulsado:", letra);
    emit('letraPulsada', letra)

}

const props = defineProps<{
  letrasUsadas: string[]
}>()

const pLetras = document.getElementsByClassName("letra-teclado")

watch(
  () => props.letrasUsadas,
  (nuevaLista) => {
    for(let i = 0; i < nuevaLista.length; i++) {
      const letra = nuevaLista[i];
      if (letra) {
        const p = obtenerLetra(letra);
        
        if (p) p.classList.add('usada');
      }
    }
  },
  { deep: true }
);

function obtenerLetra(letra: string) {
  return Array.from(pLetras).find(p => 
    p.textContent?.trim() === letra.toUpperCase()
  );
}


</script>

<template>
  <div id="teclado">
    <div class="fila">
      <p class="letra-teclado" v-for="letra in fila1" :key="letra" @click="letraClick(letra)">
        {{ letra }}
      </p>
    </div>

    <div class="fila">
      <p class="letra-teclado" v-for="letra in fila2" :key="letra" @click="letraClick(letra)">
        {{ letra }}
      </p>
    </div>

    <div class="fila">
      <p class="letra-teclado" v-for="letra in fila3" :key="letra" @click="letraClick(letra)">
        {{ letra }}
      </p>
    </div>
  </div>
</template>

<style scoped>
#teclado {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 600px;
  margin: 40px auto;
  align-items: center;
}

.fila {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.letra-teclado {
  width: 50px;
  height: 60px;
  background-color: #d3d6da;
  color: #000;
  font-weight: bold;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  user-select: none;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 0 #a9a9a9;
}

.letra-teclado:hover {
  background-color: #bcbfc3;
  transform: translateY(-2px);
}

.letra-teclado:active {
  background-color: #9fa3a7;
  transform: translateY(2px);
  box-shadow: none;
}

.usada{
  background-color: grey;
}
</style>
