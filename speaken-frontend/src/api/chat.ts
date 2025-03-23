import axios from 'axios'

// 本地部署部分
// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // 后端API地址
  timeout: 15000 // 请求超时时间
})

// // 实现内网穿透部分
// const api = axios.create({
//   // 使用 ngrok 生成的地址
//   baseURL: 'https://a76c-112-81-181-148.ngrok-free.app/api',
//   timeout: 15000
// })

// 定义聊天消息的接口
export interface ChatMessage {
  content: string
  translation?: string
  type: 'user' | 'system'
}

// 定义对话设置的接口
export interface ChatSettings {
  dialogueLanguage: 'english' | 'chinese' | 'auto'
  scene: string
  customScene: string
  userRole: string
  customUserRole: string
  aiRole: string
  customAiRole: string
  voiceRole: string
  voiceSpeed: number
  grammarCheck: boolean
  realTimeTranslation: boolean
}

// 定义API响应的接口
export interface ChatResponse {
  message: string
  translation?: string
  audioData?: string // Base64 编码的音频数据
}

// 发送消息到后端
export const sendChatMessage = async (message: string, settings: ChatSettings): Promise<ChatResponse> => {
  try {
    const response = await api.post('/chat', {
      message,
      settings
    })
    return response.data
  } catch (error) {
    console.error('发送消息失败:', error)
    throw error
  }
} 