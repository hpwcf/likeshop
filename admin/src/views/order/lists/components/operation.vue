<template>
    <!-- 列表里的操作 -->
    <div v-if="btnStyle === 'text'" class="inline">
        <!-- 下拉 -->
        <el-dropdown>
            <el-link class="ml-2 mt-[5px]" type="primary" :underline="false">
                更多
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </el-link>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item
                        v-if="admin_order_btn.cancel_btn"
                        v-perms="['order.order/cancel']"
                    >
                        <el-link type="primary" :underline="false" @click="handleCancel"
                            >取消订单</el-link
                        >
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="admin_order_btn.assign_staff_btn"
                        v-perms="['order.order/assign_staff']"
                    >
                        <el-link type="primary" :underline="false" @click="handleDispatchStaff"
                            >分配师傅</el-link
                        >
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="admin_order_btn.replace_staff_btn"
                        v-perms="['order.order/replace_staff']"
                    >
                        <el-link type="primary" :underline="false" @click="handleDispatchStaff"
                            >更换师傅</el-link
                        >
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="admin_order_btn.accept_orders_btn"
                        v-perms="['order.order/accept_orders']"
                    >
                        <el-link type="primary" :underline="false" @click="handleAcceptOrder"
                            >订单接取</el-link
                        >
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="admin_order_btn.staff_setout_btn"
                        v-perms="['order.order/staff_setout']"
                    >
                        <el-link type="primary" :underline="false" @click="handleStaffSetout"
                            >师傅出发</el-link
                        >
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="admin_order_btn.staff_arrive_btn"
                        v-perms="['order.order/staff_arrive']"
                    >
                        <el-link type="primary" :underline="false" @click="handleStaffArrive"
                            >师傅到达</el-link
                        >
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="admin_order_btn.start_service_btn"
                        v-perms="['order.order/start_service']"
                    >
                        <el-link type="primary" :underline="false" @click="handleStartService"
                            >开始服务</el-link
                        >
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="admin_order_btn.finish_btn"
                        v-perms="['order.order/finish']"
                    >
                        <el-link type="primary" :underline="false" @click="handleOrderFinish"
                            >服务完成</el-link
                        >
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="admin_order_btn.refund_btn"
                        v-perms="['order.order/refund']"
                    >
                        <el-link type="primary" :underline="false" @click="handleRefund"
                            >退款</el-link
                        >
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="admin_order_btn.remark_btn"
                        v-perms="['order.order/remark']"
                    >
                        <popup
                            class="mr-2 inline"
                            width="450px"
                            :center="true"
                            @confirm="handleRemark"
                            @open="getRemarkDetail"
                        >
                            <template #trigger>
                                <el-link type="primary" :underline="false">商家备注</el-link>
                            </template>
                            <div style="height: 300px" class="mt-4">
                                <el-form ref="orderFormRef" :model="orderForm" label-width="auto">
                                    <el-form-item label="商家备注:">
                                        <el-input
                                            class="ls-input"
                                            type="textarea"
                                            v-model="orderForm.order_remarks"
                                            placeholder="请输入"
                                            :rows="10"
                                        ></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </popup>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>

    <!-- 详情里的操作 -->
    <div v-else class="flex mt-3 inline">
        <el-button
            v-if="admin_order_btn.cancel_btn"
            @click="handleCancel"
            type="danger"
            class="mx-4"
            v-perms="['order.order/cancel']"
            >取消订单</el-button
        >
        <el-button
            v-if="admin_order_btn.assign_staff_btn"
            type="primary"
            class="mx-4"
            v-perms="['order.order/assign_staff']"
            @click="handleDispatchStaff"
            >分配师傅</el-button
        >
        <el-button
            v-if="admin_order_btn.replace_staff_btn"
            type="primary"
            class="mx-4"
            v-perms="['order.order/replace_staff']"
            @click="handleDispatchStaff"
            >更换师傅</el-button
        >
        <el-button
            v-if="admin_order_btn.accept_orders_btn"
            type="primary"
            class="mx-4"
            v-perms="['order.order/accept_orders']"
            @click="handleAcceptOrder"
            >订单接取</el-button
        >
        <el-button
            v-if="admin_order_btn.staff_setout_btn"
            type="primary"
            class="mx-4"
            v-perms="['order.order/staff_setout']"
            @click="handleStaffSetout"
            >师傅出发</el-button
        >
        <el-button
            v-if="admin_order_btn.staff_arrive_btn"
            type="primary"
            class="mx-4"
            v-perms="['order.order/staff_arrive']"
            @click="handleStaffArrive"
            >师傅到达</el-button
        >
        <el-button
            v-if="admin_order_btn.start_service_btn"
            type="primary"
            class="mx-4"
            v-perms="['order.order/start_service']"
            @click="handleStartService"
            >开始服务</el-button
        >
        <el-button
            v-if="admin_order_btn.finish_btn"
            type="primary"
            class="mx-4"
            v-perms="['order.order/finish']"
            @click="handleOrderFinish"
            >服务完成</el-button
        >
        <el-button
            v-if="admin_order_btn.refund_btn"
            type="danger"
            class="mx-4"
            v-perms="['order.order/refund']"
            @click="handleRefund"
            >退款</el-button
        >
        <popup
            class="inline"
            width="450px"
            :center="true"
            @confirm="handleRemark"
            @open="getRemarkDetail"
            v-perms="['order.order/remark']"
            v-if="admin_order_btn.remark_btn"
        >
            <template #trigger>
                <el-button>商家备注</el-button>
            </template>
            <div style="height: 300px" class="mt-4">
                <el-form ref="orderFormRef" :model="orderForm" label-width="auto">
                    <el-form-item label="商家备注:">
                        <el-input
                            class="ls-input"
                            type="textarea"
                            v-model="orderForm.order_remarks"
                            placeholder="请输入"
                            :rows="10"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </popup>
    </div>

    <refund-lists
        v-if="showRefund"
        ref="refundRef"
        @close="handleRefresh() && (showRefund = false)"
        :id="id"
        :type="refundType"
        @success="handleRefresh()"
    ></refund-lists>
    <dispatch-staff
        v-if="showDispatchStaff"
        ref="dispatchStaffRef"
        @close="handleRefresh() && (showDispatchStaff = false)"
        :id="id"
        :staff_id="staff_id"
        @success="handleRefresh()"
    ></dispatch-staff>
</template>

<script lang="ts" setup>
import {
    apiOrderRemark,
    apiOrderRemarkDetail,
    apiAcceptOrder,
    apiStaffSetout,
    apiStaffArrive,
    apiStartService,
    apiOrderFinish,
    apiOrderCancel
} from '@/api/order/lists'
import Popup from '@/components/popup/index.vue'
import { ref, defineEmits } from 'vue'
import feedback from '@/utils/feedback'
import RefundLists from './refund_lists.vue'
import DispatchStaff from './dispatch_staff.vue'

const emit = defineEmits(['refresh'])

const props = withDefaults(
    defineProps<{
        id: number //订单ID
        btnStyle: string //按钮样式
        admin_order_btn: any //后台订单按钮
        staff_id: number | string //师傅ID
        settlement_status: number //结算状态：0-未结算；1-已结算；
    }>(),
    {
        id: 0,
        btnStyle: 'text',
        admin_order_btn: {},
        staff_id: '',
        settlement_status: 0
    }
)

const orderForm = ref({
    order_remarks: '' as string
})

const refundRef = shallowRef<InstanceType<typeof RefundLists>>()
const showRefund = ref(false)
const refundType = ref(1)

const dispatchStaffRef = shallowRef<InstanceType<typeof DispatchStaff>>()
const showDispatchStaff = ref(false)

//刷新
const handleRefresh = async () => {
    emit('refresh')
}
// 取消订单
const handleCancel = async (): Promise<void> => {
    await feedback.confirm('确定要取消订单吗？')
    // await apiOrderCancel({ id: props.id })
    refundType.value = 1
    showRefund.value = true
    await nextTick()
    refundRef.value?.open()
}
// 退款
const handleRefund = async (): Promise<void> => {
    // if (props.settlement_status === 1) {
    //     await feedback.confirm(
    //         '该订单佣金已完成结算，一旦退款，已发放的佣金将不会被回收，请谨慎确认是否退款，以免造成不必要的损失。'
    //     )
    // }

    refundType.value = 2
    showRefund.value = true
    await nextTick()
    refundRef.value?.open()
}
// 商家备注详情
const getRemarkDetail = async (): Promise<void> => {
    orderForm.value = await apiOrderRemarkDetail({ id: props.id })
}
// 提交商家备注
const handleRemark = async (): Promise<void> => {
    await apiOrderRemark({ id: props.id, remark: orderForm.value.order_remarks })
    emit('refresh')
}
// 分配师傅
const handleDispatchStaff = async (): Promise<void> => {
    showDispatchStaff.value = true
    await nextTick()
    dispatchStaffRef.value?.open()
}
// 接取订单
const handleAcceptOrder = async (): Promise<void> => {
    await feedback.confirm('确定帮师傅接取订单？请谨慎操作')
    await apiAcceptOrder({ id: props.id })
    emit('refresh')
}
// 师傅出发
const handleStaffSetout = async (): Promise<void> => {
    await feedback.confirm('确定师傅已出发？请谨慎操作')
    await apiStaffSetout({ id: props.id })
    emit('refresh')
}
// 师傅到达
const handleStaffArrive = async (): Promise<void> => {
    await feedback.confirm('确定师傅已到达？请谨慎操作')
    await apiStaffArrive({ id: props.id })
    emit('refresh')
}
// 开始服务
const handleStartService = async (): Promise<void> => {
    await feedback.confirm('确定师傅已开始服务？请谨慎操作')
    await apiStartService({ id: props.id })
    emit('refresh')
}
// 服务完成
const handleOrderFinish = async (): Promise<void> => {
    await feedback.confirm('确定师傅已完成服务？请谨慎操作')
    await apiOrderFinish({ id: props.id })
    emit('refresh')
}
</script>

<style lang="scss" scoped>
.ls-input {
    width: 30vw;
}
</style>
