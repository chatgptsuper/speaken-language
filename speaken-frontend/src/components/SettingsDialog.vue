<template>
  <el-dialog
    v-model="dialogVisible"
    title="对话设置"
    width="50%"
  >
    <el-form :model="form" label-width="120px">
      <!-- 场景选择 -->
      <el-form-item label="对话场景">
        <el-select v-model="form.scene" class="w-full">
          <el-option label="日常购物" value="shopping" />
          <el-option label="餐厅点餐" value="restaurant" />
          <el-option label="旅游问询" value="travel" />
          <el-option label="商务会议" value="business" />
          <el-option label="学术讨论" value="academic" />
          <el-option label="雅思口语" value="ielts" />
          <el-option label="托福口语" value="toefl" />
        </el-select>
      </el-form-item>

      <!-- 自定义场景 -->
      <el-form-item label="自定义场景">
        <el-input
          v-model="form.customScene"
          placeholder="请输入自定义场景描述..."
        />
      </el-form-item>

      <!-- 角色选择 -->
      <el-form-item label="您的角色">
        <el-select v-model="form.userRole" class="w-full">
          <el-option label="学生" value="student" />
          <el-option label="顾客" value="customer" />
          <el-option label="游客" value="tourist" />
          <el-option label="面试者" value="interviewee" />
          <el-option label="商务人士" value="businessman" />
        </el-select>
      </el-form-item>

      <!-- AI角色 -->
      <el-form-item label="AI角色">
        <el-select v-model="form.aiRole" class="w-full">
          <el-option label="老师" value="teacher" />
          <el-option label="店员" value="clerk" />
          <el-option label="导游" value="guide" />
          <el-option label="面试官" value="interviewer" />
          <el-option label="商务伙伴" value="partner" />
        </el-select>
      </el-form-item>

      <!-- 语音角色 -->
      <el-form-item label="语音角色">
        <el-select v-model="form.voiceRole" class="w-full">
          <el-option label="度逍遥" value="5003" />
          <el-option label="度小鹿" value="5118" />
          <el-option label="度博文" value="106" />
          <el-option label="度小童" value="110" />
          <el-option label="度小萌" value="111" />
          <el-option label="度米朵" value="103" />
          <el-option label="度小娇" value="5" />
        </el-select>
      </el-form-item>

      <!-- 难度级别 -->
      <el-form-item label="难度级别">
        <el-rate v-model="form.difficulty" :max="3" />
      </el-form-item>

      <!-- 语法纠错设置 -->
      <el-form-item label="语法纠错">
        <el-switch v-model="form.grammarCheck" />
      </el-form-item>

      <!-- 实时翻译 -->
      <el-form-item label="实时翻译">
        <el-switch v-model="form.realTimeTranslation" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = ref(props.modelValue)

const form = ref({
  scene: 'shopping',
  customScene: '',
  userRole: 'customer',
  aiRole: 'clerk',
  voiceRole: '5003',
  difficulty: 1,
  grammarCheck: true,
  realTimeTranslation: false
})

const handleConfirm = () => {
  emit('confirm', form.value)
  dialogVisible.value = false
}

// 监听对话框显示状态
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
})

watch(() => dialogVisible.value, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped>
.w-full {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}

:deep(.el-dialog) {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.el-dialog__body) {
  padding: 2rem;
  max-height: calc(90vh - 150px);
  overflow-y: auto;
}

:deep(.el-form-item) {
  margin-bottom: 1.5rem;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input) {
  width: 100%;
}

:deep(.el-rate) {
  height: 32px;
  line-height: 32px;
}

@media (max-width: 1200px) {
  :deep(.el-dialog) {
    width: 90% !important;
  }
  
  :deep(.el-dialog__body) {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95% !important;
  }
  
  :deep(.el-dialog__body) {
    padding: 1rem;
  }
}
</style> 