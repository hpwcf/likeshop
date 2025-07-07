<template>
    <div>
        <div>
            <span>选择分类</span>
            <el-cascader
                class="ml-4"
                ref="cascaderRef"
                :model-value="modelValue.query?.id"
                :options="cateLists"
                :props="{
                    checkStrictly: true,
                    label: 'name',
                    value: 'id',
                    children: 'sons',
                    emitPath: false
                }"
                clearable
                filterable
                @change="change"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { LinkTypeEnum, type Link } from '.'
import { apiCategoryLists } from '@/api/service/category'

defineProps({
    modelValue: {
        type: Object as PropType<Link>,
        default: () => ({})
    }
})
const emit = defineEmits<{
    (event: 'update:modelValue', value: Link): void
}>()

const cateLists = ref<any>([])
const cascaderRef = ref()

const getLists = async (): Promise<void> => {
    try {
        const { lists } = await apiCategoryLists('')
        cateLists.value = lists
    } catch (error) {
        console.log('获取分类列表：', error)
    }
}

const change = () => {
    const node = cascaderRef.value.getCheckedNodes()
    emit('update:modelValue', {
        path: `/bundle/pages/category_goods_list/index?id=${node[0]?.data.id}`,
        query: {
            id: node[0].data.id,
            name: node[0].text
        },
        type: LinkTypeEnum.SERVICE_CLASSIFY
    })
}

getLists()
</script>

<style></style>
