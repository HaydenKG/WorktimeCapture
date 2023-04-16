<script setup>
import { ref } from "vue";
import 'cirrus-ui'; 
import Package from "./Package.vue"

let count = ref(1);

const colors = ["#F27055", "#673DF2", "#F2DF24", "#440DF5", "#30F2A9"];

</script>

<template>
    <div class="u-center w-100p" v-for="n in count" :key="n">
     <Package :borderColor="colors[n]"/>
    </div>
   
    <button class="btn-transparent addButton" v-on:click="() => count++">+</button>
</template>

<style scoped>

.idInputContainer{
    display: grid;
    grid-template-columns: .5fr .4fr;
    align-items: center;
}

.idInput{
    height: 2rem;
}
</style>