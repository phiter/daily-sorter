<script lang="ts" setup>
import { onMounted, ref } from "vue";
import sample from "lodash.sample";
import { facts } from "./facts";

interface IJoke {
  setup: string;
  punchline: string;
}

const joke = ref<IJoke | null>(null);
const revealJoke = ref(false);
const revealPunchline = ref(false);

const jokeApiUrl =
  "https://v2.jokeapi.dev/joke/Programming,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart";
const factApiUrl = "https://uselessfacts.jsph.pl/random.json?language=en";
const dogApiUrl = "https://dog-api.kinduff.com/api/facts";
const meowApiUrl = "https://meowfacts.herokuapp.com/";
const numbersApiUrl = "http://numbersapi.com/random/";

const getRandomJokeFromApi = async () => {
  const response = await fetch(jokeApiUrl).then((r) => r.json());

  return {
    setup: `Q: ${response.setup}`,
    punchline: `A: ${response.delivery}`,
  };
};

const getRandomFact = async () => ({
  setup: `Fact of the day:`,
  punchline: (await fetch(factApiUrl).then((r) => r.json())).text,
});

const getRandomStaticFact = async () => ({
  setup: `Fact of the day:`,
  punchline: sample(facts).text,
});

const getDogFactFromApi = async () => ({
  setup: `Dog fact of the day:`,
  punchline: (await fetch(dogApiUrl).then((r) => r.json())).facts[0],
});

const getMeowFactFromApi = async () => ({
  setup: `Meow fact of the day:`,
  punchline: (await fetch(meowApiUrl).then((r) => r.json())).data[0],
});

const getNumberFactFromApi = async () => ({
  setup: `Number fact of the day:`,
  punchline: await fetch(numbersApiUrl).then((r) => r.text()),
});

const getJoke = async () => {
  revealPunchline.value = false;

  if (!revealJoke.value) {
    revealJoke.value = true;
  } else {
    joke.value = null;

    const promiseFn = sample([
      getRandomJokeFromApi,
      getRandomFact,
      getDogFactFromApi,
      getMeowFactFromApi,
      getNumberFactFromApi,
      getRandomStaticFact,
    ]);

    joke.value = await promiseFn();
  }
};

onMounted(async () => {
  await getJoke();
});
</script>
<template>
  <div class="joke">
    <button @click="getJoke()">Joke time!</button>
    <div style="margin-top: 30px; font-weight: bold" v-if="joke && revealJoke">
      {{ joke.setup }}

      <div v-if="joke.punchline" style="margin-top: 30px">
        <div v-if="!reveal">
          <button @click="revealPunchline = true">Reveal</button>
        </div>
        <div style="margin-top: 30px; font-weight: bold" v-if="revealPunchline">
          {{ joke.punchline }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.joke {
  margin-top: 100px;
}
</style>
