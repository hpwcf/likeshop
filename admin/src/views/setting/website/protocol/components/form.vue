<template>
    <popup
        class="inline mr-2"
        ref="popupRef"
        :async="true"
        :clickModalClose="false"
        :title="btnText"
        :center="true"
        @close="handleClose(formRef)"
        @open="handleOpen"
        @confirm="onSubmit(formRef)"
        width="800px"
    >
        <template #trigger>
            <el-button v-if="type === 'primary'" type="primary">{{ btnText }}</el-button>
            <el-link v-if="btnText === '编辑'" type="primary" :underline="false">
                {{ btnText }}
            </el-link>
        </template>

        <el-form ref="formRef" :model="formData" label-width="120px" class="demo-formData">
            <el-form-item label="文本名称:" prop="title" required>
                <el-input class="w-[550px]" v-model="formData.title" />
            </el-form-item>
            <el-form-item label="文本内容:" prop="content" required>
                <editor class="mb-10" v-model="formData.content" height="500" width="550"></editor>
            </el-form-item>
        </el-form>
    </popup>
</template>
<script lang="ts" setup>
import Popup from '@/components/popup/index.vue'
import { apiProtocolDetail, apiProtocolEdit, apiProtocolAdd } from '@/api/setting/protocol'
import { ref, reactive, watchEffect, withDefaults, defineEmits } from 'vue'
import type { ElForm } from 'element-plus'

interface formDataObj {
    title: string
    content: string
}

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()

const prop = withDefaults(
    defineProps<{
        type?: string
        id?: string | number
        btnText: string
    }>(),
    {
        type: 'add',
        id: '',
        btnText: ''
    }
)

const emit = defineEmits(['refresh'])

const formData = ref<formDataObj>({
    title: '',
    content: ''
})

const popupRef = ref<any>(null)

// 弹窗关闭
const handleClose = (formEl: FormInstance | undefined): void => {
    if (!formEl) return
    formEl.resetFields()
}

// 弹窗打开
const handleOpen = (): void => {
    // 请求详情 => 如果是编辑的话
    if (prop.id) getDetail(prop.id)
}

// 获取详情
const getDetail = async (id: number | string): Promise<void> => {
    const res = await apiProtocolDetail({ id })
    formData.value = res
}

// 添加
const handleCategoryAdd = async (): Promise<void> => {
    await apiProtocolAdd({ ...formData.value })
    emit('refresh')
}

// 编辑
const handleCategoryEdit = async (): Promise<void> => {
    await apiProtocolEdit({ ...formData.value })
    emit('refresh')
}

// 提交
const onSubmit = (formEl: FormInstance | undefined): void => {
    if (!formEl) return
    formEl.validate(async (valid): Promise<boolean | undefined> => {
        if (!valid) return false
        if (!prop.id) await handleCategoryAdd()
        else await handleCategoryEdit()
        popupRef.value.visible = false
    })
}
</script>

<style lang="scss" scoped>
.el-dialog__header {
    text-align: left;
    font-size: 16px;
    color: #101010;
}
.ls-input,
.select {
    width: 340px;
}
</style>
