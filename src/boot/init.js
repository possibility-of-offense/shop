import { boot } from "quasar/wrappers";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

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

export default boot(async ({ store }) => {
  // something to do
  await new Promise((resolve) => {
    // const docs = await getDocuments();
    // store.dispatch("products/setProducts", docs);

    const stopObverser = onAuthStateChanged(auth, (_user) => {
      resolve();
      stopObverser();
    });
  });
});

export { db, auth, storage };
