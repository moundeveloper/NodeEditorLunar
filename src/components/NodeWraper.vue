<template>
    <div :id="nodeData.id" :style="`left:${position.x}px; top: ${position.y}px;`" ref="node" class="node-wraper"
        @mousedown="startDrag">
        <VariableNode v-if="nodeData.nodeType === 'variable'" :nodeData="nodeData" />
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { nodeEditor } from "../stores/nodeEditor.js"
import VariableNode from './Nodes/VariableNode.vue'

const node = ref(null)
const startPosition = ref({ x: 0, y: 0 });
const currentPosition = ref({ x: 0, y: 0 });
const position = ref({ x: 0, y: 0 });

const props = defineProps({
    nodeData: Object
})

// Handle dragging responsiveness
const dragStore = reactive({
    isDragging: false,
    enable() {
        this.isDragging = true;
    },
    disable() {
        this.isDragging = false;
    },
});


// Listeners for moving the node
window.addEventListener("mousemove", drag)
window.addEventListener("mouseup", endDrag)

function startDrag(event) {
    if (event.button === 1) return;

    // Update the flag and record the initial mouse positions
    const allowedClassNames = ["node-wraper", "node-header", "field"]

    if (!allowedClassNames.includes(event.target.className)) return
    startPosition.value.x = event.clientX / nodeEditor.scale - currentPosition.value.x;
    startPosition.value.y = event.clientY / nodeEditor.scale - currentPosition.value.y;
    dragStore.enable()
    document.body.classList.add('move-cursor');
}

function drag(event) {
    if (dragStore.isDragging) {
        // Update the position values based on the mouse movement
        currentPosition.value.x = event.clientX / nodeEditor.scale - startPosition.value.x;
        currentPosition.value.y = event.clientY / nodeEditor.scale - startPosition.value.y;
        position.value.x = currentPosition.value.x;
        position.value.y = currentPosition.value.y;
    }
}

function endDrag() {
    // Reset the dragging flag
    dragStore.disable()
    document.body.classList.remove('move-cursor');
}

</script>


<style scoped>
.node-wraper {
    position: absolute;
    left: 0;
    top: 0;
    width: 18rem;
    aspect-ratio: 3/2;
    background-color: #232323;
    border-radius: 0.1rem;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    display: grid;
    grid-template-columns: 1rem 1fr 1rem;
    grid-auto-flow: row;
    gap: 1rem 0;
    padding-bottom: 1rem;
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.5);
}
</style>