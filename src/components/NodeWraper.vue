<template>
    <div :id="node.id" :style="`left:${position.x}px; top: ${position.y}px;`" class="node-wraper" @mousedown="startDrag">
        <VariableNode v-if="node.nodeType === 'variable'" :node="node" />
        <PrintNode v-if="node.nodeType === 'print'" :node="node" />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { nodeEditor } from "../stores/nodeEditor.js"
import VariableNode from './Nodes/VariableNode.vue'
import PrintNode from './Nodes/PrintNode.vue';

const props = defineProps({
    node: Object
})

const startPosition = ref({ x: props.node.position.x, y: props.node.position.y });
const currentPosition = ref({ x: props.node.position.x, y: props.node.position.y });
const position = ref({ x: props.node.position.x, y: props.node.position.y });

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
    width: 20rem;
    aspect-ratio: 3/2;
    background-color: var(--primary-color);
    border-radius: 0.1rem;
    font-family: Arial, Helvetica, sans-serif;
    color: var(--tertiary-color);
    display: grid;
    grid-template-columns: 1.25rem 1fr 1.25rem;
    grid-auto-flow: row;
    gap: 1rem 0;
    padding-bottom: 1rem;
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.5);
}
</style>