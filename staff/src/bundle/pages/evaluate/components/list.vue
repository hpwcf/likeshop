<template>
    <z-paging
        auto-show-back-to-top
        :auto="i == index"
        ref="paging"
        v-model="dataList"
        :data-key="i"
        @query="queryList"
        :fixed="false"
        height="100%"
    >
        <block v-for="(item, index) in dataList" :key="index">
            <Card
                :data="item"
            ></Card>
        </block>
    </z-paging>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, shallowRef, unref } from 'vue'
import Card from './card.vue'
import { apiGoodsCommentLists } from '@/api/goods'

const paging = shallowRef<any>(null)
const dataList = ref<any>([])
const isFirst = ref<boolean>(true)

const props = withDefaults(
    defineProps<{
        i: number
        index: number
        type: number
    }>(),
    {
        type: 0
    }
)

watch(
    () => props.index,
    async () => {
        await nextTick()
        if (props.i == props.index && unref(isFirst)) {
            isFirst.value = false
            paging.value?.reload()
        }
    },
    { immediate: true }
)

const queryList = async (pageNo: number, pageSize: number) => {
    try {
        const { lists } = await apiGoodsCommentLists({
            type: props.type,
            pageNo,
            pageSize
        })
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}
</script>

<style scoped></style>
