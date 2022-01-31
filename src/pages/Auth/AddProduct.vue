<template>
  <div>
    <q-page padding>
      <h4>Add Product</h4>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md container-narrow"
      >
        <q-input
          filled
          v-model="name"
          label="Product name *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          filled
          type="number"
          v-model="price"
          label="Product price *"
          lazy-rules
          :rules="[
            (val) =>
              (val && val > 0) || 'Please type something position more than 0',
          ]"
        />
        <q-input
          filled
          type="number"
          v-model="quantity"
          label="Product quantity *"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Please type something position more than 0',
          ]"
        />
        <q-file v-model="img" label="Pick one file" filled />

        <div>
          <q-spinner-cube v-if="showSpinner" color="orange" size="5.5em" />
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-page>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef } from "vue";

// Firestore imports
import { db } from "src/boot/init";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";

// Storage imports
import { storage } from "src/boot/init.js";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";

// Vue router imports
import { useRouter } from "vue-router";

export default defineComponent({
  setup(_, context) {
    const showSpinner = vueRef(false);
    const router = useRouter();

    const name = vueRef(null);
    const price = vueRef(null);
    const quantity = vueRef(null);
    const img = vueRef(null);

    context.emit("toggleDrawer", true);

    const onSubmit = async () => {
      showSpinner.value = true;
      try {
        const added = await addDoc(collection(db, "products"), {
          name: name.value,
          price: price.value,
          quantity: quantity.value,
          created: serverTimestamp(),
        });

        const imgReference = ref(
          storage,
          `products/${added.id}/${img.value.name}`
        );
        uploadBytes(imgReference, img.value).then((snap) => {
          getDownloadURL(imgReference).then(async (url) => {
            await updateDoc(added, {
              url: url,
            });

            showSpinner.value = false;
            router.push("/");
          });
        });
      } catch (err) {
        console.log(err);
        showSpinner.value = false;
      }
    };

    return {
      onSubmit,
      onReset() {
        name.value = null;
        price.value = null;
        quantity.value = null;
        img.value = null;
      },
      name,
      price,
      quantity,
      img,
      showSpinner,
    };
  },
});
</script>

<style scoped></style>
