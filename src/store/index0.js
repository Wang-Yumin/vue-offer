// index.js 是vuex基础文件
import Vue from 'vue'
import Vuex from 'vuex'
// 引入核心模块
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)
// 初始化，并暴露全局
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})