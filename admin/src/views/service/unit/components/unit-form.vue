<template>
    <popup
        class="mr-2 inline"
        ref="popupRef"
        :async="true"
        :clickModalClose="false"
        :title="btnText"
        :center="true"
        @close="handleClose(unitFormRef)"
        @open="handleOpen"
        @confirm="onSubmit(unitFormRef)"
        width="550px"
    >
        <template #trigger>
            <el-button v-if="type === 'primary'" type="primary">{{ btnText }}</el-button>
            <el-link
                v-if="btnText === '编辑' || btnText === '新增单位'"
                type="primary"
                :underline="false"
            >
                {{ btnText }}
            </el-link>
        </template>

        <el-form
            class="unit-form"
            :model="unitForm"
            ref="unitFormRef"
            :rules="rules"
            label-width="80px"
        >
            <el-form-item label="单位名称" prop="name">
                <el-input class="ls-input w-56" v-model="unitForm.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input class="ls-input" v-model="unitForm.sort" placeholder="请输入" />
                <div class="form-tips">数字越大，排序越靠前，默认排序号为0</div>
            </el-form-item>
        </el-form>
    </popup>
</template>

<script lang="ts" setup>
import { apiUnitAdd, apiUnitEdit, apiUnitDetail } from '@/api/service/unit'
import Popup from '@/components/popup/index.vue'
import { ref, reactive, withDefaults, defineEmits } from 'vue'
import type { ElForm } from 'element-plus'

interface unitFormObj {
    name?: string
    sort?: number
}
type FormInstance = InstanceType<typeof ElForm>
const unitFormRef = ref<FormInstance>()

const props = withDefaults(
    defineProps<{
        type?: string
        id?: object | any
        btnText: string
    }>(),
    {
        type: 'add',
        id: '',
        btnText: ''
    }
)

const emit = defineEmits(['refresh'])

const unitForm = ref<unitFormObj>({
    name: '',
    sort: 0
})

// 表单娇艳规则
const rules = reactive<object>({
    name: [{ required: true, message: '请输入单位', trigger: 'blur' }]
})

const popupRef = ref<any>(null)

// 弹窗关闭
const handleClose = (formEl: FormInstance | undefined): void => {
    if (!formEl) return
    formEl.resetFields()
}

// 弹窗打开时
const handleOpen = (): void => {
    if (props.id) getUnitDetail(props.id)
}

// 获取单位详情
const getUnitDetail = async (id: number): Promise<void> => {
    ;(unitForm.value as object) = await apiUnitDetail({ id })
}

// 添加单位
const unitAdd = async (): Promise<void> => {
    await apiUnitAdd({ ...unitForm.value })
    emit('refresh')
}

// 编辑单位
const unitEdit = async (): Promise<void> => {
    await apiUnitEdit({ ...unitForm.value, id: props.id })
    emit('refresh')
}

// 提交数据
const onSubmit = (formEl: FormInstance | undefined): void => {
    if (!formEl) return
    formEl.validate((valid): boolean | undefined => {
        if (!valid) return false
        if (!props.id) unitAdd()
        else unitEdit()
        popupRef.value.visible = false
    })
}
</script>

<style lang="scss">
.el-dialog__header {
    text-align: left;
    font-size: 16px;
    color: #101010;
}
.ls-input {
    width: 340px;
}
.unit-form {
    margin-top: 30px;
    margin-bottom: 100px;
}
</style>
