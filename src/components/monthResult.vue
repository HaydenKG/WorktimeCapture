
<template>
  <div id="sumRow">
      <p></p>
      <p class="p-sum">Avg. break: {{ breakAvg }} min</p>
    <span>
      <p class="p-sum">Should: {{shouldHours}} h</p>
      <p class="p-sum">Total: {{ total }}</p>
      <p class="p-sum">Remaining: {{ remainingTime }}</p>
    </span>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  total: String,
  breakAvg: String,
  shouldHours: Number
});

const remainingTime = computed(() => {
  let hours = props.shouldHours - parseInt(props.total.split(":")[0]);
  let minutes = parseInt(props.total.split(":")[1]);
  if (minutes != 0){
    hours--;
    minutes = Math.abs(minutes - 60);
  } 

  return hours + ":" + minutes;
});
</script>

<style>
#sumRow {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  column-gap: 15px;
  align-items: center;
}

.p-sum {
  margin: 1px 0 1px 0;
}
</style>