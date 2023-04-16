<script setup>
import { ref } from "vue";

let selection = ref(0);

//TODO: replace with router get location
function changeSelection(trigger_selection){
    if(trigger_selection == "today"){
        selection.value = 0;
    } else if(trigger_selection == "week"){
        selection.value = 1;
    } else if(trigger_selection == "month"){
        selection.value = 2;
    } else if(trigger_selection == "info"){
        selection.value = 3;
    }
    console.log(selection);
}

</script>

<template>
    <div id="task-bar">
        <h3>Worktime capture</h3>
        <div id="selection">
            <h4 @click="changeSelection('today')" ><router-link to="/" :class="{ selected: selection == 0 }">Today</router-link></h4>
            <!-- <h4 @click="changeSelection('today')" :class="{selected: selection == 0}">Today</h4> -->
            <!-- <h4 @click="changeSelection('week')" :class="{selected: selection == 1}">Week</h4> -->
            <!-- <h4 @click="changeSelection('month')" :class="{selected: selection == 2}">Month</h4> -->
            <h4 @click="changeSelection('info')" ><router-link to="/info" :class="{ selected: selection == 3 }">Info</router-link></h4>
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
    width: 60%;
    justify-content: space-around;
    align-items: center;
}

#selection h4{
    cursor: pointer;
}

.selected {
    color: #42b983;
    cursor: inherit !important;
}

</style>