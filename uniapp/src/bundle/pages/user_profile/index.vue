<template>
    <!-- Main Start -->
    <!-- 头部修改头像 -->
    <view class="header bg-white py-[30rpx]">
        <view class="flex">
            <button
                class="flex flex-col items-center after:border-0"
                hover-class="none"
                open-type="chooseAvatar"
                style="background-color: transparent"
                @click="chooseAvatar"
                @chooseavatar="chooseAvatar"
            >
                <image :src="userInfo?.avatar"></image>
                <view class="mt-[10rpx] text-center text-muted text-xs"> 点击修改头像 </view>
            </button>
        </view>
    </view>

    <!-- 用户ID -->
    <view
        class="flex justify-between item text-nr"
        @click=";(showUserName = true), (newUsername = userInfo?.account)"
    >
        <view class="label">账号</view>
        <view class="content">{{ userInfo?.account }}</view>
        <u-icon name="arrow-right" size="22" color="#666"></u-icon>
    </view>

    <!-- 昵称 -->
    <view
        class="flex justify-between item text-nr"
        @click=";(showNickName = true), (newNickname = userInfo?.nickname)"
    >
        <view class="label">昵称</view>
        <view class="content">{{ userInfo?.nickname }}</view>
        <u-icon name="arrow-right" size="22" color="#666"></u-icon>
    </view>

    <!-- 性别 -->
    <view class="flex justify-between item text-nr" @click="changeSex">
        <view class="label">性别</view>
        <view class="content" v-if="userInfo?.sex === 1">男</view>
        <view class="content" v-if="userInfo?.sex === 2">女</view>
        <u-icon name="arrow-right" size="22" color="#666"></u-icon>
    </view>

    <!-- 手机号 -->
    <view class="flex justify-between item text-nr">
        <view class="label">手机号</view>
        <view class="content">{{
            userInfo?.mobile == '' ? '未绑定手机号' : userInfo?.mobile
        }}</view>

        <!-- #ifdef MP-WEIXIN -->
        <u-button
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
            type="error"
            shape="circle"
            size="mini"
            :plain="true"
            class="btn"
        >
            {{ userInfo?.mobile == '' ? '绑定手机号' : '更换手机号' }}
        </u-button>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <u-button
            @click="showMobilePop = true"
            type="error"
            size="mini"
            shape="circle"
            :plain="true"
        >
            {{ userInfo?.mobile == '' ? '绑定手机号' : '更换手机号' }}
        </u-button>
        <!-- #endif -->
    </view>

    <!-- 注册时间 -->
    <view class="flex justify-between item text-nr">
        <view class="label">注册时间</view>
        <view class="content">{{ userInfo?.create_time }}</view>
    </view>

    <!-- 昵称修改组件 -->
    <u-popup
        v-model="showNickName"
        :closeable="true"
        mode="center"
        :maskCloseAble="false"
        border-radius="20"
    >
        <view class="px-[50rpx] py-[40rpx] bg-white" style="width: 85vw">
            <form @submit="changeNameConfirm">
                <view class="mb-[70rpx] text-xl text-center">修改昵称</view>
                <u-form-item borderBottom>
                    <input
                        class="nr h-[60rpx] w-full"
                        :value="userInfo.nickname"
                        name="nickname"
                        type="nickname"
                        placeholder="请输入昵称"
                    />
                </u-form-item>
                <view class="mt-[80rpx]">
                    <button
                        class="bg-primary text-white w-full h-[80rpx] !text-lg !leading-[80rpx] rounded-full"
                        form-type="submit"
                        hover-class="none"
                        size="mini"
                    >
                        确定
                    </button>
                </view>
            </form>
        </view>
    </u-popup>

    <!-- 账号修改组件 -->
    <u-popup v-model="showUserName" :closeable="true" mode="center" border-radius="20">
        <view class="px-[50rpx] py-[40rpx] bg-white" style="width: 85vw">
            <view class="mb-[70rpx] text-xl text-center">修改账号</view>
            <u-form-item borderBottom>
                <u-input
                    class="flex-1"
                    v-model="newUsername"
                    placeholder="请输入账号"
                    :border="false"
                />
            </u-form-item>
            <view class="mt-[80rpx]">
                <u-button @click="changeUserNameConfirm" type="primary" shape="circle">
                    确定
                </u-button>
            </view>
        </view>
    </u-popup>

    <!-- 性别修改组件 -->
    <u-picker
        mode="selector"
        v-model="showPicker"
        confirm-color="#4173FF"
        :default-selector="[0]"
        :range="sexList"
        @confirm="changeSexConfirm"
    />

    <!-- 账号修改组件 -->
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
import { ref, shallowRef } from 'vue'
import { onShow, onUnload } from '@dcloudio/uni-app'
import { apiUserInfoGet, apiUserInfoSet, apiBindMobile, apiWechatMobileGet } from '@/api/user'
import { smsSend } from '@/api/app'
import { FieldType, SMSEnum } from '@/enums/appEnums'
import { uploadFile } from '@/utils/util'
import { useUserStore } from '@/stores/user'

// 用户信息
const userInfo = ref<any>({})
// 用户信息的枚举
const fieldType = ref(FieldType.NONE)
//选择性别数据
const sexList = ref<Array<string> | null>(['男', '女'])

//显示昵称弹窗
const showNickName = ref<boolean | null>(false)
//显示账户弹窗
const showUserName = ref<boolean | null>(false)
//显示性别选择弹窗
const showPicker = ref<boolean | null>(false)
// 显示手机号验证码调整弹窗 非小程序才需要
const showMobilePop = ref<boolean | null>(false)

//新昵称
const newNickname = ref<string>('')
//新账号
const newUsername = ref<string>('')
//新的手机号码
const newMobile = ref<string>('')

//修改手机验证码
const mobileCode = ref<string>('')
const codeTips = ref('')
const uCodeRef = shallowRef()

// 获取用户信息
const getUser = async (): Promise<void> => {
    userInfo.value = await apiUserInfoGet()
}

// 获取验证码显示字段
const codeChange = (text: string) => {
    codeTips.value = text
}

// 发送验证码
const sendSms = async () => {
    if (!newMobile.value) return uni.$u.toast('请输入新的手机号码')
    if (uCodeRef.value?.canGetCode) {
        await smsSend({
            scene: userInfo.value.mobile ? SMSEnum.CHANGE_MOBILE : SMSEnum.BIND_MOBILE,
            mobile: newMobile.value
        })
        uni.$u.toast('发送成功')
        uCodeRef.value?.start()
    }
}

// 验证码修改手机号-非微信小程序
const changeCodeMobile = async () => {
    await apiBindMobile({
        type: userInfo.value.mobile ? 'change' : 'bind',
        mobile: newMobile.value,
        code: mobileCode.value
    })
    uni.$u.toast('操作成功')
    showMobilePop.value = false
    getUser()
}

// 修改用户信息
const setUserInfoFun = async (value: string): Promise<void> => {
    await apiUserInfoSet({
        field: fieldType.value,
        value: value
    })
    uni.$u.toast('操作成功')
    getUser()
	
	//更新用户信息
	useUserStore().getUser()
}

// 上传头像
const chooseAvatar = (e: any) => {
    fieldType.value = FieldType.AVATAR
    // #ifndef MP-WEIXIN
    uni.navigateTo({
        url: '/uni_modules/vk-uview-ui/components/u-avatar-cropper/u-avatar-cropper?destWidth=300&rectWidth=200&fileType=jpg'
    })
    // #endif
    // #ifdef MP-WEIXIN
    if (e.detail.avatarUrl) {
        uploadAvatar(e.detail.avatarUrl)
    }
    // #endif
}

// 显示修改用户性别弹窗
const changeSex = () => {
    showPicker.value = true
    fieldType.value = FieldType.SEX
}

// 修改用户性别
const changeSexConfirm = (value) => {
    setUserInfoFun(value[0] + 1)
    showPicker.value = false
}

// 修改用户账号
const changeUserNameConfirm = async () => {
    if (newUsername.value == '') return uni.$u.toast('账号不能为空')
    if (newUsername.value.length > 10) return uni.$u.toast('账号长度不得超过十位数')

    fieldType.value = FieldType.USERNAME
    await setUserInfoFun(newUsername.value)
    showUserName.value = false
}

// 修改用户昵称
const changeNameConfirm = async (e: any) => {
    newNickname.value = e.detail.value.nickname
    if (newNickname.value == '') return uni.$u.toast('昵称不能为空')
    if (newNickname.value.length > 10) return uni.$u.toast('昵称长度不得超过十位数')
    fieldType.value = FieldType.NICKNAME
    await setUserInfoFun(newNickname.value)

    showNickName.value = false
}

// 微信小程序 绑定｜｜修改用户手机号
const getPhoneNumber = async (e): Promise<void> => {
    const { encryptedData, iv, code } = e.detail
    const data = {
        code,
        encrypted_data: encryptedData,
        iv
    }
    if (encryptedData) {
        await apiWechatMobileGet({
            ...data
        })
        uni.$u.toast('操作成功')
        getUser()
    }
}

const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}

const uploadAvatar = (path: string) => {
    uni.showLoading({
        title: '正在上传中...',
        mask: true
    })
    uploadFile(path)
        .then((res) => {
            uni.hideLoading()
            setUserInfoFun(res.url)
        })
        .catch(() => {
            uni.hideLoading()
            uni.$u.toast('上传失败')
        })
}

// 监听从裁剪页发布的事件，获得裁剪结果
uni.$on('uAvatarCropper', (path) => {
    uploadAvatar(path)
})

onShow(async () => {
    getUser()
})

onUnload(() => {
    uni.$off('uAvatarCropper')
})
</script>

<style lang="scss" scoped>
.header {
    width: 100%;

    image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
    }
}

.item {
    margin-top: 2rpx;
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
