<template>
  <!-- Top controls -->
  <div class="fixed top-3 right-4 flex gap-2 z-50">
    <button
      v-if="isPipEnabled"
      @click="openPip"
      title="Picture in picture"
      class="pip-button bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-xl px-2.5 py-1 cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >⧉</button>
    <button
      @click="toggleDark"
      :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      class="theme-toggle bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-xl px-2.5 py-1 cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >{{ isDark ? '☀️' : '🌙' }}</button>
  </div>

  <!-- Header -->
  <header class="mb-10">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Daily Sorter</h1>
  </header>

  <!-- Input section -->
  <div class="max-w-lg mx-auto mb-8">
    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 text-left">
      Names, comma separated
    </label>
    <textarea
      class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-y min-h-[64px] text-sm shadow-sm"
      v-model="namesString"
    />
    <div class="flex gap-3 mt-4 justify-center">
      <button
        @click="sortNames"
        class="px-6 py-2.5 rounded-lg bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400 text-white font-semibold text-sm transition-all active:scale-95 shadow-sm cursor-pointer"
      >Sort</button>
      <button
        @click="next"
        class="px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-all active:scale-95 shadow-sm cursor-pointer"
      >Next</button>
    </div>
  </div>

  <!-- Sorted list -->
  <div class="max-w-sm mx-auto mb-12 relative">
    <!-- Static arrow connectors — not part of the animation -->
    <div aria-hidden="true" class="pointer-events-none">
      <div
        v-for="n in Math.max(0, sortedNames.length - 1)"
        :key="n"
        class="absolute left-1/2 -translate-x-1/2"
        :style="{ top: `calc(${n} * 4.25rem - 1.25rem)` }"
      >
        <svg class="w-4 h-4 text-indigo-400 dark:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <TransitionGroup
      name="list"
      appear
      tag="div"
      class="flex flex-col gap-6"
    >
      <div
        v-for="(person, index) of sortedNames"
        :key="person.id"
        :style="{ '--i': index }"
      >
        <Person :person="person" @removePerson="removePerson(index)" />
      </div>
    </TransitionGroup>
  </div>

  <FunTime />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Person from './Person.vue';
import FunTime from './fun-time/FunTime.vue';
import { Person as IPerson } from './types';
import { openPip, isPipEnabled, pipWindow } from './pip';
import { inject } from '@vercel/analytics';

inject();

// Dark mode
const getSystemDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const isDark = ref(savedTheme ? savedTheme === 'dark' : getSystemDarkMode());

const applyTheme = (dark: boolean) => {
  document.documentElement.classList.toggle('dark', dark);
  if (pipWindow) {
    pipWindow.document.documentElement.classList.toggle('dark', dark);
  }
};

const toggleDark = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  applyTheme(isDark.value);
};

applyTheme(isDark.value);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    isDark.value = e.matches;
    applyTheme(e.matches);
  }
});

const shuffle = function (array: string[]) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const urlParams = new URLSearchParams(window.location.search);
const urlNames = urlParams.get('names') || '';

const namesString = ref<string>(urlNames);
const names = computed(() => namesString.value.split(',').map(name => name.trim()).filter(s => s));
const sortedNames = ref<IPerson[]>([]);

const sortNames = () => {
  const namesArray = shuffle([...names.value]);
  const existingPeople = [...sortedNames.value];
  sortedNames.value = namesArray.map(name => {
    const existingIdx = existingPeople.findIndex(p => p.name === name);
    if (existingIdx !== -1) {
      const [existing] = existingPeople.splice(existingIdx, 1);
      return { ...existing, done: false };
    }
    return { id: Math.random().toString(36).slice(2), done: false, name };
  });
};

sortNames();

const next = () => {
  (sortedNames.value.find((p) => !p.done) || sortedNames.value[0]).done = true;
}

const removePerson = (index: number) => {
  sortedNames.value.splice(index, 1);
}
watch(names, () => {
  if (names.value.length > 0) {
    urlParams.set('names', names.value.join(', '));
    history.replaceState(null, 'Daily sorter', "?" + urlParams.toString());
  }
});
</script>

<style>
.list-move {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.list-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
  transition-delay: calc(var(--i, 0) * 60ms);
}

.list-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
  position: absolute;
  width: 100%;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-14px) scale(0.97);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

