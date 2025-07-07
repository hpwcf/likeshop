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
                    v-model="formData.remarks"
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
import { apiMasterWorkerApplyApply } from '@/api/master_worker/apply'

const props = defineProps({
    id: { type: Number },
    apply_status: { type: Number }
})
const emit = defineEmits(['confirm', 'close'])
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formData = reactive({
    id: props.id,
    apply_status: props.apply_status,
    remarks: ''
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
    await apiMasterWorkerApplyApply({
        id: formData.id,
        apply_status: formData.apply_status,
        remarks: formData.remarks
    })
    emit('close')
    emit('confirm')
}
</script>
