<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="user-set">
		<view class="card" v-if="userInfo.is_staff">
			<navigator :url="`/bundle/pages/user_profile/index`">
				<view class="item flex bg-white rounded-[20rpx]">
					<u-avatar :src="userInfo.avatar" shape="square" :size="100"></u-avatar>
					<view class="ml-[20rpx] flex flex-1 justify-between items-center">
						<view>
							<view class="mb-[15rpx] text-xl font-medium">{{ userInfo.name }}</view>
							<view class="text-content text-xs">工号：{{ userInfo.sn }}</view>
						</view>
						<u-icon name="arrow-right" color="#666"></u-icon>
					</view>
				</view>
			</navigator>
		</view>
        <view class="card" v-if="userInfo.is_staff">
			<view class="u-flex justify-between my-[10rpx]" @click="handlePwd">
				<view class="text-[30rpx]">登录密码</view>
				<view class="text-[#909399]">{{ userInfo?.has_password ? '已设置' : '未设置' }}<u-icon name="arrow-right" color="#909399" size="24"></u-icon></view>
			</view>
		</view>
        <view class="card">
			<view class="u-flex justify-between mt-[10rpx] mb-[40rpx]" v-if="userInfo.is_staff" @click="goPage('/bundle/pages/user_info/index')">
				<view class="text-[30rpx]">个人资料</view>
				<view><u-icon name="arrow-right" color="#909399" size="24"></u-icon></view>
			</view>
			<view class="u-flex justify-between mt-[30rpx] mb-[40rpx]" @click="goPage('/bundle/pages/authentication/index')" v-if="userInfo.is_staff">
				<view class="text-[30rpx]">实名信息</view>
				<view><u-icon name="arrow-right" color="#909399" size="24"></u-icon></view>
			</view>
			<view class="u-flex justify-between mt-[30rpx] mb-[40rpx]" @click="goPage('/pages/agreement/agreement?id=3')">
				<view class="text-[30rpx]">服务协议</view>
				<view><u-icon name="arrow-right" color="#909399" size="24"></u-icon></view>
			</view>
			<view class="u-flex justify-between mt-[30rpx] mb-[40rpx]" @click="goPage('/pages/agreement/agreement?id=4')">
				<view class="text-[30rpx]">隐私协议</view>
				<view><u-icon name="arrow-right" color="#909399" size="24"></u-icon></view>
			</view>
			<view class="u-flex justify-between mt-[30rpx] mb-[10rpx]" @click="goPage('/pages/about_us/index')">
				<view class="text-[30rpx]">关于我们</view>
				<view><u-icon name="arrow-right" color="#909399" size="24"></u-icon></view>
			</view>
		</view>

        <view class="mt-[60rpx]">
            <button class="bg-primary text-lg text-white" @click="logoutHandle">
                退出登录
            </button>
        </view>
    </view>
	
	<u-action-sheet
		:list="pwdList"
		v-model="pwdShow"
		@click="handlePwdClick"
		:safe-area-inset-bottom="true"
	></u-action-sheet>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed,ref } from 'vue'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo) as any
const pwdList = ref([
    {
        text: '修改密码'
    },
    {
        text: '忘记密码'
    }
])
const pwdShow = ref(false)

const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}

const handlePwd = () => {
    if (!userInfo.value.has_password)
        return uni.navigateTo({url: '/pages/change_pwd/index?type=set'})
    pwdShow.value = true
}

const handlePwdClick = (index: number) => {
    switch (index) {
        case 0:
            uni.navigateTo({url: '/bundle/pages/change_pwd/index'})
            break
        case 1:
            uni.navigateTo({url: '/pages/forget_pwd/forget_pwd'})
            break
    }
}

// 退出登录
const logoutHandle = () => {
    uni.showModal({
        content: '是否退出登录？',
        confirmColor: '#4173FF',
        success: ({ cancel }) => {
            if (cancel) return
            userStore.logout()
            uni.redirectTo({ url: '/pages/login/login' })
        }
    })
}
</script>

<style lang="scss" scoped>
.user-set {
	padding: 30rpx 20rpx;
}
.card {
	padding: 20rpx 24rpx;
	border-radius: 20rpx;
	background-color: #ffffff;
	margin-bottom: 20rpx;
}
</style>
