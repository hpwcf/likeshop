<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <!-- <u-navbar title="订单支付" @leftClick="handleleft"> </u-navbar> -->
    <view class="box flex justify-center items-center flex-col">
        <view class="box-text">￥{{ payData.order_amount }}</view>
        <view class="box-time flex" v-if="timeStamp >= 0 && params.from === 'order'"
            >支付剩余时间<u-count-down
                :timestamp="timeStamp"
                @end="handleCountDownEnd"
                format="mm:ss"
                :font-size="26"
                :separator-size="26"
        /></view>
    </view>
    <view class="pay-box">
        <!-- <radio-group>
            <view
                v-for="item in payData.lists"
                :key="item.id"
                class="item"
                @click="selectPayWay(item.pay_way)"
            >
                <label>
                    <view class="flex justify-between items-center">
                        <view class="flex items-center py-[20rpx] justify-between w-full">
                            <view class="flex items-center">
                                <u-image :src="item.image" width="48" height="48" />
                                <view class="pl-[20rpx]">
                                    <view class="text-[28rpx] text-[#333]">{{ item.name }}</view>
                                    <view class="pt-1 text-[24rpx] text-muted">
                                        {{ item.extra }}
                                    </view>
                                </view>
                            </view>
                            <view>
                                <radio
                                    :color="$theme.primaryColor"
                                    :value="item.pay_way"
                                    :checked="item.pay_way === payWay"
                                />
                            </view>
                        </view>
                    </view>
                </label>
            </view>
        </radio-group> -->
		
		<u-radio-group v-model="payWay" :key="payWay" class="w-full" :active-color="$theme.primaryColor">
			<view
			    v-for="item in payData.lists"
			    :key="item.id"
			    class="item w-full"
			    @click="selectPayWay(item.pay_way)"
			>
			    <label>
			        <view class="flex justify-between items-center">
			            <view class="flex items-center py-[20rpx] justify-between w-full">
			                <view class="flex items-center">
			                    <u-image :src="item.image" width="48" height="48" />
			                    <view class="pl-[20rpx]">
			                        <view class="text-[28rpx] text-[#333]">{{ item.name }}</view>
			                        <view class="pt-1 text-[24rpx] text-muted">
			                            {{ item.extra }}
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
    <view class="bottom_box w-full p-[20rpx]">
        <button class="pay_btn" @click="onSubmitOrder">立即支付</button>
    </view>
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
			<view style="font-size: 50rpx;margin: 10rpx 0 20rpx;">￥{{ payData.order_amount }}</view>
	        <view class="flex row-between m-t-50" style="width: 100%;justify-content: space-between;font-weight: bold;">
	            <text class="bold">支付方式</text>
	            <text class="bold">支付宝</text>
	        </view>
	        <view class="p-20 m-t-50 m-b-50" style="width: 100%;background-color: #9e9e9e40;padding: 15rpx 15rpx;margin: 50rpx 0;">请复制链接,粘贴至浏览器并支付</view>
	        <button @click="copyAlipayLink()" :style="{'border-radius': '12rpx','width': '100%','height': '80rpx','line-height': '80rpx','font-size': '28rpx','color': 'white','background-color': $theme.primaryColor}">复制链接</button>
	    </view>
	</u-popup>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import { usePay } from '@/hooks/payment'
import { onLoad } from '@dcloudio/uni-app'
import { getToken } from '@/utils/auth'


const token = getToken()

//支付钩子
const { initPayWay, handlePayPrepay } = usePay()
const params = ref<any>({
    from: 'order',
    order_id: '',
    icon: '',
    order_amount: ''
})
const payData: any = ref({
    cancel_time: '',
    order_amount: ''
})
// 支付方式:1-微信支付;2-支付宝支付;3-余额支付;
const payWay = ref()
const timeStamp = ref<number | string | undefined>()
//支付宝支付弹窗
const alipayShow = ref(false)
//支付宝支付链接
const alipayLink = ref('')
//支付宝弹窗关闭
function handleclose() {
	const param = JSON.stringify({
	    order_id: params.value.order_id,
	    from: params.value.from
	})
	if(params.value.from == 'order') {
		uni.reLaunch({
		    url: `/bundle/pages/payment_result/payment_result?param=${param}`
		})
	}
	if(params.value.from == 'recharge') {
		uni.reLaunch({
		    url: '/bundle/pages/user_wallet/user_wallet?isPay=true'
		})
	}
	
}
//复制支付宝支付链接
function copyAlipayLink() {
	console.log(alipayLink.value)
	uni.setClipboardData({
		data: alipayLink.value
	});
}

const initPlaceOrder = async () => {
    payData.value = await initPayWay({ ...params.value })
    timeStamp.value = (payData.value.cancel_time - Date.now() / 1000) * 1000
    const checkPay =
        payData.value.lists.find((item: any) => item.is_default) || payData.value.lists[0]
    payWay.value = checkPay?.pay_way
}

const onSubmitOrder = async () => {
    const modelRes = await uni.showModal({
        title: '温馨提示',
        content: '确认支付吗？'
    })
    if (modelRes.cancel) return
	
	//支付宝支付
	if(payWay.value == 2) {
	
		// #ifdef MP-WEIXIN
		alipayLink.value = `${import.meta.env.VITE_APP_BASE_URL || ''}mobile/bundle/pages/toAlipay/toAlipay?order_id=${params.value.order_id}&from=${params.value.from}&pay_way=${payWay.value}&key=${token}`
		alipayShow.value = true
		return
		// #endif
		
		//#ifdef H5
		let ua = navigator.userAgent.toLowerCase()
		if (ua.match(/MicroMessenger/i)) {
			//微信浏览器环境
			uni.reLaunch({
			    url: `/bundle/pages/toAlipay/toAlipay?order_id=${params.value.order_id}&from=${params.value.from}&pay_way=${payWay.value}&key=${token}`
			})
			return
		}
		//#endif
	}
	
	

    try {
        handlePayPrepay({
            from: params.value.from,
            pay_way: payWay.value,
            order_id: params.value.order_id
        })
    } catch (error) {
        console.log(error)
    }
}
const selectPayWay = (pay: number) => {
    payWay.value = pay
}

onLoad(async (option: any) => {
    if (option?.order_amount) {
        params.value.order_amount = option?.order_amount
        payWay.value = 2
    }
    params.value.order_id = option.order_id
    params.value.from = option.from
    initPlaceOrder()
})
const handleCountDownEnd = async (e: any): Promise<void> => {
    await uni.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '当前订单支付时间已过，请重新下单',
        success: () => {
            uni.reLaunch({
                url: '/pages/index/index'
            })
        }
    })
}
</script>
<style lang="scss" scoped>
// 处理h5strat
.radio {
    display: block;
}
// END
.box {
    margin: 20rpx 20rpx 0;
    height: 240rpx;
    border-radius: 14rpx 14rpx 0 0;
    background: linear-gradient(90deg, $u-type-primary 0%, $u-type-primary 100%);
    &-text {
        color: rgba(255, 255, 255, 1);
        font-size: 60rpx;
    }
    &-time {
        border-radius: 200rpx;
        background-color: rgba(255, 255, 255, 1);
        padding: 10rpx 48rpx;
        margin-top: 24rpx;
        font-size: 24rpx;
    }
}
.pay-box {
    border-radius: 0 0 14rpx 14rpx;
    background-color: white;
    padding: 20rpx;
    margin: 20rpx;
    margin-top: 0;
    .item:not(:last-child) {
        border-bottom: 1rpx solid #e5e5e592;
        padding-bottom: 20rpx;
    }
}

.bottom_box {
    width: 100%;
    position: fixed;
    bottom: env(safe-area-inset-bottom);
    .pay_btn {
        border-radius: 200rpx;
        color: white;
        background-color: $u-type-primary;
        font-size: 30rpx;
        line-height: 80rpx;
        height: 80rpx;
        text-align: center;
    }
}

</style>
