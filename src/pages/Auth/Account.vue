<template>
  <div>
    <q-page padding>
      <h4 class="q-ma-none">Hello {{ user.displayName }}</h4>
      <p>You can check your orders</p>
      <Separator :many="3"></Separator>
      <div v-if="orders.length">
        <q-table
          title="Review your orders"
          row-key="name"
          rows-per-page-label="See other orders"
          :rows="orders"
          :columns="[
            {
              name: 'id',
              required: true,
              label: 'ID',
              align: 'left',
              field: (row) => row.id,
              format: (val) => `${val}`,
              sortable: false,
            },
            {
              name: 'name',
              required: true,
              label: 'Name',
              align: 'left',
              field: (row) => row.name,
              format: (val) => `${val}`,
              sortable: false,
            },
            {
              name: 'price',
              required: true,
              label: 'Price',
              align: 'left',
              field: (row) => row.price,
              format: (val) => `${val}`,
              sortable: false,
            },
            {
              name: 'quantity',
              required: true,
              label: 'Quantity',
              align: 'left',
              field: (row) => row.cartItems,
              format: (val) => `${val}`,
              sortable: false,
            },
          ]"
        />
      </div>
      <div v-else>
        <q-skeleton v-if="isLoading" height="350px" />
        <template v-else>
          <q-card class="my-card">
            <q-card-section>
              Nothing ordered yet! You can order by going to
              <router-link to="/">the Homepage!</router-link>
            </q-card-section>
          </q-card>
        </template>
      </div>
    </q-page>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef } from "vue";

// Firestore imports
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "src/boot/init";

// Auth imports
import getUser from "src/composables/getUser";

// Components import
import Separator from "src/components/General/Separator.vue";

export default defineComponent({
  name: "Account",
  components: {
    Separator,
  },
  setup() {
    const orders = vueRef([]);
    const { user } = getUser();

    const isLoading = vueRef<true | false>(false);

    // LOGIC get orders
    const getOrders = async () => {
      isLoading.value = true;
      try {
        const documents = await getDocs(
          query(collection(db, "users", user.value.uid, "bought_products"))
        );

        if (!documents.docs.length) {
          isLoading.value = false;
        }

        documents.docs.forEach((d) => {
          if (d.exists()) {
            const entr = Object.values(d.data());
            let empt = {};
            entr.forEach((el) => {
              if (el.name) {
                empt = { name: el.name, ...el };
              }
            });
            orders.value.push(empt);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
    getOrders();

    return {
      orders,
      user,
      isLoading,
    };
  },
});
</script>

<style scoped></style>
