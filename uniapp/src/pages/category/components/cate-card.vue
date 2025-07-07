<template>
    <view class="card">
        <!-- Content Header Satrt -->
        <!-- <template v-if="param.level !== 1">
            <view
                class="flex justify-between card--header"
                @click="goPage(`/bundle/pages/category_goods_list/index?id=${pid}`)"
            >
                <view class="name">{{ param.name }}</view>
                <view class="flex">
                    <u-icon name="arrow-right" size="22"></u-icon>
                </view>
            </view>
        </template> -->

        <block v-if="param.level !== 1">
            <view class="flex justify-between card--header">
                <view class="name">{{ param.name }}</view>
            </view>
        </block>

        <view class="empty" v-show="param.level === 1 && !goodsData.length">
            <u-empty
                text="暂无数据～"
                src="/static/images/empty/collection.png"
                :icon-size="300"
                color="#888888"
            ></u-empty>
        </view>
        <!-- Content Header End -->

        <!-- Content Main Start -->
        <view class="card--main">
            <block v-for="item4 in goodsData" :key="item4.id">
                <view
                    class="goods flex w-[230rpx] h-[205rpx]"
                    @click="goPage(`/pages/goods/index?id=${item4.id}`)"
                >
                    <u-image :src="item4.image" width="100%" height="100%"></u-image>
                    <view class="mt-[20rpx] truncate">{{ item4.name }}</view>
                    <view class="text-primary mt-[10rpx]">
                        <price :price="item4.price" :desc="item4.unit_desc"></price>
                    </view>
                </view>
            </block>
        </view>
        <!-- Content Main End -->
    </view>
</template>

<script lang="ts" setup>
import { ref, reactive, watchEffect, watch } from 'vue'
import { apiGoodsLists } from '@/api/store'
import Price from '@/components/price/index.vue'
import { locationState } from '@/hooks/useLocation'

/** Interface Start **/
interface GoodsDataObj {
    id: number
    name: string
    image: string
    remarks: string
    price: string
    unit_desc: string
}
/** Interface End **/

/** Props Start **/
const props = withDefaults(
    defineProps<{
        param?: any // 底部
        pid: any
    }>(),
    {
        param: {
            id: 0,
            name: ''
        },
        pid: 0
    }
)
/** Props End **/

/** Data Start **/
const goodsData = ref<Array<GoodsDataObj> | null | any>([])
/** Data End **/

/** Methods Start **/
/**
 * @return { Promise }
 * @description 初始化分类商品
 */
const initGoodsLists = async (): Promise<void> => {
    const res: any = await apiGoodsLists({ category_id: props.param.id,city_id: locationState.city_id })
    goodsData.value = res.lists
}

/**
 * @param { String } url
 * @return { Promise }
 * @description 跳转页面
 */
const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}
/** Methods End **/

watch(
    () => props.param.id,
    () => {
        initGoodsLists()
    },
    { immediate: true }
)
</script>

<style lang="scss" scoped>
.card {
    margin-bottom: 20rpx;
    border-radius: 14rpx;
    padding-bottom: 20rpx;
    background-color: #ffffff;
    &--header {
        color: #888888;
        padding: 26rpx 30rpx;
        padding-bottom: 0;
        font-size: 32rpx;

        .name {
            font-weight: 500;
            color: #222222;
            font-size: 28rpx;
        }
    }

    &--main {
        padding: 0 24rpx;
        .goods {
            padding-top: 26rpx;
            display: inline-block;
        }
        .goods:nth-child(2n + 1) {
            margin-right: 20rpx;
        }
    }
}
</style>
