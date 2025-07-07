<template>
    <el-card shadow="never" class="!border-none mt-4">
        <div class="w-[88px]">
            <skillForm
                v-perms="['staff.staff_skill/add']"
                @refresh="getLists"
                type="primary"
                btnText="新增技能"
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
                <el-table-column property="name" label="技能名称" min-width="190" />
                <el-table-column property="goods_num" label="关联项目" min-width="180" />
                <el-table-column property="staff_num" label="关联人员" min-width="180" />
                <el-table-column label="状态" min-width="140">
                    <template #default="scope">
                        <el-switch
                            v-perms="['staff.staff_skill/status']"
                            v-model="scope.row.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="handleStatusChange($event, scope.row.id)"
                        />
                    </template>
                </el-table-column>
                <el-table-column property="update_time" label="更新时间" min-width="180" />
                <el-table-column label="操作" min-width="182" fixed="right">
                    <template #default="scope">
                        <div class="flex items-center">
                            <skillForm
                                v-perms="['staff.staff_skill/edit']"
                                :id="scope.row.id"
                                type="text"
                                btnText="编辑"
                                @refresh="getLists"
                            />
                            <el-link
                                v-perms="['staff.staff_skill/del']"
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

<script lang="ts" setup name="masterWorkerSkill">
import {
    apiStaffSkillLists,
    apiStaffSkillDel,
    apiStaffSkillStatus
} from '@/api/master_worker/skill'
import { onMounted } from 'vue'
import feedback from '@/utils/feedback'
import type { ElTable } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'
import skillForm from './components/skill_form.vue'

const tableRef = shallowRef<InstanceType<typeof ElTable>>()

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiStaffSkillLists,
    params: {}
})

// 删除分类
const handleDelete = async (id: number): Promise<void> => {
    await feedback.confirm('确认删除服务技能？')
    await apiStaffSkillDel({ id })
    getLists()
}

// 状态修改
const handleStatusChange = async (event: Event, id: number) => {
    await apiStaffSkillStatus({ status: event, id })
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
