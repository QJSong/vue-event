import request from '@/utils/request'

// 用户注册接口
export const registerAPI = ({ username, password, repassword }) => request({
  url: '/api/reg',
  method: 'POST',
  data: {
    username,
    password,
    repassword
  }
})

// 用户登陆接口
export const loginAPI = ({ username, password }) => request({
  url: '/api/login',
  method: 'POST',
  data: {
    username,
    password
  }
})

// 获取用户信息接口
export const getUserInfoAPI = () => request({
  url: '/my/userinfo',
  method: 'GET'

})

// 左侧侧边栏数据接口
export const menusAPI = () => request({
  url: '/my/menus'

})
