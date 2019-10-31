// index.js 是vuex基础文件
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// var userInfo = 'userInfo'
let userInfo = JSON.parse(localStorage.getItem('[object Object]') || '{}')//这里有问题 应该是userInfo，而不是[object Object]
const key = 'formInfo'
export const store = new Vuex.Store({
  // 设置属性
  state: {
    // 用户-信息
    userInfo: userInfo,
    // 客户-产品-信息
    formInfo: {
      item_name: '',//品牌名称
      kuanshi: '',//款式
      boxing: '',//装箱数量
      item_spec: {
        length: '',
        width: '',
        height: ''
      }, //产品规格-规格
      status: '',
      qty: '',//数量
      imageUrl: "", //上传图片返回的链接
      www: '',
      Country: '',//国家地区
      Address: '',//地址
      Contacts: '',//联系人
      Email: '',//邮箱
      other: '',//其他
      customer_name: '',//客户名称
      customer_phone: '',//客户电话
      completed_date: '',//交期
      offer_method: '',//报价方式
      total_price: '',//最终总价
      unit_price: '',//最终单价
    },
    orderInfo: {
      clean_date: '',//表单清空时间(毫秒数)
      update_date: '',//表单提交成功的更新时间(毫秒数)
      create_date: '',//创建日期
      offerNumber: '',//报价单号(初次提交表单信息时生成)
      modulus: '',//系数
      exchange: ''//汇率
    },
    // 合计总价+表单提交状态
    allTotalPrice: {
      // 价格单位
      price_unit: ' ￥',
      // 报价价格
      all_unit_price: 0,
      // 价格+单位
      priceUnit: '',
      // 材料总价
      Material_price: 0,
      Material_submit: false,
      // 工艺总价
      CraftPrint_price: 0,
      CraftPrint_submit: false,
      CraftPi_price: 0,
      CraftPi_submit: false,
      CraftGilding_price: 0,
      CraftGilding_submit: false,
      CraftConvex_price: 0,
      CraftConvex_submit: false,
      CraftSilk_price: 0,
      CraftSilk_submit: false,
      CraftV_price: 0,
      CraftV_submit: false,
      CraftUV_price: 0,
      CraftUV_submit: false,
      // 工费总价
      LaborCost_price: 0,
      LaborCost_submit: false,
      // 包装总价
      InsidePackage_price: 0,
      InsidePackage_submit: false,
      OutsidePackage_price: 0,
      OutsidePackage_submit: false
    },
    //材料-信息
    materialInfo: [],
    //工艺-信息
    craftPrint: [],//印刷
    craftPi: [],//啤
    craftGilding: [],//烫金
    craftConvex: [],//激凸
    craftSilk: [],//丝印
    craftV: [],//V槽
    craftUV: [],//UV
    searchList: []
  },

  // 获取属性的状态
  getters: {
    //获取登录状态
    // isLogin: state => state.isLogin,
    getname: (state) => state.userInfo,
    // 从localStorage获取用户信息
    getStorage: (state) => {
      if (!state.userInfo) {
        state.userInfo = JSON.parse(localStorage.getItem(userInfo))
      }
      return state.user
    },
    // 如果没有数据,则从localStorage获取formInfo
    getFormInfo: (state) => {
      if (!state.formInfo.unit_price) {
        // state.formInfo = JSON.parse(localStorage.getItem(formInfo))
        state.formInfo = JSON.parse(localStorage.getItem(key))
      }
      return state.formInfo
    },
    formInfo: state => state.formInfo,
    allTotalPrice: state => state.allTotalPrice,
    searchList: state => state.searchList,
  },

  // 设置属性状态
  mutations: {
    // 存储用户数据
    SET_USERINFO(state, value) {
      state.userInfo = value;
      localStorage.setItem(userInfo, JSON.stringify(value))
    },
    // 清除用户数据(退出登录)
    REMOVE_USERINFO(state) {
      state.userInfo = {}
      localStorage.removeItem(userInfo)
    },
    // 页面刷新就获取一次
    GET_FORMINFO(state) {
      state.formInfo = JSON.parse(localStorage.getItem(key))
    },
    // 存储表单信息
    SET_FORMINFO(state, value) {
      state.formInfo = value
      localStorage.setItem(key, JSON.stringify(value))
    },
    // 清空表单信息
    REMOVE_FORMINFO(state) {
      state.formInfo = {
        offerNumber: '',
        item_name: '',
        kuanshi: '',
        boxing: '',
        item_spec: {
          length: '',
          width: '',
          height: ''
        },
        status: '',
        qty: '',
        imageUrl: "",
        www: '',
        Country: '',
        Address: '',
        Contacts: '',
        Email: '',
        other: '',
        customer_name: '',
        customer_phone: '',
        completed_date: '',
        create_date: '',
        total_price: '',
        unit_price: '',
        modulus: '',
        exchange: ''
      }
      // localStorage.removeItem(formInfo)
      localStorage.removeItem(key)
    },
    // 存储客户/产品信息
    // SET_ORDERINFO(state, value) {
    //   state.orderInfo = value
    // },
    // 存储材料信息
    // SET_MATERIALINFO(state, value) {
    //   state.materialInfo.push(value)
    // },
    // 存储总数量
    SET_NUMBER(state, value) {
      state.qty = value
    }
  },

  // 应用mutations
  actions: {
    // 提交mutations存储用户数据
    setUserInfo({ commit }, value) {
      commit('SET_USERINFO', value);
      // localStorage.setItem(userInfo, JSON.stringify(value))
    },
    getForminfo({ commit }, value) {
      commit('GET_FORMINFO', value);
    },
    setForminfo({ commit }, value) {
      commit('SET_FORMINFO', value)
    },
    // 提交mutations存储客户/产品信息
    // setOrderInfo({ commit }, value) {
    //   commit('SET_ORDERINFO', value);
    // },
    // 提交mutations存储材料信息
    // setMaterialInfo({ commit }, value) {
    //   commit('SET_MATERIALINFO', value)
    // },
    // 提交mutations存储总数量
    setNumber({ commit }, value) {
      commit('SET_NUMBER', value)
    },
    // 提交mutations存储 装箱(数量)
    setBoxing({ commit }, value) {
      commit('SET_BOXING', value)
    }
  }
})

export default store