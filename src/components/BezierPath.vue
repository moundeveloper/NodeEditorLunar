<template>
    <div>
        <svg @mousemove="updatePath" @mouseup="resetPath" ref="svg"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            <path :d="path" :stroke="color" stroke-width="2" fill="transparent" />
        </svg>
        <button @mousedown="startPath">Click me!</button>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const svgRef = ref(null);
const pathData = reactive({ x1: 0, y1: 0, x2: 0, y2: 0 });
const path = ref('');
const isDrawing = ref(false);
const color = ref('black');

function startPath() {
    isDrawing.value = true;
    color.value = getRandomColor();
    const { width, height, top, left } = svgRef.value.getBoundingClientRect();
    pathData.x1 = pathData.x2 = width / 2 + left;
    pathData.y1 = pathData.y2 = height / 2 + top;
}

function updatePath(event) {
    if (isDrawing.value) {
        pathData.x2 = event.pageX;
        pathData.y2 = event.pageY;
        path.value = `M${pathData.x1},${pathData.y1} Q${pathData.x1},${pathData.y1} ${pathData.x2},${pathData.y2}`;
    }
}

function resetPath() {
    isDrawing.value = false;
    path.value = '';
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

onMounted(() => {
    document.addEventListener('mouseup', resetPath);
});
</script>
