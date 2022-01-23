<template>
  <div>
    <q-page padding>
      <div class="q-pa-md" style="max-width: 400px">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            type="email"
            v-model="email"
            label="Your email *"
            hint="Type your email here"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="Your password *"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 8) ||
                'Please type your password (should be more than 8 characters long)',
            ]"
          />

          <q-input
            filled
            type="text"
            v-model="username"
            label="Your username *"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 4) ||
                'Please type your username (should be more than 4 characters long)',
            ]"
          />

          <div>
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
      </div>
    </q-page>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, ref as vueRef } from "vue";

// Auth imports
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// Vue-router imports
import { useRouter } from "vue-router";
import { auth, db } from "src/boot/init";

// Firestore imports
import { doc, addDoc, collection, setDoc } from "firebase/firestore";

export default defineComponent({
  setup() {
    const email = vueRef<string | null>(null);
    const password = vueRef<string | null>(null);
    const username = vueRef<string | null>(null);

    const router = useRouter();

    // LOGIC submit
    const onSubmit = async () => {
      try {
        if (!email.value || !password.value) {
          throw new Error("Fill the fields");
        } else {
          createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((user) => {
              console.log(user);

              updateProfile(auth.currentUser, {
                displayName: username.value,
              }).then(async () => {
                await setDoc(doc(db, "users", user.user.uid), {
                  id: user.user.uid,
                  name: user.user.displayName,
                });
                router.push("/");
              });
            })
            .catch((err) => {
              throw new Error(err);
            });
        }
      } catch (err) {
        console.log(err);
      }
    };

    // LOGIC reset
    const onReset = () => {
      email.value = password.value = null;
    };

    return {
      email,
      password,
      username,
      onSubmit,
      onReset,
    };
  },
});
</script>

<style scoped></style>
