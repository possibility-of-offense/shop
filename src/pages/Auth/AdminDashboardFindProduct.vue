<template>
  <div>
    <q-page padding>
      <h4 class="q-ma-none q-mb-lg">Потърси</h4>
      <q-form class="search-form">
        <q-input
          filled
          type="text"
          @focus="handleFocus"
          v-model="search"
          @keyup="handleSearch"
        />
        <div ref="div">
          <div v-if="foundTerms.length">
            <p
              v-for="(v, i) in foundTerms"
              :key="i"
              class="bg-white q-pa-md shadow-2"
            >
              <router-link
                class="row justify-between items-center"
                :to="{ name: 'SingleProduct', params: { id: v.id } }"
              >
                <span class="text-h6">{{ v.name }} </span>
                <q-img
                  style="width: 140px; height: 140px"
                  ratio="1"
                  :src="v.url"
                ></q-img>
              </router-link>
            </p>
          </div>
        </div>
      </q-form>
    </q-page>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef } from "vue";

// Vuex imports
import { useStore } from "src/store/index";

export default defineComponent({
  setup() {
    const store = useStore();

    const div = vueRef(null);

    const handleFocus = function () {
      div.value.classList.add("show-suggestions");
    };

    const search = vueRef(null);
    const foundTerms = vueRef([]);
    const handleSearch = function (ev: KeyboardEvent) {
      if (ev.code === "ShiftLeft") {
        return;
      }

      // TODO fix the types + the async setting of the Vuex
      foundTerms.value = store.state.products.products.filter(
        (product: any) => {
          if (
            product.name
              .toLowerCase()
              .includes(
                typeof search.value === "string"
                  ? search.value.toLowerCase()
                  : search.value
              )
          ) {
            return product;
          }
        }
      );
    };

    return {
      search,
      div,
      handleFocus,
      handleSearch,
      foundTerms,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-form {
  & > div {
    width: 100%;
    background-color: #ddd;
    padding: 2em;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s;
    border-radius: 0 0 4px 4px;

    &.show-suggestions {
      opacity: 1;
      pointer-events: all;
    }
  }
}
</style>
