<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter, ninjaHeaders } from '../utils';

const fact = ref('');

const load = async () => {
  const response = await fetch('https://api.api-ninjas.com/v1/facts', ninjaHeaders).then(r => r.json());
  fact.value = response[0].fact;
};

defineExpose({ load });
</script>

<template>
  <div v-if="fact" class="max-w-lg mx-auto text-center px-4">
    <p class="text-gray-800 dark:text-gray-200 font-medium">{{ uppercaseFirstLetter(fact) }}</p>
  </div>
</template>
