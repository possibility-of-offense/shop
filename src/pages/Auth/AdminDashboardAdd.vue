<template>
  <q-page padding>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        filled
        v-model="name"
        label="Name of the product*"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        type="number"
        v-model.number="price"
        label="Price of the product*"
        lazy-rules
        :rules="[
          (val) =>
            (val && typeof val === 'number') ||
            'Please type something (should be a number)',
        ]"
      />
      <q-input
        filled
        type="number"
        v-model.number="quantity"
        label="Quantity of the product*"
        lazy-rules
        :rules="[
          (val) =>
            (val && typeof val === 'number') ||
            'Please type something (should be a number)',
        ]"
      />
      <q-file outlined v-model="filePicker">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
      <q-btn label="Add" type="submit" color="primary" />
    </q-form>
  </q-page>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef } from "vue";

// Storage imports
import { storage } from "src/boot/init";
import { ref, uploadBytes } from "firebase/storage";

export default defineComponent({
  name: "AdminDashboardAdd",
  setup() {
    const name = vueRef(null);
    const price = vueRef(null);
    const quantity = vueRef(null);
    const filePicker = vueRef(null);

    // LOGIC Submit form

    const onSubmit = async function () {
      try {
        const productImageRef = ref(storage, name.value);

        uploadBytes(productImageRef, filePicker.value).then((snap) => {
          console.log(snap);
        });
      } catch (err) {
        console.log(err);
      }
    };

    return {
      name,
      price,
      quantity,
      filePicker,
      onSubmit,
    };
  },
});
</script>

<style scoped></style>
