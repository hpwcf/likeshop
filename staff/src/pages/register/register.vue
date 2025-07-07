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
			<view class="pt-[40rpx] pb-[80rpx] font-bold text-4xl">
				{{ appStore.config.staff_name }}
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
				<view class="flex mb-[40rpx]">
					<u-input
					    class="flex-1 bg-[#edf1f3]"
						style="border-radius: 100rpx; padding: 10rpx 30rpx;"
					    type="password"
					    v-model="formData.password"
					    placeholder="请输入密码"
					    :border="false"
					/>
				</view>
				<view class="flex mb-[40rpx] code-input">
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
			    <!-- <u-button type="primary" shape="square" @click="accountRegister"> 注册 </u-button> -->
				<button class="bg-primary text-lg text-white" @click="accountRegister">
					注册
				</button>
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
import { register } from '@/api/account'
import { useAppStore } from '@/stores/app'
import { computed, reactive, ref, shallowRef } from 'vue'
import { validateInput } from '@/utils/util'
import { smsSend } from "@/api/app";
import { SMSEnum } from "@/enums/appEnums";

const isCheckAgreement = ref(false)
const appStore = useAppStore()
const formData = reactive({
    mobile: '',
    password: '',
    code: ''
})
const uCodeRef = shallowRef()
const codeTips = ref('获取验证码')

const accountRegister = async () => {
    if (!isCheckAgreement.value)
        return uni.$u.toast('请勾选已阅读并同意《服务协议》和《隐私协议》')
    if (!formData.mobile) return uni.$u.toast('请输入手机号')
    if (!formData.password) return uni.$u.toast('请输入密码')
    if (!formData.code) return uni.$u.toast('请输入验证码')
    // if (!formData.password_confirm) return uni.$u.toast('请输入确认密码')
    // if (formData.password != formData.password_confirm) return uni.$u.toast('两次输入的密码不一致')
    if (!validateInput(formData.password)) return uni.$u.toast('密码应为6-20位数字+英文')
    await register(formData)
    // uni.$u.toast('注册成功！')
    // uni.navigateBack()
	uni.showToast({
		title: '注册成功！',
		icon: 'none',
		duration: 1500,
		complete: function() {
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		}
	})
}

//修改验证码提示
const codeChange = (text: string) => {
  codeTips.value = text;
};
//发送短信验证码
const sendSms = async () => {
	if (!formData.mobile) return uni.$u.toast('请输入手机号码')
	if (uCodeRef.value?.canGetCode) {
		await smsSend({
			scene: SMSEnum.ZCYZMSF,
			mobile: formData.mobile,
		})
		uni.$u.toast("发送成功");
		uCodeRef.value?.start();
	}
};

const goPage = (url: string) => {
	uni.navigateTo({
		url: url,
	});
};
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
