<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="obj in cateList"
                :key="obj.id"
                :label="obj.cate_name"
                :value="obj.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="choseFn"
              >筛选</el-button
            >
            <el-button type="info" size="small" @click="resetFn"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showPubDialogFn"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{
              scope.row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="dialogCloseFn"
    >
      <!-- 发布文章的对话框 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="obj in cateList"
              :key="obj.id"
              :label="obj.cate_name"
              :value="obj.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor
            v-model="pubForm.content"
            @blur="changeContentFn"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img
            src="../../assets/images/cover.jpg"
            alt=""
            class="cover-img"
            ref="imgRef"
          />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="iptFileRef"
            @change="changeCoverFn"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="selCoverFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')"
            >发布</el-button
          >
          <el-button type="info" @click="pubArticleFn('草稿')"
            >存为草稿</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>

      <div class="info">
        <span> 作者：{{ artDetail.nikename || artDetail.username }} </span>
        <span> 发布时间：{{ $formatDate(artDetail.pub_date) }} </span>
        <span> 所属分类：{{ artDetail.cate_name }} </span>
        <span> 状态：{{ artDetail.start }} </span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img :src="baseURL + artDetail.cover_img" alt="" />

      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArtCateListAPI,
  uploadArticleAPI,
  getArticleAPI,
  getArtDetailAPI,
  delArticleAPI
} from '@/api'
import imgobj from '../../assets/images/cover.jpg'
import { baseURL } from '@/utils/request'
export default {
  name: 'ArtList',
  data () {
    return {
      baseURL: baseURL,
      // 查询参数对象
      q: {
        pagenum: 1, // 默认请求第一页数据
        pagesize: 2, // 默认一页只要2条
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制对话框的显示隐藏
      cateList: [],
      pubForm: {
        // 表单的数据对象
        title: '', // 文章标题
        cate_id: '', // 文章分类id
        content: '', // 文章内容
        cover_img: '', // 封面
        state: '' // 已发布或者草稿
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'change' }
        ],
        cover_img: [
          { required: true, message: '请上传文章封面', trigger: 'change' }
        ],
        content: [
          // 用的不是el的组件 需要自己绑定change事件
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      detailVisible: false,
      artDetail: {}
    }
  },
  created () {
    this.getArtCateFn()
    this.getArticleListFn()
  },
  methods: {
    // 发表文章按钮->点击事件->让添加文章对话框出现
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    // 关闭发布文章前的回调
    async handleClose (done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 获取文章分类列表
    async getArtCateFn () {
      const { data: res } = await getArtCateListAPI()
      //   console.log(res)
      this.cateList = res.data
    },
    // 获取文章列表
    async getArticleListFn () {
      const { data: res } = await getArticleAPI(this.q)
      //   console.log(res)
      this.artList = res.data
      this.total = res.total
    },
    // 选择图片的方法
    selCoverFn () {
      this.$refs.iptFileRef.click()
    },
    // 用户选择了封面文件
    changeCoverFn (e) {
      const files = e.target.files
      //   console.log(files)
      if (files.length === 0) {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', imgobj)
      } else {
        this.pubForm.cover_img = files[0]
        // 用户选择的图片预览到
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }

      // 让el-form 单独交验封面
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 发布或者存为草稿 事件
    pubArticleFn (str) {
      this.pubForm.state = str
      //   console.log(this.pubForm)
      this.$refs.pubFormRef.validate(async (valid) => {
        if (valid) {
          // 通过交验
          //   console.log(this.pubForm)
          const fd = new FormData() // h5新出的表单对象
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          //   console.log(res)

          // 关闭对话框
          this.pubDialogVisible = false
          // 刷新数据
          this.getArticleListFn()
        } else {
          return false
        }
      })
    },
    // 富文本交验
    changeContentFn () {
      // 让el-form只交验 富文本
      this.$refs.pubFormRef.validateField('content')
    },
    // 关闭对话框事件
    dialogCloseFn () {
      // 清空表单
      this.$refs.pubFormRef.resetFields()
      // 手动给img标签重新赋值
      this.$refs.imgRef.setAttribute('src', imgobj)
    },
    // 每页条数发生的改变
    handleSizeChangeFn (sizes) {
      this.q.pagesize = sizes
      // 切换页码时 出现空数据 是因为都是异步代码 谁先执行不知道
      this.q.pagenum = 1
      this.getArticleListFn()
    },
    // 当前页码发生改变
    handleCurrentChangeFn (nowPage) {
      this.q.pagenum = nowPage
      this.getArticleListFn()
    },
    // 筛选点击事件
    choseFn () {
      // 下面页码货柜初始化
      this.q.pagesize = 2
      this.q.pagenum = 1
      this.getArticleListFn()
    },
    // 重置点击事件
    resetFn () {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = ''

      this.getArticleListFn()
    },
    // 文章标题点击事件
    async showDetailFn (artId) {
      this.detailVisible = true
      const res = await getArtDetailAPI(artId)
      console.log(res)
      this.artDetail = res.data.data
    },
    // 删除文章点击事件
    async removeFn (artId) {
      const { data: res } = await delArticleAPI(artId)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 删除最后一页最有一条 有bug 回在前一页显示无数据
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) { // 保证pagenum的页码值 最小为1
          this.q.pagenum--
        }
      }
      // 刷新列表
      this.getArticleListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
