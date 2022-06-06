<script>
import Vue from "vue";
import { ref, computed, getCurrentInstance } from "vue";
/* eslint-disable no-unused-vars */
import dayEntry from "./dayEntry.vue";
import result from "./result.vue";

export default {
  data() {
    return {
      currentDate: new Date(),
      currentWeekNumber: 0,
      dateOfMonday: 0,
      computationTrigger: "0",
      selectedWeekNr: 0,
      week: [],
    };
  },
  computed: {},
  methods: {
    getWeekNumber() {
      var firstJan = new Date(this.currentDate.getFullYear(), 0.1);
      var numberOfDays = Math.floor(
        (this.currentDate - firstJan) / (24 * 60 * 60 * 1000)
      );
      return Math.floor((this.currentDate.getDay() + 1 + numberOfDays) / 7);
    },
    getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },
    loadWeek(weekNumber) {
      if (localStorage.getItem("week" + weekNumber) === null) {
        console.log("No week saved yet");
        this.fillWeek();
        console.log(this.week);
      } else {
        this.week = JSON.parse(localStorage.getItem("week" + weekNumber));
      }
      this.$forceUpdate();
    },
    fillWeek() {
      this.week = [];
      for (let i = 0; i < 5; i++) {
        this.week[i] = {
          savedId: i,
          date: "",
          savedStartTime: "",
          savedEndTime: "",
          savedBreakTime: "",
          savedTotalTime: "",
          savedDescription: "",
        };
      }
    },
    getDifferentWeek(direction) {
      if (direction < 0) {
        this.selectedWeekNr--;
      } else {
        this.selectedWeekNr++;
      }
      this.week = this.loadWeek(this.currentWeekNumber + this.selectedWeekNr);
      console.log("week:" + JSON.stringify(this.week));
    },
    updateWeek(day, index) {
      this.computationTrigger.value++;
      console.log("Index: " + index + " emit reached parent", day);
      this.week[index - 1] = day;
      saveWeek();
    },
    saveWeek() {
      localStorage.setItem(
        "week" + this.currentWeekNumber,
        JSON.stringify(this.week)
      );
    },
    weekTotalTime() {
      let hours = 0;
      let minutes = 0;
      for (let i = 0; i < 5; i++) {
        if (this.weekk[i].savedTotalTime) {
          minutes += parseInt(this.week[i].savedTotalTime.split(":")[1]);
          if (minutes > 60) {
            hours++;
            minutes = minutes - 60;
          }
          hours += parseInt(this.week[i].savedTotalTime.split(":")[0]);
        }
      }
      this.week[5] = hours + ":" + minutes;
      computationTrigger.value;
      return hours + ":" + minutes;
    },
    avgBreakTime() {
      let counter = 0;
      let sum = 0;
      for (let i = 0; i < 5; i++) {
        console.log(this.week);
        if (this.week[i].savedBreakTime) {
          counter++;
          sum += parseInt(this.week[i].savedBreakTime.split(":")[1]);
          if (parseInt(this.week[i].savedBreakTime.split(":")[0]) > 0) {
            sum += parseInt(this.week[i].savedBreakTime.split(":")[0]) * 60;
          }
        }
      }
      this.week[6] = (sum / counter).toFixed(1);
      computationTrigger.value;
      return (sum / counter).toFixed(1);
    },
  },
  mounted() {
    this.currentWeekNumber = this.getWeekNumber();
    this.loadWeek(this.currentWeekNumber);
    this.dateOfMonday = this.getMonday(new Date());
  },
};
</script>

<template>
  <div class="landing-container">
    <div class="sidebar">
      <h1>Worktime capture</h1>
    </div>
    <div class="content">
      <p>Week: {{ week }}</p>
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
        {{ week }}
        <div id="entries" v-for="n in 5" :key="n">
          <hr v-if="n - 1 != 0" />
          <day-entry
            :id="n"
            :date="
              new Date(dateOfMonday.valueOf() + 1000 * 3600 * 24 * (n - 1))
            "
            :dayData="week[n - 1]"
            @saveDayData="(msg) => updateWeek(msg, n)"
          />
        </div>
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
