<script>
import MonthPanel from "./components/LandingMonth.vue";
import Navigation from "./components/Navigation.vue";
// import DayEntry from "./components/dayPanel.vue"
import InfoPage from "./components/InfoPage.vue"
import UpdatedToday from "./components/DayComponents/UpdatedToday.vue"

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
    InfoPage,
    UpdatedToday
}
};
</script>

<template>
    <Navigation @response="(panelId) => this.activePanel = panelId" />
    <UpdatedToday v-show="activePanel == 0"/>
    <!-- <MonthPanel v-show="activePanel == 2"/> -->
    <!-- <InfoPage v-show="activePanel == 3"/> -->
    
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
    border-radius: 0;
    border-color: transparent;
    border-bottom: 1px solid #aaa;
    background: transparent;
    padding: 2px 10px;
    margin: 10px;
    width: 100px;
    font-size: inherit;
    box-shadow: none;
}

button:hover {
  color:  #4ec28e;
}

button:active {
  border-color:  #42b983;
}
</style>
