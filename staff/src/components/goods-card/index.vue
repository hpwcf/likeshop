<template>
    <template v-if="type == 'list'">
        <block v-for="goodsItem in goodsList" :key="goodsItem.id">
            <view
                class="goods-item goods-list w-[340rpx] h-[480rpx] mt-[20rpx] flex bg-white"
                @click="goPage(goodsItem.id)"
            >
                <u-image :src="goodsItem.image" width="340" height="340"></u-image>
                <view class="goods-name truncate pl-[20rpx] pt-[20rpx]">
                    {{ goodsItem.name }}
                </view>
                <view class="pl-[20rpx] mt-[10rpx]">
                    <price
                        :price="goodsItem?.price"
                        :desc="goodsItem.unit_desc || goodsItem?.unit_name"
                    ></price>
                </view>
            </view>
        </block>
    </template>

    <template v-if="type == 'row'">
        <block v-for="goodsItem in goodsList" :key="goodsItem.id">
            <view
                class="goods-item w-[220rpx] h-[310rpx] mr-[20rpx] flex bg-white"
                @click="goPage(goodsItem.id)"
            >
                <u-image :src="goodsItem.image" width="220" height="200"></u-image>
                <view class="goods-name truncate pt-[20rpx]">
                    {{ goodsItem.name }}
                </view>
                <view class="mt-[10rpx]">
                    <price
                        :price="goodsItem?.price"
                        :desc="goodsItem.unit_desc || goodsItem?.unit_name"
                    ></price>
                </view>
            </view>
        </block>
    </template>
</template>

<script lang="ts" setup>
import Price from '@/components/price/index.vue'

/** Props Start **/
const props = withDefaults(
    defineProps<{
        type: string // 列表类型
        goodsList?: any // 商品数据
    }>(),
    {
        type: 'list',
        goodsList: []
    }
)
/** Props End **/

/** Methods Start **/
/**
 * @param { string } url
 * @return { void }
 * @description 跳转到商品
 */
const goPage = (id: number | string) => {
    uni.navigateTo({
        url: `/pages/goods/index?id=${id}`
    })
}
/** Methods End **/
</script>

<style lang="scss" scoped>
.goods-item {
    display: inline-block;
    overflow: hidden;
    border-radius: 8rpx;

    .goods-name {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 28rpx;
        color: #222222;
    }
}
.goods-list {
    margin-right: 20rpx;
}

.goods-list:nth-child(2n) {
    margin-right: 0;
}
</style>
