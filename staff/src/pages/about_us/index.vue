<template>
    <view class="as-us flex flex-1 flex-col items-center mb-[200rpx]">
        <image :src="appStore.config.staff_logo" mode="" class="img"></image>
        <view class="text-content mt-[40rpx]">{{ appStore.config.staff_name }}</view>
    </view>
	<view class="pl-[40rpx] pr-[40rpx]">
		<view class="u-flex justify-between mb-[50rpx]">
			<view class="font-bold">客服电话</view>
			<view class="u-flex">
				<view class="mr-[10rpx]">13000013000</view>
				<u-icon name="arrow-right" color="#909399" size="24"></u-icon>
			</view>
		</view>
		<view class="u-flex justify-between mb-[50rpx]">
			<view class="font-bold">当前版本</view>
			<view class="u-flex">
				<view class="mr-[10rpx]">{{ `v${appStore.config.version}` }}</view>
				<u-icon name="arrow-right" color="#909399" size="24"></u-icon>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
</script>

<style>
	page {
		background-color: #ffffff;
	}
</style>
<style lang="scss" scoped>
.as-us {
    .img {
        width: 160rpx;
        height: 160rpx;
        border-radius: 20rpx;
        margin-top: 96rpx;
    }
}
</style>
