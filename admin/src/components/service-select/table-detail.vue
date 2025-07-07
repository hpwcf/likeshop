<template>
    <div class="mt-5" v-if="selectData.length">
        <el-table ref="tableDataRef" :data="selectData">
            <el-table-column label="服务名称" min-width="240">
                <template #default="scope">
                    <div class="flex items-center">
                        <div class="w-[60px] h-[60px]">
                            <el-image
                                style="width: 60px; height: 60px"
                                :src="scope.row.image"
                                :fit="'cover'"
                            />
                        </div>

                        <el-tooltip :content="scope.row.name" placement="top">
                            <div class="ml-2 truncate">{{ scope.row.name }}</div>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column property="category_desc" label="服务分类" min-width="200" />
            <el-table-column property="price" label="价格" min-width="120" />
            <el-table-column property="unit_desc" label="单位" min-width="220" />
            <el-table-column property="status_desc" label="销售状态" min-width="200">
                <template #default="scope">
                    <el-tag type="success" v-if="scope.row.status == 1">销售中</el-tag>
                    <el-tag type="info" v-if="scope.row.status == 0">仓库中</el-tag>
                </template>
            </el-table-column>
            <el-table-column property="create_time" label="创建日期" min-width="205" />
            <el-table-column label="操作" min-width="120" fixed="right">
                <template #default="scope">
                    <div class="flex">
                        <el-button
                            type="primary"
                            link
                            @click="handleDeleteItem(scope.$index)"
                            :disabled="disabled"
                            >移除</el-button
                        >
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue'

/** Props Start **/
const props = withDefaults(
    defineProps<{
        modelValue: any
        disabled: boolean
    }>(),
    {
        modelValue: [],
        disabled: false
    }
)
/** Props End **/

/** Emit Start **/
const emit = defineEmits(['update:modelValue'])
/** Emit End **/

/** Computed Start **/
const selectData: any = computed(() => {
    return props.modelValue || []
})
/** Computed End **/

/** Methods Start **/
const handleDeleteItem = (index: number) => {
    selectData.value.splice(index, 1)
    emit('update:modelValue', selectData.value)
}
/** Methods End **/
</script>

<style lang="scss" scoped>
.move {
    @media screen and (max-width: 1536px) {
        @apply overflow-scroll;
    }
}
</style>
