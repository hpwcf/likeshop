<template>
    <view class="container">
        <image v-if="imageShow" src="@/bundle/static/images/Alipay.png" class="img"></image>
    </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad,onShow,onUnload } from '@dcloudio/uni-app'
import { apiJumpPayPrepay,getPayResult } from '@/api/app'

const order_id = ref()
const from = ref()
const pay_way = ref()
const token = ref()
let imageShow = ref(false)
const chatInterval = ref()
onLoad((param) => {
	order_id.value = param.order_id
	from.value = param.from
	pay_way.value = param.pay_way
	token.value = param.key
})
onShow(async () => {
	//#ifdef H5
	let ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i)) {
		imageShow.value = true
		chatInterval.value = setInterval(() => {
			const payResult = getPayResult({from:from.value,order_id:order_id.value},token.value)
			.then(function (response) {
				console.log(response)
				if(response.pay_status == 1) {
					clearInterval(chatInterval.value) 
					uni.showModal({
					    showCancel: false,
					    content: '支付成功',
					    success: () => {
							if(from.value == 'order') {
								const param = JSON.stringify({
								    order_id: order_id.value,
								    from: from.value
								})
								uni.reLaunch({
								    url: `/bundle/pages/payment_result/payment_result?param=${param}`
								})
							}
							if(from.value == 'recharge') {
								uni.reLaunch({
								    url: '/bundle/pages/user_wallet/user_wallet?isPay=true'
								})
							}
					    }
					})
				}
			})
		}, 1000)
		return
	}
	//不是微信游览器
	const res = await apiJumpPayPrepay({
	    from: from.value,
	    pay_way: pay_way.value,
	    order_id: order_id.value
	},token.value)
	console.log(res)
	const alipayPage = document.createElement('div')
	alipayPage.innerHTML = res.config
	document.body.appendChild(alipayPage)
	document.forms[0].submit()
	//#endif
})
onUnload((param) => {
	clearInterval(chatInterval.value)
})
</script>

<style lang="scss" scoped>
page {
    height: 100%;
    background-color: black;
}
.container {
    padding: 0 40rpx;
    display: flex;
    justify-content: flex-end;
    .img {
        height: 750rpx;
    }
}
</style>
