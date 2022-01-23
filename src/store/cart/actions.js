export function setCartContents({ commit }, payload) {
  commit("SET_CART_CONTENTS", payload);
}

export function clearCart({ commit }) {
  commit("CLEAR_CART");
}
