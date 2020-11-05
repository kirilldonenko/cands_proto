export default {
  items (state) {
    return state.entities
  },
  totalItems (_state, getters) {
    return getters.items ? getters.items.length : 0
  },
}
