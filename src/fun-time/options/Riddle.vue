<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter } from '../utils';
import Spinner from '../Spinner.vue';

const categories = ['logic', 'funny', 'mystery', 'science', 'math', 'who-am-i'] as const;
type Category = typeof categories[number];

const selectedCategory = ref<Category | null>(null);
const question = ref('');
const answer = ref('');
const revealAnswer = ref(false);
const loading = ref(false);

const fetchRiddle = async (category: Category) => {
  selectedCategory.value = category;
  revealAnswer.value = false;
  question.value = '';
  answer.value = '';
  loading.value = true;
  try {
    const response = await fetch(`https://riddles-api-eight.vercel.app/${category}`).then(r => r.json());
    question.value = response.riddle;
    answer.value = response.answer;
  } finally {
    loading.value = false;
  }
};

const fetchRandom = () => {
  const random = categories[Math.floor(Math.random() * categories.length)];
  fetchRiddle(random);
};

const load = async () => {
  selectedCategory.value = null;
  question.value = '';
  answer.value = '';
  revealAnswer.value = false;
};

defineExpose({ load });
</script>

<template>
  <div class="mx-auto text-center px-4">
    <div class="flex flex-wrap justify-center items-center gap-2 mb-6">
      <button
        @click="fetchRandom"
        class="px-3 py-1.5 rounded-full text-sm font-semibold transition active:scale-95 cursor-pointer border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Random category"
      >
        <svg fill="currentColor" height="13px" width="13px" viewBox="-4 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M0 20.688v2c0 0.281 0.219 0.5 0.5 0.5h2.875c1.688 0 3.094-0.781 4.25-1.969 1.188-1.188 2.156-2.781 3.125-4.313 0.781-1.25 1.563-2.438 2.375-3.344 0.781-0.938 1.563-1.5 2.5-1.5h2.656v2.281c0 0.719 0.5 0.844 1.094 0.375l4.344-3.625c0.375-0.313 0.375-0.906 0-1.219l-4.344-3.594c-0.594-0.5-1.094-0.375-1.094 0.375v2.406h-2.656c-1.719 0-3.063 0.75-4.25 1.969-1.156 1.188-2.219 2.781-3.156 4.281-0.813 1.281-1.563 2.5-2.375 3.406-0.781 0.906-1.563 1.469-2.469 1.469h-2.875c-0.281 0-0.5 0.219-0.5 0.5zM0 9.531v2c0 0.281 0.219 0.5 0.5 0.5h2.875c1.406 0 2.531 1.375 3.75 3.156 0.031-0.094 0.063-0.156 0.094-0.219 0.031-0.031 0.125-0.094 0.156-0.156 0.469-0.781 1-1.531 1.5-2.344-0.75-0.969-1.469-1.844-2.406-2.438-0.906-0.625-1.906-0.969-3.094-0.969h-2.875c-0.344 0-0.5 0.156-0.5 0.469zM18.281 20.125h-2.656c-1.375 0-2.563-1.344-3.75-3.094-0.063 0.094-0.094 0.156-0.125 0.219-0.063 0.063-0.094 0.125-0.156 0.219-0.219 0.375-0.5 0.781-0.719 1.156-0.25 0.344-0.5 0.75-0.719 1.094 0.719 0.969 1.469 1.813 2.375 2.406 0.875 0.625 1.906 1.031 3.094 1.031h2.656v2.188c0 0.719 0.5 0.875 1.094 0.375l4.344-3.656c0.375-0.313 0.375-0.875 0-1.188l-4.344-3.594c-0.594-0.469-1.094-0.375-1.094 0.375v2.469z"></path></svg>
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        @click="fetchRiddle(cat)"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition active:scale-95 cursor-pointer border',
          selectedCategory === cat
            ? 'bg-indigo-500 text-white border-indigo-500'
            : 'bg-transparent text-indigo-500 border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
        ]"
      >{{ cat }}</button>
    </div>

    <Spinner v-if="loading" />

    <div v-else-if="question">
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">{{ selectedCategory }}</p>
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
    <p v-else-if="!selectedCategory" class="text-gray-400 dark:text-gray-500 text-sm">Pick a category to get a riddle.</p>
  </div>
</template>
