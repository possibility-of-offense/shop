<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title shrink> Shop </q-toolbar-title>

        <q-btn
          v-if="!user"
          color="primary"
          glossy
          label="Log In"
          :to="{ name: 'Login' }"
        />
        &nbsp; &nbsp; &nbsp;
        <q-btn
          v-if="user"
          color="primary"
          glossy
          label="Log Out"
          @click="logout"
        ></q-btn>
        <q-btn
          v-if="!user"
          color="primary"
          glossy
          label="Sign In"
          :to="{ name: 'Signin' }"
        />

        <div class="q-ml-auto row items-center">
          <p class="q-ma-none" v-if="currentUser">Hello {{ currentUser }}</p>
          <template v-if="user && user.uid === 'xhl8kAFG3wPttsaRWh92qCIGDHQ2'">
            &nbsp; &nbsp;
            <q-btn
              color="yellow"
              text-color="black"
              clickable
              to="/admin-dashboard"
            >
              <q-item-section>
                <q-item-label>Admin Dashboard</q-item-label>
              </q-item-section>
            </q-btn>
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Links </q-item-label>

        <EssentialLink />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from "components/EssentialLink.vue";

import { defineComponent, ref as vueRef, watch } from "vue";
import { useQuasar } from "quasar";

// Vue router imports
import { useRouter } from "vue-router";

// Auth imports
import getUser from "src/composables/getUser";

// Import composable
import { error, logoutFn } from "src/composables/logout";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = vueRef(false);

    const router = useRouter();
    const $q = useQuasar();

    // LOGIC show current user
    const { user } = getUser();
    const currentUser = vueRef<string | null>(null);

    watch(
      user,
      () => {
        if (user.value) {
          currentUser.value = user.value.displayName;
        } else {
          currentUser.value = "";
        }
      },
      { immediate: true }
    );

    // LOGIC logout function
    const logout = async () => {
      await logoutFn();
      router.push("/");
      $q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message: "You sign out",
      });
    };

    return {
      leftDrawerOpen,
      // LOGIC Toggle the drawer
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      user,
      currentUser,
      logout,
      error,
    };
  },
});
</script>
