<template>
    <popup
        class="mr-2"
        width="450px"
        :center="true"
        @confirm="handleReply"
        @open="getCommentDetail"
        :title="title"
    >
        <template #trigger>
            <el-link type="primary" :underline="false">{{ title }}</el-link>
        </template>
        <div style="height: 300px">
            <el-form ref="commentFormRef" :model="commentForm" label-width="80px">
                <el-form-item label="回复评价:">
                    <el-input
                        class="ls-input"
                        type="textarea"
                        v-model="commentForm.reply"
                        placeholder="请输入"
                        :rows="10"
                    />
                </el-form-item>
            </el-form>
        </div>
    </popup>
</template>

<script lang="ts" setup>
import { apiCommentReply, apiCommentDetail } from '@/api/service/evaluate'
import Popup from '@/components/popup/index.vue'
import { ref, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refresh'])

const props = withDefaults(
    defineProps<{
        id: string | number //评价ID
        title: string
    }>(),
    {
        id: '',
        title: ''
    }
)

const commentForm = ref({
    reply: '' as string
})

// 商家备注
const handleReply = async (): Promise<void> => {
    if (commentForm.value.reply.split(' ').join('').length === 0) {
        ElMessage({ type: 'error', message: '请输入回复评价' })
        return
    }
    await apiCommentReply({ id: props.id, remark: commentForm.value.reply })
    emit('refresh')
}

// 商家备注详情
const getCommentDetail = async (): Promise<void> => {
    ;(commentForm.value as object) = await apiCommentDetail({ id: props.id })
}
</script>

<style lang="scss" scoped>
.ls-input {
    width: 30vw;
}
</style>
