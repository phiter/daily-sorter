<script lang="ts" setup>
import { ref } from 'vue';

const title = ref('');
const image = ref('');
const imageAlt = ref('');

const load = async () => {
  const latest = await fetch('https://xkcd.vercel.app/?comic=latest').then(r => r.json());
  const randomNum = Math.floor(Math.random() * latest.num) + 1;
  const comic = await fetch(`https://xkcd.vercel.app/?comic=${randomNum}`).then(r => r.json());
  title.value = comic.title;
  image.value = comic.img;
  imageAlt.value = comic.alt;
};

defineExpose({ load });
</script>

<template>
  <div v-if="title" style="font-weight: bold">
    {{ title }}
    <div style="margin-top: 30px">
      <img height="400" :src="image" :alt="imageAlt" />
    </div>
  </div>
</template>
