<template>
  <div id="app">
    <img src="./assets/logo.png">
    <hello></hello>
    <Test></Test>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Test from './components/Test'

export default {
  name: 'app',
  components: {
    Hello,
    Test
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
