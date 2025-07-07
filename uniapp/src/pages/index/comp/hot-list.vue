<template>
    <card title="热门服务">
        <block v-for="item1 in lists" :key="item1.id">
            <view
                class="goods-item mr-[20rpx]"
                @click="goPage(`/pages/goods/index?id=${item1.id}`)"
            >
                <view class="flex justify-center">
                    <u-image :src="item1.image" width="200" height="200"></u-image>
                </view>
                <view class="goods-item--text text-center">
                    <view class="goods-title truncate mt-[20rpx] mb-[16rpx]">{{ item1.name }}</view>
                    <view class="truncate goods-desc">
                        <text space="emsp" decode="true">{{ item1.remarks || ' ' }}</text>
                    </view>
                </view>
            </view>
        </block>
    </card>
</template>

<script lang="ts" setup>
import Card from './card.vue'

defineProps({
    lists: {
        type: Array,
        default: []
    }
})

const goPage = (url: string) => {
    uni.navigateTo({ url: url })
}
</script>

<style lang="scss" scoped>
// 商品列表
.goods-item {
    width: 200rpx;
    display: inline-block;

    &--text {
        // line-1
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .goods-title {
            // width: 180rpx;
            font-weight: 500;
            color: #222;
            font-size: 30rpx;
        }

        .goods-desc {
            color: #888;
            font-size: 24rpx;
        }
    }
}
</style>
