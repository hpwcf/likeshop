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
					type="list"
					:orderId="item?.id"
					:orderBtn="item.staff_order_btn"
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
import { onLoad, onShow } from '@dcloudio/uni-app'

const emit = defineEmits(['refresh'])

const props = withDefaults(
    defineProps<{
        type: number
    }>(),
    {
        type: 1
    }
)

const paging = shallowRef<any>(null)
const dataList = ref<any>([])

watch(
    () => props.type,
    () => {
        paging.value?.reload()
    }
)

const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists,extend } = await apiOrderLists({
            type: props.type,
            page_no,
            page_size
        })
        paging.value.complete(lists)
		emit('refresh',extend)
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
