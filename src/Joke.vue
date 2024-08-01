<script lang="ts" setup>
import { onMounted, ref } from "vue";

interface IJoke {
  title?: string;
  setup: string;
  punchline?: string;
  image?: string;
  image_alt?: string;
}

const uppercaseFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const ninjaHeaders = { headers: { 'X-Api-Key': (import.meta as any).env.VITE_NINJA }};
const joke = ref<IJoke | null>(null);
const revealJoke = ref(false);
const revealPunchline = ref(false);
const selectedType = ref<keyof typeof options>('😜 Joke time!');
const selectRandomType = () => {
  const keys = Object.keys(options);
  const randomIndex = Math.floor(Math.random() * keys.length);
  selectedType.value = keys[randomIndex] as any;
  joke.value = null;
  getJoke();
};
const options = {
  '😜 Joke time!': async () => {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit").then((r) => r.json());

    return {
      setup: response.setup ? `Q: ${response.setup}` : response.joke,
      punchline: response.delivery ? `A: ${response.delivery}` : undefined,
    };
  },
  '👨🏻 Dad joke': async () => ({setup: (await fetch("https://icanhazdadjoke.com/", {headers: { Accept: 'application/json' }}).then((r) => r.json())).joke}),
  '🤓 Random fact': async () => ({setup: (await fetch('https://api.api-ninjas.com/v1/facts', ninjaHeaders).then((r) => r.json()))[0].fact}),
  '💻 Random xkcd': async () => {
    const response = await fetch('https://xkcd.com/info.0.json').then((r) => r.json());
    const randomComicNumber = Math.floor(Math.random() * response.num) + 1;
    const randomComic = await fetch(`https://xkcd.com/${randomComicNumber}/info.0.json`).then((r) => r.json());

    return {
      title: randomComic.title,
      image: randomComic.img,
      image_alt: randomComic.alt,
    };
  },
  '❓ Riddle': async () => {
    const response = await fetch('https://riddles-api.vercel.app/random', ninjaHeaders).then((r) => r.json());

    return {
      setup: response.riddle,
      punchline: response.answer,
    } satisfies IJoke;
  },
  '🐶 Dog fact': async () => ({
    setup: (await fetch("https://dogapi.dog/api/v2/facts").then((r) => r.json())).data[0].attributes.body,
    image: `https://thedogapi.com/api/images/get?format=src&type=gif&nocache=${new Date().toUTCString()}`,
  }),
  '🐱 Cat fact': async () => ({
    setup: (await fetch("https://meowfacts.herokuapp.com/").then((r) => r.json())).data[0],
    image: `https://thecatapi.com/api/images/get?format=src&type=gif&nocache=${new Date().toUTCString()}`
  }),
}

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
      <button class="go random" title="Choose random type" @click="selectRandomType">
        <svg fill="#fff" height="18px" width="18px" viewBox="-4 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>shuffle</title> <path d="M0 20.688v2c0 0.281 0.219 0.5 0.5 0.5h2.875c1.688 0 3.094-0.781 4.25-1.969 1.188-1.188 2.156-2.781 3.125-4.313 0.781-1.25 1.563-2.438 2.375-3.344 0.781-0.938 1.563-1.5 2.5-1.5h2.656v2.281c0 0.719 0.5 0.844 1.094 0.375l4.344-3.625c0.375-0.313 0.375-0.906 0-1.219l-4.344-3.594c-0.594-0.5-1.094-0.375-1.094 0.375v2.406h-2.656c-1.719 0-3.063 0.75-4.25 1.969-1.156 1.188-2.219 2.781-3.156 4.281-0.813 1.281-1.563 2.5-2.375 3.406-0.781 0.906-1.563 1.469-2.469 1.469h-2.875c-0.281 0-0.5 0.219-0.5 0.5zM0 9.531v2c0 0.281 0.219 0.5 0.5 0.5h2.875c1.406 0 2.531 1.375 3.75 3.156 0.031-0.094 0.063-0.156 0.094-0.219 0.031-0.031 0.125-0.094 0.156-0.156 0.469-0.781 1-1.531 1.5-2.344-0.75-0.969-1.469-1.844-2.406-2.438-0.906-0.625-1.906-0.969-3.094-0.969h-2.875c-0.344 0-0.5 0.156-0.5 0.469zM18.281 20.125h-2.656c-1.375 0-2.563-1.344-3.75-3.094-0.063 0.094-0.094 0.156-0.125 0.219-0.063 0.063-0.094 0.125-0.156 0.219-0.219 0.375-0.5 0.781-0.719 1.156-0.25 0.344-0.5 0.75-0.719 1.094 0.719 0.969 1.469 1.813 2.375 2.406 0.875 0.625 1.906 1.031 3.094 1.031h2.656v2.188c0 0.719 0.5 0.875 1.094 0.375l4.344-3.656c0.375-0.313 0.375-0.875 0-1.188l-4.344-3.594c-0.594-0.469-1.094-0.375-1.094 0.375v2.469z"></path> </g></svg>
      </button>
      <button class="go" @click="getJoke()">Go!</button>
    </div>
    <div style="margin-top: 30px; font-weight: bold" v-if="joke && revealJoke">
      <h4 v-if="joke.title">
        {{ joke.title }}
      </h4>
      {{ uppercaseFirstLetter(joke.setup) }}

      <div v-if="joke.punchline" style="margin-top: 30px">
        <div v-if="!revealPunchline">
          <button class="sort" @click="revealPunchline = true">Reveal</button>
        </div>
        <div style="margin-top: 30px; font-weight: bold" v-if="revealPunchline">
          {{ joke.punchline }}
        </div>
      </div>

      <div v-if="joke.image" style="margin-top: 30px;">
        <img height="400" :src="joke.image" :alt="joke.image_alt" />
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
  &.random {
    background-color: #6ddbff;
    border-radius: 0;
    padding: 9px 14px;
  }
}


.block {
	position: relative;
  display: inline-flex;
  align-items: stretch;
	background: white;
  border-radius: 5px;
  height: 40px;
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
