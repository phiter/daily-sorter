<template>
  <label>
    <div>List of names, comma separated:</div>
    <textarea class="people" v-model="namesString" />
  </label>
  <div>
    <button class="sort" @click="sortNames">Sort</button>
  </div>
  <ul class="sorted">
    <li class="person" v-for="(name, index) of sortedNames" :key="name + index">
      <button class="personbtn" @click="setDone">{{name}}</button>
      <div v-if="index !== sortedNames.length - 1" class="arrow">⬇️</div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const urlParams = new URLSearchParams(window.location.search);
const urlNames = urlParams.get('names') || '';

const namesString = ref<string>(urlNames);
const names = computed(() => namesString.value.split(',').map(name => name.trim()).filter(s => s));
const sortedNames = ref<string[]>([]);

const sortNames = () => {
   sortedNames.value = [...names.value].sort(() => .5 - Math.random());
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
}
.person {
  margin: 5px auto;
}
.personbtn {
  width: 100%;
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
</style>