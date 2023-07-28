<template>
    <div class="node-header">
        <img src="../../assets/icons/variable-icon.svg" alt="">
        <span :style="[!allowNameEdit ? { pointerEvents: 'none', userSelect: 'none' } : '']" ref="variableNameContent"
            :contenteditable="allowNameEdit" @keydown="handleKeyDown" @blur="handleBlur">{{ variableValues.variableName }}
        </span>
        <img src="../../assets/icons/edit-icon.svg" alt="" @click="handleEdit">
    </div>

    <div class="node-field">
        <div class="field">
            <DropDown :label="'behaviour'" :options="['const', 'let']" v-model="variableValues.variableBehaviour" />
        </div>
    </div>

    <!-- Output fields -->
    <div v-for="output in nodeData.outputs" class="node-field right-field">
        <div class="field">
            <DropDown :label="'type'" :options="values" v-model="variableValues.variableType" />
        </div>
        <div :id="output.id" class="controll-point out"></div>
    </div>

    <!-- Input fields -->
    <div v-for="input in nodeData.inputs" class="node-field left-field">
        <div :id="input.id" class="controll-point in"></div>
        <div class="field ">
            <NumberInput v-if="variableValues.variableType === 'number'" v-model="variableValues.value" />
            <StringInput v-if="variableValues.variableType === 'string'" v-model="variableValues.value" />
            <DropDown :label="'value'" :options="[true, false]" v-if="variableValues.variableType === 'boolean'"
                v-model="variableValues.value" />
        </div>
    </div>
</template>

<script setup>
import { nodeEditor } from '../../stores/nodeEditor';
import DropDown from '../Fields/DropDown.vue';
import NumberInput from '../Fields/NumberInput.vue';
import StringInput from '../Fields/StringInput.vue';
import { ref, watchEffect, reactive } from 'vue';

const props = defineProps({
    nodeData: Object
})

const variableValues = reactive({
    variableName: props.nodeData.name,
    variableType: props.nodeData.variableType,
    variableBehaviour: 'const',
    value: 3.2,
})

const variableNameContent = ref(null)
const allowNameEdit = ref(false)

const values = [
    "number",
    "string",
    "boolean",
    "array",
    "object",
    "null",
    "undefined",
]

const handleEdit = () => {
    allowNameEdit.value = !allowNameEdit.value
}

const handleKeyDown = (event) => {
    if (event.keyCode === 13 || event.key === 'Enter') {
        event.preventDefault();
        if (event.target === variableNameContent.value) {
            variableValues.variableName = variableNameContent.value?.innerText
            allowNameEdit.value = false
        }
    }
}

const handleBlur = (event) => {
    variableValues.variableName = variableNameContent.value?.innerText
    allowNameEdit.value = false
}

watchEffect(() => {
    // Update node properties
    props.nodeData.name = variableValues.variableName
    props.nodeData.variableType = variableValues.variableType
    props.nodeData.nodeValue.variableValue = variableValues.value
    props.nodeData.variableBehaviour = variableValues.variableBehaviour

    // De-link all nodes if variable-type doesn't match anymore
    const connectedLinks = nodeEditor.findLinksConnectedToNode(props.nodeData)

    connectedLinks.forEach((link) => {
        if (link.sourceNode.nodeType === "variable" && link.targetNode.nodeType === "variable") {
            if (link.sourceNode.variableType !== link.targetNode.variableType) {

                link.targetNode.nodeValue.currentVariableReference = link.targetNode.name
                const path = nodeEditor.removeConnectedTargetControllPoint(link)
                path.remove()
            }
        }

    })
})

</script>

<style  scoped>
span {
    font-weight: 100;
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
    color: var(--primary-color);
    font-weight: 600;
    user-select: text;
    text-transform: none;
}

.node-header img {
    height: 1.1rem;
}

.node-field {
    display: flex;
    position: relative;
    align-items: flex-start;
    text-transform: capitalize;
    gap: 0.4rem;
    width: 100%;
    grid-column: 2/3;
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
}

.controll-point {
    min-width: .6rem;
    aspect-ratio: 1/4;
    transform: translateY(-5%);
}

.in {
    background-color: var(--input-color);

}

.out {
    background-color: var(--output-color);
}
</style>