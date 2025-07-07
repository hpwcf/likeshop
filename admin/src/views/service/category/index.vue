<template>
    <el-card class="!border-none" shadow="never">
        <el-form class="ls-form" :model="formData" inline>
            <el-form-item label="分类名称">
                <el-input class="ls-input" v-model="formData.name" placeholder="请输入分类名称" />
            </el-form-item>
            <el-form-item label="显示状态">
                <el-select v-model="formData.is_show" class="ls-input">
                    <el-option label="全部" value />
                    <el-option label="显示" value="1" />
                    <el-option label="隐藏" value="0" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="首页推荐">
                <el-select v-model="formData.is_recommend" class="ls-input">
                    <el-option label="全部" value />
                    <el-option label="推荐" value="1" />
                    <el-option label="不推荐" value="0" />
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <div class="flex">
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-card>

    <el-card shadow="never" class="!border-none mt-4">
        <div class="w-[88px]">
            <categoryForm
                v-perms="['goods.goods_category/add']"
                @refresh="getLists"
                type="primary"
                btnText="新增分类"
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
                <el-table-column label="分类名称" show-overflow-tooltip min-width="190">
                    <template #default="{ row }">
                        {{ row.name }}
                    </template>
                </el-table-column>
                <el-table-column label="分类图片" min-width="140">
                    <template #default="scope">
                        <el-image
                            style="width: 40px; height: 40px"
                            :src="scope.row.image"
                            :preview-src-list="[scope.row.image]"
                            :hide-on-click-modal="true"
                            :preview-teleported="true"
                            fit="cover"
                        >
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><Warning /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column property="address" label="状态" min-width="140">
                    <template #default="scope">
                        <el-switch
                            v-perms="['goods.goods_category/status']"
                            v-model="scope.row.is_show"
                            :active-value="1"
                            :inactive-value="0"
                            @change="handleStatusChange($event, scope.row.id)"
                        />
                    </template>
                </el-table-column>
                <!-- <el-table-column property="recommend_desc" label="首页推荐" min-width="157">
                    <template #default="scope">
                        <el-tag type="info" v-if="scope.row.is_recommend == 0">不推荐</el-tag>
                        <el-tag type="success" v-if="scope.row.is_recommend == 1">推荐</el-tag>
                    </template>
                </el-table-column> -->
                <el-table-column property="sort" label="排序" min-width="140" />
                <el-table-column property="create_time" label="添加时间" min-width="180" />
                <el-table-column label="操作" min-width="182" fixed="right">
                    <template #default="scope">
                        <div class="flex items-center">
                            <categoryForm
                                v-perms="['goods.goods_category/edit']"
                                :id="scope.row.id"
                                type="text"
                                btnText="编辑"
                                @refresh="getLists"
                            />
                            <el-link
                                v-perms="['goods.goods_category/del']"
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
        <!-- <div class="flex justify-end mt-4">
            <pagination v-model="pager" @change="getLists" />
        </div> -->
    </el-card>
</template>

<script lang="ts" setup name="serviceCategory">
import { apiCategoryLists, apiCategoryDel, apiCategoryStatusEdit } from '@/api/service/category'
import { onMounted } from 'vue'
import { Warning } from '@element-plus/icons-vue'
import categoryForm from './components/category-form.vue'
import feedback from '@/utils/feedback'
import type { ElTable } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'

const tableRef = shallowRef<InstanceType<typeof ElTable>>()

const tableData = ref([])

const formData = ref<any>({
    name: '',
    is_show: '',
    is_recommend: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiCategoryLists,
    params: formData.value
})

// 删除分类
const handleDelete = async (id: number): Promise<void> => {
    await feedback.confirm(
        '如果该服务已被师傅关联，此次操作也会同时删除师傅关联的服务项目，请谨慎操作'
    )
    await apiCategoryDel({ id })
    getLists()
}

// 状态修改
const handleStatusChange = async (event: Event, id: number) => {
    await apiCategoryStatusEdit({ is_show: event, id })
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
