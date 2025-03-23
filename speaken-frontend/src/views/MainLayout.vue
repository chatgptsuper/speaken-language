<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">Speaken Language</div>
      <div class="nav-actions">
        <el-select v-model="currentLanguage" class="language-select">
          <el-option label="中文" value="zh" />
          <el-option label="English" value="en" />
        </el-select>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 左侧设置面板 -->
      <div class="settings-panel">
        <h3 class="panel-title">对话设置</h3>
        <el-form :model="settings" label-position="top">
          <!-- 对话语言选择 -->
          <el-form-item label="对话语言">
            <el-select v-model="settings.dialogueLanguage">
              <el-option label="中文" value="chinese" />
              <el-option label="英文" value="english" />
            </el-select>
          </el-form-item>

          <!-- 场景选择 -->
          <el-form-item label="对话场景">
            <el-select 
              v-model="settings.scene" 
              class="w-full"
              @change="handleSceneChange"
            >
              <el-option label="日常购物" value="shopping" />
              <el-option label="餐厅点餐" value="restaurant" />
              <el-option label="旅游问询" value="travel" />
              <el-option label="商务会议" value="business" />
              <el-option label="学术讨论" value="academic" />
              <el-option label="雅思口语" value="ielts" />
              <el-option label="托福口语" value="toefl" />
              <el-option label="自定义场景" value="custom" />
            </el-select>
          </el-form-item>

          <!-- 自定义场景描述 -->
          <el-form-item v-if="settings.scene === 'custom'" label="场景描述">
            <el-input
              v-model="settings.customScene"
              type="textarea"
              :rows="3"
              placeholder="请描述具体的对话场景..."
            />
          </el-form-item>

          <!-- 角色选择 -->
          <el-form-item label="你的角色">
            <el-select 
              v-model="settings.userRole" 
              class="w-full"
              @change="handleUserRoleChange"
            >
              <el-option label="学生" value="student" />
              <el-option label="顾客" value="customer" />
              <el-option label="游客" value="tourist" />
              <el-option label="面试者" value="interviewee" />
              <el-option label="商务人士" value="businessman" />
              <el-option label="自定义角色" value="custom" />
            </el-select>
          </el-form-item>

          <!-- 自定义用户角色 -->
          <el-form-item v-if="settings.userRole === 'custom'" label="您的角色描述">
            <el-input
              v-model="settings.customUserRole"
              placeholder="请描述您的角色..."
            />
          </el-form-item>

          <!-- AI角色 -->
          <el-form-item label="AI角色">
            <el-select 
              v-model="settings.aiRole" 
              class="w-full"
              @change="handleAiRoleChange"
            >
              <el-option label="老师" value="teacher" />
              <el-option label="店员" value="clerk" />
              <el-option label="导游" value="guide" />
              <el-option label="面试官" value="interviewer" />
              <el-option label="商务伙伴" value="partner" />
              <el-option label="自定义角色" value="custom" />
            </el-select>
          </el-form-item>

          <!-- 自定义AI角色 -->
          <el-form-item v-if="settings.aiRole === 'custom'" label="AI角色描述">
            <el-input
              v-model="settings.customAiRole"
              placeholder="请描述AI的角色..."
            />
          </el-form-item>

          <!-- 语音角色 -->
          <el-form-item label="发音人">
            <el-select v-model="settings.voiceRole" class="w-full">
              <el-option label="度逍遥" value="5003" />
              <el-option label="度小鹿" value="5118" />
              <el-option label="度博文" value="106" />
              <el-option label="度小童" value="110" />
              <el-option label="度小萌" value="111" />
              <el-option label="度米朵" value="103" />
              <el-option label="度小娇" value="5" />
            </el-select>
          </el-form-item>

          <!-- 语速设置 -->
          <el-form-item label="语速">
            <el-slider
              v-model="settings.voiceSpeed"
              :min="0"
              :max="9"
              :step="1"
              :marks="{
                0: '最慢',
                5: '正常',
                9: '最快'
              }"
            />
          </el-form-item>

          <!-- 功能开关 -->
          <div class="settings-switches">
            <el-space direction="vertical" size="large" style="width: 100%">
              <el-switch
                v-model="settings.grammarCheck"
                active-text="语法纠错"
              />
              <el-switch
                v-model="settings.realTimeTranslation"
                active-text="实时翻译"
              />
            </el-space>
          </div>

          <!-- 开始对话按钮 -->
          <el-button type="primary" class="start-button" @click="startDialogue">
            开始对话
          </el-button>
        </el-form>
      </div>

      <!-- 右侧对话区域 -->
      <div class="dialogue-container">
        <!-- 对话历史 -->
        <div class="dialogue-area">
          <div v-for="(message, index) in dialogueHistory" 
               :key="index" 
               class="message" 
               :class="{ 'message-user': message.type === 'user' }">
            <div class="message-content">
              <div>{{ message.content }}</div>
              <div v-if="message.translation" class="message-translation">{{ message.translation }}</div>
              <!-- 为系统消息添加播放按钮 -->
              <el-button
                v-if="message.type === 'system' && message.audioData"
                size="small"
                type="primary"
                circle
                class="play-button"
                @click="playAudio(message.audioData)"
              >
                <el-icon><VideoPlay /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="voice-controls">
            <el-button 
              :type="isRecording ? 'danger' : 'primary'"
              @click="toggleRecording"
              :loading="isLoading"
              class="record-button"
            >
              <el-icon><Microphone /></el-icon>
              {{ isRecording ? '停止录音' : '开始录音' }}
            </el-button>
            <!-- 替换滑块为音量条 -->
            <div class="volume-meter">
              <div 
                class="volume-bar" 
                :style="{ width: `${volume}%`, backgroundColor: getVolumeColor(volume) }"
              ></div>
            </div>
            <span class="volume-status">{{ getVolumeStatus() }}</span>
          </div>
          <div class="text-input">
            <el-input
              v-model="inputText"
              type="textarea"
              :rows="3"
              placeholder="输入文字..."
            />
            <el-button type="primary" @click="handleSendMessage" :loading="isLoading">发送</el-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Setting, Microphone, VideoPlay } from '@element-plus/icons-vue'
import { sendChatMessage, type ChatMessage } from '@/api/chat'
import { ElMessage } from 'element-plus'

const DEBUG = true

const log = (...args: any[]) => {
  if (DEBUG) {
    console.log(...args)
  }
}

// 状态定义
const currentLanguage = ref('zh')
const isRecording = ref(false)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const recordedAudio = ref<Blob | null>(null)
const volume = ref(0)
const audioContext = ref<AudioContext | null>(null)
const analyser = ref<AnalyserNode | null>(null)
const microphoneStream = ref<MediaStream | null>(null)
const inputText = ref('')
const audioPlayer = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)

// 设置状态
const settings = ref({
  dialogueLanguage: 'english',
  scene: 'shopping',
  customScene: '',
  userRole: 'customer',
  customUserRole: '',
  aiRole: 'clerk',
  customAiRole: '',
  voiceRole: '5003', // 默认使用度逍遥
  voiceSpeed: 5,
  grammarCheck: false,
  realTimeTranslation: false
})

// 对话历史
interface ChatMessage {
  type: 'user' | 'system';
  content: string;
  translation?: string;
}

interface DialogueMessage extends ChatMessage {
  audioData?: string;
}

// 修改错误处理相关的类型
interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

const dialogueHistory = ref<DialogueMessage[]>([
  { 
    type: 'system', 
    content: '你好！我是你的口语练习助手。请在左侧选择对话场景和角色，然后点击"开始对话"开始练习。',
    translation: 'Hello! I am your speaking practice assistant. Please select the dialogue scene and roles on the left, then click "Start Dialogue" to begin practice.'
  }
])

// 添加loading状态
const isLoading = ref(false)

// 方法定义
const handleSceneChange = (value: string) => {
  if (value !== 'custom') {
    settings.value.customScene = ''
  }
}

const handleUserRoleChange = (value: string) => {
  if (value !== 'custom') {
    settings.value.customUserRole = ''
  }
}

const handleAiRoleChange = (value: string) => {
  if (value !== 'custom') {
    settings.value.customAiRole = ''
  }
}

const startDialogue = () => {
  // 获取实际场景和角色名称
  const sceneName = settings.value.scene === 'custom' 
    ? settings.value.customScene 
    : settings.value.scene
  
  const userRoleName = settings.value.userRole === 'custom'
    ? settings.value.customUserRole
    : settings.value.userRole
  
  const aiRoleName = settings.value.aiRole === 'custom'
    ? settings.value.customAiRole
    : settings.value.aiRole

  // 根据选择的语言设置欢迎消息
  let welcomeMessage = ''
  let translation = ''

  switch (settings.value.dialogueLanguage) {
    case 'english':
      welcomeMessage = `OK, let's start the dialogue in the ${sceneName} scene. I will be the ${aiRoleName}, and you are the ${userRoleName}.`
      translation = `好的，让我们开始${sceneName}场景的对话。我将作为${aiRoleName}，你是${userRoleName}。`
      break
    case 'chinese':
      welcomeMessage = `好的，让我们开始${sceneName}场景的对话。我将作为${aiRoleName}，你是${userRoleName}。`
      translation = `OK, let's start the dialogue in the ${sceneName} scene. I will be the ${aiRoleName}, and you are the ${userRoleName}.`
      break

  }

  // 根据设置开始新的对话
  dialogueHistory.value = [
    {
      type: 'system',
      content: welcomeMessage,
      translation: settings.value.realTimeTranslation ? translation : ''
    }
  ]
}

// 获取音量颜色
const getVolumeColor = (vol: number) => {
  if (vol < 30) return '#67C23A' // 绿色
  if (vol < 70) return '#E6A23C' // 黄色
  return '#F56C6C' // 红色
}

// 获取音量状态文本
const getVolumeStatus = () => {
  if (!isRecording.value) return '等待录音'
  if (volume.value < 10) return '音量过低'
  if (volume.value > 90) return '音量过高'
  if (volume.value < 30) return '音量偏低'
  if (volume.value > 70) return '音量偏高'
  return '音量适中'
}

// 播放音频
const playAudio = async (audioData: string) => {
  try {
    // 如果正在播放，先停止
    if (isPlaying.value) {
      audioPlayer.value?.pause()
      audioPlayer.value = null
    }

    // 将 Base64 字符串转换为 Uint8Array
    const byteCharacters = atob(audioData)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    // 创建音频 Blob
    const audioBlob = new Blob([byteArray], { type: 'audio/mp3' })
    const audioUrl = URL.createObjectURL(audioBlob)

    // 创建新的音频播放器
    audioPlayer.value = new Audio()
    
    // 设置事件监听器
    audioPlayer.value.onplay = () => {
      isPlaying.value = true
      console.log('开始播放音频')
    }
    
    audioPlayer.value.onended = () => {
      isPlaying.value = false
      URL.revokeObjectURL(audioUrl)
      console.log('音频播放结束')
    }
    
    audioPlayer.value.onerror = (error) => {
      console.error('音频播放错误:', error)
      ElMessage.error('音频播放失败')
      isPlaying.value = false
      URL.revokeObjectURL(audioUrl)
    }

    // 设置音频源并加载
    audioPlayer.value.src = audioUrl
    await audioPlayer.value.load()

    // 开始播放
    try {
      await audioPlayer.value.play()
      console.log('音频开始播放')
    } catch (playError) {
      console.error('播放失败:', playError)
      ElMessage.error('播放失败，可能需要用户交互')
      // 添加播放按钮
      const playButton = document.createElement('button')
      playButton.textContent = '点击播放音频'
      playButton.onclick = () => audioPlayer.value?.play()
      document.body.appendChild(playButton)
    }
  } catch (error) {
    console.error('播放音频失败:', error)
    ElMessage.error('播放音频失败')
  }
}

// 修改错误处理函数
const handleError = (error: ApiError) => {
  console.error('操作失败:', error)
  const errorMessage = error.response?.data?.error || error.message || '操作失败，请重试'
  ElMessage.error(errorMessage)
}

// 修改发送消息处理函数
const handleSendMessage = async () => {
  if (inputText.value.trim()) {
    try {
      isLoading.value = true
      
      // 添加用户消息到对话历史
      const userMessage: DialogueMessage = {
        type: 'user',
        content: inputText.value
      }
      dialogueHistory.value.push(userMessage)

      // 发送消息到后端
      const response = await sendChatMessage(inputText.value, settings.value)
      
      // 添加系统响应到对话历史
      const systemMessage: DialogueMessage = {
        type: 'system',
        content: response.message,
        translation: response.translation,
        audioData: response.audioData
      }
      dialogueHistory.value.push(systemMessage)

      // 如果有音频数据，播放它
      if (response.audioData) {
        console.log('收到音频数据，准备播放')
        await playAudio(response.audioData)
      }

      // 清空输入框
      inputText.value = ''
    } catch (error) {
      handleError(error as ApiError)
      dialogueHistory.value.pop()
    } finally {
      isLoading.value = false
    }
  }
}

// 修改发送语音消息函数的错误处理
const sendVoiceMessage = async (audioBlob: Blob) => {
  try {
    log('准备发送语音消息, Blob大小:', audioBlob.size, 'bytes', '类型:', audioBlob.type)
    isLoading.value = true
    ElMessage({
      message: '正在发送录音...',
      type: 'info',
      duration: 2000
    })
    
    // 创建 FormData
    const formData = new FormData()
    formData.append('audio', audioBlob, `recording${audioBlob.type === 'audio/wav' ? '.wav' : '.webm'}`)
    formData.append('settings', JSON.stringify(settings.value))
    
    log('发送请求到后端，settings:', settings.value)
    
    // 调用后端API进行语音识别和对话
    const response = await fetch('/api/chat/voice', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      log('请求失败:', response.status, errorText)
      throw new Error(`语音识别失败: ${response.status} ${errorText}`)
    }
    
    const result = await response.json()
    log('收到后端响应:', result)
    
    if (result.recognizedText) {
      dialogueHistory.value.push({
        type: 'user',
        content: result.recognizedText
      })
      ElMessage({
        message: '语音识别成功',
        type: 'success',
        duration: 2000
      })
    }
    
    if (result.aiResponse) {
      dialogueHistory.value.push({
        type: 'system',
        content: result.aiResponse.message,
        translation: result.aiResponse.translation,
        audioData: result.audioData // 保存音频数据
      })

      // 如果有音频数据，播放它
      if (result.audioData) {
        console.log('收到音频数据，准备播放')
        await playAudio(result.audioData)
      } else {
        console.log('没有收到音频数据')
      }
    }
  } catch (error) {
    handleError(error as ApiError)
  } finally {
    isLoading.value = false
  }
}

// 初始化录音功能
const initRecording = async () => {
  try {
    // 检查是否已选择语言
    if (!settings.value.dialogueLanguage) {
      ElMessage.error('请先选择对话语言')
      return false
    }

    // 清理之前的资源
    stopVolumeMonitoring()

    console.log('请求麦克风权限...')
    // 请求麦克风权限，设置正确的音频参数
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000,
        channelCount: 1
      }
    })
    console.log('获取麦克风权限成功')
    
    microphoneStream.value = stream
    
    // 创建 MediaRecorder，使用 wav 格式
    const options = { mimeType: 'audio/wav' }
    try {
      mediaRecorder.value = new MediaRecorder(stream, options)
    } catch (e) {
      console.log('WAV格式不支持，尝试使用 webm 格式')
      mediaRecorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    }
    console.log('MediaRecorder 创建成功，使用格式:', mediaRecorder.value.mimeType)
    
    // 初始化音频分析器
    try {
      audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      })
      analyser.value = audioContext.value.createAnalyser()
      const source = audioContext.value.createMediaStreamSource(stream)
      source.connect(analyser.value)
      analyser.value.fftSize = 256
      analyser.value.smoothingTimeConstant = 0.8
      console.log('音频分析器初始化成功')
    } catch (error) {
      console.error('音频分析器初始化失败:', error)
    }
    
    // 设置数据可用事件处理
    mediaRecorder.value.ondataavailable = (event) => {
      console.log('收到音频数据:', event.data.size, '字节,', 'type:', event.data.type)
      if (event.data.size > 0) {
        audioChunks.value.push(event.data)
      }
    }

    // 设置录音停止事件处理
    mediaRecorder.value.onstop = async () => {
      console.log('录音停止，音频片段数:', audioChunks.value.length)
      if (audioChunks.value.length > 0) {
        // 创建 Blob
        const audioBlob = new Blob(audioChunks.value, { type: mediaRecorder.value?.mimeType || 'audio/webm' })
        console.log('创建音频Blob，大小:', audioBlob.size, '字节,', 'type:', audioBlob.type)
        recordedAudio.value = audioBlob
        audioChunks.value = []
        
        // 自动发送录音
        await sendVoiceMessage(audioBlob)
      } else {
        ElMessage.warning('录音内容为空')
      }
      stopVolumeMonitoring()
    }

    ElMessage.success('麦克风初始化成功')
    return true
  } catch (error) {
    console.error('初始化录音失败:', error)
    ElMessage.error(`无法访问麦克风: ${error.message}`)
    return false
  }
}

// 开始/停止录音
const toggleRecording = async () => {
  try {
    if (isRecording.value) {
      // 停止录音
      if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
        console.log('停止录音')
        mediaRecorder.value.stop()
        isRecording.value = false
        ElMessage({
          message: '录音结束，正在处理...',
          type: 'info',
          duration: 2000
        })
      }
    } else {
      // 开始录音
      if (!mediaRecorder.value || mediaRecorder.value.state === 'inactive') {
        console.log('初始化录音...')
        const initialized = await initRecording()
        if (!initialized) return
      }

      if (mediaRecorder.value && mediaRecorder.value.state === 'inactive') {
        try {
          console.log('开始录音')
          mediaRecorder.value.start(1000) // 每秒触发一次 ondataavailable
          isRecording.value = true
          startVolumeMonitoring()
          ElMessage({
            message: '开始录音，请说话...',
            type: 'success',
            duration: 2000
          })
        } catch (error) {
          console.error('开始录音失败:', error)
          ElMessage.error(`开始录音失败: ${error.message}`)
        }
      }
    }
  } catch (error) {
    console.error('录音操作失败:', error)
    ElMessage.error(`录音操作失败: ${error.message}`)
  }
}

// 监测音量
const startVolumeMonitoring = () => {
  if (!analyser.value) return
  
  const dataArray = new Uint8Array(analyser.value.frequencyBinCount)
  const updateVolume = () => {
    if (!isRecording.value || !analyser.value) return
    
    analyser.value.getByteFrequencyData(dataArray)
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length
    volume.value = Math.min(100, (average / 128) * 100) // 将音量映射到0-100范围
    
    requestAnimationFrame(updateVolume)
  }
  
  updateVolume()
}

const stopVolumeMonitoring = () => {
  volume.value = 0
  if (audioContext.value) {
    audioContext.value.close()
    audioContext.value = null
  }
  if (microphoneStream.value) {
    microphoneStream.value.getTracks().forEach(track => track.stop())
    microphoneStream.value = null
  }
}

// 在组件卸载时清理资源
onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value = null
  }
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop()
  }
  stopVolumeMonitoring()
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #409EFF;
}

.nav-actions {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  min-height: calc(100vh - 64px);
  overflow: hidden;
}

/* 左侧对话设置面板样式 */
.settings-panel {
  width: 300px;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.panel-title {
  margin: 0 0 1.5rem;
  color: #409EFF;
  font-size: 1.2rem;
}

.settings-switches {
  margin: 1rem 0;
}

.start-button {
  width: 100%;
  margin-top: 1rem;
  height: 40px;
  font-size: 1.1rem;
}

/* 右侧对话区域样式 */
.dialogue-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dialogue-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  margin-bottom: 1rem;
  justify-content: flex-start;
}

.message-user {
  justify-content: flex-end;
}

.message-content {
  position: relative;
  max-width: 70%;
  padding: 0.8rem;
  border-radius: 8px;
  background: #e8f5fe;
}

.message-user .message-content {
  background: #409EFF;
  color: white;
}

.play-button {
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.8;
  transition: opacity 0.2s;
}

.play-button:hover {
  opacity: 1;
}

.message-translation {
  margin-top: 0.5rem;
  font-size: 0.9em;
  opacity: 0.8;
}

.input-area {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background: white;
}

.voice-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.record-button {
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-meter {
  flex: 1;
  height: 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.volume-bar {
  height: 100%;
  background-color: #67C23A;
  transition: all 0.1s ease;
  transform-origin: left;
}

.volume-status {
  min-width: 80px;
  text-align: center;
  font-size: 0.9em;
  color: #606266;
  font-weight: 500;
}

.text-input {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.text-input .el-input {
  flex: 1;
}

.text-input .el-button {
  height: 80px;
  width: 100px;
  font-size: 1.1rem;
}

.w-full {
  width: 100%;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .main-layout {
    padding: 0 16px;
  }
  
  .settings-panel {
    width: 250px;
  }
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }
  
  .settings-panel {
    width: 100%;
  }
  
  .dialogue-container {
    height: 600px;
  }
}

.language-hint {
  display: none;
}
</style> 