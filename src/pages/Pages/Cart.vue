<template>
  <div>
    <q-page padding>
      <p v-if="clearCartMessage">{{ clearCartMessage }}</p>
      <h2 class="q-ma-none">Cart</h2>
      <template v-if="documents.length">
        <Separator :many="3"></Separator>
      </template>

      <q-table
        v-if="documents.length"
        hide-bottom
        title="Cart contents"
        :rows="documents"
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
        row-key="id"
      />

      <template v-if="documents.length">
        <Separator></Separator>
        <div class="row items-center">
          <q-btn
            label="Clear the cart"
            color="primary"
            @click="handleClearCart"
          />
          &nbsp;
          <q-btn label="Buy" color="primary" @click="handleBuy" />
          <p class="q-pa-none q-ml-auto text-h6 text-right">
            Total: {{ getTotal }}$
          </p>
        </div>
      </template>
      <!-- TODO add nothing in the cart -->
      <div v-else>
        <Separator></Separator>
        <p>
          Nothing in the cart
          <router-link to="/">go to the Homepage!</router-link>
        </p>
      </div>
    </q-page>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef, computed } from "vue";

// Vuex imports
import { useStore } from "src/store";

// Vue router imports
import { useRouter } from "vue-router";

// Firestore imports
import {
  addDoc,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "src/boot/init";

// Auth imports
import getUser from "src/composables/getUser";

// Components import
import Separator from "src/components/General/Separator.vue";

// Interfaces imports
import {
  CartProducts,
  CartProductsTotal,
  CartProductsTotalIndexed,
} from "src/components/models";

export default defineComponent({
  name: "Cart",
  components: { Separator },
  setup() {
    const $store = useStore();

    // LOGIC Get documents from store
    const documents = vueRef([]);
    const getDocuments = () => {
      const docs = $store.getters["cart/getCartContents"];
      if (!docs.length) {
        documents.value = [];
        return false;
      }

      // Add quantity of the product bought in the cart
      const reduced = docs.reduce(
        (all: CartProductsTotalIndexed, cur: CartProducts) => {
          if (cur.id in all) {
            all[cur.id] = {
              ...cur.data,
              id: cur.id,
              cartItems: all[cur.id].cartItems + 1,
            };
          } else {
            all[cur.id] = {
              id: cur.id,
              ...cur.data,
              cartItems: 1,
            };
          }
          return all;
        },
        {}
      );

      const reducedArray = <Array<CartProductsTotal>>Object.values(reduced);

      reducedArray.forEach((el: CartProductsTotal) => {
        const newEl = {
          id: el.id,
          name: el.name,
          price: el.price,
          quantity: el.quantity,
          cartItems: el.cartItems,
        };

        documents.value.push(newEl);
      });
    };
    getDocuments();

    // LOGIC get total
    const getTotal = computed(() => {
      if (documents.value.length) {
        const total = documents.value.reduce(
          (acc: number, cur: CartProductsTotal) => {
            if (cur.cartItems > 1) {
              return (acc += cur.price * cur.cartItems);
            } else {
              return (acc += cur.price);
            }
          },
          0
        );

        return total;
      }
    });

    // LOGIC clear cart
    const clearCartMessage = vueRef(null);

    const handleClearCart = async (showMessage = true) => {
      await $store.dispatch("cart/clearCart");
      documents.value = [];
      if (showMessage) {
        clearCartMessage.value = "The cart was cleared";
        setTimeout(() => {
          clearCartMessage.value = "";
        }, 2500);
      }
    };

    const { user } = getUser();
    const router = useRouter();

    // LOGIC buy products
    const handleBuy = async () => {
      try {
        await runTransaction(db, async (transaction) => {
          return Promise.all(
            documents.value.map(async (el) => {
              const documentRef = doc(db, "products", el.id);
              const documentSnap = await transaction.get(documentRef);

              if (!documentSnap.exists()) {
                throw "No such product";
              } else if (documentSnap.data().quantity === 0) {
                throw "No quantity";
              }

              const newQuantity =
                documentSnap.data().quantity - el.cartItems * 1;

              // https://stackoverflow.com/questions/47949573/firestore-transaction-implementing-multiple-gets

              transaction.update(documentRef, {
                quantity: newQuantity,
              });
              return newQuantity;
            })
          );
        });

        // Create timestamp on the documents
        const documentsTimestamp = documents.value.map((document) => {
          return {
            created: serverTimestamp(),
            ...document,
          };
        });
        const d = await addDoc(
          collection(db, "users", user.value.uid, "bought_products"),
          {
            ...documentsTimestamp,
          }
        );
        handleClearCart(false);
        router.push("/");
      } catch (err) {
        console.log(err);
      }
    };

    return {
      documents,
      getTotal,
      handleClearCart,
      clearCartMessage,
      handleBuy,
    };
  },
});
</script>

<style scoped></style>
