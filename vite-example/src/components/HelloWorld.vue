<script setup>
import { ref, reactive } from 'vue';

defineProps({
  msg: String,
});

const obj = ref({});
const obj2 = reactive({});

function addObj() {
  const key = +new Date();
  obj.value[key] = key;
}
function addObj2() {
  const key = +new Date();
  obj2[key] = key;
}
</script>

<template>
  <!-- 循环obj -->
  <li v-for="item in obj" :key="item.id">{{ item }}</li>
  <button @click="addObj">给obj增加属性</button>

  <li v-for="item in obj2" :key="item.id">{{ item }}</li>
  <button @click="addObj2">给obj2增加属性</button>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
