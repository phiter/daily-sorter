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
  <div v-if="joke" style="font-weight: bold">{{ uppercaseFirstLetter(joke) }}</div>
</template>
