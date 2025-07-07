<template>
    <block v-for="(item2, index) in lists" :key="item2.id">
		<view class="card">
		    <!-- 卡片头部 -->
		    <view class="card--header flex justify-between">
		        <view class="title">{{ item2.name }}</view>
		        <view @click.stop="goPage(`/bundle/pages/category_goods_list/index?id=${item2.id}`)">
		            <text class="text-xs text-primary text-[#c8c9cc]">更多</text>
		            <u-icon name="arrow-right text-primary" size="18" color="#c8c9cc"></u-icon>
		        </view>
		    </view>
		
		    <!-- 内容商品 -->
			<goods-card :goodsList="item2.goods" type="grid"></goods-card>
		</view>
    </block>
</template>

<script lang="ts" setup>
import GoodsCard from '@/components/goods-card/index.vue'

const props = defineProps({
    lists: {
        type: Array,
        default: []
    }
})

const goPage = (url: string) => {
    uni.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
.card {
    margin-top: 40rpx;

    &--header {
        padding-bottom: 24rpx;
        .title {
            font-weight: 500;
            color: #222222;
            font-size: 36rpx;
        }
    }
}
</style>
