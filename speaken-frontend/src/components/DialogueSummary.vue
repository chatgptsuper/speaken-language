<template>
  <el-drawer
    v-model="drawerVisible"
    title="对话总结"
    direction="rtl"
    size="50%"
  >
    <div class="summary-container">
      <!-- 语法纠错部分 -->
      <section class="grammar-section">
        <h3 class="section-title">
          <el-icon><Warning /></el-icon>
          语法纠错
        </h3>
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(correction, index) in grammarCorrections"
            :key="index"
            :title="correction.original"
            :name="index"
          >
            <div class="correction-content">
              <div class="correction-item">
                <span class="label">正确表达：</span>
                <span class="correct-text">{{ correction.corrected }}</span>
              </div>
              <div class="correction-item">
                <span class="label">解释：</span>
                <span class="explanation">{{ correction.explanation }}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </section>

      <!-- 关键词汇部分 -->
      <section class="vocabulary-section">
        <h3 class="section-title">
          <el-icon><Collection /></el-icon>
          关键词汇
        </h3>
        <el-tag
          v-for="(word, index) in keyVocabulary"
          :key="index"
          class="vocabulary-tag"
          :type="word.type"
        >
          {{ word.text }}
          <el-tooltip
            :content="word.translation"
            placement="top"
            effect="light"
          >
            <el-icon class="ml-2"><InfoFilled /></el-icon>
          </el-tooltip>
        </el-tag>
      </section>

      <!-- 句型总结部分 -->
      <section class="patterns-section">
        <h3 class="section-title">
          <el-icon><Document /></el-icon>
          句型总结
        </h3>
        <el-card
          v-for="(pattern, index) in sentencePatterns"
          :key="index"
          class="pattern-card"
        >
          <template #header>
            <div class="pattern-header">
              <span>{{ pattern.pattern }}</span>
              <el-tag size="small" type="success">
                {{ pattern.usage }}
              </el-tag>
            </div>
          </template>
          <div class="pattern-examples">
            <div
              v-for="(example, idx) in pattern.examples"
              :key="idx"
              class="example-item"
            >
              <div>{{ example.english }}</div>
              <div class="example-translation">{{ example.chinese }}</div>
            </div>
          </div>
        </el-card>
      </section>

      <!-- 总体评价部分 -->
      <section class="evaluation-section">
        <h3 class="section-title">
          <el-icon><Star /></el-icon>
          总体评价
        </h3>
        <el-card class="evaluation-card">
          <div class="evaluation-scores">
            <div class="score-item">
              <span class="score-label">流畅度</span>
              <el-rate
                v-model="evaluation.fluency"
                disabled
                show-score
                text-color="#ff9900"
              />
            </div>
            <div class="score-item">
              <span class="score-label">准确性</span>
              <el-rate
                v-model="evaluation.accuracy"
                disabled
                show-score
                text-color="#ff9900"
              />
            </div>
            <div class="score-item">
              <span class="score-label">词汇量</span>
              <el-rate
                v-model="evaluation.vocabulary"
                disabled
                show-score
                text-color="#ff9900"
              />
            </div>
          </div>
          <div class="evaluation-comment">
            {{ evaluation.comment }}
          </div>
        </el-card>
      </section>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { Warning, Collection, InfoFilled, Document, Star } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const drawerVisible = ref(props.modelValue)
const activeNames = ref([0])

// 示例数据
const grammarCorrections = ref([
  {
    original: "I have went to the store",
    corrected: "I have gone to the store",
    explanation: "在现在完成时中，'go' 的过去分词是 'gone' 而不是 'went'"
  },
  {
    original: "If I will go there",
    corrected: "If I go there",
    explanation: "在条件句中，if 从句应使用一般现在时表示将来"
  }
])

const keyVocabulary = ref([
  { text: "negotiate", translation: "谈判，协商", type: "success" },
  { text: "compromise", translation: "妥协，折中", type: "warning" },
  { text: "perspective", translation: "观点，看法", type: "info" }
])

const sentencePatterns = ref([
  {
    pattern: "Would you mind if I...?",
    usage: "礼貌请求",
    examples: [
      {
        english: "Would you mind if I opened the window?",
        chinese: "您介意我打开窗户吗？"
      },
      {
        english: "Would you mind if I made a suggestion?",
        chinese: "您介意我提个建议吗？"
      }
    ]
  }
])

const evaluation = ref({
  fluency: 4,
  accuracy: 3.5,
  vocabulary: 4,
  comment: "整体表现不错，语言流畅自然。建议在使用高级词汇和复杂句型方面可以再加强。"
})

// 监听抽屉显示状态
watch(() => props.modelValue, (newVal) => {
  drawerVisible.value = newVal
})

watch(() => drawerVisible.value, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped>
.summary-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #409EFF;
  font-size: 1.2rem;
}

.grammar-section,
.vocabulary-section,
.patterns-section,
.evaluation-section {
  margin-bottom: 40px;
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.correction-content {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.correction-item {
  margin-bottom: 12px;
}

.label {
  color: #666;
  margin-right: 12px;
  font-weight: 500;
}

.correct-text {
  color: #67c23a;
  font-weight: 500;
  font-size: 1.1rem;
}

.vocabulary-tag {
  margin: 6px;
  padding: 8px 16px;
  font-size: 1rem;
}

.pattern-card {
  margin-bottom: 20px;
}

.pattern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.pattern-examples {
  margin-top: 12px;
}

.example-item {
  margin-bottom: 12px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.example-translation {
  color: #666;
  font-size: 0.95rem;
  margin-top: 8px;
}

.evaluation-scores {
  margin-bottom: 24px;
}

.score-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.score-label {
  width: 100px;
  color: #666;
  font-weight: 500;
}

.evaluation-comment {
  color: #333;
  line-height: 1.8;
  font-size: 1.1rem;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

:deep(.el-drawer) {
  max-width: 800px !important;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

:deep(.el-drawer__body) {
  padding: 0;
  overflow-y: auto;
}

@media (max-width: 1200px) {
  .summary-container {
    padding: 16px;
  }

  :deep(.el-drawer) {
    max-width: 90vw !important;
  }
}

@media (max-width: 768px) {
  .grammar-section,
  .vocabulary-section,
  .patterns-section,
  .evaluation-section {
    padding: 16px;
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .vocabulary-tag {
    margin: 4px;
    padding: 6px 12px;
  }

  .evaluation-comment {
    font-size: 1rem;
    padding: 12px;
  }
}
</style> 