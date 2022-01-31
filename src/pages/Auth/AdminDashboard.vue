<template>
  <div>
    <q-page class="bg-grey-4">
      <div class="row">
        <div class="col-md-2">
          <q-scroll-area
            :thumb-style="thumbStyle"
            :content-style="contentStyle"
            :content-active-style="contentActiveStyle"
            style="height: 100vh; max-width: 90%"
          >
            <q-list padding class="rounded-borders text-primary">
              <q-item
                clickable
                v-ripple
                :active="link === 'outbox'"
                @click="link = 'outbox'"
                active-class="my-menu-link"
                :to="{ name: 'AdminDashboardOrders' }"
              >
                <q-item-section avatar>
                  <q-icon name="checklist" />
                </q-item-section>

                <q-item-section>Check orders</q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                :active="link === 'outbox'"
                @click="link = 'outbox'"
                active-class="my-menu-link"
                :to="{ name: 'AdminDashboardFindProduct' }"
              >
                <q-item-section avatar>
                  <q-icon name="search" />
                </q-item-section>

                <q-item-section>Find a product</q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                :active="link === 'outbox'"
                @click="link = 'outbox'"
                active-class="my-menu-link"
                :to="{ name: 'AddProduct' }"
              >
                <q-item-section avatar>
                  <q-icon name="add" />
                </q-item-section>

                <q-item-section>Add product</q-item-section>
              </q-item>

              <q-separator spaced />

              <q-item
                clickable
                v-ripple
                :active="link === 'settings'"
                @click="link = 'settings'"
                active-class="my-menu-link"
              >
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>

                <q-item-section>Settings</q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <div class="col md-8 q-ma-lg q-pa-lg bg-white shadow-2">
          <router-view />
        </div>
      </div>
    </q-page>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef } from "vue";

export default defineComponent({
  name: "AdminDashboard",
  setup(_, context) {
    return {
      // Quasar components props
      contentStyle: {
        backgroundColor: "#fff",
        color: "#555",
      },
      contentActiveStyle: {
        backgroundColor: "#eee",
        color: "black",
      },

      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75,
      },
      link: vueRef("inbox"),
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$emit("closeDrawer", true);
    });
  },
});
</script>

<style scoped lang="scss"></style>
