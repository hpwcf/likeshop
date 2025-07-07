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
        width="550px"
    >
        <template #trigger>
            <el-button v-if="type === 'primary'" type="primary">{{ btnText }}</el-button>
            <el-link v-if="btnText === '编辑'" type="primary" :underline="false">
                {{ btnText }}
            </el-link>
        </template>

        <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="120px"
            class="demo-formData"
        >
            <el-form-item label="key:" prop="key">
                <el-input class="ls-input" v-model="formData.key" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="类型:" prop="type">
                <el-select v-model="formData.type" class="ls-input">
                    <el-option label="腾讯地图" :value="1" />
                </el-select>
            </el-form-item>
        </el-form>
    </popup>
</template>
<script lang="ts" setup>
import Popup from '@/components/popup/index.vue'
import { apiMapKeyAdd, apiMapKeyEdit, apiMapKeyDetail } from '@/api/setting/map'
import { ref, reactive, watchEffect, withDefaults, defineEmits } from 'vue'
import type { ElForm } from 'element-plus'

interface formDataObj {
    key?: string | Array<object>
    type?: number | Array<object>
}

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const formData = ref<formDataObj>({
    key: '',
    type: 1
})

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

// 表单校验规则
const rules = reactive<formDataObj>({
    key: [{ required: true, message: '请输入key', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: ['blur', 'change'] }] as any[]
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
    if (prop.id) getCategoryDetail(prop.id)
}

// 详情
const getCategoryDetail = async (id: number): Promise<void> => {
    const res = await apiMapKeyDetail({ id })
    formData.value = res
}

// 添加
const handleCategoryAdd = async (): Promise<void> => {
    await apiMapKeyAdd({ ...formData.value })
    emit('refresh')
}

// 编辑
const handleCategoryEdit = async (): Promise<void> => {
    await apiMapKeyEdit({ ...formData.value })
    emit('refresh')
}

// 提交数据
const onSubmit = (formEl: FormInstance | undefined): void => {
    if (!formEl) return
    formEl.validate((valid): boolean | undefined => {
        if (!valid) return false
        if (!prop.id) handleCategoryAdd()
        else handleCategoryEdit()
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
