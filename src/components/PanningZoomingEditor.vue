<template>
    <div class="container" ref="container"
        :class="[!containerHeight ? 'default-height' : '', !containerWidth ? 'default-width' : '']"
        :style="[containerHeight ? { height: `${containerHeight}px` } : '', containerWidth ? { width: `${containerWidth}px` } : '']">
        <div class="panning" ref="panningContainer">
            <NodeEditor />
        </div>
        <div class="grid-pattern"
            :style="`background-position: ${translate.translateX / nodeEditor.scale}px ${translate.translateY / nodeEditor.scale}px; scale: ${zoomFactor};`">
        </div>
    </div>
</template>

<script setup>
import NodeEditor from "./NodeEditor.vue";
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { nodeEditor } from "../stores/nodeEditor.js"


const props = defineProps({
    containerWidth: { type: Number },
    containerHeight: { type: Number },
})

// Panning references
const panningContainer = ref(null);
const container = ref(null)

let panningAllowed = false;
const zoomFactor = ref(1)

const translate = reactive({ scale: zoomFactor.value, translateX: 0, translateY: 0 });
const initialContentsPos = { x: 0, y: 0 };
const pinnedMousePosition = { x: 0, y: 0 };
const mousePosition = { x: 0, y: 0 };

const mousedown = (event) => {
    event.preventDefault()
    if (event.button === 1) {
        initialContentsPos.x = translate.translateX;
        initialContentsPos.y = translate.translateY;
        pinnedMousePosition.x = event.clientX;
        pinnedMousePosition.y = event.clientY;
        panningAllowed = true;
        document.body.classList.add('panning-cursor');
    }
};

const mousemove = (event) => {
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
    if (panningAllowed) {
        const diffX = mousePosition.x - pinnedMousePosition.x;
        const diffY = mousePosition.y - pinnedMousePosition.y;
        translate.translateX = initialContentsPos.x + diffX;
        translate.translateY = initialContentsPos.y + diffY;
    }
    update();
};

const mouseup = (event) => {
    panningAllowed = false;
    document.body.classList.remove('panning-cursor');
};

const zoom = (event) => {
    // Determine before anything else. Otherwise weird jumping.
    const limiter = 1000;
    if (
        zoomFactor.value - event.deltaY / limiter > 3 ||
        zoomFactor.value - event.deltaY / limiter < 0.4
    ) {
        return;
    }

    const oldZoomFactor = zoomFactor.value;
    zoomFactor.value -= event.deltaY / limiter;
    const gridSize = container.value.getBoundingClientRect();

    mousePosition.x = event.clientX - gridSize.x;
    mousePosition.y = event.clientY - gridSize.y;

    // Calculations
    nodeEditor.scale = zoomFactor.value
    translate.scale = zoomFactor.value;

    const contentMousePosX = mousePosition.x - translate.translateX;
    const contentMousePosY = mousePosition.y - translate.translateY;
    const x = mousePosition.x - contentMousePosX * (zoomFactor.value / oldZoomFactor);
    const y = mousePosition.y - contentMousePosY * (zoomFactor.value / oldZoomFactor);

    translate.translateX = x;
    translate.translateY = y;

    update();
};

const update = () => {
    const matrix = `matrix(${translate.scale},0,0,${translate.scale},${translate.translateX},${translate.translateY})`;
    panningContainer.value.style.transform = matrix;
};

onMounted(() => {
    container.value.addEventListener("wheel", zoom);
    container.value.addEventListener("mousedown", mousedown);
    container.value.addEventListener("mousemove", mousemove);
    container.value.addEventListener("mouseup", mouseup);
})

onUnmounted(() => {
    container.value.removeEventListener("wheel", zoom);
    container.value.removeEventListener("mousedown", mousedown);
    container.value.removeEventListener("mousemove", mousemove);
    container.value.removeEventListener("mouseup", mouseup);
})

</script>
<style >
.panning-zooming-wraper {
    position: relative;
}

.container {
    position: relative;
    top: 0;
    left: 0;
    overflow: hidden;
}

.default-width {
    width: 100%;
}

.default-height {
    height: 100vh;
}

.panning {
    position: absolute;
    transform-origin: 0 0;
    z-index: 2;
}

.grid-pattern {
    position: absolute;
    left: -50%;
    top: -50%;
    transform: translate(-50%, -50%);
    width: 300vw;
    height: 300vh;
    background-size: 40px 40px;
    background-image: radial-gradient(circle, #bbbbbb 1px, rgba(0, 0, 0, 0) 1px);
    transform-origin: center center;
}
</style>
