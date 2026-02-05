<script setup lang="ts">
import { ref } from 'vue'
import { usePalabraAdivinarStore } from '../stores/palabra';

const emit = defineEmits(['update:focus']) 

const espaciosRellenar = usePalabraAdivinarStore().randomWord?.length;
const letras = ref<string[]>(Array(espaciosRellenar).fill('')) 

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = target.value.slice(0, 1).toUpperCase()
  letras.value[index] = target.value

  if (target.value && index < letras.value.length - 1) {
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
      autofocus
    />
    </div>
</template>

<style scoped>
.input-letra {
  width: 54px;
  height: 54px;
  margin: 0 4px;
  background-color: #121213;
  border: 2px solid #3a3a3c;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  border-radius: 6px;
  outline: none;
  caret-color: transparent;
  transition: border-color 0.2s, transform 0.1s;
}

.input-letra:focus {
  border-color: #565758;
  transform: scale(1.05);
}

.input-letra::selection {
  background: transparent;
}
</style>
  
