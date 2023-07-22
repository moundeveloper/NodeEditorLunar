<template>
  <div class="container" ref="container">
    <Dialog :position="{ x, y }" />
    <div class="indicator" :style="`left:${position.x}px; top: ${position.y}px;`"></div>
    <div class="panning" ref="panningContainer"
      :style="`translate: ${position.x}px ${position.y}px; transform: scale(${nodeEditor.scale});`"
      @mousewheel="handleZoom">
      <NodeEditor />
    </div>
  </div>
</template>

<script setup>
import NodeEditor from "./components/NodeEditor.vue";
import Dialog from "./components/Dialog.vue";
import { useMouse } from './composables/mouse.js';
import { ref, onMounted, onUnmounted } from 'vue';
import { nodeEditor } from "./stores/nodeEditor.js"

// Panning references
const panningContainer = ref(null);
const container = ref(null)

const { x, y } = useMouse();
const isPanning = ref(false);

const startPosition = ref({ x: 0, y: 0 });
const currentPosition = ref({ x: 0, y: 0 });
const position = ref({ x: 0, y: 0 });


// Calculate Minimum allowable panning offsets
const calculateLimitOffsets = () => {
  // Minimum value
  const widthNotScaled = panningContainer.value.clientWidth
  const heightNotScaled = panningContainer.value.clientHeight
  const widthScaled = panningContainer.value.clientWidth * nodeEditor.scale
  const heightScaled = panningContainer.value.clientHeight * nodeEditor.scale

  const minRX = (widthNotScaled - widthScaled) / 2
  const minRY = (heightNotScaled - heightScaled) / 2
  return { minRX, minRY };
};

// Panning logic
const startPanning = (event) => {
  event.preventDefault();
  if (event.button !== 1) return;
  isPanning.value = true;
  startPosition.value.x = event.clientX - currentPosition.value.x;
  startPosition.value.y = event.clientY - currentPosition.value.y;
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
}

const panningHandler = (event) => {
  if (isPanning.value) {
    panning(event.clientX, event.clientY)
  }
};

const panning = (posX, posY) => {
  const { minRX, minRY } = calculateLimitOffsets();
  currentPosition.value.x = posX - startPosition.value.x;
  currentPosition.value.y = posY - startPosition.value.y;

  // Apply panning limits
  currentPosition.value.x = clamp(currentPosition.value.x, container.value.clientWidth - panningContainer.value.clientWidth * nodeEditor.scale - minRX, 0 - minRX);
  currentPosition.value.y = clamp(currentPosition.value.y, container.value.clientHeight - panningContainer.value.clientHeight * nodeEditor.scale - minRY, 0 - minRY);
  position.value.x = currentPosition.value.x;
  position.value.y = currentPosition.value.y;
}

const stopPanning = () => {
  isPanning.value = false;
};

// Zooming logic
const handleZoom = (event) => {
  const zoomSpeed = 0.01;
  event.preventDefault()
  const delta = event.deltaY || event.detail || event.wheelDelta;
  if (delta > 0 && nodeEditor.scale > 0.6) { // Scroll down to zoom out with a limit of 0.5x
    nodeEditor.updateScale(nodeEditor.scale - zoomSpeed);
  } else if (delta < 0 && nodeEditor.scale < 1.5) { // Scroll up to zoom in with a limit of 2x
    nodeEditor.updateScale(nodeEditor.scale + zoomSpeed);
  }

  // Apply Zoom limits for panning
  const { minRX, minRY } = calculateLimitOffsets();

  currentPosition.value.x = clamp(currentPosition.value.x, container.value.clientWidth - panningContainer.value.clientWidth * nodeEditor.scale - minRX, 0 - minRX);
  currentPosition.value.y = clamp(currentPosition.value.y, container.value.clientHeight - panningContainer.value.clientHeight * nodeEditor.scale - minRY, 0 - minRY);

  position.value.x = currentPosition.value.x;
  position.value.y = currentPosition.value.y;
};

// Eventlisteners setup
onMounted(() => {
  window.addEventListener("mousedown", startPanning)
  window.addEventListener("mousemove", panningHandler)
  window.addEventListener("mouseup", stopPanning)
})

onUnmounted(() => {
  window.removeEventListener("mousedown", startPanning)
  window.removeEventListener("mousemove", panningHandler)
  window.removeEventListener("mouseup", stopPanning)
})
</script>
<style>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.panning {
  position: absolute;
  overflow: hidden;
  background-size: 40px 40px;
  background-image: radial-gradient(circle, #bbbbbb 1px, rgba(0, 0, 0, 0) 1px);
  background-color: rgb(28, 28, 28);
}

.indicator {
  position: absolute;
  width: 4rem;
  height: 4rem;
  background-color: red;
  z-index: 30;
}
</style>
