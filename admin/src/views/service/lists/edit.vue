<template>
    <el-card shadow="never" class="!border-none">
        <el-page-header :content="id ? '编辑服务' : '新增服务'" @back="$router.back()" />
    </el-card>

    <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="demo-formData"
    >
        <el-card
            class="!border-none"
            shadow="never"
            body-style="padding: 0"
            style="margin-top: 15px"
        >
            <el-tabs v-model="activeName">
                <!-- 基础设置 -->
                <el-tab-pane label="基础设置" name="basic">
                    <basic v-model="formData"></basic>
                </el-tab-pane>

                <!-- 服务价格 -->
                <el-tab-pane label="服务价格" name="price">
                    <price v-model="formData"></price>
                </el-tab-pane>

                <!-- 服务详情 -->
                <el-tab-pane label="服务详情" name="details">
                    <div class="xl:flex">
                        <editorVue v-model="formData.content" width="640" height="664"></editorVue>
                        <div class="detail ml-[30px]">
                            <div class="title">- 服务详情 -</div>
                            <div class="p-[0.6rem] break-words" v-html="formData.content"></div>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- 销售设置 -->
                <el-tab-pane label="销售设置" name="sales">
                    <sales v-model="formData"></sales>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </el-form>

    <footer-btns>
        <el-button v-if="activeName != 'basic'" @click="onNextStep(false)">上一步</el-button>
        <el-button v-if="activeName != 'sales'" type="primary" @click="onNextStep">
            下一步
        </el-button>
        <el-button v-else type="primary" @click="onSubmit()">保存</el-button>
    </footer-btns>
</template>

<script lang="ts" setup>
import { apiServiceAdd, apiServiceEdit, apiServiceDetail } from '@/api/service/lists'
import { ref, nextTick } from 'vue'
import basic from './components/basic.vue'
import editorVue from '@/components/editor/index.vue'
import FooterBtns from '@/components/footer-btns/index.vue'
import type { ElForm } from 'element-plus'
import sales from './components/sales.vue'
import price from './components/price.vue'
import type { formDataObj } from '@/api/service/lists'
import feedback from '@/utils/feedback'

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()

const route = useRoute()
const router = useRouter()
const id: any = route.query.id

// 切换索引
const activeName = ref<string>('basic')
// 表单数据
const formData = ref<formDataObj>({
    type: 1,
    name: '',
    remarks: '',
    category_id: '',
    skill_id: '',
    label: '',
    goods_image: [],
    open_city_id: [],
    appoint_start_time: '',
    appoint_end_time: '',
    content: '',
    virtual_sale_num: '',
    earnings_ratio: '',
    sort: '',
    status: 0,
    sku_type: 0,
    sku_name_list: [
        {
            name: '',
            value: [
                {
                    value: ''
                }
            ]
        }
    ],
    sku: [
        {
            id: '',
            ids: [],
            sku_value_arr: [],
            price: '',
            line_price: '',
            duration: ''
        }
    ]
})

// 表单校验规则
const rules = ref<object>({
    name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
    category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
    skill_id: [{ required: true, message: '请选择技能', trigger: 'change' }],
    goods_image: [{ required: true, message: '请上传轮播图', trigger: 'change' }],
    appoint_start_time: [{ required: true, message: '请输入预约开始时间', trigger: 'blur' }],
    appoint_end_time: [{ required: true, message: '请输入预约结束时间', trigger: 'blur' }],
    earnings_ratio: [{ required: true, message: '请输入服务佣金', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    sku_type: [{ required: true, message: '请选择规格类型', trigger: 'blur' }]
})

// 获取详情
const getServiceDetail = async (): Promise<void> => {
    ;(formData.value as any) = await apiServiceDetail({ id })
}

// 添加
const handleServiceAdd = async (): Promise<void> => {
    await apiServiceAdd({ ...formData.value })
    router.back()
}

// 编辑
const handleServiceEdit = async (): Promise<void> => {
    await apiServiceEdit({ ...formData.value })
    router.back()
}

// 提交
const onSubmit = (): void => {
    formRef.value?.validate((valid, requiredFields: any) => {
        // 基础设置必填字段
        const basicFields = [
            'name',
            'category_id',
            'skill_id',
            'goods_image',
            'appoint_start_time',
            'appoint_end_time'
        ]
        // 服务价格必填字段
        const priceFields = ['sku_type', 'price', 'duration']
        // 销售设置必填字段
        const salesFields = ['earnings_ratio', 'status']
        for (const key in requiredFields) {
            if (basicFields.includes(key)) activeName.value = 'basic'
            else if (priceFields.includes(key)) activeName.value = 'price'
            else if (salesFields.includes(key)) activeName.value = 'sales'
            feedback.msgError(requiredFields[key][0].message)
            return
        }
        if (valid) {
            if (!id) handleServiceAdd()
            else handleServiceEdit()
        }
    })
}

const onNextStep = (isNext = true) => {
    switch (activeName.value) {
        case 'basic':
            activeName.value = 'price'
            break
        case 'price':
            activeName.value = isNext ? 'details' : 'basic'
            break
        case 'details':
            activeName.value = isNext ? 'sales' : 'price'
            break
        case 'sales':
            activeName.value = 'details'
            break
    }
}

//编辑获取详情
if (id) getServiceDetail()

nextTick(() => {
    formRef.value?.resetFields()
})
</script>

<style lang="scss">
.el-tabs__header {
    padding: 0 20px;
    border-bottom: 1px solid #e5e5e5;
}

.el-tabs__content {
    padding: 20px;
}

.detail {
    width: 375px;
    height: 662px;
    overflow: auto;
    border: 1px solid #e5e5e5;

    .title {
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e5e5e5;
    }
}
</style>
