<template>
    <el-card shadow="never" class="!border-none mt-4">
        <div class="w-[88px]">
            <editForm
                v-perms="['setting.map_key/add']"
                @refresh="getLists"
                type="primary"
                btnText="添加key"
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
                <el-table-column property="key" label="key" show-overflow-tooltip min-width="260" />
                <el-table-column property="type_desc" label="类型" min-width="120" />
                <el-table-column property="status" label="状态" min-width="120">
                    <template #default="scope">
                        <el-tag type="info" v-if="scope.row.status == 0">未使用</el-tag>
                        <el-tag type="success" v-if="scope.row.status == 1">使用中</el-tag>
                        <el-tooltip
                            v-if="scope.row.status == 2"
                            class="box-item"
                            effect="dark"
                            :content="scope.row.error_info?.message || '未知错误'"
                            placement="top"
                        >
                            <el-tag type="danger">异常</el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column property="create_time" label="创建时间" min-width="150" />
                <el-table-column label="操作" min-width="120" fixed="right">
                    <template #default="scope">
                        <div class="flex items-center">
                            <editForm
                                v-perms="['setting.map_key/edit']"
                                :id="scope.row.id"
                                type="text"
                                btnText="编辑"
                                @refresh="getLists"
                            />
                            <el-link
                                v-perms="['setting.map_key/del']"
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

<script lang="ts" setup name="settingWebsiteMapKey">
import { apiMapKeyLists, apiMapKeyDel } from '@/api/setting/map'
import { onMounted } from 'vue'
import editForm from './components/edit-form.vue'
import type { ElTable } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiMapKeyLists,
    params: {}
})

// 删除
const handleDelete = async (id: number): Promise<void> => {
    await feedback.confirm('确认删除key?')
    await apiMapKeyDel({ id })
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
