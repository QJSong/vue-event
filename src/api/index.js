import request from '@/utils/request'

export const registerAPI = () => request({
  url: '/api/reg',
  method: 'POST',
  data: {
    username: 'qjs',
    password: '111111',
    repassword: '111111'
  }
})
