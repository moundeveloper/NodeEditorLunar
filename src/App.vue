<template>
  <div class="app-wraper">
    <Dialog :position="{ x, y }">
      <template v-slot:activator="{ closeDialog }">
        <AddNode :closeDialog="closeDialog" />
      </template>
    </Dialog>
    <PanningZoomingEditor />
    <WidgetPannel />
  </div>
</template>

<script setup>
import PanningZoomingEditor from "./components/PanningZoomingEditor.vue";
import Dialog from "./components/Dialog.vue";
import { useMouse } from './composables/mouse.js';
import WidgetPannel from "./components/WidgetPannel.vue";
import AddNode from "./components/Widgets/AddNode.vue";

const { x, y } = useMouse()
</script>

<style scoped>
.app-wraper {
  display: flex;
}
</style>
