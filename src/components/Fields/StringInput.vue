<template>
    <div class="string-input-wrapper">
        <textarea name="" id="" rows="6" value="" @input="updateCurrentValue" placeholder="Type something here..."
            @focus="nodeEditor.preventZooming = true" @blur="nodeEditor.preventZooming = false">
        </textarea>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { nodeEditor } from "../../stores/nodeEditor.js"

const currentValue = ref('');

const emits = defineEmits();

const updateCurrentValue = (event) => {
    currentValue.value = event.target.value;
    emits('update:modelValue', currentValue.value);
};

</script>

<style scoped>
textarea {
    width: 100%;
    background-color: var(--secondary-color);
    color: var(--tertiary-color);
    padding: 0.5rem;
    user-select: text;
    border-radius: 0.1rem;
    word-break: break-all;
    word-wrap: break-word;
    resize: none;
    border: none;
}
</style>
