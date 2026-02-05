<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  palabra: string          
  palabraAdivinar: string 
}

const props = defineProps<Props>()

const letras = computed(() => props.palabra.toUpperCase().split(''))

function getClaseLetra(letra: string, index: number) {
  const palabraObjetivo = props.palabraAdivinar.toUpperCase()

  if (palabraObjetivo[index] === letra) {
    return 'correcta' 
  } else if (palabraObjetivo.includes(letra)) {
    return 'parcial' 
  } else {
    return 'incorrecta'
  }
}
</script>

<template>
  <div class="palabra">
    <div
      v-for="(letra, index) in letras"
      :key="index"
      class="letra"
      :class="getClaseLetra(letra, index)"
    >
      {{ letra }}
    </div>
  </div>
</template>

<style scoped>
.palabra {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.letra {
  width: 54px;
  height: 54px;
  border: 2px solid #3a3a3c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: #121213;
  color: #ffffff;
  transition: background-color 0.3s, border-color 0.3s, transform 0.2s;
}

.correcta {
  background-color: #538d4e;
  border-color: #538d4e;
}

.parcial {
  background-color: #b59f3b;
  border-color: #b59f3b;
}

.incorrecta {
  background-color: #3a3a3c;
  border-color: #3a3a3c;
}

.letra.correcta,
.letra.parcial,
.letra.incorrecta {
  animation: flip 0.5s ease;
}

@keyframes flip {
  0% {
    transform: rotateX(0);
  }
  50% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0);
  }
}
</style>

