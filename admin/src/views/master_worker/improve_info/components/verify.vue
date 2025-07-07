<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            title="审核拒绝"
            :async="true"
            width="400px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <div class="px-[20px] py-[10px]">
                <el-input
                    class="w-full"
                    v-model="formData.verify_remarks"
                    type="textarea"
                    :maxlength="50"
                    :rows="4"
                    placeholder="请输入审核拒绝原因"
                    show-word-limit
                />
            </div>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import Popup from '@/components/popup/index.vue'
import { apiMasterWorkerImproveInfoVerify } from '@/api/master_worker/improve_info'

const props = defineProps({
    id: { type: Number },
    verify_status: { type: Number }
})
const emit = defineEmits(['confirm', 'close'])
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formData = reactive({
    id: props.id,
    verify_status: props.verify_status,
    verify_remarks: ''
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
    await apiMasterWorkerImproveInfoVerify({
        id: formData.id,
        verify_status: formData.verify_status,
        verify_remarks: formData.verify_remarks
    })
    emit('close')
    emit('confirm')
}
</script>
