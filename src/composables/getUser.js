import { ref as vueRef } from "vue";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "src/boot/init";

const user = vueRef(auth.currentUser);

const getUser = () => {
  onAuthStateChanged(auth, (_user) => {
    if (auth.currentUser) {
      if (!user.value) {
        user.value = _user;
      }
    } else {
      user.value = null;
    }
  });

  return { user };
};

export default getUser;
