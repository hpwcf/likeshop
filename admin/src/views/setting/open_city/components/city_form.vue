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
            <el-form-item label="省:" prop="province_id">
                <el-select
                    class="mr-2 w-[340px]"
                    v-model="formData.province_id"
                    placeholder="请选择"
                    @change="changeProvince"
                >
                    <el-option
                        v-for="item in area"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="市:" prop="city_id">
                <el-select class="mr-2 w-[340px]" v-model="formData.city_id" placeholder="请选择">
                    <el-option
                        v-for="item in cityData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input class="ls-input" v-model="formData.sort" type="number" />
            </el-form-item>
        </el-form>
    </popup>
</template>
<script lang="ts" setup>
import Popup from '@/components/popup/index.vue'
import { apiOpenCityAdd, apiOpenCityEdit, apiOpenCityDetail } from '@/api/setting/open_city'
import { ref, reactive, watchEffect, withDefaults, defineEmits } from 'vue'
import type { ElForm } from 'element-plus'
import area from '@/utils/area'

interface formDataObj {
    province_id?: number | null | Array<object>
    city_id?: number | null | Array<object>
    sort?: number | null | Array<object>
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
    province_id: null,
    city_id: null,
    sort: 0
})

// 表单校验规则
const rules = reactive<formDataObj>({
    province_id: [{ required: true, message: '请选择省', trigger: 'change' }],
    city_id: [{ required: true, message: '请选择市', trigger: 'change' }]
})

const popupRef = ref<any>(null)

//选择省
const cityData = ref([]) as any
const changeProvince = () => {
    cityData.value = area.find((item) => item.value == formData.value.province_id)?.children || []
    formData.value.city_id = null
}

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
    const res = await apiOpenCityDetail({ id })
    formData.value = res
    cityData.value = area.find((item) => item.value == formData.value.province_id)?.children || []
}

// 添加
const handleCategoryAdd = async (): Promise<void> => {
    await apiOpenCityAdd({ ...formData.value })
    emit('refresh')
}

// 编辑
const handleCategoryEdit = async (): Promise<void> => {
    await apiOpenCityEdit({ ...formData.value })
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
