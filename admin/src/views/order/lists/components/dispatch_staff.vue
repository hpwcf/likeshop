<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="props.staff_id ? '更换师傅' : '分配师傅'"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form @submit.prevent ref="formRef" :model="formData" label-width="120px">
                <el-form-item :label="'选择师傅'">
                    <el-select
                        v-model="formData.staff_id"
                        placeholder="请选择"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="item in staffLists"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="'温馨提示'">
                    <div>
                        <div class="text-info">需满足下列条件，否则无法选择师傅</div>
                        <div class="text-info">1、当前服务位置是否在师傅可接单区域内</div>
                        <div class="text-info">2、只有师傅选择了该服务项目才能接单</div>
                        <div class="text-info">3、师傅的可服务时间与项目要求相符</div>
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
import { apiStaffLists, apiDispatchStaff } from '@/api/order/lists'

const props = defineProps({
    id: { type: Number },
    staff_id: { type: [String, Number] }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formData = reactive({
    id: props.id,
    staff_id: props.staff_id
})
const staffLists = ref<any>([])

const open = () => {
    console.log(formData.staff_id)
    apiStaffLists({ id: props.id }).then((res) => {
        staffLists.value = res
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
    if (!formData.staff_id) {
        feedback.msgError('请选择师傅')
        return
    }
    await apiDispatchStaff(formData)
    popupRef.value?.close()
    emit('success')
}
</script>
