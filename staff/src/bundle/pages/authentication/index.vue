<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
	<view class="main">
		<view class="u-flex info">
			<u-image
			    :src="userInfo?.avatar"
			    width="120"
			    height="120"
			    border-radius="60rpx"
			></u-image>
			<view class="ml-[30rpx]">
				<view class="text-xl font-bold mb-[10rpx]">{{ userInfo.name }}/{{ userInfo.sex_desc }}/{{ userInfo.age }}岁</view>
				<view class="text-[#909399]">{{ userInfo.identity_number }}</view>
			</view>
		</view>
		<view class="mt-[30rpx]">
			<view class="text-xl font-bold">身份证照片(人像面)</view>
			<view class="credential mt-[20rpx]">
				<u-image
				    :src="userInfo.identity_portrait_image"
					height="260rpx"
					mode="heightFix"
				    border-radius="16rpx"
					class="credential-img"
					 @click="previewImage(userInfo.identity_portrait_image)"
				></u-image>
			</view>
		</view>
		<view class="mt-[30rpx]">
			<view class="text-xl font-bold">身份证照片(国徽面)</view>
			<view class="credential mt-[20rpx]">
				<u-image
				    :src="userInfo.identity_emblem_image"
					height="260rpx"
					mode="heightFix"
				    border-radius="16rpx"
					class="credential-img"
					 @click="previewImage(userInfo.identity_emblem_image)"
				></u-image>
			</view>
		</view>
		<view class="mt-[30rpx]">
			<view class="text-xl font-bold">实拍照(正面免冠素颜照片)</view>
			<view class="credential mt-[20rpx]">
				<u-image
				    :src="userInfo.portrait_image"
					height="260rpx"
					mode="heightFix"
				    border-radius="16rpx"
					class="credential-img"
					 @click="previewImage(userInfo.portrait_image)"
				></u-image>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo) as any

//预览图片
const previewImage = (url:string) => {
	uni.previewImage({
		urls: [url]
	})
}
</script>

<style lang="scss" scoped>
.main {
	padding: 20rpx 20rpx 40rpx;
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
