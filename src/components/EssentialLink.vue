<template>
  <q-item clickable to="/">
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Home</q-item-label>
    </q-item-section>
  </q-item>

  <q-item clickable to="/my-account" v-if="isUser">
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
      <q-item-label>Cart Page</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, computed } from "vue";

// Auth imports
import getUser from "src/composables/getUser";

export default defineComponent({
  name: "EssentialLink",
  setup() {
    const { user } = getUser();
    const isUser = computed(() => {
      if (user.value) {
        return true;
      }
    });

    return {
      isUser,
    };
  },
});
</script>
