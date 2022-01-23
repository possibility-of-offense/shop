<template>
  <q-page padding>
    <div v-if="isBeingAdded">
      <q-bar class="bg-primary text-white shadow-md">
        <div class="cursor-pointer non-selectable">
          {{ document.data.name }} has been added to the cart! Check the cart if
          you want &nbsp;
          <q-btn to="/cart" label="cart" color="white" text-color="black" />
        </div>
      </q-bar>
    </div>
    <br />
    <div class="row" v-if="document">
      <div class="col-md-6">
        <q-card class="my-card">
          <img
            src="https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
          />
        </q-card>
      </div>
      <div class="col-md-6">
        <q-card style="height: 100%">
          <q-card-section>
            <div class="text-h6">{{ document.data.name }}</div>
            <p>{{ document.data.price }}</p>
            <p>Quantity: {{ document.data.quantity }}</p>
            <q-card-actions v-if="auth.currentUser">
              <q-btn
                color="primary"
                label="Buy the product"
                @click="handleBuying"
              />
            </q-card-actions>
            <q-card-actions v-else>
              <p>You should register/sign-in first</p>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef, toRef } from "vue";

// Vuex imports
import { useStore } from "src/store";

// Firestore imports
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "src/boot/init";

// Interfaces imports
import { SimpleProduct } from "src/components/models";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "SingleProduct",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // LOGIC get a document
    const document = vueRef<SimpleProduct | null>(null);
    const prop = toRef(props, "id");

    const getDocument = async () => {
      try {
        const docRef = doc(db, "products", prop.value);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const retrieved: SimpleProduct = {
            id: docSnap.id,
            data: {
              name: docSnap.data().name,
              price: docSnap.data().price,
              quantity: docSnap.data().quantity,
            },
          };

          const cartContents = <Array<SimpleProduct> | []>(
            $store.getters["cart/getCartContents"]
          );

          // Lower the quantity
          const found = cartContents.forEach((el: SimpleProduct) => {
            el.id === prop.value && retrieved.data.quantity--;
          });

          // Fill document ref
          document.value = { ...retrieved };
        } else {
          throw new Error("No such document");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getDocument();

    // LOGIC handle buying
    const $store = useStore();
    const $q = useQuasar();
    const isBeingAdded = vueRef(false);

    const handleBuying = async () => {
      try {
        if (document.value.data.quantity) {
          setTimeout(() => {
            isBeingAdded.value = false;
          }, 4000);
          isBeingAdded.value = true;
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Added to the cart",
          });
          // TODO add some local state
          $store.dispatch("cart/setCartContents", document.value);
        }
      } catch (err) {
        console.log(err);
      }
    };

    return {
      document,
      handleBuying,
      isBeingAdded,
      auth,
    };
  },
});
</script>
