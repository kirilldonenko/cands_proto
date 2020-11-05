import state from '@/dashboard/entities/store/entities.state'
import getters from '@/dashboard/entities/store/entities.getters'
import actions from '@/dashboard/entities/store/entities.actions'
import mutations from '@/dashboard/entities/store/entities.mutations'

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true,
}
