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

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  palabra: string          // palabra escrita por el usuario
  palabraAdivinar: string  // palabra que se intenta adivinar
}

const props = defineProps<Props>()

const letras = computed(() => props.palabra.toUpperCase().split(''))

// Función que devuelve una clase según si la letra es correcta o no
function getClaseLetra(letra: string, index: number) {
  const palabraObjetivo = props.palabraAdivinar.toUpperCase()

  if (palabraObjetivo[index] === letra) {
    return 'correcta' // verde
  } else if (palabraObjetivo.includes(letra)) {
    return 'parcial' // amarilla
  } else {
    return 'incorrecta' // gris/roja
  }
}
</script>

<style scoped>
.palabra {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.letra {
  width: 60px;
  height: 60px;
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 2px solid #ccc;
}

/* Colores tipo Wordle */
.correcta {
  background-color: #6aaa64; /* verde */
  color: white;
}

.parcial {
  background-color: #c9b458; /* amarillo */
  color: white;
}

.incorrecta {
  background-color: #787c7e; /* gris */
  color: white;
}
</style>
