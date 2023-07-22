<template>
    <Teleport to="body">
        <div ref="dialog" class="dialog" v-show="isDialogOpen" :style="{ top: dialogTop + 'px', left: dialogLeft + 'px' }">
            <h2>Dialog Content</h2>
            <p>This is the dialog content.</p>

        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';

const dialog = ref()
const isDialogOpen = ref(false);
const dialogLeft = ref(0)
const dialogTop = ref(0)

const props = defineProps({
    position: { type: Object }
})

const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === 'A') {
        event.preventDefault();
        openDialog();
    }
};

const handleMouseOutside = (event) => {
    closeDialog();
};

const openDialog = () => {
    isDialogOpen.value = true;
    dialogLeft.value = props.position.x
    dialogTop.value = props.position.y
    dialog.value.addEventListener('mouseleave', handleMouseOutside);
};

const closeDialog = () => {
    isDialogOpen.value = false;
    dialog.value.removeEventListener('mouseleave', handleMouseOutside);
};

onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown);
    dialog.value.removeEventListener('mouseleave', handleMouseOutside);
});
</script>

<style scoped>
.dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 200px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 20px;
    z-index: 4;
}
</style>