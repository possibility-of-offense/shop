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
                :to="{ name: 'AdminDashboard' }"
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
                :to="{ name: 'AdminDashboardAdd' }"
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
          <h6 class="q-ma-none">
            Hello {{ user.displayName }}! Here are the orders:
          </h6>
          <Separator></Separator>
          <q-list v-if="documents.length">
            <q-item
              dense
              v-for="(document, index) in documents"
              :key="index"
              class="q-pa-none cursor-pointer"
            >
              <q-item-section
                v-for="doc in document.products"
                :key="doc.id"
                class="row justify-between q-pa-sm order-hover order-border"
                :class="[
                  Object.values(document.products).length === 1
                    ? 'col-12'
                    : `col-${12 / Object.values(document.products).length}`,
                ]"
              >
                <router-link
                  class="order-remove-link-styling"
                  :to="{ name: 'SingleProduct', params: { id: doc.id } }"
                >
                  <q-item-section>
                    <q-item-label>{{ doc.name }}</q-item-label>
                    <q-item-label caption lines="2"
                      >Price: {{ doc.price }}$</q-item-label
                    >
                    <q-item-label caption>
                      Quantity: {{ doc.cartItems }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption
                      >{{ formatTime(document.created) }}
                      <p v-if="document.user">{{ document.user }}</p>
                    </q-item-label>
                  </q-item-section>
                </router-link>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, watchEffect, ref as vueRef } from "vue";

// Auth imports
import getUser from "src/composables/getUser";

// Components imports
import Separator from "src/components/General/Separator.vue";

// Firestore imports
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "src/boot/init";

// Interfaces imports
import { ServerTimeStampProperties } from "src/components/models";

function formatTime(el: ServerTimeStampProperties): string | null | void {
  const buyingDate = new Date(el.seconds * 1000);
  return `${
    buyingDate.getMonth() + 1
  }/${buyingDate.getDate()}/${buyingDate.getFullYear()} - ${buyingDate.getHours()}:${buyingDate.getMinutes()}`;
}

export default defineComponent({
  name: "AdminDashboard",
  components: {
    Separator,
  },
  setup(_, context) {
    const { user } = getUser();

    // Get orders
    // TODO fix type
    const documents = vueRef<Array<any>>([]);
    const getDocuments = async () => {
      const col = collection(db, "orders");
      try {
        const unsub = onSnapshot(
          query(col, orderBy("created", "desc")),
          (snap) => {
            snap.docs.forEach((d: any) => {
              if (d.exists()) {
                documents.value = [...documents.value, d.data()];
              }
            });
          }
        );

        watchEffect((onInvalidate) => {
          onInvalidate(() => unsub());
        });
      } catch (err) {
        console.log(err);
      }
    };
    getDocuments();

    return {
      user,
      documents,
      formatTime,
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

<style scoped lang="scss">
.order-hover {
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: rgba($primary, 0.4);
  }
}
.order-border {
  border: 1px solid #ddd;
  margin: 0 !important;
}
.order-remove-link-styling {
  text-decoration: none;
  color: inherit;
  @media (min-width: 1024px) {
    & {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
