import Vue from 'vue'
import Vuex from 'vuex'

import dashboard from '@/dashboard/store'
import ui from '@/store/ui'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    ui,
    dashboard,
  },
})

export default store
