<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view
        class="register bg-white min-h-full flex flex-col items-center px-[40rpx] pt-[40rpx] box-border"
    >
        <view class="w-full">
			<view class="pt-[40rpx] pb-[70rpx] font-bold text-3xl pl-[30rpx]">
				{{appStore.config.shop_name}}
			</view>
			<view class="mb-[60rpx]">
				<u-tabs :list="loginWayList" :active-color="$theme.primaryColor" :is-scroll="true" v-model="loginWayCurrent" bar-height="10" bar-width="80" :bar-style="{'bottom':'-4rpx'}"></u-tabs>
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
				<view class="flex mb-[40rpx] code-input" v-if="loginWayList[loginWayCurrent].way == 1">
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
						@click="goPage('/pages/forget_pwd/forget_pwd?mobile='+formData.mobile)"
					>
						<text>忘记？</text>
					</view>
				</view>
				<view class="flex mb-[40rpx] code-input" v-if="loginWayList[loginWayCurrent].way == 2">
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
				<button class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx] mb-[50rpx]" @click="accountLogin()">
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
					已阅读并同意
					<view class="text-primary" hover-class="none"
						@click.stop="goPage('/bundle/pages/service_explan/index?id=1')">
						《服务协议》
					</view>
					和
					<view class="text-primary" hover-class="none"
						@click.stop="goPage('/bundle/pages/service_explan/index?id=2')">
						《隐私协议》
					</view>
				</view>
			</u-checkbox>
		</view>
    </view>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { computed, reactive, ref, shallowRef, watch } from 'vue'
import { smsSend } from "@/api/app"
import { SMSEnum } from "@/enums/appEnums"
import { onLoad } from '@dcloudio/uni-app'
import { login, updateUser } from "@/api/account";
import { useUserStore } from "@/stores/user";
import { BACK_URL } from "@/enums/cacheEnums";
import cache from "@/utils/cache";
import {useRouter} from "uniapp-router-next";

const isCheckAgreement = ref(false)
const appStore = useAppStore()
const userStore = useUserStore();
const loginWayCurrent = ref(0)
const loginWayList = ref([
	{
		name: '账号登录',
		way: 1
	},
	{
		name: '验证码登录',
		way: 2
	}
])
const formData = reactive({
	scene: loginWayList.value[loginWayCurrent.value].way,
    mobile: '',
    password: '',
    code: '',
})
const uCodeRef = shallowRef()
const codeTips = ref('获取验证码')
const isForceBindMobile = computed(() => appStore.config.coerce_mobile == 1)
const router = useRouter()

//登录
const accountLogin = async () => {
	console.log(formData.scene)
    if (!isCheckAgreement.value) return uni.$u.toast("请勾选已阅读并同意《服务协议》和《隐私协议》");
	if (!formData.mobile) return uni.$u.toast("请输入手机号码");
    if (formData.scene == 1) {
		if (!formData.password) return uni.$u.toast("请输入密码");
    }
    if (formData.scene == 2) {
		if (!formData.code) return uni.$u.toast("请输入验证码");
    }
    uni.showLoading({
		title: "请稍后......",
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
	const { token, mobile } = data;
	if (!mobile && isForceBindMobile.value) {
		userStore.temToken = token;
		uni.navigateTo({
			url: "/pages/bind_mobile/index",
		});
		uni.hideLoading();
		return;
	}
	userStore.login(data.token);
	await userStore.getUser();
	uni.$u.toast("登录成功");
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
			scene: SMSEnum.LOGIN,
			mobile: formData.mobile,
		});
		uni.$u.toast("发送成功");
		uCodeRef.value?.start();
	}
};

const goPage = (url: string) => {
	uni.navigateTo({
		url: url,
	});
};

watch(
  () => loginWayCurrent.value,
  (value) => {
	formData.scene = loginWayList.value[loginWayCurrent.value].way;
  },
  {
    immediate: true,
  }
);
onLoad((options) => {
	loginWayList.value = loginWayList.value.filter(function(item) {
		return appStore.config.login_way.includes(item.way.toString())
	});
})
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
			top: 27rpx;
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