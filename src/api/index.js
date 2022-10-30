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

// 更新用户信息的接口
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => request({
  url: '/my/userinfo',
  method: 'PUT',
  data: {
    id,
    username,
    nickname,
    email,
    user_pic
  }
})

// 更新用户头像接口
export const updateUserAvatarAPI = (avatar) => request({
  url: '/my/update/avatar',
  method: 'PATCH',
  data: {
    avatar
  }
})

// 更新密码的接口
export const updateUserPwdAPI = ({ old_pwd, new_pwd, re_pwd }) => request({
  url: '/my/updatepwd',
  method: 'PATCH',
  data: {
    old_pwd,
    new_pwd,
    re_pwd
  }
})

// 获取文章分类列表接口
export const getArtCateListAPI = () => request({
  url: '/my/cate/list'
})

// 添加文章分类接口
export const saveArtCateAPI = ({ cate_name, cate_alias }) => request({
  url: '/my/cate/add',
  method: 'POST',
  data: {
    cate_name,
    cate_alias
  }
})

// 修改文章分类的接口
export const updateCateAPI = ({ id, cate_name, cate_alias }) => request({
  url: '/my/cate/info',
  method: 'PUT',
  data: {
    id,
    cate_name,
    cate_alias
  }
})

// 删除文章分类的接口
export const delCateAPI = (id) => request({
  url: '/my/cate/del',
  method: 'DELETE',
  params: {
    id
  }
})

// 发布文章接口
export const uploadArticleAPI = (fd) => request({
  url: '/my/article/add',
  method: 'POST',
  data: fd
})

// 获取文章列表接口
export const getArticleAPI = ({ pagenum, pagesize, cate_id, state }) => request({
  url: '/my/article/list',
  params: {
    pagenum,
    pagesize,
    cate_id,
    state
  }
})

// 获取文章详情多接口
export const getArtDetailAPI = (id) => request({
  url: '/my/article/info',
  params: {
    id
  }
})

// 删除文章接口
export const delArticleAPI = (id) => request({
  url: '/my/article/info',
  method: 'DELETE',
  params: {
    id
  }
})
