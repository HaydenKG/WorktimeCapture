<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(['response'])
let selection = ref(0);

function changeSelection(trigger_selection){
    if(trigger_selection == "today"){
        selection.value = 0;
        emit('response', 0);
    } else if(trigger_selection == "week"){
        selection.value = 1;
        emit('response', 1);
    } else if(trigger_selection == "month"){
        selection.value = 2;
        emit('response', 2);
    } else if(trigger_selection == "info"){
        selection.value = 3;
        emit("response", 3);
    }
    console.log(selection);
}

</script>

<template>
    <div id="task-bar">
        <h3>Worktime capture</h3>
        <div id="selection">
            <p @click="changeSelection('today')" :class="{selected: selection == 0}">Today</p>
            <!-- <p @click="changeSelection('week')" :class="{selected: selection == 1}">Week</p> -->
            <p @click="changeSelection('month')" :class="{selected: selection == 2}">Month</p>
            <p @click="changeSelection('info')" :class="{selected: selection == 3}">Info</p>
        </div>
    </div>
</template>

<style scoped>

#task-bar {
    width: 90%;
    height: fit-content;
    text-align: initial;
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    justify-items: center;
    background-color: #fff;
}

#task-bar h3 {
    margin: 1rem;
}

#selection{
    display: flex;
    width: 50%;
    justify-content: space-around;
    align-items: center;
}

#selection p{
    cursor: pointer;
}

.selected {
    color: #42b983;
}

</style>