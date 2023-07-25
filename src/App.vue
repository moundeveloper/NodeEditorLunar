<template>
  <div>
    <Dialog :position="{ x, y }" />
    <PanningZoomingEditor />
  </div>
</template>

<script setup>
import PanningZoomingEditor from "./components/PanningZoomingEditor.vue";
import Dialog from "./components/Dialog.vue";
import { useMouse } from './composables/mouse.js';

const { x, y } = useMouse()
</script>

<style scoped>
.wraper {
  display: flex;
}

.block {
  width: 20rem;
  height: 100vh;
  background-color: red;
}
</style>
