export function SET_PRODUCTS(state, payload) {
  payload.docs.forEach((el) => {
    state.products.push({
      id: el.id,
      ...el.data(),
    });
  });
}
