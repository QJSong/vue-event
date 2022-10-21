import Vue from 'vue'
import Vuex from 'vuex'
// vuex 插件自动存储在本地
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  getters: {
  },
  mutations: {
    updateToken (state, val) {
      state.token = val
    }
  },
  // 配置为 vuex 的插件
  plugins: [createPersistedState()],

  actions: {
  },
  modules: {
  }
})
