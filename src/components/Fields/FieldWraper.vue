<template>
    <Field />
</template>

<script setup>
import NumberInput from './NumberInput.vue';
import DropDown from './DropDown.vue';
import TextInput from './TextInput.vue';
import DefaultTemplate from './DefaultTemplate.vue';
import ArrayItem from './ArrayItem.vue';

const props = defineProps({ field: Object });

const Field = () => {
    const fieldName = props.field.fieldName

    switch (fieldName) {
        case 'NumberInput':
            return createHField(NumberInput, props.field);
            break;
        case 'DropDown':
            return createHField(DropDown, props.field);
            break;
        case 'TextInput':
            return createHField(TextInput, props.field);
            break;
        case "DefaultTemplate":
            return createHField(DefaultTemplate, props.field);
            break;
        case "ArrayItem":
            return createHField(ArrayItem, props.field);
            break;
        default:
            console.warn(`Unknown field name: ${fieldName}`);
            break;
    }
}

</script>