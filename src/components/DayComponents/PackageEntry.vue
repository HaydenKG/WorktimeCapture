<script setup>
import { ref } from "vue";
import 'cirrus-ui';

let startDate = "";
let endDate = "";

const startTimeInput = ref();
const endTimeInput = ref();
const duration = ref("-- : --")

function getHHMM(date) {
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

function setEndTime() {
    endDate = new Date();
    const formated = getHHMM(endDate);
    endTimeInput.value = `${formated.hours}:${formated.minutes}`;
    calculateDuration(false);
}

function calculateDuration(onChange) {
    if (endTimeInput.value == null) return;
    if (onChange) {
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
        <hr>
        <tbody>
            <tr>
                <th><input type="text" placeholder="33200"></th>
                <th class="buttonTimeInputContainer">
                    <button class="iconButton" v-on:click="setStartTime" :disabled="startTimeInput != null">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path d="M16.3944 11.9998L10 7.73686V16.2628L16.3944 11.9998ZM19.376 12.4158L8.77735 19.4816C8.54759 19.6348 8.23715 19.5727 8.08397 19.3429C8.02922 19.2608 8 19.1643 8 19.0656V4.93408C8 4.65794 8.22386 4.43408 8.5 4.43408C8.59871 4.43408 8.69522 4.4633 8.77735 4.51806L19.376 11.5838C19.6057 11.737 19.6678 12.0474 19.5146 12.2772C19.478 12.3321 19.4309 12.3792 19.376 12.4158Z" fill="#42b983"></path></svg>
                    </button>
                    <input type="time"
                        v-model="startTimeInput" v-on:blur="calculateDuration(true)" />
                </th>
                <th class="buttonTimeInputContainer">
                    <button class="iconButton" v-on:click="setEndTime" :disabled="endTimeInput != null">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path d="M7 7V17H17V7H7ZM6 5H18C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18V6C5 5.44772 5.44772 5 6 5Z" fill="#42b983"></path></svg>    
                    </button>
                    <input type="time" v-model="endTimeInput" v-on:blur="calculateDuration(true)" /></th>
                <th>{{ duration }}</th>
                <th><textarea class="note-textarea" v-model="message" placeholder="Type your notes here"></textarea></th>
            </tr>
        </tbody>
    </table>
</template>

<style>
tr {
    display: grid;
    grid-template-columns: .5fr 1fr 1fr .3fr 1fr;
    align-items: center;
}

th {
    justify-self: center;
    padding: 0 4px !important;
    font-size: 1.2rem;
    border: none !important;
}

hr {
    margin: 4px 0;
}

.note-textarea {
    min-height: 4rem;
}

.buttonTimeInputContainer{
    display: flex;
}

.iconButton{
    outline: none;
    border: none;
    filter: brightness(0);
    transition: all .2s;
}

.iconButton:hover:not(:disabled){
    filter: brightness(.9);
}

.iconButton:active:not(:disabled){
    filter: brightness(1);
}
</style>