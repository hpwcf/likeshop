<template>
    <view class="bg-white min-h-full flex flex-col items-center px-[40rpx] pt-[40rpx] box-border">
    	<view class="text-2xl font-bold mb-[60rpx]">重新设置密码</view>
        <view class="w-full">
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
                <view class="flex mb-[40rpx]">
                    <u-input
    					class="flex-1 bg-[#edf1f3]"
    					style="border-radius: 100rpx; padding: 10rpx 30rpx;"
    					v-model="formData.password"
    					:border="false"
					    type="password"
    					placeholder="请输入新密码"
    				/>
                </view>
                <view class="flex code-input">
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
            <view class="mt-[100rpx]">
				<button class="bg-primary text-lg text-white" @click="handleConfirm">
					确认
				</button>
                <!-- <u-button type="error" @click="handleConfirm"> 完成并登录 </u-button> -->
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { smsSend } from '@/api/app'
import { forgotPassword } from '@/api/user'
import { SMSEnum } from '@/enums/appEnums'
import { reactive, ref, shallowRef, computed } from 'vue'
import { validateInput } from '@/utils/util'
import { login } from "@/api/account"
import { useUserStore } from "@/stores/user"
import { useAppStore } from '@/stores/app'
import cache from "@/utils/cache"
import { BACK_URL } from "@/enums/cacheEnums"
import { onLoad } from '@dcloudio/uni-app'
import {useRouter} from "uniapp-router-next";

const uCodeRef = shallowRef()
const codeTips = ref('')
const appStore = useAppStore()
const userStore = useUserStore();
const isForceBindMobile = computed(() => appStore.config.coerce_mobile == 1)
const formData = reactive({
    mobile: '',
    code: '',
    password: '',
})
const router = useRouter()

const codeChange = (text: string) => {
    codeTips.value = text
}

const sendSms = async () => {
    if (!formData.mobile) return uni.$u.toast('请输入手机号码')
    if (uCodeRef.value?.canGetCode) {
        await smsSend({
            scene: SMSEnum.RESET_PASSWORD,
            mobile: formData.mobile,
        })
        uni.$u.toast('发送成功')
        uCodeRef.value?.start()
    }
}
//重置密码并登录
const handleConfirm = async () => {
    if (!formData.mobile) return uni.$u.toast('请输入手机号码')
    if (!formData.password) return uni.$u.toast('请输入密码')
    if (!formData.code) return uni.$u.toast('请输入验证码')
    if (!validateInput(formData.password)) return uni.$u.toast('密码应为6-20位数字+英文')
	uni.showLoading({
		title: "请稍后...",
	});
    await forgotPassword(formData)
	router.navigateBack()
	// try {
	// 	const data = await login({scene:1,mobile:formData.mobile,password:formData.password});
	// 	loginHandle(data);
	// } catch (error: any) {
	// 	uni.hideLoading();
	// 	uni.$u.toast(error);
	// }
}
//登陆成功后的操作
const loginHandle = async (data : any) => {
	// const { token, mobile } = data;
	// if (!mobile && isForceBindMobile.value) {
	// 	userStore.temToken = token;
	// 	uni.navigateTo({
	// 		url: "/pages/bind_mobile/index",
	// 	});
	// 	uni.hideLoading();
	// 	return;
	// }
	// userStore.login(data.token);
	// await userStore.getUser();
	// uni.$u.toast("登录成功");
	// // #ifdef APP-PLUS
	// router.navigateBack()
	// // #endif
	// // #ifndef APP-PLUS
	// const pages = getCurrentPages()
	// if (pages.length > 1) {
	// 	const prevPage = pages[pages.length - 2]
	// 	await router.navigateBack()
	// 	// @ts-ignore
	// 	const {onLoad, options} = prevPage
	// 	// 刷新上一个页面
	// 	onLoad && onLoad(options)
	// } else if (cache.get(BACK_URL)) {
	// 	try {
	// 		router.redirectTo(cache.get(BACK_URL))
	// 	} finally {
	// 		router.switchTab(cache.get(BACK_URL))
	// 	}
	// } else {
	// 	router.reLaunch('/pages/index/index')
	// }
	// cache.remove(BACK_URL)
	// // #endif
};
onLoad((options) => {
	formData.mobile = options?.mobile || ''
})
</script>

<style lang="scss">
page {
    height: 100%;
}
</style>
<style lang="scss" scoped>
.code-input {
	position: relative;
	.code {
		position: absolute;
		right: 40rpx;
		top: 27rpx;
	}
}
</style>
