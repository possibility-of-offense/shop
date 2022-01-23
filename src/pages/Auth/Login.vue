<template>
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
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
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
</template>

<script lang="ts">
import { useQuasar } from "quasar";

// Vue imports
import { ref as vueRef } from "vue";

// Vue router
import { useRouter } from "vue-router";

// Auth imports
import { auth } from "boot/init.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  name: "LogIn",
  setup() {
    const $q = useQuasar();

    const email = vueRef<string | null>("ultimatemeaning90@gmail.com");
    const password = vueRef<string | null>("ventsi1234");

    const router = useRouter();

    return {
      email,
      password,

      // LOGIC Submit function
      onSubmit() {
        if (email.value && password.value) {
          signInWithEmailAndPassword(auth, email.value, password.value)
            .then(() => {
              router.push("/");
            })
            .catch((err) => {
              if (err.code === "auth/user-not-found") {
                alert("You have typed something wrong");
              }
            });

          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Submitted",
          });
        } else {
          $q.notify({
            color: "red",
            textColor: "white",
            icon: "thumb_down_alt",
            message: "Fill the fields",
          });
        }
      },
      // LOGIC Reset function
      onReset() {
        email.value = null;
        password.value = null;
      },
    };
  },
};
</script>
