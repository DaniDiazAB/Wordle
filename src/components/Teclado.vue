<script setup lang="ts">

const emit = defineEmits(['letraPulsada'])
const props = defineProps<{
  acertadas: string[],
  desubicadas: string[],
  fallidas: string[]
}>()
const fila1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const fila2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
const fila3 = ["Z", "X", "C", "V", "B", "N", "M"];


function letraClick(letra: string) {
  emit('letraPulsada', letra)
}

function obtenerClaseLetra(letra: string): string {
  if (props.acertadas.includes(letra)) return 'acertada';
  if (props.desubicadas.includes(letra)) return 'desubicada';
  if (props.fallidas.includes(letra)) return 'usada';
  return '';
}
</script>

<template>
  <div id="teclado">
    <div class="fila">
      <p :class="['letra-teclado', obtenerClaseLetra(letra)]" v-for="letra in fila1" :key="letra"
        @click="letraClick(letra)">
        {{ letra }}
      </p>
    </div>

    <div class="fila">
      <p :class="['letra-teclado', obtenerClaseLetra(letra)]" v-for="letra in fila2" :key="letra" 
        @click="letraClick(letra)">
        {{ letra }}
      </p>
    </div>

    <div class="fila">
      <p :class="['letra-teclado', obtenerClaseLetra(letra)]" v-for="letra in fila3" :key="letra"
        @click="letraClick(letra)">
        {{ letra }}
      </p>
      <p class="delete-teclado" @click="letraClick('DEL')">
        DEL
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

.delete-teclado {
  width: 50px;
  height: 60px;
  background-color: #990000;
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
  box-shadow: 0 2px 0 #540000;
}

.delete-teclado:hover {
  background-color: #990000;
  transform: translateY(-2px);
}

.delete-teclado:active {
  background-color: #990000;
  transform: translateY(2px);
  box-shadow: none;
}

.usada {
  background-color: #787c7e !important;
  color: white !important;
  box-shadow: 0 2px 0 #505050 !important;
}

.acertada {
  background-color: #6aaa64 !important;
  color: white !important;
  box-shadow: 0 2px 0 #4d7c47 !important;
}

.desubicada {
  background-color: #c9b458 !important;
  color: white !important;
}
</style>
