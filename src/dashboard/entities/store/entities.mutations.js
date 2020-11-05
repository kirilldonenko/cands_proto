import axios from 'axios'

export default {
  // fetch entities
  fetchEntitiesRequest (state) {
    state.loading = true
  },
  fetchEntitiesSuccess (state, { entities }) {
    state.entities = entities
    state.error = null
    state.loading = false
  },
  fetchEntitiesFailure (state, { error }) {
    state.entities = {}
    state.error = error
    state.loading = false
  },

  hideModalM (state, payload) {
    state.curItem = Object.assign({}, state.defaultItem)
    state.editedIndex = -1
    state.dialog = payload
  },
  hideModalDelM (state, payload) {
    state.dialogDelete = payload
  },
  setItems: (state, payload) => {
    state.entities = payload
  },
  deleteItem: (state, payload) => {
    state.editedIndex = state.entities.indexOf(payload)
    state.editedItem = Object.assign({}, payload)
    state.dialogDelete = true
  },
  openDialog: (state, payload) => {
    state.editedIndex = state.entities.indexOf(payload)
    state.curItem = Object.assign({}, payload)
    state.dialog = true
  },
  saveItem: (state, payload) => {
    axios.post('http://localhost:8090/index.php', payload).then((response) => {
      if (state.editedIndex > -1) {
        Object.assign(state.entities[state.editedIndex], payload)
      } else {
        state.entities.push(payload)
      }
      state.curItem = Object.assign({}, state.defaultItem)
      state.editedIndex = -1
      state.dialog = false
      return false
    }).catch(error => {
      console.log('error' + error)
    })
  },
  clearCurItem: (state) => {
    state.curItem = state.defaultItem
  },

}
