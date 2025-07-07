<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            title="转账失败"
            :async="true"
            width="400px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <div class="px-[20px] py-[10px]">
                <el-input
                    class="w-full"
                    v-model="formData.transfer_remark"
                    type="textarea"
                    :maxlength="50"
                    :rows="4"
                    placeholder="请输入转账失败原因"
                    show-word-limit
                />
            </div>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import Popup from '@/components/popup/index.vue'
import { apiWithdrawTransfer } from '@/api/finance/withdraw'

const props = defineProps({
    id: { type: Number },
    transfer_status: { type: Number }
})
const emit = defineEmits(['confirm', 'close'])
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formData = reactive({
    id: props.id,
    transfer_status: props.transfer_status,
    transfer_remark: ''
})

const open = () => {
    popupRef.value?.open()
}

const handleClose = () => {
    // popupRef.value?.close()
    emit('close')
}

defineExpose({
    open
})
//提交
const handleSubmit = async () => {
    await apiWithdrawTransfer({
        id: formData.id,
        transfer_status: formData.transfer_status,
        transfer_remark: formData.transfer_remark
    })
    emit('close')
    emit('confirm')
}
</script>
