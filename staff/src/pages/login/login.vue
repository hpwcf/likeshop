<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view
        class="register bg-white min-h-full flex flex-col items-center px-[40rpx] pt-[40rpx] box-border"
    >
        <view class="w-full">
			<view class="pt-[40rpx] pb-[70rpx] font-bold text-4xl">
				{{ appStore.config.staff_name }}
			</view>
			<view class="mb-[60rpx]">
				<u-tabs :list="loginWayList" :active-color="$theme.primaryColor" :is-scroll="false" v-model="loginWayCurrent" bar-height="12" bar-width="80" :bar-style="{'bottom':'-4rpx'}" @change="loginWayChange"></u-tabs>
			</view>
			<view>
				<view class="flex mb-[40rpx]">
					<u-input
						class="flex-1 bg-[#edf1f3]"
						style="border-radius: 100rpx; padding: 10rpx 30rpx;"
						v-model="formData.mobile"
						:border="false"
						placeholder="请输入手机号"
					/>
				</view>
				<view class="flex mb-[40rpx] code-input" v-if="loginWayCurrent == 0">
					<u-input
					    class="flex-1 bg-[#edf1f3]"
						style="border-radius: 100rpx; padding: 10rpx 150rpx 10rpx 30rpx;"
					    type="password"
					    v-model="formData.password"
					    placeholder="请输入密码"
					    :border="false"
					/>
					<view
						class="code"
						@click="goPage('/pages/forget_pwd/forget_pwd')"
					>
						<text>忘记？</text>
					</view>
				</view>
				<view class="flex mb-[40rpx] code-input" v-if="loginWayCurrent == 1">
					<u-input
					    class="flex-1 bg-[#edf1f3]"
						style="border-radius: 100rpx; padding: 10rpx 200rpx 10rpx 30rpx;"
					    v-model="formData.code"
					    placeholder="请输入验证码"
					    :border="false"
					/>
					<view
						class="code"
						@click="sendSms"
					>
						<u-verification-code
							ref="uCodeRef"
							:seconds="60"
							@change="codeChange"
							change-text="x秒"
						/>
						<text>{{ codeTips }}</text>
					</view>
				</view>
			</view>
			<view class="mt-[60rpx]">
			    <!-- <u-button class="text-white" shape="square" :custom-style="{'background-color':$theme.primaryColor}" @click="accountLogin"> 登录 </u-button> -->
				<button class="bg-primary text-lg text-white" @click="accountLogin">
					登录
				</button>
				<view class="text-center mt-[40rpx]">
					<text @click="goPage('/pages/register/register')">注册</text>
				</view>
			</view>
        </view>
		<view class="footer">
			<u-checkbox v-model="isCheckAgreement" shape="circle" :active-color="$theme.primaryColor">
				<view class="text-xs flex">
					我已阅读并同意
					<view class="text-primary" hover-class="none"
						@click.stop="goPage('/pages/agreement/agreement?id=3')">
						《服务协议》
					</view>
					与
					<view class="text-primary" hover-class="none"
						@click.stop="goPage('/pages/agreement/agreement?id=4')">
						《隐私协议》
					</view>
				</view>
			</u-checkbox>
		</view>
    </view>
</template>

<script setup lang="ts">
import { login } from '@/api/account'
import { useAppStore } from '@/stores/app'
import { reactive, ref, shallowRef,watch } from 'vue'
import { validateInput } from '@/utils/util'
import { smsSend } from "@/api/app"
import { SMSEnum } from "@/enums/appEnums"
import { BACK_URL } from "@/enums/cacheEnums"
import cache from "@/utils/cache"
import { useUserStore } from "@/stores/user"
import {useRoute, useRouter} from "uniapp-router-next";
import { onLoad, onShow } from "@dcloudio/uni-app";

const isCheckAgreement = ref(false)
const appStore = useAppStore()
const userStore = useUserStore()
const uCodeRef = shallowRef()
const codeTips = ref('获取验证码')
const router = useRouter()

const loginWayCurrent = ref(0)
const loginWayList = [
	{
		name: '账号登录',
		way: 1
	},
	{
		name: '验证码登录',
		way: 2
	}
]
const formData = reactive({
	scene: loginWayList[loginWayCurrent.value].way,
    mobile: '',
    password: '',
    code: '',
})

//切换登录方式
const loginWayChange = (index:number) => {
	loginWayCurrent.value = index
}

//登录
const accountLogin = async () => {
    if (!isCheckAgreement.value) return uni.$u.toast('请勾选已阅读并同意《服务协议》和《隐私协议》')
    if (!formData.mobile) return uni.$u.toast('请输入手机号')
    if (!formData.password && formData.scene == 1) return uni.$u.toast('请输入密码')
    if (!formData.code && formData.scene == 2) return uni.$u.toast('请输入验证码')
	
	uni.showLoading({
		title: "请稍后...",
	});
    try {
		const data = await login(formData);
		loginHandle(data);
	} catch (error: any) {
		uni.hideLoading();
		uni.$u.toast(error);
	}
}
//登陆成功后的操作
const loginHandle = async (data : any) => {
	const {token} = data
	userStore.login(token)
	userStore.getUser()
	uni.hideLoading()
	// #ifdef APP-PLUS
	router.navigateBack()
	// #endif
	// #ifndef APP-PLUS
	const pages = getCurrentPages()
	if (pages.length > 1) {
		const prevPage = pages[pages.length - 2]
		await router.navigateBack()
		// @ts-ignore
		const {onLoad, options} = prevPage
		// 刷新上一个页面
		onLoad && onLoad(options)
	} else if (cache.get(BACK_URL)) {
		try {
			router.redirectTo(cache.get(BACK_URL))
		} finally {
			router.switchTab(cache.get(BACK_URL))
		}
	} else {
		router.reLaunch('/pages/index/index')
	}
	cache.remove(BACK_URL)
	// #endif
};

//修改验证码提示
const codeChange = (text: string) => {
  codeTips.value = text;
};
//发送短信验证码
const sendSms = async () => {
	if (!formData.mobile) return uni.$u.toast('请输入手机号码')
	if (uCodeRef.value?.canGetCode) {
		await smsSend({
			scene: SMSEnum.YZMDLSF,
			mobile: formData.mobile,
		})
		uni.$u.toast("发送成功");
		uCodeRef.value?.start();
	}
};

const goPage = (url: string) => {
	uni.navigateTo({
		url: url
	})
}

watch(
  () => loginWayCurrent.value,
  (value) => {
	formData.scene = loginWayList[loginWayCurrent.value].way;
  },
  {
    immediate: true,
  }
);


onLoad(async (options) => {
	//已登录，跳转首页
	if (userStore.isLogin) {
		uni.reLaunch({
			url: "/pages/index/index",
		});
		return;
	}
});
onShow(async () => {
	if (userStore.isLogin) {
		// 已经登录 => 首页
		uni.reLaunch({
			url: "/pages/index/index",
		});
		return;
	}
});
</script>

<style>
	page {
	    height: 100%;
	}
</style>
<style lang="scss" scoped>
.register {
	.code-input {
		position: relative;
		.code {
			position: absolute;
			right: 40rpx;
			top: 26rpx;
		}
	}
}
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 120rpx;
    position: fixed;
	z-index: 1;
    display: flex;
    justify-content: center;
}
</style>
