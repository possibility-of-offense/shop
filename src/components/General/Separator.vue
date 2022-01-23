<template>
  <div>
    <q-separator
      v-for="(v, i) in Array.from({ length: many })"
      :key="i"
      spaced
      color="transparent"
    ></q-separator>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    many: {
      type: Number,
      default: 1,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
