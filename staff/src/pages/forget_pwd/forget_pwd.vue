<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view
        class="forget bg-white min-h-full flex flex-col items-center px-[40rpx] pt-[100rpx] box-border"
    >
		<view class="w-full">
			<view class="pt-[20rpx] pb-[80rpx] font-bold text-3xl text-center">
				重新设置密码
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
			    <u-button type="primary" shape="square" @click="handleConfirm"> 确认 </u-button>
			</view>
		</view>
    </view>
</template>

<script setup lang="ts">
import { smsSend } from '@/api/app'
import { apiUserForgetPassword } from '@/api/user'
import { SMSEnum } from '@/enums/appEnums'
import { reactive, ref, shallowRef } from 'vue'
import { validateInput } from '@/utils/util'
import {useRoute, useRouter} from "uniapp-router-next";

const uCodeRef = shallowRef()
const codeTips = ref('')
const formData = reactive({
    mobile: '',
    code: '',
    password: ''
})
const router = useRouter()

const codeChange = (text: string) => {
    codeTips.value = text
}
const sendSms = async () => {
    if (!formData.mobile) return uni.$u.toast('请输入手机号码')
    if (uCodeRef.value?.canGetCode) {
    	await smsSend({
    		scene: SMSEnum.CSDLMMSF,
    		mobile: formData.mobile,
    	})
    	uni.$u.toast("发送成功");
    	uCodeRef.value?.start();
    }
}

const handleConfirm = async () => {
    if (!formData.mobile) return uni.$u.toast('请输入手机号码')
    if (!formData.password) return uni.$u.toast('请输入密码')
    if (!formData.code) return uni.$u.toast('请输入验证码')
    // if (formData.password != formData.password_confirm) return uni.$u.toast('两次输入的密码不一致')
    if (!validateInput(formData.password)) return uni.$u.toast('密码应为6-20位数字+英文')
 
	await apiUserForgetPassword(formData);
	router.navigateBack()
}
</script>

<style lang="scss">
page {
    height: 100%;
}
</style>
<style lang="scss" scoped>
.forget {
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