import Vue from 'vue'
import Vuex from 'vuex'
import { getStorage, setStorage } from '@/utils/storage.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getStorage('user')
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      setStorage('user', user)
    }
  },
  actions: {

  }
})
