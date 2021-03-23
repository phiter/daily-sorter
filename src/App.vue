<template>
  <label>
    <div>List of names, comma separated:</div>
    <textarea class="people" v-model="namesString" />
  </label>
  <div>
    <button class="sort" @click="sortNames">Sort</button>
  </div>
  <ul class="sorted">
    <li class="person" v-for="(person, index) of sortedNames" :key="person.name + index">
      <label :class="{personlabel: true, done: person.done }">
        <input type="checkbox" @click="person.done = !person.done" />
        {{person.name}}
      </label>
      <div v-if="index !== sortedNames.length - 1" class="arrow">⬇️</div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
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

interface Person {
  name: string;
  done: boolean;
}

const namesString = ref<string>(urlNames);
const names = computed(() => namesString.value.split(',').map(name => name.trim()).filter(s => s));
const sortedNames = ref<Person[]>([]);

const sortNames = () => {
   const namesArray = shuffle([...names.value]);
   const people: Person[] = [];
   namesArray.forEach((name) => {
     people.push({
       done: false,
       name
    });
  });
  sortedNames.value = people;
};

sortNames();

watch(names, () => {
  if (names.value.length > 0) {
    urlParams.set('names', names.value.join(', '));
    history.replaceState(null, 'Daily sorter', "?" + urlParams.toString());
  }
});
</script>

<style>
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
}
.sorted {
  list-style: none;
  display: flex;
  justify-content:  center;
  align-items: center;
  flex-direction: column;
  padding: 0;
  user-select: none;
}
.person {
  margin: 5px auto;
}
.arrow {
  margin-top: 5px;
}
.people {
  width: 40%;
  border: 1px solid #6ddbff;
  padding: 10px;
  border-radius: 5px;
}
@media (max-width: 1500px) {
  .people {
    width: 80%;
  }
}
.sort {
  background: #6ddbff;
  border: white;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
}
.personlabel{
  padding: 5px;
}
.done {
  text-decoration: line-through;
}
</style>