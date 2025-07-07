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
				{{ title }}
			</view>
			<view>
				<view class="flex mb-[40rpx]">
					<u-input
					    class="flex-1 bg-[#edf1f3]"
						style="border-radius: 100rpx; padding: 10rpx 30rpx;"
					    type="text"
					    v-model="formData.old_password"
					    placeholder="请输入原密码"
					    :border="false"
						v-if="type != 'set'"
					/>
				</view>
				<view class="flex mb-[40rpx]">
					<u-input
					    class="flex-1 bg-[#edf1f3]"
						style="border-radius: 100rpx; padding: 10rpx 30rpx;"
					    type="password"
					    v-model="formData.password"
					    placeholder="请输入新密码"
					    :border="false"
					/>
				</view>
				<view class="flex mb-[40rpx]">
					<u-input
					    class="flex-1 bg-[#edf1f3]"
						style="border-radius: 100rpx; padding: 10rpx 30rpx;"
					    type="password"
					    v-model="formData.password_confirm"
					    placeholder="请输入确认密码"
					    :border="false"
					/>
				</view>
			</view>
			<view class="mt-[60rpx]">
			    <u-button type="primary" shape="square" @click="handleConfirm"> 确认 </u-button>
			</view>
		</view>
    </view>
</template>

<script setup lang="ts">
import { apiUserChangePassword } from '@/api/user'
import { reactive, ref, shallowRef } from 'vue'
import { validateInput } from '@/utils/util'
import {useRoute, useRouter} from "uniapp-router-next";
import { onLoad } from '@dcloudio/uni-app'

const formData = reactive({
    old_password: '',
    password: '',
    password_confirm: ''
})
const router = useRouter()
const title = ref('修改登录密码')
const type = ref('')


const handleConfirm = async () => {
    if (!formData.old_password && type.value != 'set') return uni.$u.toast('请输入原密码')
    if (!formData.password) return uni.$u.toast('请输入新密码')
    if (!formData.password_confirm) return uni.$u.toast('请输入确认密码')
    if (!validateInput(formData.password)) return uni.$u.toast('密码应为6-20位数字+英文')
    if (formData.password != formData.password_confirm) return uni.$u.toast('新密码与确认密码不一致')
 
	await apiUserChangePassword(formData);
	router.navigateBack()
}

onLoad((options) => {
	type.value = options.type || ''
    if (type.value == 'set') {
		title.value = '设置登录密码'
        uni.setNavigationBarTitle({
            title: title.value,
        })
    }
})
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