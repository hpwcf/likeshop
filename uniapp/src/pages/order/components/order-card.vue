<template>
    <view class="card" @click.stop="goPage">
		<view class="u-flex justify-between">
			<view class="text-muted">上门服务</view>
			<view>
				<view v-if="orderInfo.total_refund_amount > 0" class="text-primary">已退款￥{{ orderInfo.total_refund_amount }}</view>
				<view v-else>{{ orderInfo.order_status_desc }}</view>
			</view>
		</view>
		<view class="u-flex justify-between mt-[20rpx] mb-[30rpx]">
			<view class="font-bold text-4xl flex">
				<view>{{ orderInfo.appoint_time_day }}</view>
				<view class="text-primary ml-[10rpx]">{{ orderInfo.appoint_time_slot }}</view>
			</view>
			<view>
				<view class="text-sm text-muted" v-if="orderInfo.order_status === 0">该订单还没有支付</view>
				<view class="text-sm text-muted" v-if="orderInfo.order_status === 1 && orderInfo.order_sub_status === 0">等待服务人员接单</view>
				<view class="u-flex staff" style="background-color: #f7f7f7;padding: 6rpx 10rpx;border-radius: 30rpx;" v-if="orderInfo.staff && orderInfo.order_status !== 4">
					<u-image :src="orderInfo.staff.work_image" width="30" height="30" shape="circle"></u-image>
					<view class="ml-[16rpx]">{{ orderInfo.staff.name }}</view>
				</view>
			</view>
		</view>

        <block v-for="item3 in orderInfo.order_goods" :key="item3.id">
            <view class="card--main flex">
                <u-image :src="item3.goods_image" width="130" height="130" border-radius="14rpx"></u-image>
                <view class="ml-[20rpx] service-text w-[460rpx]">
					<view class="u-flex justify-between">
						<view class="service-text--name truncate">{{ item3.goods_name }}</view>
						<view class="font-bold" :style="{'color':$theme.primaryColor}">¥{{ item3.goods_price }}</view>
					</view>
					<view class="u-flex justify-between">
						<view class="u-flex mt-[10rpx] flex-wrap flex-1">
							<view class="tag" v-for="(item4,index4) in item3.goods_sku_arr" :key="index4">{{ item4 }}</view>
						</view>
						<view class="text-muted">x{{ item3.goods_num }}</view>
					</view>
                </view>
            </view>
        </block>

        <view class="card--footer flex justify-between items-center">
			<view class="u-flex">
				<price :price="orderInfo.order_amount" priceFontSize="36rpx" v-if="timeStamp <= 0"></price>
				<view class="primary" v-if="timeStamp > 0">
				    <view class="flex items-center" v-if="timeStamp > 0">
				        <u-count-down
				            :timestamp="timeStamp"
				            format="mm:ss"
				            :font-size="26"
				            :separator-size="26"
				            @end="timeStamp = 0"
				        />
				        <text class="ml-[10rpx]">后自动取消</text>
				    </view>
				</view>
			</view>
            
            <view>
                <slot></slot>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { ref, reactive, watchEffect } from 'vue'
import Price from '@/components/price/index.vue'

const props = withDefaults(
    defineProps<{
        orderInfo?: any // 底部
    }>(),
    {
        orderInfo: {}
    }
)
const timeStamp = ref<number | null>(0)

const getCountDownSegment = watchEffect(() => {
    // 获取倒计时段
    const endTimestamp = props.orderInfo.order_cancel_time
    const startTimestamp = new Date().getTime() / 1000
    timeStamp.value = (endTimestamp - startTimestamp) * 1000
})

const goPage = () => {
    uni.navigateTo({
        url: `/pages/order_detail/index?id=${props.orderInfo.id}`
    })
}
</script>

<style lang="scss" scoped>
.card {
    border-radius: 20rpx;
    background-color: #ffffff;
    margin: 20rpx 20rpx 0 20rpx;
	padding: 34rpx 30rpx;

    &--header {
        padding: 24rpx 30rpx;
        font-size: 26rpx;
        border-bottom: 1px solid #e5e5e5;
        .order-sn {
            color: #222222;
        }
        .status {
            color: var(--color-primary, #FFC244);
        }
    }

    &--main {
        padding: 20rpx;
		border-radius: 20rpx;
		background-color: #f7f7f7;

        .service-text {
            &--name {
                font-weight: 500;
                color: #222222;
                font-size: 32rpx;
            }
			.tag {
				color: #909399;
				font-size: 20rpx;
				padding: 4rpx 10rpx;
				background-color: #ffffff;
				border-radius: 4rpx;
				display: inline-block;
				margin-right: 10rpx;
				margin-top: 10rpx;
			}
			.tag:last-child {
				margin-right: 0;
			}
        }
    }

    &--footer {
        padding-top: 30rpx;
        font-size: 26rpx;
        border-top: 1px solid #f7f7f7;
		margin-top: 30rpx;
    }
}
</style>
