import axios from 'axios'
import { api } from '@/dashboard/entities/services/entities.api'

export default {
  async getEntities (context) {
    try {
      context.commit('fetchEntitiesRequest')

      const entities = await api.getAll()

      context.commit('fetchEntitiesSuccess', { entities })
    } catch (error) {
      context.commit('fetchEntitiesFailure', { error })
    }
  },
  hideModalDel: ({ commit }) => {
    commit('hideModalDelM')
  },
  setItems: ({ commit }) => {
    axios.get('http://localhost:8090/index.php').then((response) => {
      commit('setItems', response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  async saveNewItem ({ dispatch, commit }, payload) {
    await dispatch('saveItem', payload)
    commit('clearCurItem')
  },
  saveItem: ({ commit }, payload) => {
    commit('saveItem', payload)
  },
  deleteItem: ({ commit }, payload) => {
    commit('deleteItem', payload)
  },
  async closeDialog ({ dispatch, commit }) {
    await dispatch('saveNewItem')
    commit('closeDialog')
  },
  openDialog: ({ commit }, payload) => {
    commit('openDialog', payload)
  },
  deleteItemConfirm: (state, payload) => {
    axios.post('http://localhost:8090/index.php', state.desserts[state.editedIndex]).then((response) => {
      state.desserts.splice(state.editedIndex, 1)
      state.dialogDelete = false
      return false
    }).catch(error => {
      console.log('error' + error)
    })
  },
}
