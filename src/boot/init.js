import { boot } from "quasar/wrappers";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Vue imports
import { collection, getDocs } from "@firebase/firestore";
import { defineComponent, ref as vueRef } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyCMsW7vFPmzN4aTotnlXT11DPLQ2N598SQ",
  authDomain: "shop-30ed0.firebaseapp.com",
  projectId: "shop-30ed0",
  storageBucket: "shop-30ed0.appspot.com",
  messagingSenderId: "730792360484",
  appId: "1:730792360484:web:4367399e05a59f3577b6b1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage();

const getDocuments = async () => {
  try {
    const documents = await getDocs(collection(db, "products"));
    return documents;

    // documents.docs.forEach((el) => {
    //   products.value = [
    //     ...products.value,
    //     {
    //       id: el.id,
    //       ...el.data(),
    //     },
    //   ];
    // });
  } catch (err) {
    console.log(err);
  }
};

export default boot(async ({ store }) => {
  // something to do
  await new Promise((resolve) => {
    const stopObverser = onAuthStateChanged(auth, async (_user) => {
      const docs = await getDocuments();
      store.dispatch("products/setProducts", docs);

      resolve();
      stopObverser();
    });
  });
});

export { db, auth, storage };
