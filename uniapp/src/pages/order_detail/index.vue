<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <uni-transition
        mode-class="zoom-in"
        needLayout="true"
        :show="orderData.order_goods.length"
        :duration="500"
    >
        <view class="order_detail">
            <!-- Main Start -->
			<!-- 订单状态 -->
            <view class="pt-[40rpx] pb-[40rpx] pl-[24rpx] pr-[24rpx]">
                <text class="text-white text-2xl font-bold">{{ orderData.order_status_desc }}</text>
				<view class="primary mt-[10rpx]">
				    <view class="flex items-center text-white" v-if="closeTimeStamp > 0">
				        <text>剩余</text>
				        <u-count-down
				            :timestamp="closeTimeStamp"
				            format="mm分:ss秒"
				            :font-size="26"
				            :separator-size="26"
				            @end="closeTimeStamp = 0"
				        />
				        <text>自动关闭</text>
				    </view>
					<view class="text-white" v-if="closeTimeStamp <= 0">{{ orderData.create_time }}</view>
				</view>
            </view>
			
			<view class="info">
				<!-- 地址卡片 -->
				<view class="card">
					<u-tag text="预约时间" size="default" mode="dark" bg-color="#f4f4f5" color="#82848a" />
					<view class="font-bold text-[50rpx] flex mt-[30rpx] mb-[30rpx]">
						<view>{{ orderData.appoint_time_day }}</view>
						<view class="text-primary ml-[10rpx]">{{ orderData.appoint_time_slot }}</view>
					</view>
				    <view class="mb-[20rpx] font-bold">
				        {{ orderData.address_info.province }}
				        {{ orderData.address_info.city }}
				        {{ orderData.address_info.district }}
				        {{ orderData.address_info.address }}
				    </view>
				    <view class="text-sm text-muted">
						{{ orderData.contact }}
						{{ orderData.address_info.sex_desc }}
						{{ orderData.mobile }}
					</view>
				</view>
				
				<!-- 师傅 -->
				<view
					v-if="orderData?.staff"
					class="card flex justify-between items-center"
				>
					<view class="u-flex">
						<u-image
							:src="orderData?.staff?.work_image"
							width="84"
							height="84"
							shape="circle"
						></u-image>
						<view class="ml-3">
							<view class="text-base font-medium">
								<text class="mr-1">{{ orderData?.staff?.name }}</text>
								<!-- <u-icon name="arrow-right" size="24" color="#999"/> -->
							</view>
							<view
								class="mt-1 px-[6rpx] py-[4rpx] rounded"
								style="font-size: 20rpx; background-color: #FEF4EC; color: #CB9F5D;"
							>
								实名认证
							</view>
						</view>
					</view>

					<view style="z-index: 0;">
						<u-button class="call-staff" style="z-index: 0;" size="medium" @click="call(orderData?.staff?.mobile)">
							<u-icon
								name="phone"
								color="#333"
								size="24rpx"
							></u-icon>
							<text class="ml-1">联系师傅</text>
						</u-button>
					</view>
				</view>
				
				<!-- 商品卡片 -->
				<view class="card">
				    <view class="goods-item">
				        <u-image
				            :src="orderData.order_goods[0]?.goods_image"
				            width="130"
				            height="130"
				            border-radius="14rpx"
				        ></u-image>
						<view class="ml-[20rpx] w-[500rpx]">
							<view class="truncate font-bold">{{ orderData.order_goods[0]?.goods_name }}</view>
						    <view class="u-flex flex-wrap flex-1">
						    	<view class="tag" v-for="(item4,index4) in orderData.order_goods[0]?.goods_sku_arr" :key="index4">{{ item4 }}</view>
						    </view>
				            <view class="mt-[14rpx] u-flex justify-between">
								<view class="font-bold" :style="{'color':$theme.primaryColor}">￥{{ orderData.order_goods[0]?.goods_price }}</view>
								<view class="text-sm text-muted">x{{ orderData.order_goods[0]?.goods_num }}</view>
				            </view>
						</view>
				    </view>
					<view class="other-amount" v-if="orderData.difference_price > 0 || orderData.additional_price > 0">
						<!-- <view class="u-flex justify-between">
							<view>优惠券</view>
							<view class="text-[#ff9600]">-￥{{ orderData.order_goods[0]?.goods_price }}</view>
						</view> -->
						<view class="u-flex justify-between mt-[20rpx]" v-if="orderData.difference_price > 0">
							<view>补差价</view>
							<view>￥{{ orderData.difference_price }}</view>
						</view>
						<view v-if="orderData.additional_price > 0">
							<view class="u-flex justify-between mt-[20rpx]">
								<view>加项</view>
								<view>￥{{ orderData.additional_price }}</view>
							</view>
							<view class="additional mt-[10rpx]">
								<view class="u-flex text-sm mb-[20rpx] justify-between" v-for="item in orderData.order_additional" :key="item.id">
									<view class="flex-1 truncate w-full">{{ item.name }}/{{ item.duration }}分钟/数量:{{ item.num }}</view>
									<view>￥{{ item.price }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="u-flex justify-between goods-total">
						<view></view>
						<view class="u-flex">
							<view class="text-muted">总计：</view>
							<view class="font-bold text-2xl">¥{{ orderData.order_amount }}</view>
						</view>
					</view>
					<view class="u-flex justify-between" v-if="orderData.total_refund_amount">
						<view></view>
						<view class="text-muted">
							(
							<text class="text-muted text-sm">退款金额：</text>
							<text :style="{'color':$theme.primaryColor}">¥{{ orderData.total_refund_amount }}</text>
							)
						</view>
					</view>
				</view>
				
				<!-- 订单信息 -->
				<view class="card normal text-base">
				    <view class="flex justify-between">
				        <view>订单编号</view>
				        <view class="u-flex">
							<view>{{ orderData.sn }}</view>
							<view :style="{'padding': '4rpx 14rpx','border': '1px solid '+$theme.primaryColor,'color': $theme.primaryColor,'border-radius': '10rpx','font-size': '24rpx','margin-left': '10rpx'}" @click="copy(orderData.sn)">复制</view>
						</view>
				    </view>
				    <view class="mt-[30rpx] flex justify-between">
				        <view>下单时间</view>
				        <view>{{ orderData.create_time }}</view>
				    </view>
				    <view class="mt-[30rpx] flex justify-between">
				        <view>支付方式</view>
				        <view>{{ orderData.pay_way_desc }}</view>
				    </view>
					<view class="mt-[30rpx] flex justify-between">
						<view>订单备注</view>
						<view style="max-width: 500rpx; word-wrap: break-word">{{ orderData.user_remark }}</view>
					</view>
				</view>
			</view>
            <view class="h-[120rpx]" v-if="orderData.order_status !== 4"></view>
            <!-- Main End -->
        </view>
    </uni-transition>

    <!-- Footer Start -->
    <view class="footer flex justify-end" v-if="orderData.order_status !== 4">
        <order-footer
            :orderId="orderData.id"
            :goodsId="orderData.order_goods[0].goods_id"
            :orderGoodsId="orderData.order_goods[0].id"
            :orderBtn="orderData.user_order_btn"
            @refresh="initOrderDetail"
        />
    </view>
    <!-- Footer End -->
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue'
import { onLoad, onUnload, onShow } from '@dcloudio/uni-app'
import { apiOrderDetail } from '@/api/order'
import OrderFooter from '@/components/order-footer/index.vue'

const orderData = ref<any>({
    order_goods: [],
    order_amount: '',
    total_amount: '',
    total_goods_price: '',
	order_cancel_time: 0
})
const orderId = ref<number | string>('')
const closeTimeStamp = ref<number>(0)

const getCountDownSegment = watchEffect(() => {
    // 获取倒计时段
    const endTimestamp = orderData.value.order_cancel_time
    const startTimestamp = new Date().getTime() / 1000
    closeTimeStamp.value = (endTimestamp - startTimestamp) * 1000
})
// 初始化订单详情
const initOrderDetail = async (): Promise<void> => {
    orderData.value = await apiOrderDetail({ id: orderId.value })
}
//复制
const copy = (data:string) => {
	uni.setClipboardData({
		data: data,
		showToast: true
	});
}
//拨打电话
const call = (phoneNumber:string) => {
	uni.makePhoneCall({
		phoneNumber: phoneNumber+''
	});
}

onLoad((options) => {
    // 获取订单ID
    orderId.value = parseInt(options?.id)

    // 初始化订单信息
    initOrderDetail()
})

onShow(() => {
    // 初始化订单信息
    initOrderDetail()
})
</script>

<style lang="scss">
.order_detail {
    height: 100%;
    // padding-bottom: 140rpx;
    background-color: var(--color-primary, #FFC244);
	
	.info {
		min-height: calc(100vh - 200rpx);
		background-color: #edf1f3;
		border-radius: 30rpx 30rpx 0 0;
        padding: 30rpx 24rpx;
	}

    .header-image {
        width: 44rpx;
        height: 44rpx;
    }

    .card {
        padding: 30rpx 24rpx;
        margin-bottom: 20rpx;
        background-color: #fff;
        border-radius: 20rpx;

        &--header {
            padding-bottom: 20rpx;
        }
        .title {
            font-weight: 500;
            color: #666;
            font-size: 32rpx;
        }
    }

    .goods-item {
        display: flex;
		padding-bottom: 30rpx;
		border-bottom: 1px solid #f4f4f5;
		
        &--name {
            width: 430rpx;

            // line-1
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
		
		.tag {
			color: #909399;
			font-size: 20rpx;
			padding: 4rpx 10rpx;
			background-color: #f4f4f5;
			border-radius: 4rpx;
			display: inline-block;
			margin-right: 10rpx;
			margin-top: 10rpx;
		}
		.tag:last-child {
			margin-right: 0;
		}
    }
	.other-amount {
		padding: 30rpx 0;
		
		.additional {
			padding: 20rpx 20rpx 10rpx;
			background-color: #f4f4f5;
			border-radius: 20rpx;
		}
	}
	.goods-total {
		padding-top: 30rpx;
		border-top: 1px solid #f4f4f5;
	}
	
	::v-deep .call-staff .u-btn {
		padding: 0px 50rpx !important;
	}
}
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    position: fixed;
    padding: 30rpx 30rpx 40rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);

    .btn {
        width: 320rpx;
    }
}
</style>
