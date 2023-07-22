<template>
    <div class="cp" @click="startPath"></div>
</template>

<script setup>
import { ref } from 'vue';
const posX = ref(0)
const posY = ref(0)

const props = defineProps({
    startPath: {
        type: Function
    }
})

const clickHandler = (event) => {
    console.log(event)
    props.startPath(event)
}

</script>

<style scoped>
.cp {
    width: 4rem;
    aspect-ratio: 1;
    background-color: whitesmoke;
    border-radius: 50%;
}
</style>