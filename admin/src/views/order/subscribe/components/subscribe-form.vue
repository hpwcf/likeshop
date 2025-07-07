<template>
    <popup
        ref="popupRef"
        class="mr-2 inline"
        :clickModalClose="false"
        :title="btnText"
        :center="true"
        :async="true"
        @open="handleOpen"
        @confirm="onSubmit"
        width="550px"
    >
        <!-- Trigger Start -->
        <template #trigger>
            <el-button v-if="type === 'primary'" type="primary">{{ btnText }}</el-button>
            <el-link v-if="btnText === '编辑'" type="primary" :underline="false">{{
                btnText
            }}</el-link>
        </template>
        <!-- Trigger End -->

        <!-- Form Start -->
        <el-form
            class="subscribe-form"
            :model="subscribeForm"
            ref="subscribeFormRef"
            label-width="80px"
        >
            <el-form-item label="时间段" prop="name" :error="rules.name">
                <el-time-picker
                    v-model="subscribeForm.start_time"
                    value-format="HH:mm"
                    :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                    placeholder="开始时间"
                    class="time-input m-r-10"
                >
                </el-time-picker>

                <el-time-picker
                    v-model="subscribeForm.end_time"
                    value-format="HH:mm"
                    :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                    placeholder="结束时间"
                    class="time-input"
                >
                </el-time-picker>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input
                    class="ls-input"
                    v-model="subscribeForm.sort"
                    placeholder="请输入"
                ></el-input>
                <div class="form-tips">数字越大，排序越靠前，默认排序号为0</div>
            </el-form-item>
        </el-form>
        <!-- Form End -->
    </popup>
</template>

<script lang="ts" setup>
import { apiOrderTimeAdd, apiOrderTimeEdit, apiOrderTimeDetail } from '@/api/order/subscribe'
import Popup from '@/components/popup/index.vue'
import { ref, reactive, withDefaults } from 'vue'

/** Interface Start **/
interface subscribeFormObj {
    start_time?: string
    end_time?: string
    sort?: number
}
/** Interface End **/

/** Props Start **/
const props = withDefaults(
    defineProps<{
        type?: string
        id?: object | any
        btnText: string
    }>(),
    {
        type: 'add',
        id: '',
        btnText: ''
    }
)
/** Props End **/

/** Emit Start **/
const emit = defineEmits(['refresh'])
/** Emit End **/

/** Data Start **/
const subscribeForm = ref<subscribeFormObj>({
    start_time: '',
    end_time: '',
    sort: 0
})
// 表单娇艳规则
const rules = reactive({
    name: ''
})
// 弹窗组件ref
const popupRef = ref<any>(null)
/** Data End **/

/** Methods Start **/
// 弹窗打开时
const handleOpen = (): void => {
    if (props.id) getOrderTimeDetail(props.id)
}
// 获取时间段详情
const getOrderTimeDetail = async (id: number): Promise<void> => {
    ;(subscribeForm.value as object) = await apiOrderTimeDetail({ id })
}
// 添加时间段
const handleOrderTimeAdd = async (): Promise<void> => {
    await apiOrderTimeAdd({ ...subscribeForm.value })
    emit('refresh')
}
// 编辑时间段
const handleOrderTimeEdit = async (): Promise<void> => {
    await apiOrderTimeEdit({ ...subscribeForm.value, id: props.id })
    emit('refresh')
}
// 提交数据
const onSubmit = (): string | undefined => {
    if (!subscribeForm.value.start_time || !subscribeForm.value.end_time)
        return (rules.name = '请选择时间段')
    if (!props.id) handleOrderTimeAdd()
    else handleOrderTimeEdit()
    popupRef.value.visible = false
    rules.name = ''
    subscribeForm.value.start_time = ''
    subscribeForm.value.end_time = ''
    subscribeForm.value.sort = 0
}
/** Methods End **/
</script>

<style lang="scss">
.el-dialog__header {
    text-align: left;
    font-size: 16px;
    color: #101010;
}

.subscribe-form {
    margin-top: 30px;
    margin-bottom: 100px;

    .ls-input {
        width: 340px;
    }

    .time-input {
        width: 165px;
    }
}
</style>
