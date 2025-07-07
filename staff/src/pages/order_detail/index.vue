<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
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
			
			<view class="top">
				<!-- 订单状态 -->
				<view class="py-[40rpx] px-[24rpx]">
				    <view class="text-white text-2xl font-bold">{{ orderData.order_steps_desc }}</view>
					<view class="mt-[10rpx] text-white">{{ orderData.create_time }}</view>
				</view>
				<!-- 订单步骤 -->
				<view class="px-[24rpx]">
					<!-- <u-steps :list="orderSteps" :current="orderStepsCurrent" mode="number" active-color="#ffffff" un-active-color="#d5d5d5"></u-steps> -->

					<Steps :status="orderData.order_steps_index"></Steps>
				</view>
			</view>
			
			<view class="info">
				<!-- 结算 -->
				<view class="settlement" v-if="orderData.order_status === 3 || orderData.order_status === 4">
					<view class="flex justify-center mb-[50rpx]">
						<view class="statusTag">{{ orderData.settlement_status_desc }}</view>
					</view>
					<view class="u-flex mb-[60rpx]">
						<view class="w-[330rpx]">
							<view class="text-sm text-muted">师傅结算</view>
							<view class="text-2xl font-bold mt-[14rpx]">{{ orderData.settlement_status ? orderData.settlement_amount : '结算中'}}</view>
						</view>
					</view>
					<view>
						<view class="u-flex justify-between font-bold mb-[30rpx]">
							<view>支付总金额</view>
							<view>￥{{ orderData.order_amount }}</view>
						</view>
						<view class="flex flex-wrap">
							<view class="u-flex justify-between amount-item text-sm">
								<view class="text-muted">项目金额</view>
								<view>￥{{ orderData.goods_price }}</view>
							</view>
							<!-- <view class="u-flex justify-between amount-item text-sm">
								<view class="text-muted">会员折扣</view>
								<view>￥5.00</view>
							</view>
							<view class="u-flex justify-between amount-item text-sm">
								<view class="text-muted">优惠券</view>
								<view>￥5.00</view>
							</view> -->
							<view class="u-flex justify-between amount-item text-sm">
								<view class="text-muted">补差价</view>
								<view>￥{{ orderData.difference_price }}</view>
							</view>
							<view class="u-flex justify-between amount-item text-sm">
								<view class="text-muted">加项</view>
								<view>￥{{ orderData.additional_price }}</view>
							</view>
							<!-- <view class="u-flex justify-between amount-item text-sm">
								<view class="text-muted">车费</view>
								<view>￥50.00</view>
							</view> -->
						</view>
						<view class="u-flex justify-between font-bold mb-[30rpx] mt-[10rpx]">
							<view>结算项目金额</view>
							<view>￥{{ (orderData.order_amount - orderData.total_refund_amount).toFixed(2) }}</view>
						</view>
						<view class="flex flex-wrap">
							<view class="u-flex justify-between amount-item text-sm">
								<view class="text-muted">退款金额</view>
								<view>￥{{ (orderData.total_refund_amount).toFixed(2) }}</view>
							</view>
							<!-- <view class="u-flex justify-between amount-item text-sm">
								<view class="text-muted">结算车费</view>
								<view>￥50.00</view>
							</view> -->
						</view>
					</view>
				</view>
				<!-- 地址卡片 -->
				<view class="card">
					<u-tag text="预约时间" size="default" mode="dark" bg-color="#c8c9cc52" color="#82848a" />
					<view class="flex text-4xl font-bold mt-[20rpx] mb-[20rpx]">
						<view>{{ orderData.appoint_time_day }}</view>
						<view class="ml-[16rpx]" :style="{'color':$theme.primaryColor}">{{ orderData.appoint_time_slot }}</view>
					</view>
					<view class="u-flex justify-between mb-[20rpx]">
						<view class="font-bold mr-[16rpx]">
						    {{ orderData.address_info?.city }}
							{{ orderData.address_info?.district }}
							{{ orderData.order_sub_status > 0 ? orderData.address_info?.address : '****' }}
						</view>
						<view class="text-sm text-muted">{{ orderData.distance }}</view>
					</view>
					<view class="u-flex justify-between mb-[30rpx]">
						<view class="text-sm text-muted mr-[16rpx]">
							{{ orderData.order_sub_status > 0 ? orderData.contact : '*' }}
							{{ orderData.order_sub_status > 0 ? orderData.address_info.sex_desc : '**' }}
							{{ orderData.mobile }}
						</view>
						<view class="text-[24rpx] text-[#2189ff] u-flex text-center" v-if="orderData.order_sub_status > 0">
							<view class="mr-[40rpx]" @click="call(orderData.mobile)">
								<view>
									<u-icon name="phone-fill" color="#2189ff" size="28rpx"></u-icon>
								</view>
								<view>
									电话
								</view>
							</view>
							<view @click="openLocation()">
								<view>
									<u-icon name="/static/images/icon_address_2189ff.png" size="26rpx"></u-icon>
								</view>
								<view>
									导航
								</view>
							</view>
						</view>
					</view>
					<u-line color="#f4f4f5" v-if="orderData.user_remark" />
					<view class="mt-[20rpx]" v-if="orderData.user_remark">
						<text class="font-bold">用户备注：</text>
						<text class="text-muted">{{ orderData.user_remark }}</text>
					</view>
				</view>
				
				<!-- 商品卡片 -->
				<view class="card">
				    <view class="goods-item">
				        <u-image
				            :src="orderData.order_goods[0]?.goods_image"
				            width="130"
				            height="130"
				            border-radius="16"
				        ></u-image>
						<view class="ml-[20rpx] w-[500rpx]">
							<view class="u-flex justify-between">
								<view class="truncate font-bold">{{ orderData.order_goods[0]?.goods_name }}</view>
								<u-tag text="上门服务" type="primary" size="mini" mode="dark" />
							</view>
				            <view class="mt-[40rpx] u-flex justify-between">
								<price :price="orderData.order_goods[0]?.goods_price" priceFontSize="36rpx" priceIconFontSize="26rpx"></price>
								<view class="text-sm text-muted">x{{ orderData.order_goods[0]?.goods_num }}</view>
				            </view>
						</view>
				    </view>
					<view class="other-amount" v-if="orderData.difference_price > 0 || orderData.additional_price > 0">
						<!-- <view class="u-flex justify-between">
							<view>优惠券</view>
							<view class="text-[#ff9600]">-￥{{ orderData.order_goods[0]?.goods_price }}</view>
						</view>
						<view class="u-flex justify-between mt-[20rpx]">
							<view>会员折扣</view>
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
							<view class="additional mt-[10rpx]" v-if="orderData.order_additional?.length > 0">
								<view class="u-flex text-sm mb-[20rpx] justify-between" v-for="item in orderData.order_additional" :key="item.id">
									<view>{{ item.name }}/{{ item.duration }}分钟/数量:{{ item.num }}</view>
									<view>￥{{ item.price }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="u-flex justify-between total_amount">
						<view></view>
						<view class="u-flex">
							<view class="text-muted">总计：</view>
							<view class="font-bold text-2xl">¥{{ orderData.order_amount }}</view>
						</view>
					</view>
				</view>
				
				<!-- 打卡记录 -->
				<view class="card normal text-base" v-if="orderData.order_checkin?.length">
					<view class="font-bold text-1xl">服务打卡记录</view>
				    <view class="record mt-[20rpx]" v-for="(item,index) in orderData.order_checkin" :key="index">
				    	<view class="text-muted text-sm">{{ index }}</view>
						<view class="u-flex justify-between mt-[30rpx]" v-for="item2 in item" :key="item2.id">
							<view class="mr-[20rpx] w-[70rpx] text-center">
								<view class="font-bold">{{ item2.time_desc }}</view>
								<view class="text-muted text-sm">签到</view>
							</view>
							<view class="mr-[20rpx] w-[440rpx]">
								<view class="font-bold truncate">{{ item2.address_info.address }}</view>
								<view class="text-muted text-sm">{{ item2.address_info?.province }}-{{ item2.address_info?.city }}-{{ item2.address_info?.district }}</view>
							</view>
							<view style="position: relative;" @click="previewImage(item2.image_info)">
								<u-image width="60rpx" height="60rpx" :src="item2.image_info[0]" border-radius="10rpx"></u-image>
								<view style="position: absolute;bottom: 0;right: 0;background-color: #f4f4f5;border-radius: 50%;width: 10px;height: 10px;font-size: 10px;text-align: center;line-height: 10px;">{{ item2.image_info?.length }}</view>
							</view>
						</view>
				    </view>
				</view>
				
				<!-- 订单信息 -->
				<view class="card normal text-base">
				    <view class="flex justify-between">
				        <view>订单编号</view>
				        <view class="u-flex">
							<view>{{ orderData.sn }}</view>
							<u-button class="ml-[10rpx]" size="mini" type="primary" :plain="true" @click="copy(orderData.sn)">复制</u-button>
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
				</view>
			</view>
            
            <!-- Main End -->
        </view>
    </uni-transition>

    <!-- Footer Start -->
    <view class="footer" v-if="orderData.order_status !== 3 && orderData.order_status !== 4">
		<order-footer
			type="detail"
			:orderId="orderData.id"
			:orderBtn="orderData.staff_order_btn"
			@refresh="initOrderDetail"
		/>
    </view>
    <!-- Footer End -->
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiOrderDetail } from '@/api/order'
import Price from '@/components/price/index.vue'
import orderFooter from '@/components/order-footer/index.vue'
import Steps from './components/steps.vue'

const orderData = ref<any>({
    order_goods: [],
    order_amount: '',
    total_amount: '',
    total_goods_price: ''
})
const orderId = ref<number | string>('')
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
	console.log('phoneNumber',phoneNumber)
	uni.makePhoneCall({
		phoneNumber: phoneNumber
	});
}
//预览图片
const previewImage = (url:string[]) => {
	uni.previewImage({
		urls: url
	})
}
//查看位置
const openLocation = () => {
	uni.openLocation({
		latitude: parseFloat(orderData.value.address_info.latitude as string),
		longitude: parseFloat(orderData.value.address_info.longitude as string),
		name: orderData.value.address_info.address,
		address: orderData.value.address_info.province+' '+orderData.value.address_info.city+' '+orderData.value.address_info.district,
		success: function () {
			console.log('success');
		}
	});
}

onLoad(async(options) => {
    // 获取订单ID
    orderId.value = parseInt(options?.id)

    // 初始化订单信息
    await initOrderDetail()
})
</script>

<style lang="scss">
.order_detail {
    height: 100%;
    padding-bottom: 140rpx;
	background-color: #edf1f3;
	.top {
		background: var(--color-primary, #FFC244);
		padding-bottom: 80rpx;
	}
	.info {
		background-color: #edf1f3;
		border-radius: 30rpx 30rpx 0 0;
        padding: 30rpx 24rpx;
		margin-top: -30rpx;
	
		.settlement {
			padding: 0 24rpx 30rpx;
			margin-bottom: 20rpx;
			background-color: #f1f5fd;
			border-radius: 20rpx;
			
			.statusTag {
				border-radius: 0 0 16rpx 16rpx;
				width: 180rpx;
				padding: 16rpx 0;
				background: linear-gradient(to right, #e93623, #ee7b2f);
				color: #ffffff;
				font-weight: bold;
				text-align: center;
			}
			.amount-item {
				background-color: #ffffff;
				border-radius: 14rpx;
				padding: 20rpx;
				margin: 0 20rpx 20rpx 0;
				width: 316rpx;
			}
			.amount-item:nth-child(2n) {
				margin-right: 0;
			}
		}
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
		.record {
			background-color: #f1f5fd;
			padding: 20rpx;
			border-radius: 20rpx;
		}
    }

    .goods-item {
        display: flex;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
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
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 1px solid #f4f4f5;
		
		.additional {
			padding: 20rpx 20rpx 10rpx;
			background-color: #f4f4f5;
			border-radius: 20rpx;
		}
	}
}
::v-deep .u-steps .u-steps__item__num {
	background-color: #d5d5d5 !important;
}
::v-deep .u-steps .u-steps__item__num text {
	color: var(--color-primary, #FFC244) !important;
}
::v-deep .u-steps .u-icon .u-icon__icon {
	color: var(--color-primary, #FFC244) !important;
	background-color: #ffffff;
	padding: 44rpx;
}
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    position: fixed;
	z-index: 1;
    padding: 30rpx 30rpx 40rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);

    ::v-deep button {
		width: 100% !important;
	}
}
</style>
