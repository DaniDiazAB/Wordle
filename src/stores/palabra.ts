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

const API_URL = 'https://danidiaz.site/wordle/api/getData.php'

export const usePalabraAdivinarStore = defineStore("word", () => {
  const randomWord = ref("");

  fetch(API_URL)
  
    .then(response => response.json()) // Si devuelve solo texto
    .then(palabra => {
      

      const indice = Math.floor(Math.random() * palabra.length);

      randomWord.value = palabra[indice].traduccion_palabra
    })
    .catch(error => {
      console.error('Error:', error);
      randomWord.value = "fallback";
    });
  return { randomWord };
});


