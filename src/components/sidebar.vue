<template>
  <div class="sidebar">
    <h1>Worktime capture</h1>
    <div class="navigation">
      <button :class="{ isActive: selected === 0 }" @click="setSelected(0)">
        Monthly
      </button>
      <button :class="{ isActive: selected === 1 }" @click="setSelected(1)">
        Weekly
      </button>
      <button :class="{ isActive: selected === 2 }" @click="setSelected(2)">
        Configuration
      </button>
    </div>
    <hr />
    <div class="stats">
      <p>Avg. break time:</p>
      {{ avgBreakTime > 0 ? avgBreakTime : 0 }}m
      <p>Worked so far:</p>
      <p
        :class="{ achieved: parseInt(totalTime.substring(0, 2)) > shouldHours }"
      >
        {{ totalTime }}h
      </p>
      <p>Should hours:</p>
      {{ shouldHours }}h
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";

const props = defineProps({
  avgBreakTime: String,
  totalTime: String,
  shouldHours: Number,
});
let selected = ref(0);

function setSelected(selection) {
  selected.value = selection;
}
</script>

<style>
.sidebar {
  width: 20%;
  background-color: #2c3740;
  color: #f2f2f2;
  display: flex;
  flex-direction: column;
}
.navigation {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sidebar hr {
  width: 70%;
  margin: 20px 0;
  align-self: center;
}

.achieved {
  color: #42b983;
}

button {
  border: none;
  background-color: transparent;
  color: #f2f2f2;
  font-size: 1.2em;
  margin: 10px 0;
  height: 100%;
  cursor: pointer;
}
button:not(.isActive):hover {
  transition: all 0.3s;
  background-color: #205f43;
}
button:active {
  transition: all 0.1s;
  background: #349368;
}
.isActive {
  transition: all 0.1s;
  color: #3dc889;
  cursor: default;
}
</style>