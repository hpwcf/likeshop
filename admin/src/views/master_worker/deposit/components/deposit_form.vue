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
            <el-form-item label="保证金名称:" prop="name">
                <el-input class="ls-input" v-model="formData.name" maxlength="10" show-word-limit />
            </el-form-item>
            <el-form-item label="保证金金额:" prop="amount">
                <el-input class="ls-input" v-model="formData.amount" type="number"
                    ><template #append>元</template></el-input
                >
            </el-form-item>
            <el-form-item label="日接单数量:" prop="order_num">
                <el-input class="ls-input" v-model="formData.order_num" type="number"
                    ><template #append>单</template></el-input
                >
            </el-form-item>
        </el-form>
    </popup>
</template>
<script lang="ts" setup>
import Popup from '@/components/popup/index.vue'
import {
    apiStaffDepositAdd,
    apiStaffDepositEdit,
    apiStaffDepositDetail
} from '@/api/master_worker/deposit'
import { ref, reactive, watchEffect, withDefaults, defineEmits } from 'vue'
import type { ElForm } from 'element-plus'

interface formDataObj {
    name?: string | Array<object>
    amount?: number | null | Array<object>
    order_num?: number | null | Array<object>
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
    amount: null,
    order_num: null
})

// 表单校验规则
const rules = reactive<formDataObj>({
    name: [{ required: true, message: '请输入保证金名称', trigger: 'blur' }],
    amount: [{ required: true, message: '请输入保证金金额', trigger: 'blur' }],
    order_num: [{ required: true, message: '请输入日接单数量', trigger: 'blur' }]
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
    const res = await apiStaffDepositDetail({ id })
    formData.value = res
}

// 添加
const handleCategoryAdd = async (): Promise<void> => {
    await apiStaffDepositAdd({ ...formData.value })
    emit('refresh')
}

// 编辑
const handleCategoryEdit = async (): Promise<void> => {
    await apiStaffDepositEdit({ ...formData.value })
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
