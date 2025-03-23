// 预设场景类型
export type PresetScene = 'shopping' | 'restaurant' | 'travel' | 'business' | 'academic' | 'ielts' | 'toefl' | 'custom';

// 预设角色类型
export type PresetRole = 'student' | 'customer' | 'tourist' | 'interviewee' | 'businessman' | 'teacher' | 'clerk' | 'guide' | 'interviewer' | 'partner' | 'custom';

export interface ChatSettings {
  dialogueLanguage: 'english' | 'chinese' | 'auto';
  scene: PresetScene;           // 预设场景选项
  customScene: string;          // 当scene为'custom'时，这里存储用户自定义的场景描述
  userRole: PresetRole;         // 预设用户角色选项
  customUserRole: string;       // 当userRole为'custom'时，这里存储用户自定义的角色描述
  aiRole: PresetRole;           // 预设AI角色选项
  customAiRole: string;         // 当aiRole为'custom'时，这里存储用户自定义的角色描述
  voiceRole: string;           // 语音角色设置
  voiceSpeed: number;          // 语速设置
  grammarCheck: boolean;        // 是否开启语法检查
  realTimeTranslation: boolean; // 是否开启实时翻译
}

export interface ChatMessage { // interface 强制定义对象的结构
  content: string;             // 聊天消息内容
  translation?: string;        //翻译内容
  type: 'user' | 'system';     // 消息的类型
}

export interface ChatResponse {
  message: string;             //表示ai的回应消息
  translation?: string;        // 爱回应的翻译内容
} 