<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="m-[24rpx]" style="border-radius: 20rpx;overflow: hidden;">
		<view class="flex justify-between item">
		    <view class="label flex items-center">
				<text class="font-bold">头像</text>
			</view>
			<view>
				<u-avatar :src="userInfo?.avatar" :size="80"></u-avatar>
			</view>
		</view>
		<view class="flex justify-between item text-nr">
		    <view class="label flex items-center">
				<text class="font-bold">姓名</text>
			</view>
			<view class="flex items-center">
				<view class="content">{{ userInfo?.name }}</view>
			</view>
		</view>
		<view class="flex justify-between item text-nr">
		    <view class="label flex items-center">
				<text class="font-bold">性别</text>
			</view>
			<view class="flex items-center" @click="showPicker = true">
				<text class="content mr-[10rpx]">{{ userInfo?.sex_desc }}</text>
				<u-icon name="arrow-right" size="22" color="#666"></u-icon>
			</view>
		</view>
		<view class="flex justify-between item text-nr">
		    <view class="label flex items-center">
				<text class="font-bold">手机号</text>
			</view>
			<view class="flex items-center" @click="changeMobileTips">
				<text class="content mr-[10rpx]">{{ userInfo?.mobile.slice(0, 3)+'****'+userInfo?.mobile.slice(-4) }}</text>
				<u-icon name="arrow-right" size="22" color="#666"></u-icon>
			</view>
		</view>
	</view>

    <!-- 性别修改组件 -->
    <u-picker
        mode="selector"
        v-model="showPicker"
        :confirm-color="$theme.primaryColor"
        :default-selector="[0]"
        :range="sexList"
        @confirm="changeSexConfirm"
    />
	<!-- 手机号修改组件 -->
	<u-popup v-model="showMobilePop" :closeable="true" mode="center" border-radius="20">
		<view class="px-[50rpx] py-[40rpx] bg-white" style="width: 85vw">
			<view class="mb-[70rpx] text-xl text-center">修改手机号码</view>
			<u-form-item borderBottom>
				<u-input
					class="flex-1"
					v-model="newMobile"
					placeholder="请输入新的手机号码"
					:border="false"
				/>
			</u-form-item>
			<u-form-item borderBottom>
				<u-input
					class="flex-1"
					v-model="mobileCode"
					placeholder="请输入验证码"
					:border="false"
				/>
				<view
					class="border-l border-solid border-0 border-light pl-3 text-muted leading-4 ml-3 w-[180rpx]"
					@click="sendSms"
				>
					<u-verification-code
						ref="uCodeRef"
						:seconds="60"
						@change="codeChange"
						change-text="x秒"
					/>
					{{ codeTips }}
				</view>
			</u-form-item>
			<view class="mt-[80rpx]">
				<u-button @click="changeCodeMobile" type="primary" shape="circle"> 确定 </u-button>
			</view>
		</view>
	</u-popup>
</template>

<script lang="ts" setup>
import { ref, shallowRef,computed } from 'vue'
import { smsSend } from '@/api/app'
import { FieldType, SMSEnum } from '@/enums/appEnums'
import { useUserStore } from '@/stores/user'
import { apiUserSetInfo } from '@/api/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo) as any
// 用户信息的枚举
const fieldType = ref(FieldType.NONE)
//选择性别数据
const sexList = ref<Array<string> | null>(['男', '女'])
//显示性别选择弹窗
const showPicker = ref<boolean | null>(false)
// 显示手机号验证码调整弹窗 非小程序才需要
const showMobilePop = ref<boolean | null>(false)
//新的手机号码
const newMobile = ref<string>('')

//修改手机验证码
const mobileCode = ref<string>('')
const codeTips = ref('')
const uCodeRef = shallowRef()

// 获取验证码显示字段
const codeChange = (text: string) => {
    codeTips.value = text
}

// 发送验证码
const sendSms = async () => {
    if (!newMobile.value) return uni.$u.toast('请输入新的手机号码')
    if (uCodeRef.value?.canGetCode) {
        await smsSend({
            scene: SMSEnum.BGSJHMSF,
            mobile: newMobile.value
        })
        uni.$u.toast('发送成功')
        uCodeRef.value?.start()
    }
}

// 修改用户信息
const setUserInfoFun = async (field: string,value: string): Promise<void> => {
    await apiUserSetInfo({
        field: field,
        value: value
    })
    uni.$u.toast('操作成功')
    userStore.getUser()
}
// 修改用户性别
const changeSexConfirm = (value) => {
    setUserInfoFun(FieldType.SEX,value[0] + 1)
    showPicker.value = false
}
// 修改手机号
const changeMobileTips = () => {
	uni.showModal({
		title: '确认更换手机号？',
		content: '当前绑定的手机号'+userInfo.value?.mobile?.slice(0, 3)+'****'+userInfo.value?.mobile?.slice(-4),
		confirmText: '更换',
		success: function (res) {
			if (res.confirm) {
				showMobilePop.value = true
			}
		}
	});
}
const changeCodeMobile = async () => {
    await setUserInfoFun(FieldType.MOBILE,newMobile.value)
    showMobilePop.value = false
}
</script>

<style lang="scss" scoped>

.item {
    // margin-top: 2rpx;
    padding: 30rpx;
    background-color: #ffffff;

    .label {
        width: 150rpx;
    }

    .content {
        flex: 1;
        width: 80%;
    }
}
</style>
