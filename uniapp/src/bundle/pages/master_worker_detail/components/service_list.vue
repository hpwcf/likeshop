<template>
	<view class="card" v-for="(item,index) in serviceData" :key="index">
	    <navigator :url="`/pages/goods/index?id=${item.id}`">
	        <view class="flex master_worker_item col-start">
	            <u-image
	                :src="item.image"
	                width="140"
	                height="140"
	                border-radius="14rpx"
	            ></u-image>
	            <view class="ml-[20rpx] w-[500rpx]">
	                <view class="u-flex justify-between">
						<view class="text-[32rpx] font-bold">{{ item.name }}</view>
						<view class="text-[#909399] text-[20rpx]">已售200</view>
					</view>
	                <view class="u-flex mt-[10rpx] text-[#707070]">
	    				<text class="service-tag">清洗<text class="line">|</text></text>
	    				<text class="service-tag">保洁<text class="line">|</text></text>
	    			</view>
	                <view class="u-flex mt-[10rpx] justify-between">
	    				<view class="text-primary">
	    				    <price
	    				        :price="item.price"
								priceFontSize="36rpx"
	    				    ></price>
	    				</view>
	    				<view>
	    					<button
	    					    class="bg-primary text-[24rpx] text-white leading-[46rpx] h-[46rpx] w-[120rpx] m-0"
	    						style="border-radius: 46rpx;"
	    					>
	    					    下单
	    					</button>
	    				</view>
	    			</view>
	            </view>
	        </view>
	    </navigator>
	</view>
</template>

<script lang="ts" setup>
import Price from '@/components/price/index.vue'

const props = withDefaults(
    defineProps<{
        serviceData: any
    }>(),
    {
        serviceData: []
    }
)
</script>

<style lang="scss" scoped>
.card {
    margin-bottom: 40rpx;
    padding-bottom: 40rpx;
	border-bottom: solid #f4f4f5 1px;
	
	.service-tag .line {
		font-size: 20rpx;
		margin: 0 10rpx;
	}
	.service-tag:last-child .line {
		display: none;
	}
}
.card:last-child {
	border-bottom: 0;
}
</style>
