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
                :comment="item.comment"
                :goods_comment_image="item.goods_comment_image"
                :reply="item.reply"
                :create_time="item.create_time"
                :goods_id="item.goods_id"
                :service_comment="item.service_comment"
                :user="item.user"
            ></Card>
        </block>
    </z-paging>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, shallowRef, unref } from 'vue'
import Card from './card.vue'
import { apiEvaluateGoodsLists } from '@/api/goods'

const paging = shallowRef<any>(null)
const dataList = ref<any>([])
const isFirst = ref<boolean>(true)

const props = withDefaults(
    defineProps<{
        goods_id: number
        i: number
        index: number
        cid: number
    }>(),
    {
        goods_id: 0,
        cid: 0
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
        const { lists } = await apiEvaluateGoodsLists({
            goods_id: props.goods_id,
            pageNo,
            pageSize,
            id: props.cid
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
