<script lang="ts" setup>
import { ref } from 'vue';
import { uppercaseFirstLetter, ninjaHeaders } from '../utils';

const title = ref('');
const question = ref('');
const answer = ref('');
const revealAnswer = ref(false);

const load = async () => {
  revealAnswer.value = false;
  const response = await fetch('https://api.api-ninjas.com/v1/riddles', ninjaHeaders).then(r => r.json());
  const riddle = response[0];
  title.value = riddle.title;
  question.value = riddle.question;
  answer.value = riddle.answer;
};

defineExpose({ load });
</script>

<template>
  <div v-if="question" style="font-weight: bold">
    <h4 v-if="title">{{ title }}</h4>
    {{ uppercaseFirstLetter(question) }}
    <div style="margin-top: 30px">
      <button v-if="!revealAnswer" class="sort" @click="revealAnswer = true">Reveal</button>
      <div v-else style="margin-top: 30px; font-weight: bold">{{ answer }}</div>
    </div>
  </div>
</template>
