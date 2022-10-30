import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/element-ui'
import dayjs from 'dayjs'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 全局注册富文本编辑器
Vue.use(VueQuillEditor /* { default global options } */)

// 定义时间格式
Vue.prototype.$formatDate = (dateObj) => dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
