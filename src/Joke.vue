<script lang="ts" setup>
import { ref } from 'vue';

interface IJoke {
    setup: string;
    punchline: string;
}

const joke = ref<IJoke | null>(null);
const reveal = ref(false);

const getJoke = async () => {
    reveal.value = false;
    joke.value = null;
    const response = await fetch('https://official-joke-api.appspot.com/jokes/random').then(r => r.json()) as IJoke;
    joke.value = response;
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