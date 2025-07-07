<template>
    <el-card shadow="never" class="!border-none">
        <el-page-header @back="$router.back()">
            <template #content>
                <div class="flex items-center">
                    <span class="text-large font-600 mr-3"> 附加项目 </span>
                    <span style="color: var(--el-text-color-regular)">
                        {{ goods_name }}
                    </span>
                </div>
            </template>
        </el-page-header>
    </el-card>
    <el-card shadow="never" class="!border-none mt-4">
        <div class="w-[88px]">
            <additionalForm
                v-perms="['goods.goods_additional/add']"
                @refresh="getLists"
                type="primary"
                btnText="新增"
                :goodsId="goods_id"
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
                <el-table-column property="name" label="附加项目名称" min-width="190" />
                <el-table-column property="price" label="价格" min-width="180" />
                <el-table-column property="duration" label="时长" min-width="180" />
                <el-table-column label="状态" min-width="140">
                    <template #default="scope">
                        <el-switch
                            v-perms="['goods.goods_additional/status']"
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
                            <additionalForm
                                v-perms="['goods.goods_additional/edit']"
                                :id="scope.row.id"
                                type="text"
                                btnText="编辑"
                                :goodsId="goods_id"
                                @refresh="getLists"
                            />
                            <el-link
                                v-perms="['goods.goods_additional/del']"
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

<script lang="ts" setup name="serviceAdditional">
import {
    apiServiceAdditionalLists,
    apiServiceAdditionalDel,
    apiServiceAdditionalStatus
} from '@/api/service/additional'
import { onMounted } from 'vue'
import feedback from '@/utils/feedback'
import type { ElTable } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'
import additionalForm from './components/additional_form.vue'

const route = useRoute()
const goods_id: any = route.query.goods_id
const goods_name: any = route.query.goods_name

const tableRef = shallowRef<InstanceType<typeof ElTable>>()

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiServiceAdditionalLists,
    params: { goods_id }
})

// 删除
const handleDelete = async (id: number): Promise<void> => {
    await feedback.confirm('确认删除附加项目？')
    await apiServiceAdditionalDel({ id })
    getLists()
}

// 状态
const handleStatusChange = async (event: Event, id: number) => {
    await apiServiceAdditionalStatus({ status: event, id })
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
