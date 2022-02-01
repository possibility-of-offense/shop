<template>
  <q-page padding>
    <div class="container-max">
      <h2 class="q-ma-none">Welcome to our shop</h2>
    </div>
    <Separator :many="2"></Separator>

    <template v-if="isLoading">
      <template v-if="!docs.length">
        <div class="container-max__gridify">
          <q-skeleton
            v-for="(v, i) in Array.from({ length: 9 })"
            :key="i"
            height="350px"
          />
        </div>
      </template>
      <template v-else>
        <ProductsGrid :docs="docs"></ProductsGrid>
        <div class="row justify-center q-mt-lg">
          <Pagination></Pagination>
        </div>
      </template>
    </template>
  </q-page>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef, computed, toRefs, watch } from "vue";

// Firestore imports
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { db } from "src/boot/init";

// Interfaces imports
import { SimpleProduct } from "src/components/models";

// Components imports
import Separator from "src/components/General/Separator.vue";
import ProductsGrid from "src/components/Shop/ProductsGrid.vue";
import Pagination from "src/components/Shop/Pagination.vue";

// Vue-router imports
import { useRoute } from "vue-router";

// Vuex imports
import { useStore } from "src/store";

export default defineComponent({
  components: { ProductsGrid, Pagination, Separator },
  name: "Index",
  setup() {
    const docs = vueRef<Array<SimpleProduct>>([]);
    const isLoading = vueRef<boolean>(false);
    const route = useRoute();
    const store = useStore();

    const pageProp = toRefs(route);

    const lastVisibleSnap = computed(() => {
      const b =
        store.state.products.products[
          pageProp.query.value.page
            ? Number(pageProp.query.value.page) * 2 - 1
            : 0
        ];
      console.log(b);

      return b;
    });

    // LOGIC get documents
    const getDocuments = async (): Promise<void> => {
      docs.value = [];
      try {
        isLoading.value = true;

        const docSnap = await getDoc(
          doc(
            db,
            `products/${
              store.state.products.products[
                pageProp.query.value.page
                  ? Number(pageProp.query.value.page) * 2 - 2
                  : 0
              ].id
            }`
          )
        );

        const querySnapshot = await getDocs(
          query(
            collection(db, "products"),
            orderBy("created"),
            limit(2),
            startAt(docSnap)
          )
        );

        querySnapshot.forEach((doc): void => {
          const obj: SimpleProduct = {
            id: doc.id,
            data: {
              name: doc.data().name,
              price: doc.data().price,
              salePrice: doc.data().salePrice ? doc.data().salePrice : null,
              quantity: doc.data().quantity,
              imgSrc: doc.data().url ? doc.data().url : null,
            },
          };
          docs.value.push(obj);
        });
      } catch (err) {
        console.log(err);
      }
    };

    getDocuments();

    watch(pageProp.query, async () => {
      await getDocuments();
    });

    return {
      docs,
      isLoading,
      lastVisibleSnap,
      pageProp,
    };
  },
});
</script>
