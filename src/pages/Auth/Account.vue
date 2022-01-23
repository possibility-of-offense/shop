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
              field: (row) => row.price + '$',
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
            {
              name: 'created',
              required: true,
              label: 'Created On:',
              align: 'left',
              field: (row) => row.created,
              format: (val) => `${val}`,
              sortable: false,
            },
          ]"
        >
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <router-link
                :to="{ name: 'SingleProduct', params: { id: props.value } }"
              >
                <q-badge :label="props.value" />
              </router-link>
            </q-td>
          </template>
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <q-badge color="blue" :label="props.value" />
            </q-td>
          </template>
        </q-table>
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

            console.log(entr);

            // let empt = {};
            entr.forEach((el) => {
              const buyingDate = new Date(el.created.seconds * 1000);

              if (el.name) {
                const empt = {
                  ...el,
                  name: el.name,
                  created: `${
                    buyingDate.getMonth() + 1
                  }/${buyingDate.getDate()}/${buyingDate.getFullYear()} - ${buyingDate.getHours()}:${buyingDate.getMinutes()}`,
                };
                orders.value.push(empt);
              }
            });
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
