<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter } from '../utils';

const joke = ref('');

const load = async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  }).then(r => r.json());
  joke.value = response.joke;
};

defineExpose({ load });
</script>

<template>
  <div v-if="joke" class="max-w-lg mx-auto text-center px-4">
    <p class="text-gray-800 dark:text-gray-200 font-medium">{{ uppercaseFirstLetter(joke) }}</p>
  </div>
</template>
