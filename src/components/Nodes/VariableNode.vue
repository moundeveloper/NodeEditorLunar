<template>
    <div class="node-header">
        <img src="../../assets/icons/variable-icon.svg" alt="">
        <span :style="[!allowNameEdit ? { pointerEvents: 'none', userSelect: 'none' } : '']" ref="variableNameContent"
            :contenteditable="allowNameEdit" @keydown="handleKeyDown" @blur="handleBlur">{{ variableValues.variableName }}
        </span>
        <img src="../../assets/icons/edit-icon.svg" alt="" @click="handleEdit">
    </div>

    <!-- Output fields -->
    <div v-for="output in node.outputs" class="node-field right-field">
        <div class="field">
            <FieldWraper :field="{
                fieldName: output.component,
                data: {
                    interface: output,
                    options: output.options
                }, updateHandler:
                    handleUpdatedOutputType
            }" />
        </div>
        <div :id="output.id" class="interface out"></div>
    </div>

    <!-- Fields -->
    <div v-for="option in node.options" class="node-field">
        <div class="field">
            <FieldWraper :field="{
                fieldName: option.component,
                data: {
                    options: option.options
                }, updateHandler:
                    handleUpdatedBehaviour
            }" />
        </div>
    </div>

    <!-- Input fields -->
    <div v-for="input in node.inputs" class="node-field left-field">
        <div :id="input.id" class="interface in"></div>
        <div class="field ">
            <FieldWraper v-if="!nodeEditor.isInterfaceConnected(input)" :field="{
                fieldName: input.component,
                data: { interface: input, options: input.options },
                updateHandler: handleUpdatedInputValue
            }" />

            <FieldWraper v-else :field="{
                fieldName: 'DefaultTemplate',
                data: {
                    options: {
                        label: 'value'
                    }
                },
                updateHandler: handleUpdatedInputValue
            }" />
        </div>
    </div>
    <button v-if="variableType === 'array'" class="primary-btn-c" @click="handleAddArrayItem">add
        array-item</button>
</template>

<script setup>
import FieldWraper from '../Fields/FieldWraper.vue';
import { nodeEditor } from '../../stores/nodeEditor';

const props = defineProps({
    node: Object
})

const variableValues = reactive({
    variableName: props.node.name,
    variableType: props.node.variableType,
    variableBehaviour: 'const',
    data: {
        id: null,
        value: null
    }
})

const variableType = computed(() => props.node.outputs[0].type)

const variableNameContent = ref(null)
const allowNameEdit = ref(false)

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

const handleUpdatedInputValue = ({ interfaceId, value }) => {
    console.log(value)
    props.node.setInterfaceInputValue(interfaceId, value)
}

const handleUpdatedOutputType = ({ value }) => {
    console.log(value)
    props.node.setCurrentState(value)
}

const handleUpdatedBehaviour = (value) => {
    console.log(value)
    props.node.variableBehaviour = value
}

const handleAddArrayItem = () => {
    props.node.addInputInterface(new ArrayItem(genId("in")))
}

watchEffect(() => {
    // Update node properties
    props.node.name = variableValues.variableName
})

watch(props.node.getOutputInterface(), (newVal) => {
    // De-link all nodes if variable-type doesn't match anymore
    const connectedLinks = nodeEditor.findLinksConnectedToNode(props.node)
    connectedLinks.forEach((link) => {
        if (link.sourceNode.nodeType === "variable" && link.targetNode.nodeType === "variable") {
            // FIX THIS SHIT PLEASEESS!!!!!
            console.log(link.sourceInterface, link.targetInterface)
            if (link.sourceNode.getOutputInterface().type !== link.targetNode.getOutputInterface().type) {
                console.log("why are you ehre??")
                link.targetNode.nodeReference.currentVariableReference = link.targetNode.name
                const path = nodeEditor.removeConnectedTargetLink(link)
                path.remove()
            }
        }
    })
});

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
    gap: 0.6rem;
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

.interface {
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

.primary-btn-c {
    grid-column: 2/3;
}
</style>