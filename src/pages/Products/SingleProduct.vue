<template>
  <q-page padding>
    <div class="container--single-product">
      <div v-if="isBeingAdded">
        <q-bar class="bg-primary text-white shadow-md">
          <div class="cursor-pointer non-selectable">
            {{ document.data.name }} has been added to the cart! Check the cart
            if you want &nbsp;
            <q-btn to="/cart" label="cart" color="white" text-color="black" />
          </div>
        </q-bar>
      </div>
      <br />
      <div class="row" v-if="document">
        <div class="col-md-6">
          <q-chip
            class="glossy"
            color="orange"
            text-color="white"
            icon-right="star"
          >
            This product was seen {{ views }} times
          </q-chip>
          <q-card class="my-card">
            <q-img :src="document.data.imgSrc" :ratio="4 / 3" />
          </q-card>
        </div>
        <div class="col-md-6">
          <q-card flat style="height: 100%">
            <q-card-section>
              <Separator :many="2"></Separator>
              <div class="text-h3">{{ document.data.name }}</div>
              <Separator></Separator>
              <p>Price: {{ document.data.price }}$</p>
              <p>
                Quantity:
                <q-badge color="red">{{ document.data.quantity }}</q-badge>
              </p>
              <div v-html="document.data.description"></div>
              <Separator></Separator>
              <q-card-actions class="q-pa-none" v-if="auth.currentUser">
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
    </div>
  </q-page>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef, toRef } from "vue";

// Vuex imports
import { useStore } from "src/store";

// Components imports
import Separator from "src/components/General/Separator.vue";

// Firestore imports
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "src/boot/init";

// Interfaces imports
import { SimpleProduct } from "src/components/models";
import { useQuasar } from "quasar";

export default defineComponent({
  components: {
    Separator,
  },
  name: "SingleProduct",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  beforeRouteEnter(to) {
    (async function () {
      await addDoc(collection(db, "marketing"), {
        product: {
          id: to.params.id,
        },
        user: {
          id: auth.currentUser.uid,
        },
      });
    })();
  },
  setup(props) {
    // LOGIC get a document
    const document = vueRef<SimpleProduct | null>(null);
    const prop = toRef(props, "id");

    const getDocument = async () => {
      try {
        const docsRefs = await getDocs(
          query(collection(db, "products", prop.value, "additional_info"))
        );
        docsRefs.docs.forEach((d) => {
          const retrieved: SimpleProduct = {
            id: d.id,
            data: {
              name: d.data().basic.name,
              price: d.data().basic.price,
              quantity: d.data().basic.quantity,
              imgSrc: d.data().basic.url,
              description: d.data().description,
            },
          };
          const cartContents = <Array<SimpleProduct> | []>(
            $store.getters["cart/getCartContents"]
          );

          // Lower the quantity
          const found = cartContents.forEach((el: SimpleProduct) => {
            el.id === prop.value && retrieved.data.quantity--;
          });
          console.log(retrieved);

          // Fill document ref
          document.value = { ...retrieved };
        });

        // const docRef = doc(db, "products", prop.value);
        // const docSnap = await getDoc(docRef);

        // if (docSnap.exists()) {
        //   const retrieved: SimpleProduct = {
        //     id: docSnap.id,
        //     data: {
        //       name: docSnap.data().name,
        //       price: docSnap.data().price,
        //       quantity: docSnap.data().quantity,
        //       imgSrc: docSnap.data().url,
        //     },
        //   };

        //   const cartContents = <Array<SimpleProduct> | []>(
        //     $store.getters["cart/getCartContents"]
        //   );

        //   // Lower the quantity
        //   const found = cartContents.forEach((el: SimpleProduct) => {
        //     el.id === prop.value && retrieved.data.quantity--;
        //   });

        //   // Fill document ref
        //   document.value = { ...retrieved };
        // } else {
        //   throw new Error("No such document");
        // }
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

    // LOGIC show views
    const views = vueRef(0);
    const getViews = async () => {
      try {
        onSnapshot(
          query(
            collection(db, "marketing"),
            where("product.id", "==", prop.value)
          ),
          (snap) => {
            views.value = snap.docs.length;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };
    getViews();

    return {
      document,
      handleBuying,
      isBeingAdded,
      auth,
      views,
    };
  },
});
</script>
