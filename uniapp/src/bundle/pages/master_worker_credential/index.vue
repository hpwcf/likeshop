<template>
	<view class="main">
		<view class="u-flex info">
			<u-image
			    :src="avatar"
			    width="150"
			    height="150"
			    border-radius="150rpx"
			></u-image>
			<view class="ml-[20rpx]">
				<view class="text-3xl font-bold">{{ name }}</view>
				<view class="text-[#909399]">{{ identity_number }}</view>
			</view>
		</view>
		<!-- <view class="mt-[30rpx]">
			<view class="text-3xl font-bold">从业资格证</view>
			<view class="credential mt-[20rpx]">
				<u-image
				    src="http://php-smjz.yixiangonline.com/uploads/images/20221209/20221209151235882e72054.jpg"
					height="260rpx"
					mode="heightFix"
				    border-radius="16rpx"
					class="credential-img"
				></u-image>
			</view>
		</view>
		<view class="mt-[30rpx]">
			<view class="text-3xl font-bold">健康证</view>
			<view class="credential mt-[20rpx]">
				<u-image
				    src="http://php-smjz.yixiangonline.com/uploads/images/20221209/20221209151235882e72054.jpg"
					height="260rpx"
					mode="heightFix"
				    border-radius="16rpx"
					class="credential-img"
				></u-image>
			</view>
		</view> -->
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const avatar = ref('')
const name = ref('')
const identity_number = ref('')

onLoad(async (options) => {
    avatar.value = options?.avatar || ''
    name.value = options?.name || ''
    identity_number.value = options?.identity_number || ''
})
</script>

<style lang="scss" scoped>
.main {
	padding: 20rpx;
	.info {
		padding: 30rpx 24rpx 40rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
	}
	.credential {
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		text-align: center;
	}
}
</style>
