<template>
  <div class="top-controls">
    <button class="pip-button" v-if="isPipEnabled" @click="openPip" title="Picture in picture">
      ⧉
    </button>
    <button class="theme-toggle" @click="toggleDark" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
      {{ isDark ? '☀️' : '🌙' }}
    </button>
  </div>
  <label>
    <div>List of names, comma separated:</div>
    <textarea class="people" v-model="namesString" />
  </label>
  <div>
    <button class="sort" @click="sortNames">Sort</button>
    <button class="next" @click="next">Next</button>
  </div>
  <ul class="sorted">
    <template v-for="(person, index) of sortedNames" :key="person.name + index">
      <Person :person="person" @removePerson="removePerson(index)" />
      <div v-if="index !== sortedNames.length - 1" class="arrow" />
    </template>
  </ul>
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
   const people: IPerson[] = [];
   namesArray.forEach((name) => {
     people.push({
       done: false,
       name
    });
  });
  sortedNames.value = people;
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

<style lang="scss">
:root {
  --color-text: #2c3e50;
  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-border: #6ddbff;
  --color-accent: #6d9bff;
  --color-person-border: rgba(0, 0, 0, 0.2);
  --color-person-hover: rgba(109, 218, 255, 0.29);
  --color-input-bg: #ffffff;
}

html.dark {
  --color-text: #c9d1d9;
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-border: #4aa8cc;
  --color-accent: #5a85e0;
  --color-person-border: rgba(255, 255, 255, 0.15);
  --color-person-hover: rgba(109, 218, 255, 0.15);
  --color-input-bg: #1c2128;
}

body {
  background: var(--color-bg);
  transition: background 0.2s, color 0.2s;
}

* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text);
  margin-top: 60px;
  margin: 60px auto;
  padding-top: 50px;
  transition: color 0.2s;
}
.top-controls {
  position: fixed;
  top: 12px;
  right: 16px;
  display: flex;
  gap: 6px;
  z-index: 100;
}
.theme-toggle,
.pip-button {
  background: none;
  border: 1px solid var(--color-person-border);
  border-radius: 8px;
  font-size: 20px;
  padding: 4px 10px;
  cursor: pointer;
  color: var(--color-text);
  &:hover {
    background: var(--color-person-hover);
  }
}
#app.pip {
  margin: 8px auto 30px;
  .pip-button {
    display: none;
  }
}

@media (min-width: 1200px) {
  #app {
    width: 80%;
  }
}
.sorted {
  list-style: none;
  display: flex;
  justify-content:  stretch;
  align-items: stretch;
  flex-direction: column;
  padding: 0;
  user-select: none;
}
.arrow {
  border: 2px solid var(--color-accent);
  border-top-color: transparent;
  border-right-color: transparent;
  width: 12px;
  height: 12px;
  transform: rotate(-45deg);
  margin: 3px auto;
  margin-bottom: 10px;
  position: relative;
  right: 5px;
}
.people {
  width: 100%;
  max-width: 600px;
  resize: vertical;
  border: 1px solid var(--color-border);
  padding: 10px;
  border-radius: 5px;
  background: var(--color-input-bg);
  color: var(--color-text);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.sort {
  background: var(--color-border);
  border: white;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
}
.next {
  background: var(--color-accent);
  border: white;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
  margin-left: 20px;
}

button {
  cursor: pointer;
  font-weight: bold;
  &:hover {
    box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.75);
  }
  &:active {
    box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.75) inset;
  }
}
</style>
