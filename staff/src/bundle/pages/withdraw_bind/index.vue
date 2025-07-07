<template>
    <view class="withdraw">
		<view v-for="item in withdrawConfig.type" :key="item.way" class="u-flex account" @click="goPage('/bundle/pages/withdraw_bind_account/index?type='+item.way)">
			<view>
				<u-image width="50rpx" height="50rpx" :src="item.image"></u-image>
			</view>
			<view class="ml-[20rpx]">
				<view class="font-bold text-1xl">提现至{{ item.withdraw_way_name }}</view>
				<view class="text-sm text-[#909399] u-flex mt-[10rpx] text-[24rpx]">
					<text>{{ item.name?.length ? item.name + ' ' + item.account : '请设置提现账户' }}</text>
					<u-icon name="arrow-right" color="#909399" size="22rpx"></u-icon>
				</view>
			</view>
		</view>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { apiGetWithdrawConfig } from '@/api/wallet'

const withdrawConfig = ref<any>({})

// 获取提现配置
const getWithdrawConfig = async () => {
    withdrawConfig.value = await apiGetWithdrawConfig({})
}

// 跳转页面
const goPage = (url: any) => {
    uni.navigateTo({ url: url })
}

onShow(() => {
    getWithdrawConfig()
})
</script>

<style lang="scss" scoped>
.withdraw {
    padding: 20rpx 30rpx;

	.account {
		margin-top: 20rpx;
		padding: 30rpx 24rpx;
		background-color: #ffffff;
        border-radius: 20rpx;
	}
}
</style>
