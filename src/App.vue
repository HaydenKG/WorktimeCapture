<script>
import MonthPanel from "./components/LandingMonth.vue";
import Navigation from "./components/Navigation.vue";
import dayEntry from "./components/dayPanel.vue"
import infoPoint from "./components/infoPoint.vue"

export default {
  name: "App",
  data() {
    return {
      activePanel: 0
    }
  },
  components: {
    MonthPanel,
    Navigation,
    dayEntry,
    infoPoint
}
};
</script>

<template>
    <Navigation @response="(panelId) => this.activePanel = panelId" />
    <dayEntry v-show="activePanel == 0"/>
    <MonthPanel v-show="activePanel == 2"/>
    <infoPoint v-show="activePanel == 3"/>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

body {
  margin: 0;
}

#app {
  font-family: 'Roboto', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: grid;
  justify-items: center;
  align-items: start;
  font-size: 1.3rem;
}

button {
    border: 1px solid #7e7e7e;
    border-radius: 2px;
    background: transparent;
    padding: 2px 10px;
    margin: 10px;
    width: 100px; 
    font-size: inherit;
}

button:hover {
  border-color:  #50e6a2;
}

button:active {
  border-color:  #42b983;
}
</style>
