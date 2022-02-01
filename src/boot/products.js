import { boot } from "quasar/wrappers";

// Vue imports
import { collection, getDocs, orderBy, query } from "@firebase/firestore";

// Firestore imports
import { db } from "./init";

export default boot(async ({ store }) => {
  try {
    const documents = await getDocs(
      query(collection(db, "products"), orderBy("created"))
    );
    store.dispatch("products/setProducts", documents);
  } catch (err) {
    console.log(err);
  }
});
