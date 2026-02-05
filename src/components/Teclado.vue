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
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  user-select: none;
}

.fila {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.letra-teclado,
.delete-teclado {
  background-color: #818384;
  color: #ffffff;
  min-width: 38px;
  height: 52px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.letra-teclado:active,
.delete-teclado:active {
  transform: scale(0.95);
}

.acertada {
  background-color: #538d4e;
}

.desubicada {
  background-color: #b59f3b;
}

.usada {
  background-color: #3a3a3c;
}

.delete-teclado {
  padding: 0 12px;
  background-color: #565758;
  font-size: 14px;
}
</style>
