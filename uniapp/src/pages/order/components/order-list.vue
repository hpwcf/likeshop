<template>
    <z-paging
        auto-show-back-to-top
        ref="paging"
        v-model="dataList"
        @query="queryList"
        :fixed="false"
        height="100%"
    >
        <block v-for="(item, index) in dataList" :key="index">
            <order-card :orderInfo="item">
                <order-footer
                    :orderId="item?.id"
                    :goodsId="item?.order_goods[0].goods_id"
                    :orderGoodsId="item?.order_goods[0].id"
                    :orderBtn="item.user_order_btn"
                    @refresh="paging.reload()"
                />
            </order-card>
        </block>
    </z-paging>
</template>

<script lang="ts" setup>
import { ref, watch, shallowRef } from 'vue'
import orderCard from './order-card.vue'
import orderFooter from '@/components/order-footer/index.vue'
import { apiOrderLists } from '@/api/order'
import { onShow } from '@dcloudio/uni-app'

const props = withDefaults(
    defineProps<{
        order_status: number
    }>(),
    {
        order_status: 0
    }
)

const paging = shallowRef<any>(null)
const dataList = ref<any>([])

watch(
    () => props.order_status,
    () => {
        paging.value.reload()
    }
)

const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists } = await apiOrderLists({
            order_status: props.order_status,
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

onShow(() => {
    paging.value?.reload()
})
</script>

<style scoped></style>
