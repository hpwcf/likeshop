<template>
    <view class="bind">
		<view v-if="type == 1">
			<view>
				<view class="font-bold text-2xl mb-[20rpx]">姓名</view>
				<view>
					<u-input class="w-full m-0" :custom-style="{'padding':'14rpx 20rpx','border-radius':'12rpx','background-color':'#f5f7f9'}" v-model="formData.wechat_name" :clearable="false" placeholder="输入微信姓名" />
				</view>
			</view>
			<view class="mt-[30rpx]">
				<view class="font-bold text-2xl mb-[20rpx]">手机号</view>
				<view>
					<u-input class="w-full m-0" :custom-style="{'padding':'14rpx 20rpx','border-radius':'12rpx','background-color':'#f5f7f9'}" v-model="formData.wechat_mobile" :clearable="false" placeholder="输入微信绑定的手机号" />
				</view>
			</view>
		</view>
		<view v-if="type == 2">
			<view>
				<view class="font-bold text-2xl mb-[20rpx]">姓名</view>
				<view>
					<u-input class="w-full m-0" :custom-style="{'padding':'14rpx 20rpx','border-radius':'12rpx','background-color':'#f5f7f9'}" v-model="formData.alipay_name" :clearable="false" placeholder="输入支付宝姓名" />
				</view>
			</view>
			<view class="mt-[30rpx]">
				<view class="font-bold text-2xl mb-[20rpx]">账号</view>
				<view>
					<u-input class="w-full m-0" :custom-style="{'padding':'14rpx 20rpx','border-radius':'12rpx','background-color':'#f5f7f9'}" v-model="formData.alipay_account" :clearable="false" placeholder="输入支付宝账号" />
				</view>
			</view>
		</view>
		<view v-if="type == 3">
			<view>
				<view class="font-bold text-2xl mb-[20rpx]">姓名</view>
				<view>
					<u-input class="w-full m-0" :custom-style="{'padding':'14rpx 20rpx','border-radius':'12rpx','background-color':'#f5f7f9'}" v-model="formData.bank_holder_name" :clearable="false" placeholder="输入开户人姓名" />
				</view>
			</view>
			<view class="mt-[30rpx]">
				<view class="font-bold text-2xl mb-[20rpx]">开户行</view>
				<view>
					<u-input class="w-full m-0" :custom-style="{'padding':'14rpx 20rpx','border-radius':'12rpx','background-color':'#f5f7f9'}" v-model="formData.bank_opening" :clearable="false" placeholder="输入开户行名称" />
				</view>
			</view>
			<view class="mt-[30rpx]">
				<view class="font-bold text-2xl mb-[20rpx]">银行卡号</view>
				<view>
					<u-input class="w-full m-0" :custom-style="{'padding':'14rpx 20rpx','border-radius':'12rpx','background-color':'#f5f7f9'}" v-model="formData.bank_number" :clearable="false" placeholder="输入银行卡号" />
				</view>
			</view>
		</view>
		
		<view class="footer">
			<button class="bg-primary text-lg text-white" @click="confirm">
				确定
			</button>
			<!-- <u-button type="primary" size="medium" @click="confirm">确定</u-button> -->
		</view>
    </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { apiUserGetWithdrawAccount,apiUserSetWithdrawAccount } from '@/api/user'

const type = ref<number>(1)
const formData = ref<any>({})

// 获取提现账号
const getWithdrawAccount = async () => {
    formData.value = await apiUserGetWithdrawAccount()
}

//提交
const confirm = async() => {
	await apiUserSetWithdrawAccount(formData.value)
	uni.navigateBack()
}

onLoad((option) => {
	type.value = option.type
	let titleName = '微信'
	if(type.value == 2) {
		titleName = '支付宝'
	}
	if(type.value == 3) {
		titleName = '银行卡'
	}
	uni.setNavigationBarTitle({
		title: titleName
	})
	getWithdrawAccount()
})
</script>

<style lang="scss" scoped>
.bind {
	height: 100vh;
	background-color: #ffffff;
    padding: 40rpx 24rpx;

	// ::v-deep .input .u-input {
	// 	background-color: #f5f7f9 !important;
	// 	padding: 14rpx 20rpx !important;
	// 	border-radius: 12rpx !important;
	// }
}

// 底部按钮
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 108rpx;
    position: fixed;
	z-index: 11;
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);

    ::v-deep button {
		width: 100% !important;
	}
}
</style>
