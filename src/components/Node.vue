<template>
    <div :id="id" :style="`left:${position.x}px; top: ${position.y}px;`" ref="node" class="node-wraper"
        @mousedown="startDrag">
        <div class="node-header" ref="header">
            <span>{{ name }} {{ position.x }}, {{ position.y }}</span>
        </div>

        <div v-for="input in inputs" class="node-field left-field">
            <div :id="input.id" class="controll-point in"></div>
            <div class="field ">
                <span>{{ input.type }}</span>
            </div>
        </div>

        <div v-for="output in outputs" class="node-field right-field">
            <div :id="output.id" class="controll-point out"></div>
            <div class="field">
                <span>{{ output.type }}</span>
            </div>
        </div>

        <!--         <div class="node-field">
            <div class="field">
                <input type="text" class="input">
            </div>
        </div>
 -->
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { nodeEditor } from "../stores/nodeEditor.js"

/* const { x, y } = useMouse() */
const node = ref(null)
const header = ref(null)
const startPosition = ref({ x: 0, y: 0 });
const currentPosition = ref({ x: 0, y: 0 });
const position = ref({ x: 0, y: 0 });

const props = defineProps({
    id: {
        type: String
    },
    name: {
        type: String
    },
    inputs: {
        type: Array
    },
    outputs: {
        type: Array
    }
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
    const allowedClassNames = ["node-wraper", "node-header"]

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

/* watch(
    () => nodeEditor.scale,
    (newValue, oldValue) => {
        // Check if the function is not already running and scale has changed
        if (!isUpdateRunning && newValue !== oldValue) {
            // Set the flag to true, so the function runs only once
            isUpdateRunning = !isUpdateRunning;
            // Request the first animation frame to start the update loop
            position.value.x = position.value.x / nodeEditor.scale;
            position.value.y = position.value.y / nodeEditor.scale;
        }
    },
    { immediate: false } // Run the callback immediately on mount
); */


</script>

<style>
:root {
    --grid-lateral-margin: 1rem;
}
</style>

<style scoped>
.node-wraper {
    position: absolute;
    left: 0;
    top: 0;
    width: 14rem;
    aspect-ratio: 3/2;
    background-color: rgb(48, 48, 48);
    border-radius: 0.25rem;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    display: grid;
    grid-template-columns: var(--grid-lateral-margin) 1fr var(--grid-lateral-margin);
    grid-auto-flow: row;
    gap: 1rem 0;
    padding-bottom: 1rem;
}

span {
    user-select: none;
    pointer-events: none;
}

.node-header {
    padding: 0.5rem 1rem;
    background-color: brown;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    grid-column: 1/4;
    height: 2.5rem;
    display: grid;
    justify-content: flex-start;
    align-items: center;
}

.node-header span {
    text-transform: capitalize;
}

.node-field {
    display: flex;
    position: relative;
    align-items: center;
    width: fit-content;
    grid-column: 2/3;
    text-transform: capitalize;
}


.left-field {
    justify-self: flex-start;
}

.right-field {
    justify-self: flex-end;
}


.field {
    /*     padding: 0.5rem;
    background-color: whitesmoke;
    color: black;
    border-radius: 0.25rem; */
}

.controll-point {
    width: 1rem;
    aspect-ratio: 1;
    position: absolute;
    background-color: lawngreen;
    border-radius: 50%;
}

.in {
    top: .05rem;
    left: -1.5rem;
    background-color: lawngreen;
}

.out {
    top: .05rem;
    right: -1.5rem;

    background-color: rgb(86, 17, 183);
}

/* .in {
    top: 50%;
    left: -1rem;
    transform: translate(-50%, -50%);
    background-color: lawngreen;
}

.out {
    top: 50%;
    right: -1rem;
    transform: translate(50%, -50%);
    background-color: rgb(86, 17, 183);
}
 */
.input {
    width: 100%;
}
</style>