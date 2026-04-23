<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter } from '../utils';

const fact = ref('');

const load = async () => {
  const response = await fetch('https://meowfacts.herokuapp.com/').then(r => r.json());
  fact.value = response.data[0];
};

defineExpose({ load });
</script>

<template>
  <div v-if="fact" style="font-weight: bold">
    {{ uppercaseFirstLetter(fact) }}
  </div>
</template>
