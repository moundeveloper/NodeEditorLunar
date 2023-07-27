<template>
    <div class="node-header">
        <img src="../assets/icons/variable-icon.svg" alt="">
        <span>{{ nodeData.name }}</span>
        <img src="../assets/icons/edit-icon.svg" alt="">
    </div>

    <div v-for="output in nodeData.outputs" class="node-field right-field">
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

    <div v-for="input in nodeData.inputs" class="node-field left-field">
        <div :id="input.id" class="controll-point in"></div>
        <div class="field ">
            <NumberInput />
            <!-- <span>{{ input.type }}</span> -->
        </div>
    </div>
</template>

<script setup>
import DropDown from '../Fields/DropDown.vue';
import NumberInput from '../Fields/NumberInput.vue';

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

const props = defineProps({
    nodeData: Object
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
    color: #232323;
    font-weight: 600;
    user-select: none;
    pointer-events: none;
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
</style>