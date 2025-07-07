<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            title="退款"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form @submit.prevent ref="formRef" :model="formData" label-width="120px">
                <el-form-item :label="'订单金额'">
                    <div class="#F56C6C">{{ refundInfo?.order_amount }}</div>
                </el-form-item>
                <el-form-item :label="'退款方式'">
                    <el-radio-group class="m-r-16" v-model="formData.refund_way">
                        <el-radio :label="1">原路退回</el-radio>
                        <el-radio :label="2">退回余额</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="'订单退款'">
                    <div>
                        <el-input
                            class="ls-input"
                            v-model="formData.refund_amount"
                            type="number"
                            style="width: 300px"
                            :disabled="is_all_return"
                        >
                            <template #append>元</template>
                        </el-input>
                        <div>
                            <span class="text-info">订单剩余：</span>
                            <span>{{
                                (refundInfo?.order_amount - refundInfo?.refund_amount).toFixed(2)
                            }}</span>
                            <span class="text-info ml-[10px]">已退款：</span>
                            <span>{{ refundInfo?.refund_amount }}</span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item :label="'温馨提示'">
                    <div>
                        <div class="text-info">1、订单退款金额不能大于订单金额</div>
                        <div class="text-info">2、订单总金额 - 退款总金额 = 结算金额</div>
                    </div>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import { apiRefundInfo, apiOrderCancel, apiOrderRefund } from '@/api/order/lists'

const props = defineProps({
    order_info: { type: Array },
    is_cancel_order: { type: Number },
    is_all_return: { type: Number }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formData = reactive({
    order_info: JSON.stringify(props.order_info),
    is_cancel_order: props.is_cancel_order,
    is_all_return: props.is_all_return,
    refund_way: 1,
    refund_amount: ''
})
const refundInfo = ref<any>({})
const settlementStatus = ref(0)

const open = () => {
    apiRefundInfo({
        order_info: JSON.stringify(props.order_info)
    }).then((res) => {
        refundInfo.value = res
        const amount = res.order_amount - res.refund_amount
        formData.refund_amount = (amount > 0 ? amount : 0).toFixed(2)
        settlementStatus.value = res.settlement_status
    })
    popupRef.value?.open()
}

const handleClose = () => {
    emit('close')
}

defineExpose({
    open
})
//提交
const handleSubmit = async () => {
    if (Number(formData.refund_amount) <= 0) {
        feedback.msgError('请输入大于0的金额')
        return
    }
    if (settlementStatus.value === 1) {
        await feedback.confirm(
            '该订单佣金已完成结算，一旦退款，已发放的佣金将不会被回收，请谨慎确认是否退款，以免造成不必要的损失。'
        )
    }
    await apiOrderRefund(formData)
    emit('close')
    emit('success')
}
</script>
