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
      </template>
    </template>
  </q-page>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef } from "vue";

// Firestore imports
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "src/boot/init";

// Interfaces imports
import { SimpleProduct } from "src/components/models";

// Components imports
import Separator from "src/components/General/Separator.vue";
import ProductsGrid from "src/components/Shop/ProductsGrid.vue";

export default defineComponent({
  components: { ProductsGrid, Separator },
  name: "Index",
  setup() {
    const docs = vueRef<Array<SimpleProduct>>([]);
    const isLoading = vueRef<boolean>(false);

    // LOGIC get documents
    const getDocuments = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const querySnapshot = await getDocs(
          query(
            collection(db, "products"),
            limit(10),
            orderBy("created", "desc")
          )
        );

        querySnapshot.forEach((doc): SimpleProduct[] => {
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

          return (docs.value = [...docs.value, obj]);
        });
      } catch (err) {
        console.log(err);
      }
    };

    getDocuments();

    return {
      docs,
      isLoading,
    };
  },
});
</script>
