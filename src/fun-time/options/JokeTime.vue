<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter, ninjaHeaders } from '../utils';

const joke = ref('');

const load = async () => {
  joke.value = '';
  const response = await fetch('https://api.api-ninjas.com/v1/jokeoftheday', ninjaHeaders).then(r => r.json());
  joke.value = response[0].joke;
};

defineExpose({ load });
</script>

<template>
  <div v-if="joke" class="mx-auto text-center px-4">
    <p class="text-gray-800 dark:text-gray-200 font-medium">{{ uppercaseFirstLetter(joke) }}</p>
  </div>
</template>
