<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter } from '../utils';

const setup = ref('');
const punchline = ref<string | undefined>(undefined);
const revealPunchline = ref(false);

const load = async () => {
  revealPunchline.value = false;
  const response = await fetch(
    'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit'
  ).then(r => r.json());
  setup.value = response.setup ? `Q: ${response.setup}` : response.joke;
  punchline.value = response.delivery ? `A: ${response.delivery}` : undefined;
};

defineExpose({ load });
</script>

<template>
  <div v-if="setup" style="font-weight: bold">
    {{ uppercaseFirstLetter(setup) }}
    <div v-if="punchline" style="margin-top: 30px">
      <button v-if="!revealPunchline" class="sort" @click="revealPunchline = true">Reveal</button>
      <div v-else style="margin-top: 30px; font-weight: bold">{{ punchline }}</div>
    </div>
  </div>
</template>
