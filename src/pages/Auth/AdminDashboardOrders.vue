<template>
  <div>
    <q-page padding>
      <h6 class="q-ma-none">
        <!-- TODO add fallback content -->
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
    </q-page>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef, watchEffect } from "vue";

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
  components: {
    Separator,
  },
  setup() {
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
    };
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
