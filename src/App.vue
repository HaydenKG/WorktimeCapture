<script>
import { ref } from 'vue'
import Navigation from "./components/Navigation.vue";

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})


export default {
  name: "App",
  data() {
    return {
    }
  },
  components: {
    Navigation,
  }
};
</script>

<template>
  <Navigation />
  <router-view></router-view>
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

button:hover:not(:disabled) {
  color: #4ec28e;
}

button:active {
  border-color: #42b983;
}

.addButton{
  font-size: 1.4rem;
}

a:focus {
  box-shadow: none;
}
</style>
