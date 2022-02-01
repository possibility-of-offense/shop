<template>
  <q-item clickable to="/">
    <q-item-section avatar>
      <q-icon name="home" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Home</q-item-label>
    </q-item-section>
  </q-item>

  <q-item clickable to="/my-account" v-if="user">
    <q-item-section avatar>
      <q-icon name="person" />
    </q-item-section>

    <q-item-section>
      <q-item-label>My Account</q-item-label>
    </q-item-section>
  </q-item>
  <q-item clickable to="/cart">
    <q-item-section avatar>
      <q-icon name="shopping_cart" />
    </q-item-section>

    <q-item-section>
      <div class="row items-center">
        <q-item-label>Cart Page</q-item-label>

        <q-btn
          dense
          color="purple"
          round
          icon="shopping_basket"
          class="q-ml-md"
        >
          <q-badge color="red" floating>{{ getCartNumbers.length }}</q-badge>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, computed } from "vue";

// Auth imports
import getUser from "src/composables/getUser";

// Vuex imports
import { useStore } from "src/store";

export default defineComponent({
  name: "EssentialLink",
  setup() {
    const { user } = getUser();
    const store = useStore();

    const getCartNumbers = computed(() => {
      return store.getters["cart/getCartContents"];
    });

    return {
      user,
      getCartNumbers,
    };
  },
});
</script>
