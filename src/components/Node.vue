<template>
    <div :id="id" :style="`left:${position.x}px; top: ${position.y}px;`" ref="node" class="node-wraper"
        @mousedown="startDrag">
        <div class="node-header" ref="header">
            <img src="../assets/icons/variable-icon.svg" alt="">
            <span>{{ name }} {{ position.x }}, {{ position.y }}</span>
            <img src="../assets/icons/edit-icon.svg" alt="">
        </div>

        <div v-for="output in outputs" class="node-field right-field">
            <div class="field">
                <DropDown />
                <!--  <span>{{ output.type }}</span> -->
            </div>
            <div :id="output.id" class="controll-point out"></div>
        </div>

        <!--         <div class="node-field">
            <div class="field">
                <input type="text" class="input">
            </div>
        </div>
 -->


        <div v-for="input in inputs" class="node-field left-field">
            <div :id="input.id" class="controll-point in"></div>
            <div class="field ">
                <span>{{ input.type }}</span>
            </div>
        </div>




    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { nodeEditor } from "../stores/nodeEditor.js"
import DropDown from './fields/DropDown.vue';

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

const nodeTypes = [
    {
        type: "variable",
        color: "#7FBB43",
        icon: "@/assets/icons/variable-icon.svg",
    },
    {
        type: "print",
        color: "#5458AD",
        icon: "@/assets/icons/print-icon.svg",
    },
]

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
    width: 18rem;
    aspect-ratio: 3/2;
    background-color: #232323;
    border-radius: 0.1rem;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    display: grid;
    grid-template-columns: var(--grid-lateral-margin) 1fr var(--grid-lateral-margin);
    grid-auto-flow: row;
    gap: 1rem 0;
    padding-bottom: 1rem;
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.5);
}

span {
    font-weight: 100;
    user-select: none;
    pointer-events: none;
    overflow: hidden;
    width: 60%;
    text-transform: capitalize;
}

.node-header {
    padding: 0.5rem 1rem;
    background-color: #7FBB43;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    grid-column: 1/4;
    height: 2.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.node-header span {
    margin-right: auto;
    color: #232323;
    font-weight: 600;
}

.node-header img {
    height: 1.1rem;
}

.node-field {
    display: flex;
    position: relative;
    align-items: center;
    text-transform: capitalize;
    gap: 0.4rem;
    width: 100%;
}


.left-field {
    grid-column: 1/3;
    justify-self: flex-start;
}

.right-field {
    grid-column: 2/4;
    justify-self: flex-end;
    justify-content: flex-end;
}


.field {
    flex-grow: 1;
    /*     padding: 0.5rem;
    background-color: whitesmoke;
    color: black;
    border-radius: 0.25rem; */
}

.controll-point {
    width: .6rem;
    aspect-ratio: 1/4;
}

.in {
    background-color: #439EBB;
}

.out {
    background-color: #AA43BB;
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