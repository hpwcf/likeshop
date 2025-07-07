<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="order_buy">
        <!-- 地址卡片 -->
        <view class="card">
			<view class="card--address" @click="goPage('/bundle/pages/user_address/index?type=true&goods_id='+goodsForm.id)">
				<view class="flex justify-between">
				    <template v-if="orderData.address.length === 0">
				        <view class="title pt-[20rpx]">请选择地址</view>
				    </template>
					<template v-else>
						<view class="title">
							{{ orderData.address.province }}
							{{ orderData.address.city }}
							{{ orderData.address.district }}
							{{ orderData.address.address }}
						</view>
					</template>
				    <u-icon name="arrow-right" color="#707070" size="22"></u-icon>
				</view>
				<template v-if="!orderData.address.length">
					<view class="text-sm text-muted mt-[10rpx]">
						{{ orderData.address?.contact }} {{ orderData.address?.sex_desc }} {{ orderData.address?.mobile }}
					</view>
				</template>
			</view>
            <!-- <view
                class="u-flex justify-between mt-[30rpx] mb-[10rpx]"
            >
                <view class="normal text-base font-medium">服务人员</view>
                <view class="u-flex">
					<text class="mr-[10rpx] text-sm text-black text-[#909399]" v-if="staff.length == 0">请选择服务人员</text>
                    <view v-else class="u-flex">
						<u-image width="50rpx" height="50rpx" shape="circle" :src="staff.avatar"></u-image>
						<text class="mr-[10rpx] ml-[10rpx] text-sm text-black">{{ staff.name }}</text>
					</view>
                    <u-icon name="arrow-right" color="#707070" size="22"></u-icon>
                </view>
            </view> -->
            <view
                class="u-flex justify-between mt-[30rpx] mb-[10rpx]"
                @click="handleAppointTime"
            >
                <view class="normal text-base font-medium">服务时间</view>
                <view class="u-flex">
                    <text class="mr-[10rpx] text-sm text-black" :style="{'color':$theme.primaryColor}" v-if="appointDesc.length > 0">{{ appointDesc }}</text>
                    <text class="mr-[10rpx] text-sm text-black text-[#909399]" v-else>请选择服务时间</text>
                    <u-icon name="arrow-right" color="#707070" size="22"></u-icon>
                </view>
            </view>
        </view>

        <!-- 商品卡片 -->
        <view class="card">
            <view class="goods-item">
                <u-image
                    :src="orderData.goods.image"
                    width="160"
                    height="160"
                    border-radius="16"
                ></u-image>
                <view class="ml-[20rpx] w-[480rpx] goods-item--info">
					<view class="flex-1 truncate font-bold">{{ orderData.goods.name }}</view>
					<view class="u-flex flex-wrap text-[#707070] text-[24rpx]" v-if="orderData.goods?.label">
						<text class="tag" v-for="(labelItem,labelIndex) in orderData.goods.label" :key="labelIndex">
							{{ labelItem }}
						</text>
					</view>
                    <view class="mt-[30rpx] u-flex justify-between foot">
                        <price :price="orderData.goods.price" priceFontSize="36rpx"></price>
						<u-number-box v-model="goodsForm.goods_num" :min="1" :input-width="60" bg-color="#ffffff" @change="changeGoodsNum"></u-number-box>
                    </view>
                </view>
            </view>
			<!-- <view
			    class="u-flex justify-between mt-[40rpx] mb-[10rpx]"
			>
			    <view class="normal text-base font-medium">优惠券</view>
			    <view class="u-flex">
			        <text class="mr-[10rpx] text-sm text-black text-[#909399]">请选择优惠券</text>
			        <u-icon name="arrow-right" color="#707070" size="22"></u-icon>
			    </view>
			</view> -->
        </view>

        <!-- 备注 -->
        <view class="card">
            <view class="normal text-lg font-medium">订单备注</view>
            <view class="mt-[10rpx]">
                <u-input
                    v-model="userRemark"
                    type="textarea"
                    placeholder="请输入备注信息"
                    height="124"
                />
            </view>
        </view>
		
		<!-- 支付方式 -->
		<view class="card">
			<view class="font-bold text-2xl mb-[20rpx]">支付方式</view>
			<view>
			    <!-- <radio-group>
			        <view
			            v-for="item in payWayList"
			            :key="item.id"
			            class="pt-[10rpx] pb-[10rpx] mb-[20rpx]"
			            @click="selectPayWay(item.pay_way)"
			        >
			            <label>
			                <view class="flex justify-between items-center">
			                    <view class="flex items-center justify-between w-full">
			                        <view class="flex items-center">
			                            <u-image :src="item.image" width="36" height="36" shape="circle" />
			                            <view class="pl-[20rpx] u-flex">
			                                <view class="text-[28rpx] text-[#333]">{{ item.name }}</view>
			                                <view class="pl-[10rpx] text-[24rpx] text-muted">
			                                    {{ item.extra || '' }}
			                                </view>
			                            </view>
			                        </view>
			                        <view>
			                            <radio
			                                :color="$theme.primaryColor"
			                                :value="item.pay_way"
			                                :checked="item.pay_way === payWay"
											style="transform:scale(0.7)"
			                            />
			                        </view>
			                    </view>
			                </view>
			            </label>
			        </view>
			    </radio-group> -->
				<u-radio-group v-model="payWay" :key="payWay" class="w-full" :active-color="$theme.primaryColor">
					<view
					    v-for="item in payWayList"
					    :key="item.id"
					    class="pt-[10rpx] pb-[10rpx] mb-[20rpx] w-full"
					    @click="selectPayWay(item.pay_way)"
					>
					    <label>
					        <view class="flex justify-between items-center">
					            <view class="flex items-center justify-between w-full">
					                <view class="flex items-center">
					                    <u-image :src="item.image" width="36" height="36" shape="circle" />
					                    <view class="pl-[20rpx] u-flex">
					                        <view class="text-[28rpx] text-[#333]">{{ item.name }}</view>
					                        <view class="pl-[10rpx] text-[24rpx] text-muted">
					                            {{ item.extra || '' }}
					                        </view>
					                    </view>
					                </view>
					                <view>
					                    <u-radio :name="item.pay_way"></u-radio>
					                </view>
					            </view>
					        </view>
					    </label>
					</view>
				</u-radio-group>
			</view>
		</view>
		
        <!-- Footer Start -->
        <view class="footer flex justify-between items-center">
            <view>
                <text class="text-base">总计：</text>
                <text class="text-base" :style="{'color':$theme.primaryColor}">¥</text>
                <text class="font-medium text-4xl" :style="{'color':$theme.primaryColor}">{{ orderData.order_amount }}</text>
            </view>
            <view class="btn">
                <button
                    class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx]"
                    @click="onSubmitOrder"
                >
                    立即支付
                </button>
            </view>
        </view>
        <!-- Footer End -->
		
		<!-- 服务时间弹窗 -->
		<AppointTime
		    ref="appointTimeRef"
			:data="appointTimeData"
		></AppointTime>
		<!-- 支付宝支付弹窗 -->
		<u-popup
		    v-model="alipayShow"
		    mode="bottom"
		    height="600rpx"
		    safe-area-inset-bottom
		    border-radius="20"
		    closeable
		    @close="handleclose"
		>
		    <view style="padding: 60rpx 30rpx;display: flex;justify-content: center;align-items: center;flex-direction: column;">
				<view style="font-size: 50rpx;margin: 10rpx 0 20rpx;">￥{{ orderData.order_amount }}</view>
		        <view class="flex row-between m-t-50" style="width: 100%;justify-content: space-between;font-weight: bold;">
		            <text class="bold">支付方式</text>
		            <text class="bold">支付宝</text>
		        </view>
		        <view class="p-20 m-t-50 m-b-50" style="width: 100%;background-color: #9e9e9e40;padding: 15rpx 15rpx;margin: 50rpx 0;">请复制链接,粘贴至浏览器并支付</view>
		        <button @click="copyAlipayLink()" :style="{'border-radius': '12rpx','width': '100%','height': '80rpx','line-height': '80rpx','font-size': '28rpx','color': 'white','background-color': $theme.primaryColor}">复制链接</button>
		    </view>
		</u-popup>
    </view>
</template>

<script lang="ts" setup>
import { ref, computed, shallowRef, reactive } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { apiPlaceOrder,apiOrderPayWay } from '@/api/order'
import Price from '@/components/price/index.vue'
import { usePay } from '@/hooks/payment'
import AppointTime from './components/appoint_time.vue'
import { getClient } from '@/utils/client'
import { getToken } from '@/utils/auth'
import { apiAppointTime } from '@/api/goods'
import { apiSubscribe } from '@/api/app'

// 支付钩子
const { initPayWay, handlePayPrepay } = usePay()

/** Data Start **/
const orderData = ref<any>({
    address: [],
    goods: [],
    order_amount: '',
    total_amount: '',
    total_goods_price: ''
})
const userRemark = ref<string | null>('')
const addressId = ref<number | string | null>('')
let goodsForm = reactive({
    goods_num: 1 as number,
    id: 0 as number,
    sku_id: 0 as number
})
const token = getToken()
//服务时间
const appointDesc = ref('')
const appointTime = ref<any>({})
const appointTimeRef = shallowRef()
//服务预约时间数据
const appointTimeData = ref({})
//服务人员
const staff = ref({})
//支付方式
const payWay = ref()
//支付方式列表
const payWayList = ref()
//支付宝支付弹窗
const alipayShow = ref(false)
//支付宝支付链接
const alipayLink = ref('')
//订单信息
const orderId = ref('')
/** Data End **/

/** Methods Start **/
// 初始化下单数据
const initPlaceOrder = async (address_id: number | string | null = ''): Promise<void> => {
    const params = {
        action: 'settlement',
        goods: goodsForm,
        address_id: address_id
    }
    orderData.value = await apiPlaceOrder({ ...params })
    addressId.value = orderData.value.address?.id
}
//选择服务时间
const handleAppointTime = () => {
	appointTimeRef.value.open()
}
//修改服务数量
const changeGoodsNum = () => {
	orderData.value.order_amount = (orderData.value.goods.price * goodsForm.goods_num).toFixed(2)
}
//获取用户消息授权
const getAuthMsg = () => {
    return new Promise((resolve, reject) => {
        apiSubscribe({'scene':'before_pay'})
            .then((res) => {
                if (!res.length) resolve('暂无可订阅信息')
                uni.requestSubscribeMessage({
                    tmplIds: res,
                    success(ress) {
                        console.log('requestSubscribeMessageRes', ress)
                    },
                    fail(res) {
                        console.log(res.errMsg)
                    },

                    complete() {
                        resolve(res)
                    }
                })
            })
            .catch((error) => reject(error))
    })
}
// 1. 确认提交订单
const onSubmitOrder = async (): Promise<void> => {
    if (!addressId.value) return uni.$u.toast('请先去选择地址')
    // if (!staff.value) return uni.$u.toast('请先去选择服务人员')
    if (!appointDesc.value) return uni.$u.toast('请先去选择服务时间')
    if (!payWay.value) return uni.$u.toast('请先去选择支付方式')
	uni.showModal({
		title: '温馨提示',
		content: '是否确认下单支付？',
		success: async function (res) {
			if (res.confirm) {
				// #ifdef MP-WEIXIN
				await getAuthMsg()
				//#endif
				handlePlaceOrder()
			}
		}
	});
}
// 2. 下单处理
const handlePlaceOrder = async (): Promise<void> => {
	uni.showLoading({
		title: '订单提交中...',
		mask: true
	});

    const params = {
        action: 'submit',
        appoint_time: `${appointTime.value.year}-${appointTime.value.month}-${appointTime.value.day} ${appointTime.value.appoint_time}`,
        goods: goodsForm,
        address_id: addressId.value,
        user_remark: userRemark.value,
        pay_way: payWay.value
    }
    try {
        const res = await apiPlaceOrder({ ...params })
		orderId.value = res.order_id
		uni.hideLoading();
		
		//支付宝支付
		if(payWay.value == 2) {
		
			// #ifdef MP-WEIXIN
			alipayLink.value = `${import.meta.env.VITE_APP_BASE_URL || ''}mobile/bundle/pages/toAlipay/toAlipay?order_id=${res.order_id}&from=${res.type}&pay_way=${payWay.value}&key=${token}`
			alipayShow.value = true
			return
			// #endif
			
			//#ifdef H5
			let ua = navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i)) {
				//微信浏览器环境
				uni.reLaunch({
				    url: `/bundle/pages/toAlipay/toAlipay?order_id=${res.order_id}&from=${res.type}&pay_way=${payWay.value}&key=${token}`
				})
				return
			}
			//#endif
		}
		
		//其他支付
		handlePayPrepay({
		    from: res.type,
		    pay_way: payWay.value,
		    order_id: res.order_id
		})
    } catch (err) {
        console.log('下单', err)
    }
}
//支付宝弹窗关闭
function handleclose() {
	const param = JSON.stringify({
	    order_id: orderId.value,
	    from: 'order'
	})
	uni.reLaunch({
	    url: `/bundle/pages/payment_result/payment_result?param=${param}`
	})
}
//复制支付宝支付链接
function copyAlipayLink() {
	uni.setClipboardData({
		data: alipayLink.value
	});
}
//获取支付方式
const getPayWay = async () => {
	const data = await apiOrderPayWay({
	    from: 'order',
	    scene: getClient()
	})
	payWayList.value = data
	for (var i in data) { 
	    if (data[i].is_default == 1) {
			payWay.value = data[i].pay_way
		}
	}
}
const selectPayWay = (pay: number) => {
    payWay.value = pay
}

// 跳转页面方法
const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}

//获取预约时间
const getAppointTime = async (): Promise<void> => {
    appointTimeData.value = await apiAppointTime({ sku_id:goodsForm.sku_id })
}
/** Methods End **/

/** Life Cycle Start **/
onLoad(async (options: any) => {
    // 获取商品详情传来的参数
    const { goodsData } = JSON.parse(options.params)
    goodsForm.goods_num = parseInt(goodsData.goods_num)
    goodsForm.id = parseInt(goodsData.id)
    goodsForm.sku_id = parseInt(goodsData.sku_id)

    // 初始化订单信息
    initPlaceOrder()
	//获取支付方式
	getPayWay()
	//获取服务时间
	getAppointTime()

    // 监听上门时间选择
    uni.$on('appointTime', (event) => {
		console.log(event)
		appointTime.value = event
		appointDesc.value = event.month + '-' + event.day + ' (' + event.week + ') ' + event.appoint_time
    })
    uni.$on('address', (event) => {
        addressId.value = event
        initPlaceOrder(event)
    })
})

onUnload(() => {
    uni.$off(['appointTime', 'address'])
})
</script>

<style lang="scss">
::v-deep .u-numberbox .u-icon-minus {
	border-radius: 50% !important;
	width: 46rpx !important;
	height: 46rpx !important;
	border: 1px solid var(--color-primary, #FFC244) !important;
	background: unset !important;
	.num-btn {
		color: var(--color-primary, #FFC244) !important;
		top: 0 !important;
	}
}
::v-deep .u-numberbox .u-icon-plus {
	border-radius: 50% !important;
	width: 46rpx !important;
	height: 46rpx !important;
	border: 1px solid var(--color-primary, #FFC244) !important;
	background: var(--color-primary, #FFC244) !important;
	.num-btn {
		color: #FFFFFF !important;
		top: 0 !important;
	}
}
.order_buy {
    padding: 20rpx 20rpx 220rpx;

    .card {
        padding: 24rpx;
        margin-bottom: 20rpx;
        background-color: #fff;
        border-radius: 20rpx;

		&--address {
            padding: 30rpx 0;
			border-bottom: 1px solid #f4f4f5;
        }
        &--header {
            padding-bottom: 20rpx;
        }
        .title {
            color: rgba(16, 16, 16, 1);
            font-size: 32rpx;
            .num {
                font-size: 28rpx;
                color: #666;
            }
        }
    }

    .goods-item {
        display: flex;
        &--info {
            position: relative;
			
			.foot {
				position: absolute;
				bottom: 0px;
				left: 0px;
				width: 100%;
			}
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

    .footer {
        left: 0;
        bottom: 0;
        width: 100%;
        position: fixed;
        padding: 20rpx 30rpx;
        background-color: #ffffff;
        box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);
        padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);

        .btn {
            width: 320rpx;
            height: 100%;
        }
    }
}
</style>
