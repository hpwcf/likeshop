<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            title="可用余额调整"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form @submit.prevent ref="formRef" :model="formData" label-width="120px">
                <el-form-item :label="'当前余额'">
                    <div>¥ {{ value }}</div>
                </el-form-item>
                <el-form-item :label="'余额增减'">
                    <!-- 单选按钮 -->
                    <el-radio-group class="m-r-16" v-model="formData.adjust_action">
                        <el-radio :label="1">增加余额</el-radio>
                        <el-radio :label="2">扣减余额</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="'调整余额'" prop="num">
                    <div>
                        <el-input
                            class="ls-input"
                            v-model="formData.adjust_num"
                            placeholder="请输入调整的金额"
                            style="width: 300px"
                        >
                            <template #append>元</template>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item :label="'调整后余额'">
                    ￥
                    <div>{{ adjustednum }}</div>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { adjustUserWallet } from '@/api/user'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const props = defineProps({
    id: { type: Number },
    value: {
        type: String
    },
    type: {
        type: Number
    }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formData = reactive({
    id: props.id,
    adjust_type: props.type,
    adjust_action: 1,
    adjust_num: ''
})

const open = () => {
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
    if (Number(formData.adjust_num) <= 0) {
        feedback.msgError('请输入大于0的数字')
        return
    }
    await adjustUserWallet(formData)
    popupRef.value?.close()
    emit('success')
}
const adjustednum = computed(() => {
    let total: any = props.value
    if (isNaN(Number(formData.adjust_num))) return 0
    if (formData.adjust_action == 1) {
        total = Number(total) + Number(formData.adjust_num)
    } else {
        total = Number(total) - Number(formData.adjust_num)
    }
    return total.toFixed(2)
})
</script>
