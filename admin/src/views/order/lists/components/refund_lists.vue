<template>
    <div class="edit-popup">
        <popup
            v-if="popupRefShow"
            ref="popupRef"
            title="退款"
            :async="true"
            width="800px"
            cancelButtonText=""
            confirmButtonText=""
            @close="handleClose"
        >
            <div class="mt-4">
                <div class="mb-[10px]">
                    <el-button @click="handleAllRefund">全部退款</el-button>
                </div>
                <el-table ref="tableRef" size="large" :data="pager.lists" v-loading="pager.loading">
                    <el-table-column type="selection" :selectable="selectable" width="55" />
                    <el-table-column property="sn" label="订单编号" min-width="190" />
                    <el-table-column
                        property="order_category_desc"
                        label="订单分类"
                        min-width="100"
                    />
                    <el-table-column property="actual_price" label="订单金额" min-width="100" />
                    <el-table-column property="pay_time" label="支付时间" min-width="180" />
                    <el-table-column property="refund_amount" label="已退款金额" min-width="120" />
                    <el-table-column label="操作" min-width="70" fixed="right">
                        <template #default="scope">
                            <el-link
                                v-if="scope.row.actual_price > scope.row.refund_amount"
                                type="primary"
                                :underline="false"
                                @click="handleRefund(scope.row.id, scope.row.order_category)"
                                >退款</el-link
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <div class="flex justify-end mt-4">
                    <pagination v-model="pager" @change="getLists" />
                </div>
            </div>
        </popup>
    </div>

    <refund
        v-if="showRefund"
        ref="refundRef"
        @close="showRefund = false"
        :order_info="returnOrderInfo"
        :is_cancel_order="type === 1 ? 1 : 0"
        :is_all_return="isAllReturn"
        @success="getLists()"
    ></refund>
</template>
<script lang="ts" setup>
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import { apiRefundOperationLists } from '@/api/order/lists'
import { usePaging } from '@/hooks/usePaging'
import Pagination from '@/components/pagination/index.vue'
import Refund from './refund.vue'
import type { TableInstance } from 'element-plus'

const props = defineProps({
    id: { type: Number },
    type: { type: Number }
})
const emit = defineEmits(['success', 'close'])
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const popupRefShow = ref(true)
const refundRef = shallowRef<InstanceType<typeof Refund>>()
const showRefund = ref(false)
const returnOrderInfo = ref<any>([])
const tableRef = ref<TableInstance>()
const isAllReturn = ref(0)

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiRefundOperationLists,
    params: { id: props.id }
})

const open = async () => {
    popupRef.value?.open()
    await getLists()
    nextTick(() => {
        pager.lists.forEach((row) => {
            tableRef.value!.toggleRowSelection(row, row.selected, false)
        })
    })
}

const handleClose = () => {
    emit('close')
}

//多选控制
const selectable = (row: any, index: number) => {
    if (row.actual_price <= row.refund_amount) {
        return false
    } else {
        return true
    }
}

defineExpose({
    open
})

// 退款
const handleRefund = async (id: number, order_category: number): Promise<void> => {
    returnOrderInfo.value = [{ id: id, order_category: order_category }]
    isAllReturn.value = 0
    showRefund.value = true
    await nextTick()
    refundRef.value?.open()
}
// 全部退款
const handleAllRefund = async (): Promise<void> => {
    //获取选择行数据
    const selectionRowsData = tableRef.value!.getSelectionRows()
    if (!selectionRowsData?.length) {
        feedback.msgWarning('请选择退款订单')
        return
    }

    returnOrderInfo.value = []
    selectionRowsData.forEach((item) => {
        returnOrderInfo.value.push({ id: item.id, order_category: item.order_category })
    })
    isAllReturn.value = 1
    showRefund.value = true
    await nextTick()
    refundRef.value?.open()
}
</script>
