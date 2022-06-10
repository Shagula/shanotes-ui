<template>
    <h1>{{text}}</h1>
</template>
<script>
import { test } from '../api/test';

export default {
    async mounted() {
        this.text = await test();
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
