import Vue from 'vue'
import Vuex from 'vuex'
// vuex 插件自动存储在本地
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {}
  },
  getters: {
    username: state => state.userInfo.username,
    nickname: state => state.userInfo.nickname,
    user_pic: state => state.userInfo.user_pic
  },
  mutations: {
    // 设置token
    updateToken (state, val) {
      state.token = val
    },
    // 设置用户信息
    updateUserInfo (state, val) {
      state.userInfo = val
    }
  },
  actions: {
    async getUserInfoActions (store) {
      const res = await getUserInfoAPI()
      // console.log(res)
      store.commit('updateUserInfo', res.data.data)
    }
  },
  modules: {
  },
  // 配置为 vuex 的插件
  plugins: [createPersistedState()]
})
