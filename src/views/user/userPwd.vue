<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form
      :model="pwdForm"
      :rules="pwdFormRules"
      ref="pwdFormRef"
      label-width="100px"
    >
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwdFn">修改密码</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updateUserPwdAPI } from '@/api'
export default {
  name: 'UserPwd',
  data () {
    // 检测新旧密码是否相同
    const samePwd = (rule, value, callback) => {
      // value 就是输入框的值
      if (this.pwdForm.old_pwd === value) {
        return callback(new Error('新旧密码不能相同！'))
      }
      callback()
    }
    // 检测两次新密码是否一致
    const rePwd = (rule, value, callback) => {
      if (this.pwdForm.new_pwd !== value) {
        return callback(new Error('两次新密码不一致！'))
      }
      callback()
    }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置密码事件
    updatePwdFn () {
      this.$refs.pwdFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await updateUserPwdAPI(this.pwdForm)
          console.log(res)
          if (res.code !== 0) return this.$message.error('愿密码错误！')
          this.$message.success('密码更新成功！')
          this.$refs.pwdFormRef.resetFields()
          // 密码更新完成后 需要跳转登录页面 清空token和用户信息
          this.$store.commit('updateToken', '')
          this.$store.commit('updateUserInfo', {})
          this.$router.push('/login')
        } else {
          return false
        }
      })
    },
    // 重置按钮
    resetFn () {
      this.$refs.pwdFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
