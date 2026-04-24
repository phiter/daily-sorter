<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter } from '../utils';

const setup = ref('');
const punchline = ref<string | undefined>(undefined);
const revealPunchline = ref(false);

const load = async () => {
  revealPunchline.value = false;
  const response = await fetch(
    'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit'
  ).then(r => r.json());
  setup.value = response.setup ? `Q: ${response.setup}` : response.joke;
  punchline.value = response.delivery ? `A: ${response.delivery}` : undefined;
};

defineExpose({ load });
</script>

<template>
  <div v-if="setup" class="mx-auto text-center px-4">
    <p class="text-gray-800 dark:text-gray-200 font-medium">{{ uppercaseFirstLetter(setup) }}</p>
    <div v-if="punchline" class="mt-6">
      <button
        v-if="!revealPunchline"
        @click="revealPunchline = true"
        class="px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition active:scale-95 cursor-pointer"
      >Reveal</button>
      <p v-else class="mt-6 text-gray-800 dark:text-gray-200 font-semibold">{{ punchline }}</p>
    </div>
  </div>
</template>
