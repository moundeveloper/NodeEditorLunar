<template>
    <div class="widget-pannel-wraper">
        <h1>Diagnostic Pannel</h1>
        <p>Connect, run, display</p>
        <button class="primary-btn-c" @click="handleRun">run code</button>
        <div class="display">
            <p v-for="code in structure">{{ code }}</p>
        </div>
    </div>
</template>

<script setup>
import { getGraphSourcesTargets, traverseGraph } from "../classes/GraphNode.js"
import { convertNodeToCode, executeParsedCode } from "../classes/ConvertCode.js"
import { nodeEditor } from "../stores/nodeEditor";
import { ref } from "vue";

const structure = ref(null)

structure.value = getGraphSourcesTargets(nodeEditor.links)

const handleRun = () => {
    const adjacencyList = getGraphSourcesTargets(nodeEditor.links)

    const codeListRaw = [];

    const [[k, v]] = adjacencyList
    traverseGraph(k, adjacencyList, (nodeKey, currentNode, visited) => {
        convertNodeToCode(nodeKey, codeListRaw);
    });

    console.log(codeListRaw);

    /* executeParsedCode(codeListRaw.join("\n")); */
    structure.value = codeListRaw
}

</script>

<style scoped>
.widget-pannel-wraper * {
    color: #232323;
}

.widget-pannel-wraper {
    width: 30rem;
    height: 100vh;
    background-color: var(--tertiary-color);
    z-index: 4;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.primary-btn-c {
    background-color: var(--input-color);
    padding: 0.5rem 1rem;
    font-weight: 600;
    color: var(--primary-color);
    border: none;
    text-transform: capitalize;
    cursor: pointer;
    border-radius: 0.1rem;
    width: 100%;
}

.primary-btn-c:active {
    background-color: rgb(4, 184, 184)
}

.display {
    flex-grow: 1;
    border-radius: 0.1rem;
    outline: 1px solid var(--primary-color);
    padding: 0.5rem;
    user-select: text;
    pointer-events: visible;
}
</style>