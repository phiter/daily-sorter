<script lang="ts" setup>
import { onMounted, ref } from "vue";

interface IJoke {
  title?: string;
  setup: string;
  punchline?: string;
}
const uppercaseFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const ninjaHeaders = { headers: { 'X-Api-Key': (import.meta as any).env.VITE_NINJA }};
const joke = ref<IJoke | null>(null);
const revealJoke = ref(false);
const revealPunchline = ref(false);
const selectedType = ref<keyof typeof options>('😜 Joke time!');

const options = {
  '😜 Joke time!': async () => {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit").then((r) => r.json());

    return {
      setup: response.setup ? `Q: ${response.setup}` : response.joke,
      punchline: response.delivery ? `A: ${response.delivery}` : undefined,
    };
  },
  '👨🏻 Get dad joke': async () => ({setup: (await fetch("https://icanhazdadjoke.com/", {headers: { Accept: 'application/json' }}).then((r) => r.json())).joke}),
  '🤓 Get random fact': async () => ({setup: (await fetch('https://api.api-ninjas.com/v1/facts', ninjaHeaders).then((r) => r.json()))[0].fact}),
  '❓ Get riddle': async () => {
    const response = await fetch('https://api.api-ninjas.com/v1/riddles', ninjaHeaders).then((r) => r.json());

    return {
      title: response[0].title,
      setup: response[0].question,
      punchline: response[0].answer,
    } satisfies IJoke;
  },
  '🐶 Get dog fact': async () => ({setup: (await fetch("https://dog-api.kinduff.com/api/facts").then((r) => r.json())).facts[0]}),
  '🐱 Get cat fact': async () => ({setup: (await fetch("https://meowfacts.herokuapp.com/").then((r) => r.json())).data[0]}),
}

const images = {
  '🐶 Get dog fact': () => `https://thedogapi.com/api/images/get?format=src&type=gif&nocache=${new Date().toUTCString()}`,
  '🐱 Get cat fact': () => `https://thecatapi.com/api/images/get?format=src&type=gif&nocache=${new Date().toUTCString()}`,
} as any;

const getJoke = async () => {
  revealPunchline.value = false;

  if (!revealJoke.value) {
    revealJoke.value = true;
  } else {
    joke.value = null;

    const promiseFn = options[selectedType.value];

    joke.value = await promiseFn();
  }
};

onMounted(async () => {
  await getJoke();
});

</script>
<template>
  <div class="joke">
    <div class="block">
      <select class="selector" v-model="selectedType" @change="joke = null">
        <option v-for="(option, title) in options">{{ title }}</option>
      </select>
      <button class="go" @click="getJoke()">Go!</button>
    </div>
    <div style="margin-top: 30px; font-weight: bold" v-if="joke && revealJoke">
      <h4 v-if="joke.title">
        {{ joke.title }}
      </h4>
      {{ uppercaseFirstLetter(joke.setup) }}

      <div v-if="joke.punchline" style="margin-top: 30px">
        <div v-if="!revealPunchline">
          <button @click="revealPunchline = true">Reveal</button>
        </div>
        <div style="margin-top: 30px; font-weight: bold" v-if="revealPunchline">
          {{ joke.punchline }}
        </div>
      </div>

      <div v-if="selectedType in images" style="margin-top: 30px;">
        <img height="200" :src="images[selectedType]()" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.joke {
  margin-top: 60px;
}
.selector {
  max-width: 600px;
  resize: vertical;
  border: 1px solid #6ddbff;
  padding: 10px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  &:focus {
    outline: none;
  }
}

.go {
  background: #6d9bff;
  border: white;
  color: white;
  padding: 10px 20px;
  padding-bottom: 11px;
  font-size: 16px;
  border-radius: 5px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}


.block {
	position: relative;
  display: inline-block;
	background: white;
  border-radius: 5px;
}

.block:after, .block:after {
	content: '';
	position: absolute;
	left: -2px;
	top: -2px;
	background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00,#ffff00, #ff0000, #fb0094, 
		#0000ff, #00ff00,#ffff00, #ff0000);
	background-size: 200%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
	z-index: -1;
	animation: steam 5s linear infinite;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}

.block:hover:after, .block:hover:after {
  opacity: 1;
}

@keyframes steam {
	0% {
		background-position: 0 0;
	}
	100% {
		background-position: 400% 0;
	}
}

.block:after {
	filter: blur(20px);
}
</style>
