<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter, ninjaHeaders } from '../utils';

const title = ref('');
const question = ref('');
const answer = ref('');
const revealAnswer = ref(false);

const load = async () => {
  revealAnswer.value = false;
  const response = await fetch('https://api.api-ninjas.com/v1/riddles', ninjaHeaders).then(r => r.json());
  const riddle = response[0];
  title.value = riddle.title;
  question.value = riddle.question;
  answer.value = riddle.answer;
};

defineExpose({ load });
</script>

<template>
  <div v-if="question" class="mx-auto text-center px-4">
    <p v-if="title" class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">{{ title }}</p>
    <p class="text-gray-800 dark:text-gray-200 font-medium">{{ uppercaseFirstLetter(question) }}</p>
    <div class="mt-6">
      <button
        v-if="!revealAnswer"
        @click="revealAnswer = true"
        class="px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition active:scale-95 cursor-pointer"
      >Reveal</button>
      <p v-else class="mt-6 text-gray-800 dark:text-gray-200 font-semibold">{{ answer }}</p>
    </div>
  </div>
</template>
