<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { intlFormat, startOfWeek, addDays, subDays } from "date-fns";
/* eslint-disable no-unused-vars */
import dayEntry from "./dayEntry.vue";
import result from "./result.vue";

const currentDate = new Date();
const currentWeekNumber = getWeekNumber();

// intlFormat(
//   startOfWeek(new Date(), {
//     weekStartsOn: 1,
//   }),
//   {
//     locale: "en-GB",
//   }
// );

let dateOfMonday = startOfWeek(new Date(), {
  weekStartsOn: 1,
});

let monOfSelectedWeek = ref("");
let computationTrigger = ref("0");
let selectedWeekNr = ref(0);
let week = reactive([]);
let idTrigger = 0;
loadWeek(currentWeekNumber);

function getWeekNumber() {
  var firstJan = new Date(currentDate.getFullYear(), 0.1);
  var numberOfDays = Math.floor(
    (currentDate - firstJan) / (24 * 60 * 60 * 1000)
  );
  return Math.floor((currentDate.getDay() + 1 + numberOfDays) / 7);
}

function loadWeek(weekNumber) {
  if (localStorage.getItem("week" + weekNumber) === null) {
    console.log("No week saved yet");
    fillWeek();
    console.log(week);
  } else {
    week = JSON.parse(localStorage.getItem("week" + weekNumber));
  }
}

function fillWeek() {
  week = [];
  for (let i = 0; i < 5; i++) {
    week[i] = {
      savedId: idTrigger,
      date: addDays(dateOfMonday, i),
      savedStartTime: "",
      savedEndTime: "",
      savedBreakTime: "",
      savedTotalTime: "",
      savedDescription: "",
    };
    idTrigger++;
  }
}

function getDifferentWeek(direction) {
  // this.week = [];
  if (direction < 0) {
    selectedWeekNr.value--;
    dateOfMonday = subDays(dateOfMonday, 7);
  } else {
    selectedWeekNr.value++;
  }
  loadWeek(currentWeekNumber + selectedWeekNr);
}

function updateWeek(day, index) {
  computationTrigger.value++;
  console.log("Index: " + index + " emit reached parent", day);
  week[index - 1] = day;
  saveWeek();
}

function saveWeek() {
  localStorage.setItem("week" + currentWeekNumber, JSON.stringify(week));
}

const weekTotalTime = computed(() => {
  let hours = 0;
  let minutes = 0;
  for (let i = 0; i < 5; i++) {
    if (week[i].savedTotalTime) {
      minutes += parseInt(week[i].savedTotalTime.split(":")[1]);
      if (minutes > 60) {
        hours++;
        minutes = minutes - 60;
      }
      hours += parseInt(week[i].savedTotalTime.split(":")[0]);
    }
  }
  week[5] = hours + ":" + minutes;
  computationTrigger.value;
  return hours + ":" + minutes;
});

const avgBreakTime = computed(() => {
  let counter = 0;
  let sum = 0;
  for (let i = 0; i < 5; i++) {
    if (week[i].savedBreakTime) {
      counter++;
      sum += parseInt(week[i].savedBreakTime.split(":")[1]);
      if (parseInt(week[i].savedBreakTime.split(":")[0]) > 0) {
        sum += parseInt(week[i].savedBreakTime.split(":")[0]) * 60;
      }
    }
  }
  week[6] = (sum / counter).toFixed(1);
  computationTrigger.value;
  return (sum / counter).toFixed(1);
});
</script>

<template>
  <div class="landing-container">
    <div class="sidebar">
      <h1>Worktime capture</h1>
    </div>
    <div class="content">
      <div class="title">
        <button @click="getDifferentWeek(-1)">
          <i class="arrow left"></i>
        </button>
        <h1>Week {{ currentWeekNumber + selectedWeekNr }}</h1>
        <button @click="getDifferentWeek(1)">
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
          id="entries2"
          v-for="(day, index) in week.slice(0, -2)"
          :key="day.savedId"
        >
          <hr v-if="index != 0" />
          <day-entry
            :id="index"
            :date="week[index].date"
            :dayData="week[index]"
            @saveDayData="(msg) => updateWeek(msg, index)"
          />
        </div>
        <!-- <div id="entries" v-for="n in 5" :key="n">
          <hr v-if="n - 1 != 0" />
          <day-entry
            :id="n"
            :date="
              new Date(dateOfMonday.valueOf() + 1000 * 3600 * 24 * (n - 1))
            "
            :dayData="week[n - 1]"
            @saveDayData="(msg) => updateWeek(msg, n)"
          />
        </div> -->
        <result :breakAvg="avgBreakTime" :total="weekTotalTime" />
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
button {
  border: none;
  background-color: transparent;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
button:hover {
  transition: all 0.3s;
  background-color: #42b983;
}
button:active {
  transition: all 0.1s;
  background: #349368;
}

.landing-container {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 20%;
  background-color: #2c3740;
  color: #f2f2f2;
}
.content {
  text-align: center;
  padding: 5%;
  width: 80%;
}

.title {
  display: inline-grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
}

.tableHeader {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr;
  text-align: center;
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
