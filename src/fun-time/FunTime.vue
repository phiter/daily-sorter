<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue';
import JokeTime from './options/JokeTime.vue';
import Trivia from './options/Trivia.vue';
import RandomFact from './options/RandomFact.vue';
import RandomXkcd from './options/RandomXkcd.vue';
import Riddle from './options/Riddle.vue';
// import DogFact from './options/DogFact.vue';
import CatFact from './options/CatFact.vue';
import RandomLocation from './options/RandomLocation.vue';
import DayInHistory from './options/DayInHistory.vue';

const options = {
  '😜 Joke time!': JokeTime,
  '🧠 Trivia': Trivia,
  '🤓 Random fact': RandomFact,
  '💻 Random xkcd': RandomXkcd,
  '❓ Riddle': Riddle,
  // '🐶 Dog fact': DogFact,
  '🐱 Cat fact': CatFact,
  '🌍 Random location': RandomLocation,
  '📅 Day in history': DayInHistory,
};

type OptionKey = keyof typeof options;

const isOpen = ref(false);
const selectedType = ref<OptionKey | null>(null);
const optionRef = ref<{ load: () => void } | null>(null);

const currentComponent = computed(() => selectedType.value ? options[selectedType.value] : null);

const selectOption = async (key: OptionKey) => {
  if (selectedType.value === key) {
    optionRef.value?.load();
  } else {
    selectedType.value = key;
    await nextTick();
    optionRef.value?.load();
  }
};

const selectRandomType = async () => {
  const keys = Object.keys(options) as OptionKey[];
  const randomIndex = Math.floor(Math.random() * keys.length);
  selectedType.value = keys[randomIndex];
  await nextTick();
  optionRef.value?.load();
};
</script>

<template>
  <div class="mt-16 border-t border-gray-100 dark:border-gray-800 pt-10">
    <div class="flex items-center justify-center gap-3 mb-6">
      <button
        class="flex items-center gap-2 group cursor-pointer"
        @click="isOpen = !isOpen"
      >
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition">🎲 Fun Time</p>
        <svg
          class="w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform duration-200"
          :class="isOpen ? 'rotate-180' : ''"
          fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <button
        :class="['p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition cursor-pointer', isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none']"
        title="Choose random type"
        @click="selectRandomType"
      >
        <svg fill="currentColor" height="14px" width="14px" viewBox="-4 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M0 20.688v2c0 0.281 0.219 0.5 0.5 0.5h2.875c1.688 0 3.094-0.781 4.25-1.969 1.188-1.188 2.156-2.781 3.125-4.313 0.781-1.25 1.563-2.438 2.375-3.344 0.781-0.938 1.563-1.5 2.5-1.5h2.656v2.281c0 0.719 0.5 0.844 1.094 0.375l4.344-3.625c0.375-0.313 0.375-0.906 0-1.219l-4.344-3.594c-0.594-0.5-1.094-0.375-1.094 0.375v2.406h-2.656c-1.719 0-3.063 0.75-4.25 1.969-1.156 1.188-2.219 2.781-3.156 4.281-0.813 1.281-1.563 2.5-2.375 3.406-0.781 0.906-1.563 1.469-2.469 1.469h-2.875c-0.281 0-0.5 0.219-0.5 0.5zM0 9.531v2c0 0.281 0.219 0.5 0.5 0.5h2.875c1.406 0 2.531 1.375 3.75 3.156 0.031-0.094 0.063-0.156 0.094-0.219 0.031-0.031 0.125-0.094 0.156-0.156 0.469-0.781 1-1.531 1.5-2.344-0.75-0.969-1.469-1.844-2.406-2.438-0.906-0.625-1.906-0.969-3.094-0.969h-2.875c-0.344 0-0.5 0.156-0.5 0.469zM18.281 20.125h-2.656c-1.375 0-2.563-1.344-3.75-3.094-0.063 0.094-0.094 0.156-0.125 0.219-0.063 0.063-0.094 0.125-0.156 0.219-0.219 0.375-0.5 0.781-0.719 1.156-0.25 0.344-0.5 0.75-0.719 1.094 0.719 0.969 1.469 1.813 2.375 2.406 0.875 0.625 1.906 1.031 3.094 1.031h2.656v2.188c0 0.719 0.5 0.875 1.094 0.375l4.344-3.656c0.375-0.313 0.375-0.875 0-1.188l-4.344-3.594c-0.594-0.469-1.094-0.375-1.094 0.375v2.469z"></path></svg>
      </button>
    </div>

    <div v-if="isOpen">
      <div class="grid grid-cols-4 gap-2 max-w-2xl mx-auto">
        <div
          v-for="(_, title) in options"
          :key="title"
          class="fun-btn-wrap relative z-0"
        >
          <button
            @click="selectOption(title as OptionKey)"
            :class="[
              'w-full px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer border text-left',
              selectedType === title
                ? 'bg-indigo-500 border-indigo-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
            ]"
          >{{ title }}</button>
        </div>
      </div>

      <div class="mt-8" :class="['🌍 Random location (beta)', '💻 Random xkcd'].includes(selectedType ?? '') ? 'full-bleed' : ''">
        <component v-if="selectedType" :is="currentComponent" :key="selectedType" ref="optionRef" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.full-bleed {
  margin-left: calc(-50vw + 50% + 40px);
  margin-right: calc(-50vw + 50% + 40px);
  width: calc(100vw - 80px);
}

.fun-btn-wrap::after {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
  background-size: 400%;
  z-index: -1;
  animation: steam 5s linear infinite;
  opacity: 0;
  transition: opacity 0.3s;
  filter: blur(8px);
  border-radius: 0.75rem;
}

.fun-btn-wrap:hover::after {
  opacity: 0.7;
}

@keyframes steam {
  0% { background-position: 0 0; }
  100% { background-position: 400% 0; }
}
</style>
