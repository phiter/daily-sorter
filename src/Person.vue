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
  <div class="group relative flex items-center h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900">
    <label
      class="flex items-center flex-1 px-4 py-3 cursor-pointer gap-3 select-none"
    >
      <!-- Hidden native checkbox -->
      <input type="checkbox" v-model="person.done" class="sr-only" />
      <!-- Custom checkbox -->
      <span
        class="flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
        :class="person.done
          ? 'bg-indigo-500 border-indigo-500'
          : 'border-gray-400 dark:border-gray-500 bg-transparent'"
      >
        <svg v-if="person.done" class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span
        class="font-medium text-sm text-gray-800 dark:text-gray-200 transition-all"
        :class="{ 'line-through text-gray-400 dark:text-gray-500': person.done }"
      >{{ person.name }}</span>
    </label>
    <button
      @click="$emit('removePerson')"
      class="invisible group-hover:visible group-focus-within:visible flex items-center justify-center w-8 h-8 mr-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition text-xs font-bold flex-shrink-0"
    >✕</button>
  </div>
</template>
