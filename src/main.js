import Vue from 'vue'


import '../src/assets/style/reset.css'//引入公用样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'//引入vuex的store,并挂载到Vue实例


Vue.prototype.axios = axios// Vue.use(axios);不用这样直接引用，要通过原型使用

axios.defaults.baseURL = "http://192.168.101.21:8787/api"


// // 路由守卫
// router.beforeEach((to, from, next) => {
//   //获取用户登录成功后储存的登录标志
//   let getFlag = localStorage.getItem("Flag");
//   //如果登录标志存在且为isLogin，即用户已登录
//   if (getFlag === "isLogin") {
//     //设置vuex登录状态为已登录
//     store.state.isLogin = true
//     next()
//     //如果已登录，还想想进入登录注册界面，则定向回首页
//     // if (!to.meta.isLogin) {
//     //   //iViewUi友好提示
//     //   alert('已经登录')
//     //   next({
//     //     path: '/index'
//     //   })
//     // }
//     //如果登录标志不存在，即未登录
//   } else {
//     //用户想进入需要登录的页面，则定向回登录界面
//     if (to.meta.isLogin) {
//       next({
//         path: '/login',
//       })
//       //iViewUi友好提示
//       alert('请先登录')
//       //用户进入无需登录的界面，则跳转继续
//     } else {
//       next()
//     }
//   }
// });
// router.afterEach(route => {
//   window.scroll(0, 0);
// });



new Vue({
  el: '#app',
  render: c => c(App),
  router,//使用vue-router
  store//使用vuex的store
})