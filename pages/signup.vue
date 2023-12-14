<script setup></script>

<script>
import { ref } from "vue";
import SignUp from "~/components/SignUp/SignUp.vue";

definePageMeta({
  //   layout: "product",
});

export default {
  components: {
    SignUp,
  },
  setup() {
    const count = ref(0);

    // expose to template and other options API hooks
    return {
      count,
    };
  },

  mounted() {
    console.log(this.count); // 0
  },
};
</script>

<template>
  <div>
    <sign-up />
  </div>
</template>

<style></style>
