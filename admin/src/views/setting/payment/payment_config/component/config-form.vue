<template>
    <popup
        class="mr-2"
        width="600px"
        :center="true"
        @confirm="handleReply(formRef)"
        @open="getPaymentConfigDetail"
        :title="title"
    >
        <template #trigger>
            <el-link type="primary" :underline="false">{{ title }}</el-link>
        </template>

        <div class="">
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="auto">
                <el-form-item label="支付方式">
                    <el-input v-model="paymentWay" :disabled="true" class="ls-input" />
                </el-form-item>

                <el-form-item label="显示名称" prop="name">
                    <el-input v-model="formData.name" class="ls-input" />
                </el-form-item>

                <el-form-item label="显示图标" prop="image">
                    <div>
                        <material-picker :limit="1" :disabled="false" v-model="formData.image" />
                        <div class="form-tips">建议尺寸：152*42像素，支持jpg，jpeg，png格式</div>
                    </div>
                </el-form-item>

                <!-- 微信的配置 Start -->
                <template v-if="formData.pay_way == 1">
                    <el-form-item prop="interface_version" label="微信支付接口版本">
                        <div>
                            <div>
                                <el-radio-group v-model="formData.interface_version">
                                    <el-radio :label="formData.interface_version"></el-radio>
                                </el-radio-group>
                            </div>
                            <div class="form-tips">暂时只支持V2版本</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商户类型" prop="merchant_type">
                        <div>
                            <div>
                                <el-radio-group v-model="formData.merchant_type">
                                    <el-radio :label="formData.merchant_type">普通商户</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="form-tips">
                                暂时只支持普通商户类型，服务商户类型模式暂不支持
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="微信支付商户号" prop="mch_id">
                        <el-input v-model="formData.mch_id" class="ls-input" />
                        <div class="form-tips">微信支付商户号（MCHID）</div>
                    </el-form-item>

                    <el-form-item label="商户API密钥" prop="pay_sign_key">
                        <el-input v-model="formData.pay_sign_key" class="ls-input" />
                        <div class="form-tips">微信支付商户API密钥（paySignKey）</div>
                    </el-form-item>

                    <el-form-item label="微信支付证书" prop="apiclient_cert">
                        <el-input
                            type="textarea"
                            rows="3"
                            v-model="formData.apiclient_cert"
                            class="ls-input"
                        />
                        <div class="form-tips">微信支付证书，前往微信商家平台生成并黏贴至此处</div>
                    </el-form-item>

                    <el-form-item label="微信支付证书密钥" prop="apiclient_key">
                        <el-input
                            type="textarea"
                            rows="3"
                            v-model="formData.apiclient_key"
                            class="ls-input"
                        />
                        <div class="form-tips">
                            微信支付证书密钥，前往微信商家平台生成并黏贴至此处
                        </div>
                    </el-form-item>

                    <el-form-item label="支付授权目录">
                        <div class="mr-4">https://前台手机端域名/</div>
                        <el-button type="text" v-copy="'https://前台手机端域名/'">复制</el-button>
                        <div class="form-tips">
                            支付授权目录仅用于参考，复制后前往微信商家平台填写
                        </div>
                    </el-form-item>
                </template>
                <!-- 微信 End -->

                <!-- 支付宝 Start -->
                <template v-if="formData.pay_way == 2">
                    <el-form-item label="模式" prop="pattern">
                        <div>
                            <div>
                                <el-radio-group v-model="formData.pattern">
                                    <el-radio :label="formData.pattern">普通模式</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="form-tips">暂时仅支持支付宝普通模式</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商户类型" prop="merchant_type">
                        <div>
                            <div>
                                <el-radio-group v-model="formData.merchant_type">
                                    <el-radio :label="formData.merchant_type">普通商户</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="form-tips">
                                暂时只支持普通商户类型，服务商户类型模式暂不支持
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="应用ID" prop="app_id">
                        <el-input v-model="formData.app_id" class="ls-input" />
                    </el-form-item>

                    <el-form-item label="应用私钥" prop="private_key">
                        <el-input v-model="formData.private_key" class="ls-input" />
                    </el-form-item>

                    <el-form-item label="支付宝公钥" prop="ali_public_key">
                        <el-input v-model="formData.ali_public_key" class="ls-input" />
                    </el-form-item>
                </template>
                <!-- 支付宝配置 End -->

                <el-form-item label="排序" prop="sort">
                    <el-input v-model.number="formData.sort" class="ls-input" />
                    <div class="form-tips">默认为0，数值越大越排前面</div>
                </el-form-item>
            </el-form>
        </div>
    </popup>
</template>

<script lang="ts" setup>
import { apiPaymentConfigSet, apiPaymentConfigDetail } from '@/api/setting/payment'
import { ref, reactive, computed } from 'vue'
import MaterialPicker from '@/components/material/picker.vue'
import type { ElForm } from 'element-plus'
import Popup from '@/components/popup/index.vue'

const emit = defineEmits(['refresh'])

interface formDataObj {
    pay_way?: number
    name: string //支付名称
    image: string //支付图标
    sort: string //排序
    remark: string //备注
    merchant_type: string //（微信支付 ｜｜ 支付宝）商户类型ordinary_merchant-普通商户
    interface_version: 'v2' //微信支付接口版本v2-v2
    mch_id: string //微信支付商户号
    pay_sign_key: string //微信商户支付API密钥
    apiclient_cert: string //微信支付证书
    apiclient_key: string //微信支付证书密钥
    pattern: string //模式：normal_mode普通商户
    app_id: string //应用ID
    private_key: string //支付宝公钥
    ali_public_key: string //应用私钥
}

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const formData = ref<formDataObj>({
    pay_way: 0,
    name: '',
    image: '',
    sort: '',
    remark: '',
    merchant_type: '',
    interface_version: 'v2',
    mch_id: '',
    pay_sign_key: '',
    apiclient_cert: '',
    apiclient_key: '',
    pattern: '',
    app_id: '',
    private_key: '',
    ali_public_key: ''
})

const props = withDefaults(
    defineProps<{
        id: string | number //评价ID
        title: string
    }>(),
    {
        id: '',
        title: ''
    }
)

// 表单娇艳规则
const rules = reactive<object>({
    name: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
    icon: [{ required: true, message: '请输入上传图标', trigger: 'change' }],
    mch_id: [{ required: true, message: '请输入微信支付商户号', trigger: 'blur' }],
    pay_sign_key: [{ required: true, message: '请输入微信商户支付API密钥', trigger: 'blur' }],
    apiclient_cert: [{ required: true, message: '请输入微信支付证书', trigger: 'blur' }],
    apiclient_key: [{ required: true, message: '请输入微信支付证书密钥', trigger: 'blur' }],
    private_key: [{ required: true, message: '请输入支付宝公钥', trigger: 'blur' }],
    ali_public_key: [{ required: true, message: '请输入应用私钥', trigger: 'blur' }],
    app_id: [{ required: true, message: '请输入应用ID', trigger: 'blur' }],
    sort: [
        { required: true, message: '请输入排序', trigger: 'blur' },
        { type: 'number', pattern: !/-|\+|(\.[0-9])/, message: '请输入正确的排序', trigger: 'blur' }
    ]
})

const paymentWay = computed(() => {
    const pay_way = Number(formData.value.pay_way)
    switch (pay_way) {
        case 1:
            return '微信支付'
        case 2:
            return '支付宝支付'
        case 3:
            return '余额支付'
    }
})

// 打开弹窗->获取详情
const getPaymentConfigDetail = async (): Promise<void> => {
    const res = await apiPaymentConfigDetail({ id: props.id })
    const result: any = {
        ...res.config,
        ...res
    }
    delete result.config
    if (result.pay_way == 2) result.interface_version = 'v2'
    if (result.pay_way == 3) result.mode = 'normal_mode'
    result.merchant_type = 'ordinary_merchant'
    ;(formData.value as object) = result
    console.log('formData.value', formData.value)
}
// 编辑配置
const handlePaymentConfigEdit = async (): Promise<void> => {
    // 当微信支付时需固定写死
    if (paymentWay.value == '微信支付') {
        formData.value.interface_version = 'v2'
        formData.value.merchant_type = 'ordinary_merchant'
    }
    await apiPaymentConfigSet({ ...formData.value })
    emit('refresh')
}
// 确定->校验表单->调用编辑配置
const handleReply = (formEl: FormInstance | undefined): void => {
    if (!formEl) return
    formEl.validate((valid): boolean | undefined => {
        if (!valid) return false
        handlePaymentConfigEdit()
    })
}
</script>

<style lang="scss" scoped>
.ls-input,
.select {
    width: 340px;
}
</style>
