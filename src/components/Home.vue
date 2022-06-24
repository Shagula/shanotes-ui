<template>
  <div id="main">
    <NavigationBar></NavigationBar>
    <router-view></router-view>
  </div>
</template>
<script>
import NavigationBar from './NavigationBar.vue'
export default {
  async mounted() {
    
  },
  components: { NavigationBar },
  data() {
    return {
    }
  }
}
</script>

<style scoped>
</style>
