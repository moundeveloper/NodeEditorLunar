<template>
    <div class="array-wraper">
        <FieldWraper v-for="(subInterface, i) in data.options.subInterfaces" :field="{
            fieldName: subInterface.component,
            data: {
                interface: subInterface,
                options: subInterface.options
            }, updateHandler:
                handleUpdatedValue
        }" :key="i" />

        <button class="delete-interface-btn" @click="deleteArrayInterface()">
            <img src="../../assets/icons/delete.svg" alt="">
        </button>
    </div>
</template>

<script setup>
import { InterfaceC } from '../../classes/Interface';

const props = defineProps({
    data: {
        interface: InterfaceC,
        options: {
            label: String,
            subInterfaces: Array[InterfaceC]
        }
    },
    updateHandler: Function
})

const currentState = reactive({
    interfaceType: "number",
    interfaceComponent: "NumberInput"
})

/* 
const interfaceType = ref(props.data.interface.type) */

const handleUpdatedValue = ({ value }) => {
    props.interface.setInterfaceValue(value)
}

/* const handleUpdatedOutputType = ({ value }) => {
    console.log(value)
    props.node.setCurrentState(value)
} */

/* const deleteArrayInterface = () => {
    const node = nodeEditor.nodes.find(node => node.inputs.find(input => input.id === props.interface.id))
    const state = node.getStateByType("array")
    state.inputs = state.inputs.filter(input => input.id !== props.interface.id)
    node.setCurrentState("array")
    console.log(node.getStateByType("array"))
} */

watchEffect(() => {
    // Update node properties
    /* props.interface.setInterfaceType(interfaceType.value) */
})

</script>

<style scoped>
.drop-down {
    margin-bottom: 1rem;
}

.array-wraper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.delete-interface-btn {
    font-size: .7rem;
    position: absolute;
    top: 0.75rem;
    right: -0.85rem;
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--tertiary-color);
    cursor: pointer;
}
</style>