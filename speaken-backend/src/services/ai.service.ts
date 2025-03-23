import OpenAI from 'openai'; // 引入openaiSDK与deepseek api进行交互
import { ChatSettings } from '../types/chat';
import dotenv from 'dotenv';

// 确保加载环境变量
dotenv.config();

// 添加对话历史接口
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  private openai: OpenAI; // 声明openai变量
  //conversationHistory表示用于保存对话历史记录
  private conversationHistory: Map<string, Message[]> = new Map();
  // 表示map的键是string类型，值value是messager

  constructor() {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY 环境变量未设置'); // 抛出错误并终止程序执行
    }

    console.log('初始化 AI 服务:', {
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
      apiKeyExists: !!process.env.DEEPSEEK_API_KEY // !!强制转化为布尔值，存在且有值就会被强制转化
    });

    this.openai = new OpenAI({ // 构造函数中实例化openai类，并赋值给之前声明的openai变量
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'
    });
  }

  // 根据chatSettings生成系统提示词
  // 接受参数名为settings，类型为ChatSettings，返回值类型为string
  private generateSystemPrompt(settings: ChatSettings): string {
    //如果这些变量被设置为'custom'自定义，则使用自定义的配置值，否则使用默认值
    const scene = settings.scene === 'custom' ? settings.customScene : settings.scene;
    const aiRole = settings.aiRole === 'custom' ? settings.customAiRole : settings.aiRole;
    const userRole = settings.userRole === 'custom' ? settings.customUserRole : settings.userRole;
    
    // 根据设置的对话语言生成相应的提示词
    if (settings.dialogueLanguage === 'chinese') {
      return `你是一个口语练习助手。作为${aiRole}，你将全程以${aiRole}的身份与${userRole}在${scene}场景中进行对话。
        保持自然且符合场景和角色身份的对话流程，同时帮助用户练习口语技能。
        无论用户使用什么语言，你都必须严格使用中文回复。
        你的回复必须严格遵循${scene}的场景设定和${aiRole}的角色设定，尽可能贴合${aiRole}的角色身份和言语风格，不能偏离设定。
        无论在什么情况下，你都应当展现出${aiRole}应有的特点，确保每次互动都严格按照该角色的设定进行。
        ${settings.grammarCheck ? '同时，请指出用户输入中的语法错误。' : ''}`;
    } else {
      return `You are a speaking practice assistant. As ${aiRole}, you will interact with ${userRole} throughout the conversation in the ${scene} setting, fully adopting the identity of ${aiRole}. 
        Please maintain a natural conversation flow that is consistent with the scene and role identity, while helping the user practice their speaking skills.
        Regardless of the language the user uses, you must respond strictly in English.
        Your responses must strictly follow the scene setting of ${scene} and the role setting of ${aiRole}, closely aligning with ${aiRole}'s identity, speaking style, and behavior. You must not deviate from the established role. 
        In any situation, you should demonstrate the characteristics of ${aiRole}, ensuring every interaction strictly adheres to the role's design.
        ${settings.grammarCheck ? 'Also, kindly point out any grammar mistakes in the user\'s input.' : ''}`;
    }
  }

  private getConversationId(settings: ChatSettings): string { // 生成唯一的conversationid 用于标识对话
    return `${settings.scene}_${settings.userRole}_${settings.aiRole}_${settings.dialogueLanguage}`;
  }

  // 管理对话历史记录，最终返回的是conversationID
  private getOrCreateConversation(settings: ChatSettings): Message[] {
    const conversationId = this.getConversationId(settings);
    if (!this.conversationHistory.has(conversationId)) { // 检查是否已经存在该对话历史记录
      // 当对话历史记录不存在时，系统会创建一条由 system 角色发送的消息，这条消息用于初始化对话
      const systemMessage: Message = {
        role: 'system',
        content: this.generateSystemPrompt(settings)
      };
      this.conversationHistory.set(conversationId, [systemMessage]); // 将新创建的对话历史保存到其中
    }
    return this.conversationHistory.get(conversationId)!; // !表示返回结果不能为null或undefined
  }//并且最终返回的是conversationID

  // 生成ai的回复
  async generateResponse(message: string, settings: ChatSettings): Promise<{ message: string; translation?: string }> {
    try {
      console.log('开始生成响应:', { message, settings }); //这里的message是字符串类型的参数，表示用户输入的信息

      // 是否开启实时翻译
      let needsTranslation = settings.realTimeTranslation;

      // 获取当前对话的消息历史
      const messages = this.getOrCreateConversation(settings);

      // 添加用户的新消息
      messages.push({
        role: 'user',
        content: message
      });

      // 生成主要响应
      console.log('调用 deepseek API 生成主要响应，消息历史:', messages);

      const primaryResponse = await this.openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 1.3, 
        max_tokens: 1000  // 限制回复长度
      });

      const primaryMessage = primaryResponse.choices[0].message.content || '';
      console.log('获得主要响应:', primaryMessage);

      // 将AI的响应添加到历史记录
      messages.push({
        role: 'assistant',
        content: primaryMessage
      });

      // 更新对话历史
      this.conversationHistory.set(this.getConversationId(settings), messages);

      // 如果需要翻译
      let translation: string | undefined;
      if (needsTranslation) {
        console.log('开始生成翻译');
        const targetLanguage = settings.dialogueLanguage === 'english' ? 'chinese' : 'english';
        const translationResponse = await this.openai.chat.completions.create({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are a translator. Please translate the following ${settings.dialogueLanguage} text to ${targetLanguage}. 
                       Maintain the same tone and meaning while making it natural in the target language.`
            },
            {
              role: 'user',
              content: primaryMessage
            }
          ]
        });

        translation = translationResponse.choices[0].message.content || undefined;
        console.log('获得翻译:', translation);
      }

      return {
        message: primaryMessage,
        translation
      };
    } catch (error) {
      console.error('AI服务错误:', error);
      if (error instanceof Error) {
        throw new Error(`AI服务错误: ${error.message}`);
      } else {
        throw new Error('AI服务未知错误');
      }
    }
  }
} 