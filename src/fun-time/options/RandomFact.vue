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
  <div v-if="fact" style="font-weight: bold">{{ uppercaseFirstLetter(fact) }}</div>
</template>
