<script lang="ts" setup>
import { onMounted, ref } from "vue";

interface IJoke {
  setup: string;
  punchline?: string;
}

const joke = ref<IJoke | null>(null);
const revealJoke = ref(false);
const revealPunchline = ref(false);
const selectedType = ref<keyof typeof options>('Joke time!');

const options = {
  'Joke time!': async () => {
  const response = await fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit").then((r) => r.json());

  return {
    setup: response.setup ? `Q: ${response.setup}` : response.joke,
    punchline: response.delivery ? `A: ${response.delivery}` : undefined,
  };
},
  'Get random fact': async () => ({setup: (await fetch('https://uselessfacts.jsph.pl/random.json?language=en').then((r) => r.json())).text}),
  'Get dog fact': async () => ({setup: (await fetch("https://dog-api.kinduff.com/api/facts").then((r) => r.json())).facts[0]}),
  'Get cat fact': async () => ({setup: (await fetch("https://meowfacts.herokuapp.com/").then((r) => r.json())).data[0]}),
  'Get number fact': async () => ({setup: await fetch("http://numbersapi.com/random/").then((r) => r.text())})
}

const images = {
  'Get cat fact': () => `https://thecatapi.com/api/images/get?format=src&type=gif&nocache=${new Date().toUTCString()}`,
  'Get dog fact': () => `https://thedogapi.com/api/images/get?format=src&type=gif&nocache=${new Date().toUTCString()}`
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
      <select class="selector" v-model="selectedType">
        <option v-for="(option, title) in options">{{ title }}</option>
      </select>
      <button class="go" @click="getJoke()">Go!</button>
    </div>
    <div style="margin-top: 30px; font-weight: bold" v-if="joke && revealJoke">
      {{ joke.setup }}

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

<style scoped>
.joke {
  margin-top: 100px;
}
.selector {
  max-width: 600px;
  resize: vertical;
  border: 1px solid #6ddbff;
  padding: 10px;
  border-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
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
