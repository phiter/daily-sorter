<script lang="ts" setup>
import { PropType } from '@vue/runtime-core';
import { Person } from './types'

defineProps({
  person: {
    required: true,
    type: Object as PropType<Person>
  }
});
</script>

<template>
  <li class="person">
    <label class="personlabel" :class="{ done: person.done }">
      <input type="checkbox" v-model="person.done" />
      <div class="personname">
        {{person.name}}
      </div>
    </label>
    <button class="remove" @click="$emit('removePerson')">
      &#x2715;
    </button>
  </li>
</template>
<style lang="scss" scoped>
.person {
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin: 5px auto;
  display: flex;
  max-width: 300px;
  width: 100%;
  &:hover {
    background: #6ddaff4b;
    .remove {
      visibility: visible;
    }
  }
}
.personlabel {
  padding: 5px 10px;
  width: 100%;
  display: inline-flex;
  cursor: pointer;

  &.done .personname {
    text-decoration: line-through;
  }
}
.personname {
  margin: auto;
}
.remove {
  visibility: hidden;
  color: red;
  background: rgb(255, 206, 206);
  border: none;
  padding: 5px 10px;
}
</style>