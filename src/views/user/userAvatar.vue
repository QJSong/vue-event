<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" />
      <img  v-else class="the_img" :src="avatar" alt="" />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg"
          >选择图片</el-button
        >
        <el-button
          type="success"
          icon="el-icon-upload"
          :disabled="avatar === ''"
          @click="uploadFn"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    // 选择图片事件
    chooseImg () {
      // 用input 框选择图片
      this.$refs.iptRef.click()
    },
    onFileChange (e) {
      const files = e.target.files // 获取用户选择的文件数组
      if (files.length === 0) {
        // 用户没有选择图片
      } else {
        // 用户选择了图片
        console.log(files[0])
        // 将拿到的files 转成base64
        const fr = new FileReader()
        fr.readAsDataURL(files[0]) // 把文件读成base64
        // 读成base 64 后出发
        fr.onload = (e) => {
          // e.target.result 就是读取完后的值
          this.avatar = e.target.result
        }
      }
    },
    // 上传图片
    async uploadFn () {
      const { data: res } = await updateUserAvatarAPI(this.avatar)
      console.log(res)
      if (res.code !== 0) return this.$$message.error(res.message)
      this.$message.success(res.message)
      this.$store.dispatch('getUserInfoActions')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
