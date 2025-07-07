<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-page-header content="编辑通知设置" @back="$router.back()" />
        </el-card>
        <el-form
            ref="formRef"
            :model="formData"
            label-width="auto"
            :rules="rules"
            v-loading="loading"
        >
            <div>
                <!-- 通知名称 -->
                <el-card class="!border-none mt-4" shadow="never">
                    <div class="font-medium mb-7">通知名称</div>
                    <el-form-item label="通知名称" prop="scene_name">
                        {{ formData.scene_name }}
                    </el-form-item>
                    <el-form-item label="通知类型" prop="type"> {{ formData.type }} </el-form-item>
                    <el-form-item label="通知业务" prop="scene_desc">
                        {{ formData.scene_desc }}
                    </el-form-item>
                </el-card>

                <!-- 短信通知 -->
                <el-card class="!border-none mt-4" shadow="never">
                    <div class="font-medium mb-7">短信通知</div>
                    <el-form-item label="开启状态" prop="sms_notice.status" required>
                        <el-radio-group v-model="formData.sms_notice.status">
                            <el-radio label="0">关闭</el-radio>
                            <el-radio label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="模板ID" prop="sms_notice.template_id">
                        <div class="w-80">
                            <el-input
                                v-model="formData.sms_notice.template_id"
                                placeholder="请输入模板ID"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item label="短信内容" prop="sms_notice.content">
                        <div class="flex-1">
                            <div class="w-full max-w-[320px]">
                                <el-input
                                    type="textarea"
                                    :rows="6"
                                    v-model="formData.sms_notice.content"
                                />
                            </div>
                            <div
                                class="form-tips"
                                v-for="(item, index) in formData.sms_notice.tips"
                                :key="index"
                            >
                                {{ item }}
                            </div>
                        </div>
                    </el-form-item>
                </el-card>

                <!-- 微信模板通知 -->
                <el-card class="!border-none mt-4" shadow="never" v-if="formData.oa_notice.is_show">
                    <div class="m-t-24">
                        <div class="font-medium mb-[20px]">微信模板消息</div>
                        <el-alert
                            title="温馨提示： 1. 请前往微信公众平台，将【主营行业：IT科技/互联网|电子商务 副营行业：消费品】类目添加至您的服务类目，否则将影响订阅通知的正常发送。 2. 查找订阅通知并选用，调整关键词的顺序后，复制模板ID，粘贴在此页面对应的模板ID输入框中"
                            type="success"
                            show-icon
                            :closable="false"
                        />

                        <div class="mt-[10px]">
                            <el-form ref="form" label-width="145px">
                                <el-form-item label="开启状态" required>
                                    <el-radio v-model="formData.oa_notice.status" :label="'0'"
                                        >关闭</el-radio
                                    >
                                    <el-radio v-model="formData.oa_notice.status" :label="'1'"
                                        >开启</el-radio
                                    >
                                </el-form-item>

                                <el-form-item label="模板ID" size="mini" required>
                                    <div class="w-80">
                                        <el-input v-model="formData.oa_notice.template_id" />
                                    </div>
                                </el-form-item>

                                <el-form-item label="模板字段first内容" size="mini" required>
                                    <div class="w-80">
                                        <el-input v-model="formData.oa_notice.first" />
                                    </div>
                                </el-form-item>

                                <el-form-item label="模板字段remrk内容" size="mini" required>
                                    <div class="w-80">
                                        <el-input v-model="formData.oa_notice.remark" />
                                    </div>
                                </el-form-item>

                                <el-form-item label="模板内容" size="mini" required>
                                    <div>
                                        <el-button type="primary" size="mini" @click="handleOaAdd"
                                            >新增模板字段</el-button
                                        >
                                        <el-table
                                            class="mt-[10px]"
                                            :data="formData.oa_notice.tpl"
                                            style="width: 540px"
                                            size="mini"
                                        >
                                            <el-table-column label="字段名" width="120">
                                                <template v-slot="scope">
                                                    <el-input
                                                        v-model="scope.row.tpl_name"
                                                        placeholder="订单编号"
                                                    ></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="字段值" width="120">
                                                <template v-slot="scope">
                                                    <el-input
                                                        v-model="scope.row.tpl_keyword"
                                                        placeholder="keyword1"
                                                    ></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="字段内容" width="180">
                                                <template v-slot="scope">
                                                    <el-input
                                                        v-model="scope.row.tpl_content"
                                                        placeholder="{order_sn}"
                                                    ></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="操作" width="120">
                                                <template v-slot="scope">
                                                    <el-button
                                                        type="text"
                                                        size="mall"
                                                        @click="
                                                            formData.oa_notice.tpl.splice(
                                                                scope.$index,
                                                                1
                                                            )
                                                        "
                                                        >删除</el-button
                                                    >
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </el-form-item>
                            </el-form>

                            <div class="desc m-t-20" style="margin-left: 135px">
                                <div v-for="(item, index) in formData.oa_notice.tips" :key="index">
                                    {{ item }}
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>

                <!-- 微信小程序提醒 -->
                <el-card
                    class="!border-none mt-4"
                    shadow="never"
                    v-if="formData.mnp_notice.is_show"
                >
                    <div class="ls-card m-t-24">
                        <div class="font-medium mb-[20px]">微信小程序通知</div>

                        <el-alert
                            title="1. 请前往微信公众平台，将【主营行业：IT科技/互联网|电子商务 副营行业：消费品】类目添加至您的服务类目，否则将影响订阅通知的正常发送。 2. 查找订阅通知并选用，调整关键词的顺序后，复制模板ID，粘贴在此页面对应的模板ID输入框中"
                            type="success"
                            show-icon
                            :closable="false"
                        />

                        <div class="mt-[10px]" style="width: 90%">
                            <el-form ref="form" label-width="135px">
                                <el-form-item label="开启状态" required>
                                    <el-radio v-model="formData.mnp_notice.status" :label="'0'"
                                        >关闭</el-radio
                                    >
                                    <el-radio v-model="formData.mnp_notice.status" :label="'1'"
                                        >开启</el-radio
                                    >
                                </el-form-item>

                                <el-form-item label="模板ID" size="mini" required>
                                    <div class="w-80">
                                        <el-input v-model="formData.mnp_notice.template_id" />
                                    </div>
                                </el-form-item>

                                <el-form-item label="模板内容" size="mini" required>
                                    <div>
                                        <el-button type="primary" size="mini" @click="handleMnpAdd"
                                            >新增模板字段</el-button
                                        >
                                        <el-table
                                            class="mt-[10px]"
                                            :data="formData.mnp_notice.tpl"
                                            style="width: 100%"
                                            size="mini"
                                        >
                                            <el-table-column label="字段名" width="120">
                                                <template v-slot="scope">
                                                    <el-input
                                                        v-model="
                                                            formData.mnp_notice.tpl[scope.$index]
                                                                .tpl_name
                                                        "
                                                        placeholder="订单编号"
                                                    ></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="字段值" width="120">
                                                <template v-slot="scope">
                                                    <el-input
                                                        v-model="scope.row.tpl_keyword"
                                                        placeholder="keyword1"
                                                    ></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="字段内容" width="180">
                                                <template v-slot="scope">
                                                    <el-input
                                                        v-model="scope.row.tpl_content"
                                                        placeholder="order_sn"
                                                    ></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="操作" width="120">
                                                <template v-slot="scope">
                                                    <el-button
                                                        type="text"
                                                        size="mall"
                                                        @click="
                                                            formData.mnp_notice.tpl.splice(
                                                                scope.$index,
                                                                1
                                                            )
                                                        "
                                                        >删除</el-button
                                                    >
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </el-form-item>
                            </el-form>

                            <div class="desc m-t-20" style="margin-left: 135px">
                                <div v-for="(item, index) in formData.mnp_notice.tips" :key="index">
                                    {{ item }}
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
        </el-form>
        <footer-btns>
            <el-button type="primary" @click="handleSave">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import feedback from '@/utils/feedback'
import { noticeDetail, setNoticeConfig } from '@/api/setting/message'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const formData = reactive<any>({
    id: '',
    scene_name: '', // 通知名称
    scene_desc: '', // 通知业务
    type: '', // 通知类型
    sms_notice: {
        status: 0,
        template_id: '',
        content: '',
        tips: [],
        type: 'sms'
    },
    oa_notice: {
        first: '',
        is_show: false,
        name: '',
        remark: '',
        status: '',
        template_id: '',
        tpl: []
    },
    mnp_notice: {
        is_show: false,
        name: '',
        status: '',
        template_id: '',
        tpl: []
    }
})
//表单验证
const rules = {}

const formRef = shallowRef<FormInstance>()

//微信模版内容添加
const handleOaAdd = () => {
    formData.oa_notice.tpl.push({
        name: '',
        value: '',
        content: ''
    })
}
//微信小程序内容添加
const handleMnpAdd = () => {
    formData.mnp_notice.tpl.push({
        name: '',
        value: '',
        content: ''
    })
}

const getDetails = async () => {
    loading.value = true
    const data = await noticeDetail({
        id: route.query.id
    })

    Object.keys(formData).forEach((key) => {
        // @ts-ignore
        formData[key] = data[key]
    })

    loading.value = false
}

const handleSave = async () => {
    await formRef.value?.validate()
    console.log(formData)
    await setNoticeConfig({
        id: route.query.id,
        template: [
            {
                type: 'sms',
                ...formData.sms_notice
            },
            {
                type: 'oa',
                ...formData.oa_notice
            },
            {
                type: 'mnp',
                ...formData.mnp_notice
            }
        ]
    })
    feedback.msgSuccess('操作成功')
    router.back()
}

route.query.id && getDetails()
</script>

<style lang="scss" scoped>
.tablemove {
    @media screen and (max-width: 768px) {
        overflow: scroll;
    }
}
</style>
