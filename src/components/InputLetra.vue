<script setup lang="ts">
import { ref } from 'vue'
import { usePalabraAdivinarStore } from '../stores/palabra';

// Definimos el emit para avisar al padre
const emit = defineEmits(['update:focus']) 

const espaciosRellenar = usePalabraAdivinarStore().randomWord?.length;
const letras = ref<string[]>(Array(espaciosRellenar).fill('')) 

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = target.value.slice(0, 1).toUpperCase()
  letras.value[index] = target.value

  if (target.value && index < letras.value.length - 1) {
    // Nota: Esto busca en todo el documento, idealmente debería buscar solo en este componente,
    // pero para este arreglo mantendremos tu lógica actual.
    const inputs = document.querySelectorAll<HTMLInputElement>('.div-intento .input-letra')
    const nextInput = inputs[index + 1]
    nextInput?.focus()
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' || event.key === 'Delete') {
    if (!letras.value[index] && index > 0) {
      const inputs = document.querySelectorAll<HTMLInputElement>('.div-intento .input-letra')
      const prevInput = inputs[index - 1]
      prevInput?.focus()
      letras.value[index - 1] = ''
    } else {
      letras.value[index] = ''
    }
  }
}
</script>

<template>
  <div>
    <input
      v-for="(_, i) in letras"
      :key="i"
      class="input-letra"
      v-model="letras[i]"
      @input="handleInput(i, $event)"
      @keydown="handleKeydown(i, $event)"
      @focus="emit('update:focus', $event)" 
    />
    </div>
</template>

<style>
.input-letra {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
  margin-right: 10px;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  color: #000;
}
.input-letra:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
