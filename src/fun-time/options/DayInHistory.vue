<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter, ninjaHeaders } from '../utils';

const year = ref('');
const month = ref('');
const day = ref('');
const event = ref('');

const load = async () => {
  year.value = '';
  month.value = '';
  day.value = '';
  event.value = '';
  const response = await fetch('https://api.api-ninjas.com/v1/dayinhistory', ninjaHeaders).then(r => r.json());
  const item = response[0];
  year.value = item.year;
  month.value = item.month;
  day.value = item.day;
  event.value = item.event;
};

defineExpose({ load });
</script>

<template>
  <div v-if="event" class="mx-auto text-center px-4">
    <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
      {{ new Date(+year, +month - 1, +day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
    </p>
    <p class="text-gray-800 dark:text-gray-200 font-medium">{{ uppercaseFirstLetter(event) }}</p>
  </div>
</template>
