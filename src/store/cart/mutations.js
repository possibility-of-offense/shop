export function SET_CART_CONTENTS(state, payload) {
  payload.data.quantity--;
  state.cartContents.push(payload);
}

export function CLEAR_CART(state) {
  while (state.cartContents.length) {
    state.cartContents.pop();
  }
}
