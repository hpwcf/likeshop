<template>
    <el-card shadow="never">
        <el-page-header :content="id ? '编辑分类' : '新增分类'" @back="$router.back()" />
    </el-card>

    <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="demo-formData"
    >
        <el-card shadow="never" style="margin-top: 15px">
            <el-form-item label="分类名称:" prop="name">
                <el-input class="ls-input" v-model="formData.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="父级分类:" prop="pid">
                <el-radio v-model="isParent" :label="0">无父级分类</el-radio>
                <el-radio v-model="isParent" :label="1">有父级分类</el-radio>

                <div class="m-t-15" v-show="isParent">
                    <el-cascader
                        class="select m-r-10"
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
                <el-input class="ls-input" v-model="formData.sort" placeholder="请输入"></el-input>
                <div class="form-tips">数字越大，排序越靠前，默认排序号为0</div>
            </el-form-item>
            <el-form-item label="首页推荐:" v-if="!isParent">
                <el-switch
                    v-model="formData.is_recommend"
                    :active-text="formData.is_recommend ? '推荐' : '不推荐'"
                    :active-value="1"
                    :inactive-value="0"
                />
            </el-form-item>
            <el-form-item label="状态:" prop="is_show">
                <el-switch
                    v-model="formData.is_show"
                    :active-text="formData.is_show ? '显示' : '隐藏'"
                    :active-value="1"
                    :inactive-value="0"
                />
            </el-form-item>
        </el-card>
    </el-form>

    <footer-btns>
        <el-button type="primary" @click="onSubmit(formRef)">保存</el-button>
    </footer-btns>
</template>

<script lang="ts" setup>
import {
    apiCategoryAdd,
    apiCategoryEdit,
    apiCategoryCommonLists,
    apiCategoryDetail
} from '@/api/service/category'
import { ref, reactive, watchEffect } from 'vue'
import FooterBtns from '@/components/footer-btns/index.vue'
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

const route = useRoute()
const router = useRouter()
const id: any = route.query.id

// 是否有父级分类
const isParent = ref<string | number | undefined>(0)
const categoryData = ref<Array<Lists> | null>([])
const formData = ref<formDataObj>({
    name: '',
    pid: '',
    image: '',
    sort: 0,
    is_show: 0,
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

// 获取分类详情
const getCategoryDetail = async (id: number): Promise<void> => {
    const res = await apiCategoryDetail({ id })
    formData.value = res
    console.log('pid', formData.value)

    isParent.value = formData.value.pid === '' ? 0 : 1
}

// 获取分类通用列表
const getCategoryLists = async (): Promise<void> => {
    ;(categoryData.value as object) = await apiCategoryCommonLists()
}

// 添加分类
const handleCategoryAdd = async (): Promise<void> => {
    await apiCategoryAdd({ ...formData.value })
    router.back()
}

// 编辑分类
const handleCategoryEdit = async (): Promise<void> => {
    await apiCategoryEdit({ ...formData.value })
    router.back()
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
        if (!id) handleCategoryAdd()
        else handleCategoryEdit()
    })
}

watchEffect(() => {
    if (!isParent.value) {
        formRef?.value?.clearValidate(['pid'])
    }
})

// 请求通用列表
getCategoryLists()

// 请求详情 => 如果是编辑的话
if (id) getCategoryDetail(id)
</script>

<style lang="scss" scoped>
.ls-input,
.select {
    width: 340px;
}
</style>
