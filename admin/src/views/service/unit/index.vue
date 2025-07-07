<template>
    <el-card shadow="never" class="!border-none">
        <div class="w-[88px]">
            <!-- 添加单位 -->
            <unit-form
                v-perms="['goods.goods_unit/add']"
                @refresh="getLists"
                type="primary"
                btnText="添加单位"
            />
        </div>
        <div>
            <el-table
                ref="tableRef"
                :data="pager.lists"
                style="width: 100%"
                v-loading="pager.loading"
            >
                <el-table-column property="name" label="单位名称" min-width="200" />
                <el-table-column property="sort" label="排序" min-width="120" />
                <el-table-column property="create_time" label="添加时间" min-width="200" />
                <el-table-column label="操作" min-width="160" fixed="right">
                    <template #default="scope">
                        <div class="flex items-center">
                            <!-- 编辑单位 -->
                            <unit-form
                                v-perms="['goods.goods_unit/edit']"
                                :id="scope.row.id"
                                type="text"
                                btnText="编辑"
                                @refresh="getLists"
                            />
                            <!-- 删除单位 -->
                            <el-link
                                v-perms="['goods.goods_unit/del']"
                                class="ml-4 mt-[1px]"
                                type="danger"
                                :underline="false"
                                @click="handleDelete(scope.row.id)"
                                >删除</el-link
                            >
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

<script lang="ts" setup name="serviceUnit">
import { apiUnitLists, apiUnitDel } from '@/api/service/unit'
import Pagination from '@/components/pagination/index.vue'
import unitForm from './components/unit-form.vue'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiUnitLists
})

// 删除分类
const handleDelete = async (id: number): Promise<void> => {
    await feedback.confirm('确认要删除吗？')
    await apiUnitDel({ id })
    getLists()
}

getLists()
</script>

<style lang="scss"></style>
