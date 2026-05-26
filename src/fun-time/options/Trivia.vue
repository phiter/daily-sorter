<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter, ninjaHeaders } from '../utils';

const category = ref('');
const question = ref('');
const answer = ref('');
const revealAnswer = ref(false);

const load = async () => {
  category.value = '';
  question.value = '';
  answer.value = '';
  revealAnswer.value = false;
  const response = await fetch('https://api.api-ninjas.com/v1/triviaoftheday', ninjaHeaders).then(r => r.json());
  const item = response[0];
  category.value = item.category;
  question.value = item.question;
  answer.value = item.answer;
};

defineExpose({ load });
</script>

<template>
  <div v-if="question" class="mx-auto text-center px-4">
    <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">{{ category }}</p>
    <p class="text-gray-800 dark:text-gray-200 font-medium">{{ uppercaseFirstLetter(question) }}</p>
    <div class="mt-6">
      <button
        v-if="!revealAnswer"
        @click="revealAnswer = true"
        class="px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition active:scale-95 cursor-pointer"
      >Reveal</button>
      <p v-else class="mt-6 text-gray-800 dark:text-gray-200 font-semibold">{{ uppercaseFirstLetter(answer) }}</p>
    </div>
  </div>
</template>
