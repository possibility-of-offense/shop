<template>
  <div>
    <q-page padding>
      <h4 class="q-ma-none">Hello Admin</h4>
      <Separator :many="2"></Separator>

      <q-list v-if="documents.length">
        <q-item
          :to="{ name: '' }"
          v-for="(document, index) in documents"
          :key="index"
        >
          <q-list
            bordered
            v-for="doc in document"
            :key="doc.id"
            class="row justify-between q-pa-md order-hover"
            :class="[
              Object.values(document).length === 1
                ? 'col-12'
                : `col-${12 / Object.values(document).length}`,
            ]"
          >
            <q-item-section>
              <q-item-label>{{ doc.name }}</q-item-label>
              <q-item-label caption lines="2"
                >Price: {{ doc.price }}$</q-item-label
              >
              <q-item-label caption>
                Quantity: {{ doc.quantity }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{ formatTime(doc.created) }}</q-item-label>
            </q-item-section>
          </q-list>
        </q-item>
      </q-list>
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
import { collection, onSnapshot, query } from "@firebase/firestore";
import { db } from "src/boot/init";

// Interfaces imports
import { ServerTimeStampProperties } from "src/components/models";

function formatTime(el: ServerTimeStampProperties): string | null | void {
  console.log(el);

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
  setup() {
    const { user } = getUser();

    // Get orders
    // TODO fix type
    const documents = vueRef<Array<any>>([]);
    const getDocuments = async () => {
      try {
        const unsub = onSnapshot(query(collection(db, "orders")), (snap) => {
          snap.docs.forEach((d: any) => {
            if (d.exists()) {
              documents.value = [...documents.value, d.data()];
            }
          });
        });

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
</style>
