<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter } from '../utils';
import Spinner from '../Spinner.vue';

const fact = ref('');
const loading = ref(false);

const load = async () => {
  fact.value = '';
  loading.value = true;
  try {
    const response = await fetch('https://meowfacts.herokuapp.com/').then(r => r.json());
    fact.value = response.data[0];
  } finally {
    loading.value = false;
  }
};

defineExpose({ load });
</script>

<template>
  <div class="mx-auto text-center px-4">
    <Spinner v-if="loading" />
    <p v-else-if="fact" class="text-gray-800 dark:text-gray-200 font-medium">{{ uppercaseFirstLetter(fact) }}</p>
  </div>
</template>
