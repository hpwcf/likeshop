<template>
    <z-paging
        auto-show-back-to-top
        ref="paging"
        v-model="dataList"
        @query="queryList"
        :fixed="false"
        height="100%"
    >
        <Card :withdrawApplyLists="dataList" />
    </z-paging>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import Card from './card.vue'
import { apiWithdrawLists } from '@/api/wallet'

const paging = shallowRef<any>(null)
const dataList = ref<any>([])

const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists } = await apiWithdrawLists({
            page_no,
            page_size
        })
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}
</script>
