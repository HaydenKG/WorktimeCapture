<template>
  <div>
    <landing />
  </div>
</template>

<script>
import Landing from "./components/LandingMonth.vue";

export default {
  name: "App",
  components: {
    Landing,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");
body {
  margin: 0;
}
#app {
  font-family: "Inter", sans-serif, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
