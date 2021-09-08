<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import random from 'lodash.random';

interface IJoke {
    setup: string;
    punchline: string;
}

const joke = ref<IJoke | null>(null);
const jokes = ref<IJoke[]>([]);
const reveal = ref(false);

onMounted(async () => {
    const response = await fetch('https://raw.githubusercontent.com/15Dkatz/official_joke_api/master/jokes/index.json').then(r => r.json()) as IJoke[];
    jokes.value = response;
})
const getJoke = async () => {
    reveal.value = false;
    joke.value = null;
    
    joke.value = jokes.value[random(0, jokes.value.length - 1)];
}
</script>
<template>
    <div class="joke">
        <button @click="getJoke">
            Joke time!
        </button>
        <div style="margin-top: 30px; font-weight: bold;" v-if="joke">
            Q: {{ joke.setup }}

            <div style="margin-top: 30px;">
                <div v-if="!reveal">
                    <button @click="reveal = true">Reveal</button>
                </div>
                <div v-if="reveal">
                    A: {{ joke.punchline }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.joke {
    margin-top: 100px;
}
</style>