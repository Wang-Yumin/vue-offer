// 操作数据变化（增减，更新），接受数据并处理数据（同步操作）
import {
  RECEIVE_USER_INFO,
  RESET_USER_INFO
} from './mutation-types'

export default {

  // 存储用户信息
  [RECEIVE_USER_INFO](state, { userInfo }) {
    state.userInfo = userInfo
  },
  // 清空用户信息
  [RESET_USER_INFO](state) {
    state.userInfo = {}//请清空用户登录数据
  }
}