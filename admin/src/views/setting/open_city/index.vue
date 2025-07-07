<template>
    <el-card shadow="never" class="!border-none mt-4">
        <div class="w-[88px]">
            <cityForm
                v-perms="['setting.open_city/add']"
                @refresh="getLists"
                type="primary"
                btnText="新增城市"
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
                <el-table-column property="city_name" label="城市名" min-width="190" />
                <el-table-column property="sort" label="排序" min-width="180" />
                <el-table-column property="update_time" label="更新时间" min-width="180" />
                <el-table-column label="操作" min-width="182" fixed="right">
                    <template #default="scope">
                        <div class="flex items-center">
                            <cityForm
                                v-perms="['setting.open_city/edit']"
                                :id="scope.row.id"
                                type="text"
                                btnText="编辑"
                                @refresh="getLists"
                            />
                            <el-link
                                v-perms="['setting.open_city/del']"
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

<script lang="ts" setup name="settingOpenCity">
import { apiOpenCityLists, apiOpenCityDel } from '@/api/setting/open_city'
import { onMounted } from 'vue'
import feedback from '@/utils/feedback'
import type { ElTable } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'
import cityForm from './components/city_form.vue'

const tableRef = shallowRef<InstanceType<typeof ElTable>>()

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiOpenCityLists,
    params: {}
})

// 删除
const handleDelete = async (id: number): Promise<void> => {
    await feedback.confirm('确认删除城市？')
    await apiOpenCityDel({ id })
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
