<template>
    <view class="card" @click.stop="goPage">
		<view class="u-flex justify-between">
			<view class="text-[#909399]">{{ orderInfo.distance }}</view>
			<view class="font-bold">{{ orderInfo.order_status_desc }}</view>
		</view>
		<view class="u-flex font-bold text-4xl mt-[30rpx] mb-[30rpx]">
			<view>{{ orderInfo.appoint_time_day }}</view>
			<view class="text-[#62cb81] ml-[20rpx]">{{ orderInfo.appoint_time_slot }}</view>
		</view>

        <block v-for="item3 in orderInfo.order_goods" :key="item3.id">
            <view class="card--main flex">
                <u-image :src="item3.goods_image" width="130" height="130" border-radius="14rpx"></u-image>
                <view class="ml-[20rpx] service-text w-[460rpx]">
					<view class="u-flex justify-between">
						<view class="service-text--name truncate">{{ item3.goods_name }}</view>
						<price :price="item3.goods_price" priceFontSize="30rpx" priceIconFontSize="22rpx"></price>
					</view>
					<view class="u-flex justify-between mt-[30rpx]">
						<view class="u-flex flex-wrap flex-1">
							<view class="tag" v-for="(item4,index4) in item3.goods_sku_arr" :key="index4">{{ item4 }}</view>
						</view>
						<view class="text-sm text-muted">x{{ item3.goods_num }}</view>
					</view>
                </view>
            </view>
        </block>
		<view class="mt-[20rpx] u-flex">
			<view class="font-bold">服务地址：</view>
			<view class="text-muted">
				{{ orderInfo.address_info.city }}
				{{ orderInfo.address_info.district }}
				<text v-if="orderInfo.order_sub_status > 0">{{ orderInfo.address_info.address }}</text>
			</view>
		</view>
		<view class="mt-[20rpx]" v-if="orderInfo.user_remark">
			<text class="font-bold">用户备注：</text>
			<text class="text-muted">{{ orderInfo.user_remark }}</text>
		</view>

        <view class="card--footer flex justify-between items-center">
			<view class="text-[#ff9600] font-bold text-2xl u-flex">
				<view class="text-[24rpx] text-muted">合计：</view>
				<price :price="orderInfo.order_amount"></price>
			</view>
            <view>
                <slot></slot>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import Price from '@/components/price/index.vue'

const props = withDefaults(
    defineProps<{
        orderInfo?: any // 底部
    }>(),
    {
        orderInfo: {}
    }
)

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
