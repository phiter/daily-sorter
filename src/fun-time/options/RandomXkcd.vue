<script lang="ts" setup>
import { ref } from 'vue';
import Spinner from '../Spinner.vue';

const title = ref('');
const image = ref('');
const imageAlt = ref('');
const loading = ref(false);

const load = async () => {
  title.value = '';
  image.value = '';
  loading.value = true;
  try {
    const latest = await fetch('https://xkcd.vercel.app/?comic=latest').then(r => r.json());
    const randomNum = Math.floor(Math.random() * latest.num) + 1;
    const comic = await fetch(`https://xkcd.vercel.app/?comic=${randomNum}`).then(r => r.json());
    title.value = comic.title;
    image.value = comic.img;
    imageAlt.value = comic.alt;
  } finally {
    loading.value = false;
  }
};

defineExpose({ load });
</script>

<template>
  <div class="text-center px-4">
    <Spinner v-if="loading" />
    <template v-else-if="title">
      <p class="text-gray-800 dark:text-gray-200 font-semibold mb-6">{{ title }}</p>
      <img v-if="image" class="max-w-full mx-auto rounded-xl shadow-md" :src="image" :alt="imageAlt" />
    </template>
  </div>
</template>
