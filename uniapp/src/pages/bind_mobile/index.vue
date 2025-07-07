<template>
    <view class="bg-white min-h-full flex flex-col items-center px-[40rpx] pt-[40rpx] box-border">
		<view class="text-2xl font-bold mb-[60rpx]">绑定您的手机号</view>
        <view class="w-full">
            <view>
                <view class="flex mb-[40rpx]">
                    <u-input
						class="flex-1 bg-[#edf1f3]"
						style="border-radius: 100rpx; padding: 10rpx 30rpx;"
						v-model="formData.mobile"
						:border="false"
						placeholder="请输入你常用手机号"
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
                <u-button type="error" @click="handleConfirm"> 确定 </u-button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { apiBindMobile } from '@/api/user'
import { smsSend } from '@/api/app'
import { SMSEnum } from '@/enums/appEnums'
import { reactive, ref, shallowRef } from 'vue'
import { useUserStore } from '@/stores/user'
const uCodeRef = shallowRef()
const codeTips = ref('')

const userStore = useUserStore()
const codeChange = (text: string) => {
    codeTips.value = text
}

const formData = reactive({
    type: 'bind',
    mobile: '',
    code: ''
})
const sendSms = async () => {
    if (!formData.mobile) return uni.$u.toast('请输入手机号码')
    if (uCodeRef.value?.canGetCode) {
        await smsSend({
            scene: SMSEnum.BIND_MOBILE,
            mobile: formData.mobile
        })
        uni.$u.toast('发送成功')
        uCodeRef.value?.start()
    }
}
const handleConfirm = async () => {
    if (!formData.mobile) return uni.$u.toast('请输入手机号码')
    if (!formData.code) return uni.$u.toast('请输入验证码')
    await apiBindMobile(formData, { token: userStore.temToken })
    uni.$u.toast('绑定成功')
    userStore.login(userStore.temToken!)
    uni.navigateBack()
}
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
