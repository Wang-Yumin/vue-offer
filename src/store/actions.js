// Action: 通过操作mutation间接更新state的多个方法的对象
import { reqUserInfo } from '../api'
import {
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
} from './mutation-types'


export default {
  // 同步记录用户信息(这里是在Login.vue中获取已经拿到的用户信息)
  // 注意这里userInfo的位置,他和stata不同,他是从Login.vue传来的数据
  saveUser({ commit }, userInfo) {
    commit(RECEIVE_USER_INFO, { userInfo })
  },
  // 异步获取用户信息(这个是获取浏览器session会话中存放的用户信息)
  async getUserInfo({ commit }) {
    // 发送异步ajax请求
    const result = await reqUserInfo()
    // 如成功则提交一个mutation(并根据api文档传参)
    if (result.code === 0) {
      const userInfo = result.data
      commit(RECEIVE_USER_INFO, { userInfo })
    }
  },
  // 异步发送退出登录请求
  async logout({ commit }) {
    const result = await reqLogout()
    // 如成功则提交一个mutation,退出登录无需传参
    if (result.code === 0) {
      commit(RESET_USER_INFO)
    }
  }
}