<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateFn"
          >添加分类</el-button
        >
      </div>
      <el-table :data="cateList" style="width: 100%" border stripe>
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateCateFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delCateFn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加文章分类"
      :visible.sync="addVisible"
      width="35%"
      @close="dialogCliseFn"
    >
      <!-- 添加的表单 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input
            v-model="addForm.cate_name"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input
            v-model="addForm.cate_alias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmFn"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 同一个按钮，想要不同的状态
// 1. 设置一个变量 点击一种按钮赋值 点击另一种按钮在给赋另外的值
// 2.发请求时 做判读
import { getArtCateListAPI, saveArtCateAPI, updateCateAPI, delCateAPI } from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [],
      addVisible: false,
      addForm: {
        // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      isEdit: false, // false 是新增分类 true 是编辑
      editId: '', // 编辑分类 需要的id值
      addRules: {
        // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getArtCateFn()
  },
  methods: {
    // 获取文章分类列表方法
    async getArtCateFn () {
      const res = await getArtCateListAPI()
      //   console.log(res)
      this.cateList = res.data.data
    },
    // 添加文章分类按钮事件
    addCateFn () {
      this.isEdit = false
      this.editId = ''
      this.addVisible = true
    },
    // 取消的点击事件
    cancelFn () {
      this.addVisible = false
    },
    // 确定的点击事件
    confirmFn () {
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            // 去编辑
            const { data: res } = await updateCateAPI({ id: this.editId, ...this.addForm })
            console.log(res)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 去新增
            const { data: res } = await saveArtCateAPI(this.addForm)
            console.log(res)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          }
          // 数据发送给后台后，需要回显示在页面上 就需要重新调获取文章列表方法
          this.getArtCateFn()
          this.addVisible = false
        } else {
          return false
        }
      })
    },
    // 对话框关闭后的操作
    dialogCliseFn () {
      this.$refs.addRef.resetFields()
    },
    // 修改按钮的事件
    // el-form 和 el-dialog 数据回显示 同时使用bug 解决：$nextTick 让真实dom 创建后在复制值
    updateCateFn (obj) {
      console.log(obj)
      this.isEdit = true
      this.editId = obj.id
      this.addVisible = true
      this.$nextTick(() => {
        // 数据的回显
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    // 删除文章分类的事件
    async delCateFn (obj) {
      const { data: res } = await delCateAPI(obj.id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 刷新文章分类列表
      this.getArtCateFn()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
