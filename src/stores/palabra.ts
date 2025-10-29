// EN CASO DE QUE LA API DEJE DE FUNCIONAR DESCOMENTAR ESTAS LINEAS Y COMENTAR LAS OTRAS
// No es una solucion real, ya que la lista de palabras es escasa, pero para comprobar el funcionamiento sirve igual

/*
import { defineStore } from "pinia";
import { wordList } from "../data/words";


export const usePalabraAdivinarStore = defineStore("word", () => {
  const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
  return { randomWord };
})
*/

import { defineStore } from "pinia";
import { ref } from "vue";

const API_URL = 'https://random-word-api.herokuapp.com/word?length=5'

export const usePalabraAdivinarStore = defineStore("word", () => {
  const randomWord = ref("");

  fetch(API_URL)
    .then(response => response.text()) // Si devuelve solo texto
    .then(palabra => {
      randomWord.value = palabra.slice(2, -2);
    })
    .catch(error => {
      console.error('Error:', error);
      randomWord.value = "fallback";
    });
    randomWord.value = limpiarTexto(randomWord.value)
  return { randomWord };
});

// Elimina cualquier signo de puntuacion de la palabra
function limpiarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
