import Vue from 'vue'
import VueRouter from 'vue-router'

import index from '../page/index/index.vue'
import Login from '../page/Login/Login.vue'
import Pdf from '../page/pdf/index.vue'
import Other from '../page/Other/Other.vue'
import Test from '../page/Test/Test.vue'
import Test1 from '../page/Test/Test1.vue'
import Test2 from '../page/Test/Test2.vue'
import Test007 from '../page/Test/Test007.vue'
import Test008 from '../page/Test/Test008.vue'

// 全局注册Vue-router组件
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'Index',
      component: index
      // meta: {
      //   isLogin: true//标志这个路由地址，必须要登录才能进入
      // },
    },
    {
      path: '/other',
      name: 'Other',
      component: Other
    },
    // 登录注册
    {
      path: '/login',
      name: 'Login',
      component: Login
      // meta: {
      //   isLogin: false//标志这个路由地址，不用给登录也可以进入
      // }
    },
    {
      path: '/pdf',
      name: 'Pdf',
      component: Pdf
    },
    {
      path: '/test',
      component: Test
    },
    {
      path: '/test1',
      component: Test1
    },
    {
      path: '/test2',
      component: Test2
    },
    {
      path: '/test007',
      component: Test007
    },
    {
      path: '/test008',
      component: Test008
    }
  ]
})