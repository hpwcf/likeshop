<template>
    <popup
        class="inline mr-3"
        :clickModalClose="false"
        title="选择服务"
        :center="true"
        @close="handleClose(serviceFormRef)"
        @confirm="handleConfirm"
        width="1050px"
    >
        <!-- Trigger Start -->
        <template #trigger>
            <!-- trigger -->
            <slot name="popup"></slot>
        </template>
        <!-- Trigger End -->

        <!-- Form Start -->
        <el-form :model="serviceForm" ref="serviceFormRef" :inline="true" label-width="auto">
            <el-form-item label="服务名称">
                <el-input
                    class="ls-input"
                    v-model="serviceForm.name"
                    placeholder="请输入"
                ></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="serviceForm.status" placeholder="请选择" class="ls-input">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="销售中" value="1"></el-option>
                    <el-option label="仓库中" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getLists">搜索</el-button>
                <el-button @click="resetParams">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- Form End -->

        <!-- Table Start   @selection-change="handleSelectionChange" -->
        <div>
            <el-table ref="tableDataRef" :data="pager.lists" border style="width: 100%">
                <el-table-column label="选择" width="50">
                    <template #header>
                        <el-checkbox size="large" v-model="selectAll"></el-checkbox>
                    </template>
                    <template #default="{ row }">
                        <div class="flex row-center" @click.stop>
                            <el-checkbox
                                :model-value="selectItem(row)"
                                @change="handleSelect($event, row)"
                                size="large"
                            ></el-checkbox>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="服务名称" min-width="200">
                    <template #default="scope">
                        <div class="flex items-center">
                            <el-image
                                style="width: 48px; height: 48px"
                                :src="scope.row.image"
                                :fit="'cover'"
                            />

                            <el-tooltip :content="scope.row.name" placement="top">
                                <div class="w-16 ml-2 truncate flex-1">{{ scope.row.name }}</div>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="category_desc" label="服务分类" min-width="160" />
                <el-table-column property="status_desc" label="状态" min-width="120">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.status == 1">销售中</el-tag>
                        <el-tag type="info" v-if="scope.row.status == 0">仓库中</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- Table End -->

        <!-- Footer Pagination Start -->
        <div class="flex justify-end">
            <pagination v-model="pager" @change="getLists" />
        </div>
        <!-- Footer Pagination End -->
    </popup>
</template>

<script lang="ts" setup>
import { apiServiceLists } from '@/api/service/lists'
import Popup from '@/components/popup/index.vue'
import Pagination from '@/components/pagination/index.vue'
import type { ElForm } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'
import { deepClone } from '@/utils/util'
import { computed, withDefaults, watchEffect, ref, reactive } from 'vue'

interface serviceFormObj {
    name?: string
    status?: number | string
    skill_id?: number | string
}
type FormInstance = InstanceType<typeof ElForm>
const serviceFormRef = ref<FormInstance>()

const props = withDefaults(
    defineProps<{
        goodsId: any
        selectData: any
        skill_id: number | string
    }>(),
    {
        goodsId: [],
        selectData: [],
        skill_id: ''
    }
)

const emit = defineEmits(['update:goodsId', 'update:selectData'])

const selectData = ref<any>(props.selectData)
const serviceForm = reactive<serviceFormObj>({
    name: '',
    status: '',
    skill_id: props.skill_id
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    size: 5,
    fetchFun: apiServiceLists,
    params: serviceForm
})

// 表格多选选择的数据
// const handleSelectionChange = (val: Event | any) => {
//     selectData.value = [...val]
// }

// 弹窗关闭
const handleClose = (formEl: FormInstance | undefined): void => {
    if (!formEl) return
    formEl.resetFields()
}
// 确认选择
const handleConfirm = (): void => {
    // 深度克隆防止数据串到父组件
    emit('update:selectData', deepClone(selectData.value))
    emit('update:goodsId', deepClone(selectData.value.map((item: Event | any) => item.id)))
}
const selectItem = computed(() => {
    return (row: any) => {
        if (!selectData.value) return false
        return selectData.value.some((item: any) => item.id == row.id)
    }
})
const selectAll = computed({
    get: () => {
        const { lists } = pager
        if (!selectData.value) return false
        const ids: any[] = selectData.value.map((item: any) => item.id)
        if (!lists.length) {
            return false
        }
        return lists.every((item) => ids.includes(item.id))
    },
    set: (val) => {
        const { lists } = pager
        if (val) {
            for (let i = 0; i < lists.length; i++) {
                const item = lists[i]
                const ids: any[] = selectData.value.map((item: any) => item.id)
                if (!ids.includes(item.id)) {
                    selectData.value.push(item)
                }
            }
        } else {
            lists.forEach((row) => {
                deleteSelectedData(row)
            })
        }
    }
})
const handleSelect = ($event: any, row: any) => {
    if ($event) {
        selectData.value.push(row)
    } else {
        deleteSelectedData(row)
    }
}
const deleteSelectedData = (row: any) => {
    const index = selectData.value.findIndex((item: any) => item.id == row.id)
    if (index != -1) {
        selectData?.value.splice(index, 1)
    }
}
// const selectData: any = computed({
//     get: () => {
//         return props.selectData || []
//     },
//     set: (value) => {
//         emit(
//             'update:goodsId',
//             value.map((item: Event | any) => item.id)
//         )
//         emit('update:selectData', value)
//     }
// })

getLists()

watchEffect(() => {
    selectData.value = props.selectData
})
</script>

<style lang="scss" scoped>
.ls-input {
    width: 240px;
}
:deep(.el-table__inner-wrapper) {
    height: 365px;
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>
