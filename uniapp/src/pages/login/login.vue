<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
	<view class="bg-white login min-h-full flex flex-col items-center px-[40rpx] pt-[80rpx] box-border">
		<view>
			<u-image :src="appStore.config.shop_logo" mode="widthFix" height="160" width="160" border-radius="16rpx" />
		</view>
		<view class="mt-[100rpx] text-center">
			<view class="text-2xl font-bold">{{appStore.config.shop_name}}</view>
			<view class="text-muted mt-[30rpx]">{{appStore.config.shop_abbrev}}</view>
		</view>
		<view class="mt-[140rpx] w-full">
			<view v-if="isOpenThirdAuth && isOpenWechatAuth">
				<button class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx] mb-[50rpx]" @click="wxLogin()">
					用户一键登录
				</button>
			</view>
			<view>
				<view class="text-center" @click="goPage('/pages/login_account/index')">
					手机号登录
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
		
		<mplogin-popup v-model:show="showLoginPopup" :logo="appStore.config.shop_logo"
			:title="appStore.config.shop_name" @update="handleUpdateUser" />
	</view>
</template>

<script setup lang="ts">
	import { mnpLogin, updateUser } from "@/api/account";
	import { BACK_URL } from "@/enums/cacheEnums";
	import { useAppStore } from "@/stores/app";
	import { useUserStore } from "@/stores/user";
	import cache from "@/utils/cache";
	import { isWeixinClient } from "@/utils/client";
	// #ifdef H5
	import wechatOa from "@/utils/wechat";
	// #endif
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { computed, ref } from "vue";
	import {useRouter} from "uniapp-router-next";

	const isWeixin = ref(true);
	// #ifdef H5
	isWeixin.value = isWeixinClient();
	// #endif

	const userStore = useUserStore();
	const appStore = useAppStore();
	const router = useRouter()

	const isCheckAgreement = ref(false);
	const showLoginPopup = ref(false);
	const loginData = ref();

	const isOpenThirdAuth = computed(() => appStore.config.third_auth == 1);
	const isOpenWechatAuth = computed(() => appStore.config.wechat_auth == 1);
	const isForceBindMobile = computed(() => appStore.config.coerce_mobile == 1)

	const wxLogin = async () => {
		if (!isCheckAgreement.value) {
			return uni.$u.toast("请勾选已阅读并同意《服务协议》和《隐私协议》");
		}
			
		// #ifdef MP-WEIXIN
		uni.showLoading({
			title: "请稍后...",
		});
		try {
			const { code } : any = await uni.login({
				provider: "weixin",
			});
			const data = await mnpLogin({
				code: code,
			});
			loginData.value = data;
			if (data.is_new_user) {
				uni.hideLoading();
				userStore.temToken = data.token;
				showLoginPopup.value = true;
				return;
			}
			loginHandle(data);
		} catch (error : any) {
			uni.hideLoading();
			uni.$u.toast(error);
		}
		// #endif
		// #ifdef H5
		if (isWeixin.value) {
			wechatOa.getUrl();
		}
		// #endif
	};

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

	const goPage = (url : string) => {
		uni.navigateTo({
			url: url,
		});
	};

	const handleUpdateUser = async (value : any) => {
		await updateUser(value, { token: userStore.temToken });
		showLoginPopup.value = false;
		loginHandle(loginData.value);
	};

	onLoad(async (options) => {
		//已登录，跳转首页
		if (userStore.isLogin) {
			uni.reLaunch({
				url: "/pages/index/index",
			});
			return;
		}
		// 非公众号H5，跳转账号登录页面
		// #ifdef H5
		if (!isWeixin.value) {
			uni.redirectTo({
				url: "/pages/login_account/index?type="+(appStore.config.login_way[0] || 1),
			});
			return;
		}
		// #endif
		
		// #ifdef H5
		const { code } = options;
		if (code) {
			uni.showLoading({
				title: "请稍后...",
			});
			//用于清空code

			try {
				const data = await wechatOa.authLogin(code);
				loginHandle(data);
			} catch (error : any) {
				uni.hideLoading();
				throw new Error(error);
			}
		} else {
			// 未开启第三方登录，跳转到账号登录
			if (!isOpenThirdAuth.value || !isOpenWechatAuth.value) {
				uni.redirectTo({
					url: "/pages/login_account/index",
				});
				return;
			}
		}
		// #endif
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

<style lang="scss">
	page {
		height: 100%;
	}
</style>
<style lang="scss" scoped>
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