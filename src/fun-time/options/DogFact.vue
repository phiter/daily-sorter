<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter } from '../utils';

const fact = ref('');

const load = async () => {
  const response = await fetch('https://dogapi.dog/api/v2/facts').then(r => r.json());
  fact.value = response.data[0].attributes.body;
};

defineExpose({ load });
</script>

<template>
  <div v-if="fact" style="font-weight: bold">
    {{ uppercaseFirstLetter(fact) }}
  </div>
</template>
