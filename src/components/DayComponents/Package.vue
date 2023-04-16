<script setup>
import { ref, defineProps } from "vue";
import 'cirrus-ui';
import PackageEntry from "./PackageEntry.vue"

const props = defineProps(['borderColor'])

//create an array of objects so you can delete single entries
let count = ref(1);

</script>

<template>
    <div class="card w-90p m-1" :style="{ borderLeft: '2px solid ' + props.borderColor }">
        <div class="idInputContainer">
            <h6>Project name:</h6>
            <input type="text" class="idInput" />
        </div>
        <table class="table m-0">
            <thead>
                <tr>
                    <th>Identification</th>
                    <th>Start</th>
                    <th>Stop</th>
                    <th>Duration</th>
                    <th>Notes</th>
                </tr>
            </thead>
        </table>
        <div v-for="n in count" :key="n">
            <PackageEntry />
        </div>
        <button class="btn-transparent addButton" v-on:click="() => count++">+</button>
        <p>Duration sum: --</p>
    </div>
</template>

<style scoped>
h6 {
    margin: 0%;
}

.idInputContainer {
    margin: 1rem 0;
    display: grid;
    grid-template-columns: .25fr .4fr;
    align-items: center;
    justify-items: start;
    padding-left: 3rem;
}

.idInput {
    height: 2rem;
}

tr {
    display: grid;
    grid-template-columns: .5fr 1fr 1fr .3fr 1fr;
    align-items: start;
}
</style>