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
            <el-form-item label="技能名称:" prop="name">
                <el-input class="ls-input" v-model="formData.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="状态:" prop="status">
                <el-switch
                    v-model="formData.status"
                    :active-text="formData.status ? '显示' : '隐藏'"
                    :active-value="1"
                    :inactive-value="0"
                />
            </el-form-item>
        </el-form>
    </popup>
</template>
<script lang="ts" setup>
import Popup from '@/components/popup/index.vue'
import { apiStaffSkillAdd, apiStaffSkillEdit, apiStaffSkillDetail } from '@/api/master_worker/skill'
import { ref, reactive, watchEffect, withDefaults, defineEmits } from 'vue'
import type { ElForm } from 'element-plus'

interface formDataObj {
    name?: string | Array<object>
    status?: number | Array<object>
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
    name: '',
    status: 1
})

// 表单校验规则
const rules = reactive<formDataObj>({
    name: [{ required: true, message: '请输入技能名称', trigger: 'blur' }],
    status: [{ required: true, message: '是否显示', trigger: 'change' }]
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

// 获取详情
const getCategoryDetail = async (id: number | string): Promise<void> => {
    const res = await apiStaffSkillDetail({ id })
    formData.value = res
}

// 添加
const handleCategoryAdd = async (): Promise<void> => {
    await apiStaffSkillAdd({ ...formData.value })
    emit('refresh')
}

// 编辑
const handleCategoryEdit = async (): Promise<void> => {
    await apiStaffSkillEdit({ ...formData.value })
    emit('refresh')
}

// 提交
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
