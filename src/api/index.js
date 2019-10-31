// //param参数类型GET方式 ajax(`${根路径}/position/${参数}`)
// //       无参数GET方式 ajax(根路径+'/api地址')
// //query参数类型GET方式 ajax(根路径+'/api路径',{参数})

// // api.js 与后台交换信息(依赖已经封装好的ajax函数)
// import ajax from './ajax'
// export const BASE_URL = 'http://192.168.101.29:8787/api'

// // 用户名密码登陆 参数类型: 请求体 请求方式：POST
// export const reqPwdLogin = ({ name, pwd }) => ajax(BASE_URL + '/login_pwd', { name, pwd }, 'POST')

// // 用户登出 参数类型：无 请求方式：GET
// export const reqLogout = () => ajax(BASE_URL + '/logout')

// // 根据会话获取用户信息 参数类型：无 请求方式：GET
// export const reqUserInfo = () => ajax(BASE_URL + '/userinfo')