<template>
    <div class="default-template-wraper">
        {{ data.options.label || "Value" }}
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        interfaceId: String,
        options: {
            label: String,
        }
    },
})
</script>

<style  scoped>
.default-template-wraper {
    padding: 0.5rem 1rem;
}
</style>