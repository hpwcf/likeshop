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
            <el-form-item label="项目名称:" prop="name">
                <el-input class="ls-input" v-model="formData.name" maxlength="10" show-word-limit />
            </el-form-item>
            <el-form-item label="价格:" prop="price">
                <el-input class="ls-input" v-model="formData.price" type="number"
                    ><template #append>元</template></el-input
                >
            </el-form-item>
            <el-form-item label="时长:" prop="duration">
                <el-input class="ls-input" v-model="formData.duration" type="number"
                    ><template #append>分钟</template></el-input
                >
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
import {
    apiServiceAdditionalAdd,
    apiServiceAdditionalEdit,
    apiServiceAdditionalDetail
} from '@/api/service/additional'
import { ref, reactive, watchEffect, withDefaults, defineEmits } from 'vue'
import type { ElForm } from 'element-plus'

interface formDataObj {
    goods_id?: string | number | null
    name?: string | Array<object>
    price?: number | null | Array<object>
    duration?: number | null | Array<object>
    status?: number | Array<object>
}

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()

const prop = withDefaults(
    defineProps<{
        type?: string
        id?: string | number
        btnText: string
        goodsId: string | number | null
    }>(),
    {
        type: 'add',
        id: '',
        btnText: '',
        goodsId: null
    }
)

const emit = defineEmits(['refresh'])

const formData = ref<formDataObj>({
    goods_id: prop.goodsId,
    name: '',
    price: null,
    duration: null,
    status: 1
})

// 表单校验规则
const rules = reactive<formDataObj>({
    name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
    price: [{ required: true, message: '请输入价格', trigger: 'change' }],
    duration: [{ required: true, message: '请输入时长', trigger: 'change' }],
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
    const res = await apiServiceAdditionalDetail({ id })
    formData.value = res
}

// 添加
const handleCategoryAdd = async (): Promise<void> => {
    await apiServiceAdditionalAdd({ ...formData.value })
    emit('refresh')
}

// 编辑
const handleCategoryEdit = async (): Promise<void> => {
    await apiServiceAdditionalEdit({ ...formData.value })
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
