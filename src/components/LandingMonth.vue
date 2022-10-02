<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";
import {
  addDays,
  addMonths,
  subMonths,
  format,
  getDaysInMonth,
  startOfMonth,
  isSunday,
  isSaturday,
} from "date-fns";
/* eslint-disable no-unused-vars */
import dayEntry from "./dayEntry.vue";
import monthResult from "./monthResult.vue";
import {helper} from "./helper.js"

const currentDate = new Date();
let focusedDate = ref();
focusedDate.value = new Date();
let firstDayOfMonth = ref();
firstDayOfMonth = startOfMonth(currentDate);
let monthEntries = reactive([]);
let idTrigger = 0;
let computationTrigger = ref(0);
let monthExtraInfo = reactive([0, 0]);
let shouldHours = ref(0);

// loadSettings();
loadMonth(currentDate);

function loadMonth(date) {
  if (localStorage.getItem(helper.getMonth(date) + date.getFullYear()) === null) {
    console.log("No data saved yet");
    fillMonthEntries(date);
    saveMonth();
    return;
  }
  monthEntries.splice(0, monthEntries.length);
  let tempObj = JSON.parse(
    localStorage.getItem(helper.getMonth(date) + date.getFullYear())
  );
  calculateShouldHours(tempObj.length);
  for (let i = 0; i < tempObj.length; i++) {
    tempObj[i].id = ++idTrigger;
    monthEntries.push(tempObj[i]);
  }
}

helper.refreshMonth = (date) => loadMonth(date);

function calculateShouldHours(days) {
  shouldHours.value = days * 8;
}

function fillMonthEntries(date) {
  monthEntries.splice(0, monthEntries.length);
  firstDayOfMonth.value = startOfMonth(date);
  let daysInMonth = getDaysInMonth(date);

  for (let i = 0; i < daysInMonth; i++) {
    let unformatedDate = addDays(firstDayOfMonth.value, i);
    if (isSaturday(unformatedDate) || isSunday(unformatedDate)) {
      // continue;
    }
    let date =
      unformatedDate.toString().substring(0, 3) +
      " " +
      format(new Date(unformatedDate), 'dd/MM/yy');

    monthEntries.push({
      id: idTrigger,
      date: date,
      savedStartTime: "",
      savedEndTime: "",
      savedBreakTime: "",
      savedTotalTime: "",
      savedDescription: "",
      unformatedDate: unformatedDate
    });
    idTrigger++;
  }
  calculateShouldHours(monthEntries.length);
}

function getDifferentMonth(direction) {
  if (direction < 0) {
    focusedDate.value = subMonths(focusedDate.value, 1);
  } else {
    focusedDate.value = addMonths(focusedDate.value, 1);
  }
  loadMonth(focusedDate.value);
}

function updateMonth(day, index) {
  console.log("Index: " + index + " emit reached parent", day);
  monthEntries[index] = day;
  saveMonth();
}

function saveMonth() {
  localStorage.setItem(
    helper.getMonth(focusedDate.value) + focusedDate.value.getFullYear(),
    JSON.stringify(monthEntries)
  );
}

function downloadMonth() {
  let textObj = JSON.parse(localStorage.getItem(helper.getMonth(focusedDate.value) + focusedDate.value.getFullYear()));
  let text = "";
  for(let i = 0; i < textObj.length; i++){
    text += `\n ${textObj[i].date} : ${textObj[i].savedStartTime} - ${textObj[i].savedEndTime} \t break duration: ${textObj[i].savedBreakTime} \t description ${textObj[i].savedDescription}`
  }
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text ? text : "No data entered"));
  element.setAttribute('download', helper.getMonth(focusedDate.value) + focusedDate.value.getFullYear()+".txt");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const totalTime = computed(() => {
  let hours = 0;
  let minutes = 0;
  for (let i = 0; i < monthEntries.length; i++) {
    if (monthEntries[i].savedTotalTime) {
      minutes += parseInt(monthEntries[i].savedTotalTime.split(":")[1]);
      if (minutes > 60) {
        hours++;
        minutes = minutes - 60;
      }
      hours += parseInt(monthEntries[i].savedTotalTime.split(":")[0]);
    }
  }
  monthExtraInfo[0] = hours + ":" + minutes;
  computationTrigger.value;
  return hours + ":" + minutes;
});

const avgBreakTime = computed(() => {
  let counter = 0;
  let sum = 0;
  for (let i = 0; i < monthEntries.length; i++) {
    if (monthEntries[i].savedBreakTime) {
      counter++;
      sum += parseInt(monthEntries[i].savedBreakTime.split(":")[1]);
      if (parseInt(monthEntries[i].savedBreakTime.split(":")[0]) > 0) {
        sum += parseInt(monthEntries[i].savedBreakTime.split(":")[0]) * 60;
      }
    }
  }
  monthExtraInfo[1] = (sum / counter).toFixed(1);
  computationTrigger.value;
  return (sum / counter).toFixed(1);
});
</script>

<template>
  <div class="landing-container">
    <div class="content">
      <div class="title">
        <button class="changeMonthBtn" @click="getDifferentMonth(-1)">
          <i class="arrow left"></i>
        </button>
        <h1 id="monthTitle">{{ helper.getMonth(focusedDate) }}</h1>
        <button class="changeMonthBtn" @click="getDifferentMonth(1)">
          <i class="arrow right"></i>
        </button>
      </div>
      <div class="weekdays">
        <div class="tableHeader">
          <p>Date</p>
          <p>Starttime</p>
          <p>Endtime</p>
          <p>Breaktime</p>
          <p>Worked</p>
          <p>Description</p>
        </div>
        <div
          id="entries"
          v-for="(day, index) in monthEntries"
          :key="day.id"
        >
          <hr v-if="index != 0" />
          <day-entry
            :id="index"
            :date="day.date"
            :dayData="day"
            @saveDayData="(msg) => updateMonth(msg, index)"
          />
        </div>
        <monthResult :shouldHours="shouldHours" :breakAvg="avgBreakTime" :total="totalTime" />
        <button id="exportBtn" @click="downloadMonth()">Export</button>
      </div>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.changeMonthBtn {
  border: none;
  background-color: transparent;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 5px;
}

.changeMonthBtn:hover {
  transition: all 0.3s;
  color: #42b983;
}

.landing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  text-align: center;
  width: 80%;
  margin-bottom: 5%;
}

.title {
  display: inline-grid;
  grid-template-rows: 1fr;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  justify-items: center;
  align-items: center;
}

#monthTitle {
  min-width: 200px;
}

.tableHeader {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr;
  text-align: center;
  column-gap: 15px;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}
</style>
