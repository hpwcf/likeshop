<template>
	<view class="card">
	    <!-- 卡片头部 -->
	    <view class="card--header flex justify-between">
	        <view class="title">附近师傅</view>
	        <view @click="goPage('/bundle/pages/master_worker_list/index')">
	            <text class="text-xs text-primary text-[#c8c9cc]">更多</text>
	            <u-icon name="arrow-right text-primary" size="18" color="#c8c9cc"></u-icon>
	        </view>
	    </view>
	
	    <!-- 内容商品 -->
	    <scroll-view class="scroll-view-box" scroll-x="true">
	        <block v-for="item3 in lists" :key="item3.id">
	            <view
	                class="master_worker_item"
	                @click.stop="goPage(`/bundle/pages/master_worker_detail/index?id=${item3.id}`)"
	            >
	                <u-image
	                    :src="item3.work_image"
	                    width="160"
	                    height="160"
	                    border-radius="10"
	                ></u-image>
	                <view class="master_worker_item--text">
	                    <view class="master_worker-title">{{ item3.name }}</view>
	                    <view class="truncate master_worker-desc mt-[10rpx]">{{ item3.goods_name }}</view>
	                </view>
	            </view>
	        </block>
	    </scroll-view>
	</view>
</template>

<script lang="ts" setup>

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
.card {
    margin-top: 40rpx;

    &--header {
        padding-bottom: 24rpx;
        // padding-right: 30rpx;
        .title {
            font-weight: 500;
            color: #222222;
            font-size: 36rpx;
        }
    }

    .scroll-view-box {
        white-space: nowrap;
    }
}
.master_worker_item {
	width: 200rpx;
    padding: 20rpx;
    border-radius: 10rpx;
	background-color: #ffffff;
	display: inline-block;
	margin-right: 20rpx;
	text-align: center;

    &--text {
        .master_worker-title {
            font-weight: 500;
            color: #222;
            font-size: 30rpx;
			margin-top: 10rpx;
        }

        .master_worker-desc {
            max-width: 350rpx;
            color: var(--color-primary, #FFC244);
            font-size: 20rpx;
			padding: 4rpx 10rpx;
			background-color: #fef0f0;
			border-radius: 4rpx;
			display: inline-block;
			max-width: 160rpx;
        }
    }
}
.master_worker_item:last-child {
	margin-right: 0;
}
</style>
