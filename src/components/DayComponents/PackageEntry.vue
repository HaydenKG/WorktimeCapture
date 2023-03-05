<script setup>
import { ref } from "vue";
import 'cirrus-ui'; 

let startDate = "";
let endDate = "";

const startTimeInput = ref();
const endTimeInput = ref();
const duration = ref("-- : --")

function getHHMM(date){
    const minutesFormated = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    const hoursFormated = (date.getHours() < 10 ? '0' : '') + date.getHours()

    return {
        hours: hoursFormated,
        minutes: minutesFormated,
    }
}

function setStartTime() {
    startDate = new Date();
    const formated = getHHMM(startDate);
    startTimeInput.value = `${formated.hours}:${formated.minutes}`;
}

function setEndTime(){
    endDate = new Date();
    const formated = getHHMM(endDate);
    endTimeInput.value = `${formated.hours}:${formated.minutes}`;
    calculateDuration(false);
}

function calculateDuration(onChange){
    if(endTimeInput.value == null) return;
    if(onChange){
        const startTimeDateFormat = startTimeInput.value.split(":");
        const endTimeDateFormat = endTimeInput.value.split(":");
        
        //you could also create two new dates and set the hours according to the above. Because 0,0,0 lets you end up in 1900 or so
        startDate = new Date(0, 0, 0, startTimeDateFormat[0], startTimeDateFormat[1], 0);
        endDate = new Date(0, 0, 0, endTimeDateFormat[0], endTimeDateFormat[1], 0);
    }

    const durationTime = endDate - startDate;
    //getTimeZoneOffset() gets you the timezone offset in minutes therefor / 60
    const diffAsDate = new Date(durationTime);
    const minutesFormated = (diffAsDate.getMinutes() < 10 ? '0' : '') + diffAsDate.getMinutes()
    const hoursFormated = (diffAsDate.getHours() < 10 ? '0' : '') + diffAsDate.getHours() - Math.abs(diffAsDate.getTimezoneOffset() / 60)
    duration.value = `${hoursFormated} : ${minutesFormated}`
}

</script>

<template>
    <table class="table m-0">
        <thead>
            <tr>
                <th><button v-on:click="setStartTime" :disabled="startTimeInput != null">Start</button></th>
                <th><button v-on:click="setEndTime" :disabled="endTimeInput != null">Stop</button></th>
                <th>Duration</th>
                <th>Notes</th>
            </tr>
        </thead>
        <hr>
        <tbody>
            <tr>
                <th><input type="time" v-model="startTimeInput" v-on:blur="calculateDuration(true)"/></th>
                <th><input type="time" v-model="endTimeInput" v-on:blur="calculateDuration(true)"/></th>
                <th>{{duration}}</th>
                <th><textarea class="note-textarea" v-model="message" placeholder="Type your notes here"></textarea></th>
            </tr>
        </tbody>
    </table>
</template>

<style>
tr{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
}

th {
    justify-self: center;
    padding: 0 !important;
    font-size: 1.2rem;
    border: none !important;
}

hr {
    margin: 4px 0;
}

.note-textarea{
    min-height: 4rem;
}

</style>