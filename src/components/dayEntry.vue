<template>
  <span id="row">
    <p id="date">{{ d }}</p>

    <input type="time" id="starttimeinput" v-model="startTime" />
    <input type="time" id="endtimeinput" v-model="endTime" />
    <input
      id="breaktime"
      type="text"
      minlength="4"
      maxlength="5"
      placeholder="0:30"
      v-model="breakTime"
      @change="startCalculation()"
      @blur="startCalculation()"
    />
    <p id="total">{{ total }}h</p>
    <input
      id="descriptioninput"
      type="text"
      placeholder="Development of.."
      v-model="description"
      @change="saveEntries()"
    />
  </span>
</template>

<script setup>
import { defineProps, ref, defineEmits } from "vue";
import { getDay, parseISO } from "date-fns";

const props = defineProps({
  id: Number,
  date: String,
  dayData: Object,
});
let d = props.date;

let dataToSave = JSON.parse(JSON.stringify(props.dayData));
dataToSave.date = d;

const emit = defineEmits(["saveDayData"]);

var startTime = ref("");
var endTime = ref("");
var breakTime = ref("");
var total = ref("");
var description = ref("");

let remainingMinutes = 0;

loadData();

function loadData() {
  if (dataToSave.savedStartTime != 0)
    startTime.value = "" + dataToSave.savedStartTime;
  if (dataToSave.savedEndTime != 0)
    endTime.value = "" + dataToSave.savedEndTime;
  if (dataToSave.savedBreakTime != 0)
    breakTime.value = dataToSave.savedBreakTime;
  if (dataToSave.savedTotalTime != 0) total.value = dataToSave.savedTotalTime;
  if (dataToSave.savedDescription != "")
    description = dataToSave.savedDescription;
}

function calculateTimeDifference(start, end, breakT) {
  start = start.split(":");
  end = end.split(":");
  if (breakT != "") breakT = breakT.split(":");

  var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  var endDate = new Date(0, 0, 0, end[0], end[1], 0);
  var diff = endDate.getTime() - startDate.getTime();
  var hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  var minutes = Math.floor(diff / 1000 / 60);

  if (parseInt(breakT[0]) > 0) {
    hours -= parseInt(breakT[0]);
  }
  if (parseInt(breakT[1]) > 0) {
    if (minutes < parseInt(breakT[1])) hours--;
    if (minutes > parseInt(breakT[1])) minutes -= parseInt(breakT[1]);
    else {
      remainingMinutes = Math.abs(minutes - parseInt(breakT[1]));
      if (remainingMinutes == 0) minutes = 0;
      else minutes = 60 - remainingMinutes;
    }
  }
  // If using time pickers with 24 hours format, add the below line get exact hours
  if (hours < 0) hours += 24;

  return hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}

function startCalculation() {
  if (startTime == endTime) {
    alert("Same start and end time entered");
    resetFalseElements(2);
    return;
  } else if (endTime == "") return;

  total.value = calculateTimeDifference(
    startTime.value,
    endTime.value,
    breakTime.value
  );
  saveEntries();
}

// let dataToSave = 0;
function saveEntries() {
  if (dataToSave == true && $("descriptioninput").value == "") return;

  dataToSave = {
    id: props.id,
    date: d,
    savedStartTime: startTime.value,
    savedEndTime: endTime.value,
    savedBreakTime: breakTime.value,
    savedTotalTime: total.value,
    savedDescription: description.value,
  };
  let jsonstring = JSON.stringify(dataToSave);
  console.log("Entries were saved as: \n" + jsonstring);
  emit("saveDayData", dataToSave);
}

function resetFalseElements(which) {
  if (which == 1) {
    $("starttimeinput").value = 0;
    $("endtimeinput").value = 0;
  }
  if (which == 2) {
    document.getElementById("endtimeinput").value = 0;
    document.getElementById("breaktime").value = 0;
    $("total").innerText = "--";
  }
}

function $(id) {
  return document.getElementById(id);
}
</script>

<style>
#row {
  /* animation: enter 0.82s linear; */
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr;
  column-gap: 15px;
  align-items: center;
}
#row input {
  width: 100%;
  border-width: 0 0 2px;
  height: fit-content;
  font-family: inherit;
}
#row input:active {
  border-color: #297350;
  border-width: 0 0 2px;
}

@keyframes enter {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>