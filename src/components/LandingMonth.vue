<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";
import {
  intlFormat,
  startOfWeek,
  addDays,
  subDays,
  addMonths,
  subMonths,
  getMonth,
  format,
  getDaysInMonth,
  startOfMonth,
  isSunday,
  isSaturday,
} from "date-fns";
import dayEntry from "./dayEntry.vue";
import sidebar from "./sidebar.vue";

const currentDate = new Date();
let focusedDate = ref();
focusedDate.value = new Date();
let firstDayOfMonth = ref();
firstDayOfMonth = startOfMonth(currentDate);
let monthEntries = reactive([]);
let idTrigger = 0;
let startDay = ref(0);
let endDay = ref(31);
let computationTrigger = ref(0);
let monthExtraInfo = reactive([0, 0]);
let shouldHours = ref(0);

// loadSettings();
loadMonth(currentDate);

function loadMonth(date) {
  if (localStorage.getItem(getMonthName(date) + date.getFullYear()) === null) {
    console.log("No data saved yet");
    fillMonthEntries(date);
    return;
  }
  monthEntries.splice(0, monthEntries.length);
  let tempObj = JSON.parse(
    localStorage.getItem(getMonthName(date) + date.getFullYear())
  );
  calculateShouldHours(tempObj.length);
  for (let i = 0; i < tempObj.length; i++) {
    monthEntries.push(tempObj[i]);
  }
}

function calculateShouldHours(days) {
  shouldHours.value = days * 8;
}

function fillMonthEntries(date) {
  monthEntries.splice(0, monthEntries.length);
  console.log(date);
  firstDayOfMonth.value = startOfMonth(date);
  let daysInMonth = getDaysInMonth(date);

  for (let i = 0; i < daysInMonth; i++) {
    let unformatedDate = addDays(firstDayOfMonth.value, i);
    if (isSaturday(unformatedDate) || isSunday(unformatedDate)) {
      continue;
    }

    let date =
      unformatedDate.toString().substring(0, 3) +
      " " +
      intlFormat(unformatedDate);

    monthEntries.push({
      id: idTrigger,
      date: date,
      savedStartTime: "",
      savedEndTime: "",
      savedBreakTime: "",
      savedTotalTime: "",
      savedDescription: "",
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
  console.log(focusedDate.value);
  loadMonth(focusedDate.value);
}

function getMonthName(date) {
  return format(date, "MMMM");
}

function updateMonth(day, index) {
  console.log("Index: " + index + " emit reached parent", day);
  monthEntries[index] = day;
  saveMonth();
}

function saveMonth() {
  localStorage.setItem(
    getMonthName(focusedDate.value) + focusedDate.value.getFullYear(),
    JSON.stringify(monthEntries)
  );
}

function getExtraInformation(date) {
  if (
    localStorage.getItem(getMonthName(date) + date.getFullYear() + "extra") ===
    null
  ) {
    console.log("No data saved yet");
    return;
  }
  let tempArr = localStorage.getItem(
    getMonthName(date) + date.getFullYear() + "extra"
  );
  monthExtraInfo.splice(0, 2);
  monthExtraInfo.push(tempArr[0]);
  monthExtraInfo.push(tempArr[1]);
}

function saveExtraInformation() {
  localStorage.setItem(
    getMonthName(focusedDate.value) + focusedDate.value.getFullYear() + "extra",
    JSON.stringify(monthExtraInfo)
  );
}

const entries = computed(() => {
  return monthEntries;
});

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

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: "1.6em",
    delay: el.dataset.index * 0.15,
    onComplete: done,
  });
}
</script>

<template>
  <div class="landing-container">
    <sidebar
      :avgBreakTime="avgBreakTime"
      :totalTime="totalTime"
      :shouldHours="shouldHours"
    />
    <div class="content">
      <div class="title">
        <button @click="getDifferentMonth(-1)">
          <i class="arrow left"></i>
        </button>
        <h1>{{ getMonthName(focusedDate) }}</h1>
        <button @click="getDifferentMonth(1)">
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
        <!-- Add animations ?  -->
        <div
          id="entries"
          v-for="(day, index) in entries.slice(startDay, 30 - (30 - endDay))"
          :key="day.id"
        >
          <hr
            v-if="index != 0"
            :class="{ newWeek: day.date.includes('Mon') }"
          />
          <day-entry
            :id="index"
            :date="day.date"
            :dayData="day"
            @saveDayData="(msg) => updateMonth(msg, index)"
          />
        </div>
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
.newWeek {
  height: 2px;
  background-color: #42b983;
}

.landing-container {
  display: flex;
  flex-direction: row;
}

.content {
  padding: 5%;
  text-align: center;
  width: 80%;
}

.title {
  display: inline-grid;
  grid-template-rows: 1fr;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  justify-items: center;
  align-items: center;
}

.tableHeader {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr;
  text-align: center;
}

.tableHeader p {
  font-weight: 600;
}

button {
  color: inherit;
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
