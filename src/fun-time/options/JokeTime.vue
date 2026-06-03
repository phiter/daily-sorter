<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter, ninjaHeaders } from '../utils';
import Spinner from '../Spinner.vue';

const joke = ref('');
const loading = ref(false);

const load = async () => {
  joke.value = '';
  loading.value = true;
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/jokeoftheday', ninjaHeaders).then(r => r.json());
    joke.value = response[0].joke;
  } finally {
    loading.value = false;
  }
};

defineExpose({ load });
</script>

<template>
  <div class="mx-auto text-center px-4">
    <Spinner v-if="loading" />
    <p v-else-if="joke" class="text-gray-800 dark:text-gray-200 font-medium">{{ uppercaseFirstLetter(joke) }}</p>
  </div>
</template>
