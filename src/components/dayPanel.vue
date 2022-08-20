<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";
import {  intlFormat,  format  } from "date-fns";

let startedSession = ref(false);
let onBreak = ref(false);
let breakInformation = ref("");

let startTime = ref(0);

let day = {
    date: new Date(), 
    worktime: {start: 0, end: 0, duration: 0},
    break: {start: 0, end: 0, duration: 0}
}

let itemInStorage = JSON.parse(localStorage.getItem("today"));

if(itemInStorage !== null){
    // debugger ; 
    if(new Date(itemInStorage.date).toDateString() == new Date().toDateString()) {
        day = itemInStorage;
        translateDates();

        if(day.worktime.start != 0){
            startTime.value = new Date(day.worktime.start);
        } if(day.worktime.end == 0 && day.worktime.start != 0)
            startedSession.value = true;
        if(day.break.start != 0 && day.break.end == 0)
            onBreak.value = true;
    }
}

function translateDates(){
    if(day.worktime != 0)
        day.worktime.start = new Date(day.worktime.start);
    if(day.worktime.end)    
        day.worktime.end = new Date(day.worktime.end);
    if(day.break.start)    
        day.break.start = new Date(day.break.start);
    if(day.break.end)    
        day.break.end = new Date(day.break.end);
}

function startSession(){
    startedSession.value = !startedSession.value;
    if(startedSession.value){
        startTime.value = new Date();
        console.log("Session started");
        day.worktime.start = new Date();
    }
    else{
        console.log("ended");
        day.worktime.end = new Date();
        day.worktime.duration = calculateDuration(day.worktime.start, day.worktime.end);
    }
    localStorage.setItem("today", JSON.stringify(day));
}

function pauseSession(){
    if(!onBreak.value){
        console.log("Pause started");
        day.break.start = new Date();
        breakInformation.value = "Break started at: " + day.break.start;
    } else {
        console.log("Pause stopped");
        day.break.end = new Date();
        let breakDuration = calculateDuration(day.break.start, day.break.end); 
        if(day.break.duration == 0){
            day.break.duration = breakDuration;
        } else {
            day.break.duration += breakDuration;
        }
        breakInformation.value = "Break duration was: " + (calculateDuration(day.break.start, day.break.end));
    }
    onBreak.value = !onBreak.value;
    localStorage.setItem("today", JSON.stringify(day));
}

function calculateDuration(start, end){
    // debugger;
    let hours = end.getHours() - start.getHours();
    let minutes = end.getMinutes() - start.getMinutes();
    
    if(hours < 10)
        hours = "0" + hours;
    if(minutes < 10)
        minutes = "0" + minutes;
    return hours + ":" + minutes;
}

function getShortTimeformat(dateInformation){
    let formatedDate = new Date(dateInformation);
    let hours = formatedDate.getHours();
    if(hours < 10)
        hours = "0" + hours;
    let minutes = formatedDate.getMinutes();
    if(minutes < 10)
        minutes = "0" + minutes;
    return hours + ":" + minutes;
}
</script>

<template>
    <div id="day_button_container">
        <p></p>
        <p>Start <span class="timeDivider">/</span> Stop</p>
        <p>Duration</p>
        <button @click="startSession" :disabled="onBreak">{{startedSession? "Stop" : "Start"}}</button>
        <p>{{day.worktime.start != 0? getShortTimeformat(day.worktime.start) : "-  :  -  "}} <span class="timeDivider">/</span> {{day.worktime.end != 0? getShortTimeformat(day.worktime.end) : "  -  :  -"}} </p>
        <p>{{day.worktime.duration != 0? day.worktime.duration : ""}}</p>
        <button @click="pauseSession()" :disabled="!startedSession">{{onBreak? "Stop break": "Start break"}}</button>
        <p>{{day.break.start != 0? getShortTimeformat(day.break.start) : "-  :  -  "}} <span class="timeDivider">/</span> {{day.break.end != 0? getShortTimeformat(day.break.end) : "  -  :  -"}} </p>
        <p>{{day.break.duration != 0? day.break.duration : ""}}</p>
    </div>
</template>

<style scoped>
    .timeDivider{
        color: #42b983;
    }

    #day_button_container {
        width: 50%;
        display: grid;
        align-items: center;
        grid-template-columns: 1fr 2fr 1fr;
        justify-items: center;
    }
</style>