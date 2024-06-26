<template>
  <button class="pip-button" v-if="isPipEnabled" @click="openPip">
    ⧉
  </button>
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
  <Joke />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Person from './Person.vue';
import Joke from './Joke.vue';
import { Person as IPerson } from './types';
import { openPip, isPipEnabled } from './pip';
import { inject } from '@vercel/analytics';

inject();
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
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin: 60px auto;
}
.pip-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
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
  border: 2px solid #6d9bff;
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
  border: 1px solid #6ddbff;
  padding: 10px;
  border-radius: 5px;
}
.sort {
  background: #6ddbff;
  border: white;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
}
.next {
  background: #6d9bff;
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
