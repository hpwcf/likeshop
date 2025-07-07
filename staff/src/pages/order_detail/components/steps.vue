<template>
    <view
    	style="background-color: rgba(255, 255, 255, 0.1)"
    	class="grid grid-cols-5 gap-1 p-[20rpx] rounded-lg text-white w-full"
    >
    	<view class="flex flex-col items-center progressItem">
    		<view v-if="status >= 1" class="text-center">
    			<view class="rounded-full w-[44rpx] h-[44rpx] bg-white flex items-center justify-center m-[auto]">
    				<u-icon name="checkbox-mark" :color="$theme.primaryColor"></u-icon>
    			</view>
    			<view class="mt-2">已接单</view>
    		</view>
    		<view v-else>
    			<view
    				style="background-color: rgba(255, 255, 255, 0.1)"
    				class="rounded-full w-[44rpx] h-[44rpx] flex items-center justify-center m-[auto]"
    			>
    				<view>1</view>
    			</view>
    			<view class="mt-2 text-light">已接单</view>
    		</view>
    	</view>
    	<view class="flex flex-col items-center progressItem">
			<view v-if="status >= 2" class="text-center">
				<view class="rounded-full w-[44rpx] h-[44rpx] bg-white flex items-center justify-center m-[auto]">
					<u-icon name="checkbox-mark" :color="$theme.primaryColor"></u-icon>
				</view>
				<view class="mt-2">已出发</view>
			</view>
			<view v-else>
				<view
					style="background-color: rgba(255, 255, 255, 0.1)"
					class="rounded-full w-[44rpx] h-[44rpx] flex items-center justify-center m-[auto]"
				>
					<view>2</view>
				</view>
				<view class="mt-2 text-light">已出发</view>
			</view>
    	</view>
    	<view class="flex flex-col items-center progressItem">
    		<view v-if="status >= 3" class="text-center">
    			<view class="rounded-full w-[44rpx] h-[44rpx] bg-white flex items-center justify-center m-[auto]">
    				<u-icon name="checkbox-mark" :color="$theme.primaryColor"></u-icon>
    			</view>
    			<view class="mt-2">已到达</view>
    		</view>
    		<view v-else>
    			<view
    				style="background-color: rgba(255, 255, 255, 0.1)"
    				class="rounded-full w-[44rpx] h-[44rpx] flex items-center justify-center m-[auto]"
    			>
    				<view>3</view>
    			</view>
    			<view class="mt-2 text-light">已到达</view>
    		</view>
    	</view>
    	<view class="flex flex-col items-center progressItem">
    		<view v-if="status >= 4" class="text-center">
    			<view class="rounded-full w-[44rpx] h-[44rpx] bg-white flex items-center justify-center m-[auto]">
    				<u-icon name="checkbox-mark" :color="$theme.primaryColor"></u-icon>
    			</view>
    			<view class="mt-2">开始服务</view>
    		</view>
    		<view v-else>
    			<view
    				style="background-color: rgba(255, 255, 255, 0.1)"
    				class="rounded-full w-[44rpx] h-[44rpx] flex items-center justify-center m-[auto]"
    			>
    				<view>4</view>
    			</view>
    			<view class="mt-2 text-light">开始服务</view>
    		</view>
    	</view>
    	<view class="flex flex-col items-center progressItem">
    		<view v-if="status >= 5" class="text-center">
    			<view class="rounded-full w-[44rpx] h-[44rpx] bg-white flex items-center justify-center m-[auto]">
    				<u-icon name="checkbox-mark" :color="$theme.primaryColor"></u-icon>
    			</view>
    			<view class="mt-2">服务完成</view>
    		</view>
    		<view v-else>
    			<view
    				style="background-color: rgba(255, 255, 255, 0.1)"
    				class="rounded-full w-[44rpx] h-[44rpx] flex items-center justify-center m-[auto]"
    			>
    				<view>5</view>
    			</view>
    			<view class="mt-2 text-light">服务完成</view>
    		</view>
    	</view>
    </view>
</template>

<script lang="ts" setup>
const props = defineProps({
    status: {
        type: Number,
        default: 0
    }
})
</script>

<style lang="scss" scoped>
.progressItem {
    position: relative;
    &:not(:last-child) {
        &::before {
            content: '';
            position: absolute;
            width: 50rpx;
            height: 4rpx;
            background-color: rgba(255, 255, 255, 0.5);
            top: 20rpx;
            left: 100rpx;
        }
    }
}
</style>
