<template>
    <div class="editor-wraper">
        <NodeWraper :style="{ zIndex: 2 }" v-for="node in nodeEditor.nodes" :nodeData="node" />
        <svg class="path-wraper">
            <g fill="none" stroke="white" stroke-width="2" ref="pathWraper">
            </g>
        </svg>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { getElementPositionOffset, setPathDByID, findGrandparentElementById, getElementPositionViewportById } from "../utils/htmlElement.js"
import { genId } from "../utils/utility.js"
import { nodeEditor } from "../stores/nodeEditor.js"
import { NodeC, NodeVariableC } from "../classes/Node"
import { LinkC } from "../classes/Link"
import { ControllPointC } from "../classes/ControllPoint"
import { TypesEnum } from "../classes/Types.js";
import NodeWraper from './NodeWraper.vue';

const pathWraper = ref('')
let isUpdateRunning = false;
let globalID
// Drag and drop link connection variables
let isMouseDown = false;
let path, startPos, startBoxId
let startingPosition = { x: 0, y: 0 }

const billy = new NodeVariableC("billy")
billy.position.x = 800
billy.position.y = 200
const frank = new NodeVariableC("frank")
frank.position.x = 400
frank.position.y = 400
const joel = new NodeVariableC("joel")
joel.position.x = 40
joel.position.y = 40


nodeEditor.addNode(billy)
nodeEditor.addNode(frank)
nodeEditor.addNode(joel)


const createLink = (sourceId, targetId, path) => {

    const sourceFamily = findGrandparentElementById(sourceId)
    const targetFamily = findGrandparentElementById(targetId)

    /*     const sourceNodeObject = nodeEditor.getNodeById(sourceFamily.grandparent.id)
        const targetNodeObject = nodeEditor.getNodeById(targetFamily.grandparent.id)
        if (sourceNodeObject.variableType !== targetNodeObject.variableType) return */

    if (document.getElementById(targetId).className === "controll-point in") {
        const sourceLinkLimitSelf = nodeEditor.checkSourceLink(targetId)
        if (sourceLinkLimitSelf) {
            const pathToRemove = nodeEditor.removeConnectedTargetControllPoint(sourceLinkLimitSelf)
            clearSVGPath(pathToRemove)
        }

        const sourceLinkLimitTarget = nodeEditor.checkTargetLink(targetId)
        if (sourceLinkLimitTarget) {
            const pathToRemove = nodeEditor.removeConnectedTargetControllPoint(sourceLinkLimitTarget)
            clearSVGPath(pathToRemove)
        }
    }

    let sourceControllPoint = null
    let targetControllPoint = null
    let sourceNode = null
    let targetNode = null
    nodeEditor.updateNodeControllPoint(sourceFamily.grandparent.id, sourceId, (controllPoint, node) => {
        sourceNode = node
        sourceControllPoint = controllPoint
        controllPoint.to = targetId
    })
    nodeEditor.updateNodeControllPoint(targetFamily.grandparent.id, targetId, (controllPoint, node) => {
        targetNode = node
        targetControllPoint = controllPoint
        controllPoint.to = sourceId
    })
    const startPos = getElementPositionOffset(sourceId)
    const endPos = getElementPositionOffset(targetId)
    const { d } = generateDpath(startPos, endPos)
    const link = new LinkC(genId(), sourceControllPoint, targetControllPoint, sourceNode, targetNode)

    path.setAttribute("id", link.id)
    path.setAttribute("d", d)

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
    const sourcePos = getElementPositionOffset(link.sourceControllPoint.id)
    const targetPos = getElementPositionOffset(link.targetControllPoint.id)
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

function createSVGPath(startX, startY) {
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathWraper.value.appendChild(path);

    startPos = { x: startX, y: startY };
}

function createSVGPathRemoved(startX, startY, removedPath) {
    path = removedPath
    startPos = { x: startX, y: startY };
}

function updateSVGPath(x, y) {
    const { d } = generateDpath({ x: startPos.x, y: startPos.y }, { x, y })
    path.setAttribute("d", d);
}

function clearSVGPath(path) {
    if (path) {
        path.remove()
        path = null;
    }
}

onMounted(() => {
    window.addEventListener("mousedown", (event) => {

        if (typeof event.target.className !== 'string' ||
            !event.target.className.includes('controll-point')) return

        isMouseDown = true;
        const { x, y } = getElementPositionOffset(event.target.id)
        startBoxId = event.target.id;

        if (document.getElementById(startBoxId).className === "controll-point in") {
            const sourceLinkLimitSelf = nodeEditor.checkSourceLink(startBoxId)
            if (sourceLinkLimitSelf) {
                const removedPath = nodeEditor.removeConnectedTargetControllPoint(sourceLinkLimitSelf)
                startBoxId = sourceLinkLimitSelf.targetControllPoint.id
                const { x, y } = getElementPositionOffset(startBoxId)
                const { xV, yV } = getElementPositionViewportById(startBoxId)
                startingPosition.x = xV / nodeEditor.scale - x;
                startingPosition.y = yV / nodeEditor.scale - y;
                createSVGPathRemoved(x, y, removedPath)
                return
            }

            const sourceLinkLimitTarget = nodeEditor.checkTargetLink(startBoxId)
            if (sourceLinkLimitTarget) {
                const removedPath = nodeEditor.removeConnectedTargetControllPoint(sourceLinkLimitTarget)
                startBoxId = sourceLinkLimitTarget.sourceControllPoint.id
                const { x, y } = getElementPositionOffset(startBoxId)
                const { xV, yV } = getElementPositionViewportById(startBoxId)
                startingPosition.x = xV / nodeEditor.scale - x;
                startingPosition.y = yV / nodeEditor.scale - y;
                createSVGPathRemoved(x, y, removedPath)
                return
            }
        }

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

            if (typeof targetElement.className !== 'string' || !targetElement.className.includes("controll-point")) {
                clearSVGPath(path);
                isMouseDown = false;
                return
            }

            if (document.getElementById(startBoxId).className === targetElement.className) {
                clearSVGPath(path);
                isMouseDown = false;
                return
            }

            const targetBoxId = targetElement?.id;


            const sourceFamily = findGrandparentElementById(startBoxId)
            const targetFamily = findGrandparentElementById(targetBoxId)

            const sourceNodeObject = nodeEditor.getNodeById(sourceFamily.grandparent.id)
            const targetNodeObject = nodeEditor.getNodeById(targetFamily.grandparent.id)
            if (sourceNodeObject.variableType !== targetNodeObject.variableType) {
                clearSVGPath(path);
                return
            }

            if (targetBoxId && targetBoxId !== startBoxId) {
                // Anchor the SVG path
                const newLink = createLink(startBoxId, targetBoxId, path)
                nodeEditor.links.push(newLink)
                console.log("Anchored to box:", targetBoxId);
            } else {
                // Destroy the SVG path
                clearSVGPath(path);
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