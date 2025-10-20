import { defineStore } from "pinia";
import { wordList } from "../data/words";


export const usePalabraAdivinarStore = defineStore("word", () => {
  const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
  return { randomWord };
})


