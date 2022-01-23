import { ref as vueRef } from "vue";

import { auth } from "src/boot/init";
import { signOut } from "firebase/auth";

const error = vueRef(null);

const logoutFn = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    error.value = err;
  }
};

export { error, logoutFn };
