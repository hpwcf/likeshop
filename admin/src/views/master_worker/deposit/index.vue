<template>
    <el-card shadow="never" class="!border-none mt-4">
        <div class="w-[88px]">
            <depositForm
                v-perms="['staff.staff_deposit/add']"
                @refresh="getLists"
                type="primary"
                btnText="新增保证金"
            />
        </div>
        <div>
            <el-table
                ref="tableRef"
                :data="pager.lists"
                size="large"
                row-key="id"
                :indent="20"
                :tree-props="{ children: 'sons' }"
            >
                <el-table-column property="name" label="名称" min-width="190" />
                <el-table-column property="amount" label="保证金金额" min-width="180" />
                <el-table-column property="order_num" label="日接单数量" min-width="180" />
                <el-table-column property="update_time" label="更新时间" min-width="180" />
                <el-table-column label="操作" min-width="182" fixed="right">
                    <template #default="scope">
                        <div class="flex items-center">
                            <depositForm
                                v-perms="['staff.staff_deposit/edit']"
                                :id="scope.row.id"
                                type="text"
                                btnText="编辑"
                                @refresh="getLists"
                            />
                            <el-link
                                v-perms="['staff.staff_deposit/del']"
                                class="ml-4"
                                type="danger"
                                :underline="false"
                                @click="handleDelete(scope.row.id)"
                            >
                                删除
                            </el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="flex justify-end mt-4">
            <pagination v-model="pager" @change="getLists" />
        </div>
    </el-card>
</template>

<script lang="ts" setup name="masterWorkerDeposit">
import { apiStaffDepositLists, apiStaffDepositDel } from '@/api/master_worker/deposit'
import { onMounted } from 'vue'
import feedback from '@/utils/feedback'
import type { ElTable } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'
import depositForm from './components/deposit_form.vue'

const tableRef = shallowRef<InstanceType<typeof ElTable>>()

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiStaffDepositLists,
    params: {}
})

// 删除分类
const handleDelete = async (id: number): Promise<void> => {
    await feedback.confirm('确认删除保证金？')
    await apiStaffDepositDel({ id })
    getLists()
}

onMounted(() => {
    getLists()
})
</script>

<style lang="scss">
.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}
.image-slot .el-icon {
    font-size: 30px;
}
.ls-input {
    width: 280px;
}
</style>
