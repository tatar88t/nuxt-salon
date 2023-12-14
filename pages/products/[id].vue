<template>
  <div>
    <h1>PRODUCT BY ID {{ id }}</h1>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "product",
});
onMounted(() => console.log("je mounted"));
const { id } = useRoute().params;
</script>

<style></style>
