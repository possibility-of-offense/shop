<template>
  <div class="text-center container-max__gridify">
    <div v-for="doc in documents" :key="doc.id">
      <q-card
        class="my-card"
        :class="[doc.data.quantity === 0 ? 'no-stock-card ' : '']"
      >
        <img
          :src="
            doc.data.imgSrc
              ? doc.data.imgSrc
              : 'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80'
          "
        />

        <q-card-section class="remove-bottom-padding">
          <div class="text-h6">{{ doc.data.name }}</div>
          <p class="q-mb-none">
            <span v-if="insertSalePrice(doc)">
              <span class="text-caption">Price: </span>{{ doc.data.salePrice }}$
              <span class="text-caption text-strike">
                {{ doc.data.price }}$</span
              >
            </span>
            <span v-else>
              <span class="text-caption">Price: </span>{{ doc.data.price }}$
            </span>
          </p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            :to="{ name: 'SingleProduct', params: { id: doc.id } }"
            color="primary"
            :label="doc.data.quantity ? `See the product` : 'Out of stock'"
            :class="[doc.data.quantity ? '' : 'cursor-not-allowed	']"
            :disable="doc.data.quantity ? false : true"
            class="see-product"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, PropType, toRef } from "vue";

// Interfaces imports
import { SimpleProduct, SimpleProductRemoveId } from "src/components/models";

// Insert sale price function
function insertSalePrice(d: SimpleProductRemoveId): true | false {
  if (d.data.salePrice) {
    return true;
  } else {
    return false;
  }
}

export default defineComponent({
  props: {
    docs: {
      type: Array as PropType<Array<SimpleProduct>>,
      default: [],
    },
  },
  setup(props) {
    const documents = toRef(props, "docs");

    return {
      documents,
      insertSalePrice,
    };
  },
});
</script>

<style scoped></style>
