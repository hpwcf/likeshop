<template>
    <el-card shadow="never" class="!border-none mt-4">
        <div class="w-[88px]">
            <Form
                v-perms="['setting.web.protocol/add']"
                @refresh="getLists"
                type="primary"
                btnText="新增"
            />
        </div>
        <div>
            <el-table ref="tableRef" :data="pager.lists" size="large" row-key="id">
                <el-table-column property="id" label="ID" min-width="100" />
                <el-table-column property="title" label="文本名称" min-width="300" />
                <el-table-column property="create_time" label="创建时间" min-width="180" />
                <el-table-column label="操作" min-width="140" fixed="right">
                    <template #default="scope">
                        <div class="flex items-center">
                            <Form
                                v-perms="['setting.web.protocol/edit']"
                                :id="scope.row.id"
                                type="text"
                                btnText="编辑"
                                @refresh="getLists"
                            />
                            <el-link
                                v-if="!scope.row.is_system"
                                v-perms="['setting.web.protocol/del']"
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

<script lang="ts" setup name="settingWebsiteProtocol">
import { apiProtocolLists, apiProtocolDel } from '@/api/setting/protocol'
import { onMounted } from 'vue'
import feedback from '@/utils/feedback'
import type { ElTable } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'
import Form from './components/form.vue'

const tableRef = shallowRef<InstanceType<typeof ElTable>>()

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiProtocolLists,
    params: {}
})

// 删除
const handleDelete = async (id: number): Promise<void> => {
    await feedback.confirm('确认删除文本？')
    await apiProtocolDel({ id })
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
