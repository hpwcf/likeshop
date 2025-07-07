<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="order_detail">
        <!-- Main Start -->
    	
    	<view class="top text-center">
    		<price :price="userInfo.staff_deposit" priceFontSize="60rpx" priceIconFontSize="26rpx" priceColor="#ffffff"></price>
    		<view class="text-sm text-[#ffffffd1]">当前保证金（元）</view>
    	</view>
    	
    	<view class="info">
			<view class="mb-[40rpx]">
				<view class="font-bold text-1xl">缴纳金额</view>
				<view class="input u-flex mt-[20rpx] mb-[20rpx]">
					<text class="font-bold text-[36rpx]">￥</text>
					<u-input class="w-full ml-[10rpx]" v-model="formData.amount" :clearable="false" placeholder="输入缴纳金额" />
				</view>
			</view>
			
			<view>
				<view class="font-bold text-1xl">支付方式</view>
				<u-radio-group v-model="formData.pay_way" :key="formData.pay_way" class="w-full" :active-color="$theme.primaryColor">
					<view v-for="item in payWayLists" :key="item.pay_way" class="u-flex justify-between account w-full" @click="changePayWay(item.pay_way)">
						<view class="u-flex">
							<view>
								<u-image width="40rpx" height="40rpx" :src="item.image"></u-image>
							</view>
							<view class="font-bold text-1xl ml-[20rpx]">{{ item.name }}</view>
						</view>
						<view>
							<u-radio :name="item.pay_way"></u-radio>
						</view>
					</view>
				</u-radio-group>
			</view>
    	</view>

		<view class="footer">
			<button class="bg-primary text-lg text-white" @click="recharge">
				充值
			</button>
			<!-- <u-button type="primary" size="medium" @click="recharge">充值</u-button> -->
		</view>
		
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
				<view style="font-size: 50rpx;margin: 10rpx 0 20rpx;">￥{{ formData.amount }}</view>
				<view class="flex row-between m-t-50" style="width: 100%;justify-content: space-between;font-weight: bold;">
					<text class="bold">支付方式</text>
					<text class="bold">支付宝</text>
				</view>
				<view class="p-20 m-t-50 m-b-50" style="width: 100%;background-color: #9e9e9e40;padding: 15rpx 15rpx;margin: 50rpx 0;">请复制链接,粘贴至浏览器并支付</view>
				<button @click="copyAlipayLink()" style="border-radius: 12rpx;width: 100%;height: 80rpx;line-height: 80rpx;font-size: 28rpx;color: white;background-color: #F36161;">复制链接</button>
			</view>
		</u-popup>
    </view>
</template>

<script lang="ts" setup>
import { ref,computed } from 'vue'
import Price from '@/components/price/index.vue'
import { useUserStore } from '@/stores/user'
import { onLoad } from '@dcloudio/uni-app'
import { apiUserDepositRecharge } from '@/api/user'
import { getToken } from '@/utils/auth'
import { usePay } from '@/hooks/payment'

const { initPayWay, handlePayPrepay } = usePay()
interface FormDataObj {
	pay_way: number | string
	amount: number | string
}
const formData = ref<FormDataObj>({
	pay_way: '',
	amount: ''
})
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo) as any
const payWayLists = ref<any>([])
const alipayLink = ref('')
const alipayShow = ref(false)
const token = getToken()
const orderId = ref(0)

// 获取支付方式
const getPayWay = async () => {
    payWayLists.value = await initPayWay({from:'deposit'})
	const defaultPayWay = payWayLists.value.filter(item => item.is_default === 1)
	formData.value.pay_way = defaultPayWay[0]?.pay_way
}

//选择支付方式
const changePayWay = (index:number) => {
	formData.value.pay_way = index
	console.log(formData.value.pay_way)
}

//页面跳转
const goPage = (url: string) => {
    uni.navigateTo({ url: url })
}

//充值
const recharge = async() => {
	if (!formData.value.amount) return uni.$u.toast('请输入支付金额')
	if (!formData.value.pay_way) return uni.$u.toast('请选择支付方式')
	uni.showModal({
		title: '温馨提示',
		content: '是否确认下单支付？',
		success: function (res) {
			if (res.confirm) {
				handlePlaceOrder()
			}
		}
	})
}
// 下单处理
const handlePlaceOrder = async (): Promise<void> => {
	uni.showLoading({
		title: '订单提交中...',
		mask: true
	});

    try {
        const res = await apiUserDepositRecharge(formData.value)
		orderId.value = res.order_id
		
		//支付宝支付
		if(formData.value.pay_way == 2) {
			uni.hideLoading();
		
			// #ifdef MP-WEIXIN
			alipayLink.value = `${import.meta.env.VITE_APP_BASE_URL || ''}staff/bundle/pages/toAlipay/toAlipay?order_id=${res.order_id}&from=${res.type}&pay_way=${formData.value.pay_way}&key=${token}`
			alipayShow.value = true
			return
			// #endif
			
			//#ifdef H5
			let ua = navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i)) {
				//微信浏览器环境
				uni.reLaunch({
				    url: `/bundle/pages/toAlipay/toAlipay?order_id=${res.order_id}&from=${res.type}&pay_way=${formData.value.pay_way}&key=${token}`
				})
				return
			}
			//#endif
		}
		
		//其他支付
		handlePayPrepay({
		    from: res.type,
		    pay_way: formData.value.pay_way,
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
	    from: 'deposit'
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

onLoad((options) => {
	formData.value.amount = options.order_amount || 0 as number
    getPayWay()
})
</script>

<style lang="scss" scoped>
.order_detail {
    height: 100%;
	background-color: #edf1f3;
	.top {
		background-color: var(--color-primary, #FFC244);
		padding: 50rpx 50rpx 90rpx;
		
		.withdraw {
			padding: 12rpx 24rpx;
			background-color: #ffffff;
			color: var(--color-primary, #FFC244);
			border-radius: 10rpx;
		}
	}
	.info {
		height: calc(100vh - 230rpx);
		overflow-y: auto;
		background-color: #edf1f3;
		border-radius: 30rpx 30rpx 0 0;
        padding: 30rpx 24rpx 210rpx;
		margin-top: -30rpx;
		
		.input {
			padding: 16rpx 20rpx;
			background-color: #ffffff;
			border-radius: 14rpx;
		}
		.account {
			margin-top: 20rpx;
			padding: 30rpx 24rpx;
			background-color: #ffffff;
		    border-radius: 20rpx;
		}
	}

    .card {
        padding: 30rpx 24rpx;
        margin: 0 14rpx 20rpx 0;
        background-color: #fff;
        border-radius: 14rpx;
		width: 220rpx;
		text-align: center;
    }
    .card:nth-child(3n) {
        margin-right: 0;
    }
	.card-selected {
		border: 1px solid var(--color-primary, #FFC244);
	}
}

// 底部按钮
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    position: fixed;
	z-index: 11;
    padding: 30rpx 30rpx 40rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);

    ::v-deep button {
		width: 100% !important;
	}
}
</style>
