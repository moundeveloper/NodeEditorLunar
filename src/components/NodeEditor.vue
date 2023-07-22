<template>
    <div class="editor-wraper">
        <Node :style="{ zIndex: 2 }" v-for="node in nodeEditor.nodes" :id="node.id" :name="node.name" :inputs="node.inputs"
            :outputs="node.outputs" />
        <svg class="path-wraper">
            <g fill="none" stroke="white" stroke-width="2" ref="pathWraper">
            </g>
        </svg>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import Node from './Node.vue'
import { getElementPositionOffset, setPathDByID, findGrandparentElementById } from "../utils/htmlElement.js"
import { genId } from "../utils/utility.js"
import { nodeEditor } from "../stores/nodeEditor.js"
import { NodeC } from "../classes/Node"
import { LinkC } from "../classes/Link"

const pathWraper = ref('')
const selectedNodes = ref([])
/* const nodeEditor = reactive({ links: [] }) */
let isUpdateRunning = false;
let globalID

nodeEditor.addNode(new NodeC(genId(), "multiply", 2, [
    { id: genId("in"), type: "string", to: "" },
], [
    { id: genId("out"), type: "integer", to: "" },
    { id: genId("out"), type: "float", to: "" },
]))
nodeEditor.addNode(new NodeC(genId(), "add", 2, [
    { id: genId("in"), type: "string", to: "" },
], [
    { id: genId("out"), type: "integer", to: "" },
    { id: genId("out"), type: "float", to: "" },
]))
nodeEditor.addNode(new NodeC(genId(), "add", 2, [
    { id: genId("in"), type: "string", to: "" },
], [
    { id: genId("out"), type: "integer", to: "" },
    { id: genId("out"), type: "float", to: "" },
]))

const createLink = (sourceId, targetId, path) => {

    // Check if link already exists
    const existingLink = nodeEditor.links.find(link => link.id === sourceId && link.id === targetId);
    if (existingLink) return

    const sourceFamily = findGrandparentElementById(sourceId)
    const targetFamily = findGrandparentElementById(targetId)

    const targetLink = nodeEditor.checkTargetLink(targetId)
    const sourceLink = nodeEditor.checkSourceLink(targetId)
    console.log(sourceLink, targetLink)
    if (targetLink) {
        nodeEditor.removeConnectedTargetControllPoint(targetLink, pathWraper.value)
    }
    if (sourceLink) {
        nodeEditor.removeConnectedTargetControllPoint(sourceLink, pathWraper.value)
    }
    if (document.getElementById(sourceId).className === "controll-point in") {
        const sourceLinkLimitSelf = nodeEditor.checkSourceLink(sourceId)
        if (sourceLinkLimitSelf) {
            nodeEditor.removeConnectedTargetControllPoint(sourceLinkLimitSelf, pathWraper.value)
        }

        const sourceLinkLimitTarget = nodeEditor.checkTargetLink(sourceId)
        if (sourceLinkLimitTarget) {
            nodeEditor.removeConnectedTargetControllPoint(sourceLinkLimitTarget, pathWraper.value)
        }
    }

    nodeEditor.updateNodeControllPoint(sourceFamily.grandparent.id, sourceId, (controllPoint) => {
        controllPoint.to = targetId
    })
    nodeEditor.updateNodeControllPoint(targetFamily.grandparent.id, targetId, (controllPoint) => {
        controllPoint.to = sourceId
    })

    const startPos = getElementPositionOffset(sourceId)
    const endPos = getElementPositionOffset(targetId)

    const { d, controllPoints } = generateDpath(startPos, endPos)
    const link = new LinkC(genId(), sourceId, targetId, controllPoints)
    console.log(path)

    path.setAttribute("id", link.id)
    path.setAttribute("d", d)

    /*     setPathDByID(link.id, d) */

    return link
}

const createNode = () => {
    nodeEditor.addNode(new NodeC(genId, "multiply", 2, [
        { id: genId(), type: "string" },
    ], [
        { id: genId(), type: "integer" },
        { id: genId(), type: "float" },
    ]))
}

const updateLink = (link) => {
    const sourcePos = getElementPositionOffset(link.sourceNode)
    const targetPos = getElementPositionOffset(link.targetNode)
    const { d } = generateDpath(sourcePos, targetPos)
    setPathDByID(link.id, d)
}

const generateDpath = (startPos, endPos) => {

    let x1 = startPos.x
    let y1 = startPos.y
    let x2 = endPos.x
    let y2 = endPos.y

    // Control Points setup for bezier curve
    const cy1 = y1
    const cy2 = y2

    const cx1 = x2
    const cx2 = x1

    const d = `M${x1} ${y1} C${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`
    const controllPoints = { x1, y1, x2, y2, cx1, cy1, cx2, cy2 }
    return { d, controllPoints };
}


const updateLinks = () => {
    console.log("updating...")
    nodeEditor.links.forEach(link => {
        updateLink(link)
    })
}

// Update animation for nodes & links when moved
const updateNodeEditor = () => {
    updateLinks()
    globalID = requestAnimationFrame(updateNodeEditor);
}

const updateNodeEditorOnZoom = () => {
    updateLinks()
    if (isUpdateRunning) {
        isUpdateRunning = !isUpdateRunning;
        globalID = requestAnimationFrame(updateNodeEditorOnZoom);
    }
}

watch(
    () => nodeEditor.scale,
    (newValue, oldValue) => {
        // Check if the function is not already running and scale has changed
        if (!isUpdateRunning && newValue !== oldValue) {
            // Set the flag to true, so the function runs only once
            isUpdateRunning = !isUpdateRunning;
            // Request the first animation frame to start the update loop
            globalID = requestAnimationFrame(updateNodeEditorOnZoom);
        }
    },
    { immediate: false } // Run the callback immediately on mount
);

window.addEventListener("mousedown", (event) => {
    if (event.button === 1) return
    globalID = requestAnimationFrame(updateNodeEditor)
})

window.addEventListener("mouseup", (event) => {
    if (event.button === 1) return
    globalID = cancelAnimationFrame(globalID)
})

let isMouseDown = false;
let path, startPos, startBoxId
let startingPosition = { x: 0, y: 0 }
function createSVGPath(startX, startY) {
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathWraper.value.appendChild(path);

    startPos = { x: startX, y: startY };
}

function updateSVGPath(x, y) {
    const { d } = generateDpath({ x: startPos.x, y: startPos.y }, { x, y })
    path.setAttribute("d", d);
}

function clearSVGPath() {
    if (path) {
        pathWraper.value.removeChild(path);
        path = null;
    }
}

onMounted(() => {
    window.addEventListener("mousedown", (event) => {
        event.preventDefault();
        if (typeof event.target.className !== 'string' ||
            !event.target.className.includes('controll-point')) return

        isMouseDown = true;
        const { x, y } = getElementPositionOffset(event.target.id)
        startBoxId = event.target.id;
        startingPosition.x = event.clientX / nodeEditor.scale - x;
        startingPosition.y = event.clientY / nodeEditor.scale - y;

        createSVGPath(x, y);
    });

    window.addEventListener("mousemove", (event) => {
        if (isMouseDown && path) {
            const x = event.clientX / nodeEditor.scale - startingPosition.x;
            const y = event.clientY / nodeEditor.scale - startingPosition.y;
            updateSVGPath(x, y);
        }
    });

    window.addEventListener("mouseup", (event) => {
        if (!isMouseDown) return

        if (path) {
            const targetElement = document.elementFromPoint(
                event.clientX,
                event.clientY
            );
            if (document.getElementById(startBoxId).className === targetElement.className) {
                clearSVGPath();
                isMouseDown = false;
                return
            }
            const targetBoxId = targetElement?.id;
            if (targetBoxId && targetBoxId !== startBoxId) {
                // Anchor the SVG path
                const newLink = createLink(startBoxId, targetBoxId, path)
                nodeEditor.links.push(newLink)
                console.log("Anchored to box:", targetBoxId);
            } else {
                // Destroy the SVG path
                clearSVGPath();
            }
        }
        isMouseDown = false;

    });
})

</script>



<style scoped>
.editor-wraper {
    position: relative;
    width: 4000px;
    height: 4000px;
}

svg {
    width: fit-content;
    height: fit-content;
    position: absolute;
    z-index: 0;
    overflow: visible;
}

button {
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    padding: 0.5rem 1rem;
    text-transform: capitalize;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    cursor: pointer;
}
</style>