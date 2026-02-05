<script setup lang="ts">
</script>

<template>
  <button>Volver a jugar</button>
</template>

<style scoped>
button {
  margin-top: 16px;
  padding: 12px 24px;
  background-color: #538d4e;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

button:hover {
  background-color: #6aaa64;
}

button:active {
  transform: scale(0.96);
}
</style>
