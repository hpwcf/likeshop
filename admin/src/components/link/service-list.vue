<template>
    <div>
        <div class="flex items-center">
            <span>服务搜索</span>
            <div class="ml-4">
                <el-input v-model="formData.name">
                    <template #append>
                        <el-button :icon="Search" @click="resetPage" />
                    </template>
                </el-input>
            </div>
        </div>
        <div class="mt-4">
            <el-scrollbar height="380px" class="mt-[20px]">
                <el-table :data="pager.lists" style="width: 100%" @row-click="rowClick">
                    <el-table-column min-width="40">
                        <template #default="{ row }">
                            <el-radio :label="row.id" :model-value="tableSelect">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务名称" min-width="200">
                        <template #default="{ row }">
                            <div class="flex items-center">
                                <div>
                                    <el-image :src="row.image" class="w-[40px] h-[40px]" />
                                </div>
                                <span class="ml-2">{{ row.name }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="min_price" label="价格" min-width="100" />
                    <!-- <el-table-column prop="unit_desc" fixed="right" label="单位" min-width="130" /> -->
                </el-table>
            </el-scrollbar>
        </div>
        <div class="flex justify-end">
            <pagination
                v-model="pager"
                @change="getLists"
                layout="total, prev, pager, next, jumper"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { apiServiceLists } from '@/api/service/lists'
import { usePaging } from '@/hooks/usePaging'
import type { PropType } from 'vue'
import { LinkTypeEnum, type Link } from '.'

defineProps({
    modelValue: {
        type: Object as PropType<Link>,
        default: () => ({})
    }
})
const emit = defineEmits<{
    (event: 'update:modelValue', value: Link): void
}>()

const formData = ref({
    name: '' // 服务名称
})

const tableSelect = ref()
const rowClick = (row: any) => {
    tableSelect.value = row.id
    console.log('row', row)

    emit('update:modelValue', {
        path: `/pages/goods/index?id=${row.id}`,
        query: {
            id: row.id,
            name: row.name
        },
        type: LinkTypeEnum.SERVICE_LIST
    })
}

//分页组件
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiServiceLists,
    params: formData.value
})

getLists()
</script>

<style></style>
