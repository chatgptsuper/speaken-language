import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: {
    zh: {
      // 中文语言包
      message: {
        hello: '你好',
        settings: '设置',
        startRecording: '开始录音',
        stopRecording: '停止录音',
        send: '发送',
        cancel: '取消',
        confirm: '确认'
      }
    },
    en: {
      // 英文语言包
      message: {
        hello: 'Hello',
        settings: 'Settings',
        startRecording: 'Start Recording',
        stopRecording: 'Stop Recording',
        send: 'Send',
        cancel: 'Cancel',
        confirm: 'Confirm'
      }
    }
  }
})

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(createPinia())
app.use(ElementPlus)
app.use(i18n)

app.mount('#app')
