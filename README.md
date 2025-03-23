<<<<<<< HEAD
# Speaken Language - 智能口语对话系统 | Intelligent Oral English Practice System

### 项目介绍
Speaken Language 是一个基于人工智能的中英文口语练习系统。它结合了语音识别、语音合成和大语言模型，为用户提供沉浸式的口语练习体验。用户可以选择多种场景进行对话练习，系统会根据用户的语音输入实时生成响应，并提供语法纠错和对话总结功能。

### 功能特点
- 🎯 多场景对话：支持日常购物、餐厅点餐、旅游问询、商务会议等多种场景
- 🗣️ 实时语音交互：集成语音识别和合成，实现自然对话
- 📝 智能纠错：提供实时语法纠错和改进建议
- 🎭 角色定制：支持自定义对话角色和场景

### 技术栈

#### 前端技术
- 框架：Vue 3 + TypeScript
- 构建工具：Vite
- UI组件：Element Plus
- 状态管理：Pinia
- 路由：Vue Router
- HTTP客户端：Axios

#### 后端技术
- 运行环境：Node.js
- 框架：Express + TypeScript
- 语音服务：百度语音识别/合成 SDK
- 音频处理：FFmpeg
- 环境变量：dotenv
- 大语言模型：deepseek API

### 系统架构
```mermaid
graph LR
    A[前端Vue3] --> B[后端Express]
    B --> C[百度语音服务]
    B --> D[deepseek API]
    B --> E[音频处理FFmpeg]

### 主要功能模块

#### 1. 语音识别与合成
- 使用百度语音服务进行实时语音识别
- 支持中英文语音合成，提供多种音色选择
- 音频格式自动转换（WebM -> PCM）

#### 2. 对话场景
- 预设多种日常对话场景
- 支持自定义场景和角色
- 实时生成符合场景的对话内容

#### 3. 语法纠错
- 实时检测语法错误
- 提供改进建议

本地开发

git clone https://github.com/chatgptsuper/speaken-language.git
cd speaken-language

# 安装前端依赖
cd speaken-frontend
npm install

# 安装后端依赖
cd ../speaken-backend
npm install

# 环境配置

在 speaken-backend 目录下创建 .env 文件，配置必要的环境变量：

BAIDU_APP_ID=your_baidu_app_id
BAIDU_API_KEY=your_baidu_api_key
BAIDU_SECRET_KEY=your_baidu_secret_key
BAIDU_TTS_APP_ID=your_baidu_tts_app_id
BAIDU_TTS_API_KEY=your_baidu_tts_api_key
BAIDU_TTS_SECRET_KEY=your_baidu_tts_secret_key
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# 启动前端开发服务器
cd speaken-frontend
npm run dev

# 启动后端服务器
cd ../speaken-backend
npm run dev

项目结构
speaken-language/
├── speaken-frontend/          # 前端项目
│   ├── src/
│   │   ├── api/              # API 请求
│   │   ├── components/       # 组件
│   │   ├── views/           # 页面
│   │   └── main.ts          # 入口文件
│   └── package.json
├── speaken-backend/          # 后端项目
│   ├── src/
│   │   ├── services/        # 业务服务
│   │   ├── types/          # 类型定义
│   │   └── index.ts        # 入口文件
│   └── package.json
└── README.md

示例图

![示意图](images\图片1.png)
![示意图](images\图片2.png)
![示意图](images\图片3.png)
=======
# speaken-language
智能口语对话训练机器人
>>>>>>> 63f83f4a003c24d0538aa6d6f5554e8691fd7df8
