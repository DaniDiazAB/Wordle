<script setup lang="ts">

import { watch } from 'vue'

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
      <p class="letra-teclado">Q</p>
      <p class="letra-teclado">W</p>
      <p class="letra-teclado">E</p>
      <p class="letra-teclado">R</p>
      <p class="letra-teclado">T</p>
      <p class="letra-teclado">Y</p>
      <p class="letra-teclado">U</p>
      <p class="letra-teclado">I</p>
      <p class="letra-teclado">O</p>
      <p class="letra-teclado">P</p>
    </div>

    <div class="fila">
      <p class="letra-teclado">A</p>
      <p class="letra-teclado">S</p>
      <p class="letra-teclado">D</p>
      <p class="letra-teclado">F</p>
      <p class="letra-teclado">G</p>
      <p class="letra-teclado">H</p>
      <p class="letra-teclado">J</p>
      <p class="letra-teclado">K</p>
      <p class="letra-teclado">L</p>
      <p class="letra-teclado">Ñ</p>
    </div>

    <div class="fila">
      <p class="letra-teclado">Z</p>
      <p class="letra-teclado">X</p>
      <p class="letra-teclado">C</p>
      <p class="letra-teclado">V</p>
      <p class="letra-teclado">B</p>
      <p class="letra-teclado">N</p>
      <p class="letra-teclado">M</p>
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
