<template>
  <div>
    <q-pagination
      v-model="current"
      color="black"
      :max="Math.ceil(maxPages / 2)"
      :boundary-numbers="false"
      :to-fn="(page) => ({ query: { page } })"
      direction-links
    />
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef, computed, watch, toRefs } from "vue";

// Vuex imports
import { useStore } from "src/store/index";

// Vue router imports
import { useRoute } from "vue-router";

export default defineComponent({
  setup(_) {
    const store = useStore();
    const route = useRoute();
    const current = vueRef(1);

    const queryProp = toRefs(route);

    const maxPages = computed(() => {
      return store.state.products.products.length;
    });

    watch(
      queryProp.query,
      () => {
        current.value = queryProp.query.value.page
          ? Number(queryProp.query.value.page)
          : 1;
      },
      { immediate: true }
    );

    return {
      current,
      maxPages,
    };
  },
});
</script>

<style scoped></style>
