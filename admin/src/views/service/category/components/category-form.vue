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
            <el-form-item label="分类名称:" prop="name">
                <el-input class="ls-input" v-model="formData.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="父级分类:" prop="pid">
                <el-radio v-model="isParent" :label="0">无父级分类</el-radio>
                <el-radio v-model="isParent" :label="1">有父级分类</el-radio>

                <div class="m-t-15" v-show="isParent">
                    <el-cascader
                        class="mr-2 select"
                        v-model="formData.pid"
                        :options="categoryData"
                        :props="props"
                        clearable
                    />
                </div>
            </el-form-item>
            <el-form-item label="分类图片:" prop="image">
                <div>
                    <material-picker v-model="formData.image" :limit="1" />
                    <div class="form-tips">建议尺寸：宽200像素*高200像素的jpg，jpeg，png图片</div>
                </div>
            </el-form-item>
            <el-form-item label="排序:">
                <el-input class="ls-input" v-model="formData.sort" placeholder="请输入" />
                <div class="form-tips">数字越大，排序越靠前，默认排序号为0</div>
            </el-form-item>
            <!-- <el-form-item label="首页推荐:" v-if="!isParent">
                <el-switch
                    v-model="formData.is_recommend"
                    :active-text="formData.is_recommend ? '推荐' : '不推荐'"
                    :active-value="1"
                    :inactive-value="0"
                />
            </el-form-item> -->
            <el-form-item label="状态:" prop="is_show">
                <el-switch
                    v-model="formData.is_show"
                    :active-text="formData.is_show ? '显示' : '隐藏'"
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
    apiCategoryAdd,
    apiCategoryEdit,
    apiCategoryCommonLists,
    apiCategoryDetail
} from '@/api/service/category'
import { ref, reactive, watchEffect, withDefaults, defineEmits } from 'vue'
import MaterialPicker from '@/components/material/picker.vue'
import type { ElForm } from 'element-plus'

interface formDataObj {
    name?: string | Array<object>
    pid?: number | string | Array<object>
    image?: string | Array<object>
    sort?: number
    is_show?: number | Array<object>
    is_recommend?: number
}
interface Lists {
    name: string
    id: number | string
}

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()

const prop = withDefaults(
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

// 是否有父级分类
const isParent = ref<string | number | undefined>(0)
const categoryData = ref<Array<Lists> | null>([])
const formData = ref<formDataObj>({
    name: '',
    pid: '',
    image: '',
    sort: 0,
    is_show: 1,
    is_recommend: 0
})

// 表单校验规则
const rules = reactive<formDataObj>({
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    pid: [{ required: true, message: '请选父级分类', trigger: ['blur', 'change'] }] as any[],
    is_show: [{ required: true, message: '是否显示', trigger: 'change' }]
})

const props = reactive({
    multiple: false,
    checkStrictly: true,
    label: 'name',
    value: 'id',
    emitPath: false
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
    // 请求通用列表
    getCategoryLists()
}

// 获取分类详情
const getCategoryDetail = async (id: number): Promise<void> => {
    const res = await apiCategoryDetail({ id })
    formData.value = res
    isParent.value = formData.value.pid === '' ? 0 : 1
}

// 获取分类通用列表
const getCategoryLists = async (): Promise<void> => {
    ;(categoryData.value as object) = await apiCategoryCommonLists()
}

// 添加分类
const handleCategoryAdd = async (): Promise<void> => {
    await apiCategoryAdd({ ...formData.value })
    emit('refresh')
}

// 编辑分类
const handleCategoryEdit = async (): Promise<void> => {
    await apiCategoryEdit({ ...formData.value })
    emit('refresh')
}

// 提交分类数据
const onSubmit = (formEl: FormInstance | undefined): void => {
    if (!isParent.value) {
        rules.pid = []
        formData.value.pid = ''
    } else {
        rules.pid = [{ required: true, message: '请选父级分类', trigger: ['blur', 'change'] }]
    }
    if (!formEl) return
    formEl.validate((valid): boolean | undefined => {
        if (!valid) return false
        if (!prop.id) handleCategoryAdd()
        else handleCategoryEdit()
        popupRef.value.visible = false
    })
}

watchEffect(() => {
    if (!isParent.value) {
        formRef?.value?.clearValidate(['pid'])
    }
})
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
