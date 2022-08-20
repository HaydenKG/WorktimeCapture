<script setup>
</script>

<template>
    <div id="information">
        Your times are saved locally in your browsers storage.
        No data is leaving your PC.
        The times you enter are saved automatically.
        So even if you lose internet conenction or close the browser it is saved.
        <button :disabled="true">Export</button>
    </div>
</template>

<style scoped>
    #information{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 60%;
    }
</style>