<template>
  <div>
    <h1>Huets Settings</h1>

    <h3>{{ data }}</h3>
  </div>
</template>

<script setup>
const { data } = await useFetch("/api/first");
</script>

<style></style>
