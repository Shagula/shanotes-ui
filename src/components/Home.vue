<template>
  <h1>{{text}}</h1>
</template>
<script>
import { test } from '../api/test';

export default {
  async mounted() {
    let msg = (await test());
    this.text = msg.data;
  },
  data() {
    return {
      text: '',
    }
  }
}
</script>
<style scoped>
</style>
