<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar
            :front-color="$theme.navColor"
            :background-color="$theme.navBgColor"
        />
        <!-- #endif -->
    </page-meta>
    <view class="user-set flex flex-col min-h-0 h-full">

        <u-sticky h5-nav-height="0" bg-color="transparent">
            <u-navbar
                :is-back="true"
                :is-fixed="true"
                title="个人设置"
                :border-bottom="false"
                :title-bold="false"
                :background="{ background: `rgba(256,256, 256, 0)` }"
                :title-color="'#000'"
            >
            </u-navbar>
        </u-sticky>

        <view class="flex-1 px-[30rpx]">
            <navigator :url="`/bundle/pages/user_profile/index`">
                <view class="item flex bg-white rounded-[20rpx] mt-[20rpx]">
                    <u-avatar :src="userInfo.avatar" shape="square" :size="100"></u-avatar>
                    <view class="ml-[20rpx] flex flex-1 justify-between items-center">
                        <view>
                            <view class="mb-[15rpx] text-xl font-medium">{{ userInfo.nickname }}</view>
                            <view class="text-content text-xs">账号：{{ userInfo.account }}</view>
                        </view>
                        <u-icon name="arrow-right" color="#666"></u-icon>
                    </view>
                </view>
            </navigator>
            <view
                class="item bg-white rounded-t-[20rpx] mt-[20rpx] btn-border flex flex-1 justify-between"
                @click="handlePwd"
            >
                <view class="">登录密码</view>
                <u-icon name="arrow-right" color="#666"></u-icon>
            </view>
            <!-- #ifdef MP-WEIXIN || H5 -->
            <view
                class="item bg-white rounded-b-[20rpx] flex flex-1 justify-between"
                v-if="isWeixin"
                @click="handleBindwx"
            >
                <view class="">绑定微信</view>
                <view class="flex justify-between">
                    <view class="text-muted mr-[20rpx]">
                        {{ userInfo.has_auth ? '已绑定' : '未绑定' }}
                    </view>
                    <!-- <u-icon name="arrow-right" color="#666"></u-icon> -->
                </view>
            </view>
            <!-- #endif -->
            <view
                class="item bg-white rounded-t-[20rpx] mt-[20rpx] btn-border flex flex-1 justify-between"
                @click="goPage('/bundle/pages/service_explan/index?id=2')"
            >
                <view class="">隐私政策</view>
                <u-icon name="arrow-right" color="#666"></u-icon>
            </view>
            <view
                class="item bg-white btn-border flex flex-1 justify-between"
                @click="goPage('/bundle/pages/service_explan/index?id=1')"
            >
                <view class="">服务协议</view>
                <u-icon name="arrow-right" color="#666"></u-icon>
            </view>
            <view
                class="item bg-white rounded-b-[20rpx] flex flex-1 justify-between"
                @click="goPage('/pages/as_us/as_us')"
            >
                <view class="">关于我们</view>
                <view class="flex justify-between">
                    <view class="text-muted mr-[20rpx]"> v{{ appStore.config.version }}</view>
                    <u-icon name="arrow-right" color="#666"></u-icon>
                </view>
            </view>
        </view>

        <view
            class="bg-white p-[30rpx]"
            style="box-shadow: 0 -4rpx 48rpx 0 #1423191f;"
        >
            <button class="bg-primary text-lg text-white" @click="logoutHandle">
                退出登录
            </button>
            <!-- <u-button type="error" @click="logoutHandle">
                退出登录
            </u-button> -->
        </view>

        <u-action-sheet
            :list="list"
            v-model="show"
            @click="handleClick"
            :safe-area-inset-bottom="true"
        ></u-action-sheet>
    </view>
</template>

<script setup lang="ts">
import {apiUserInfoGet, apiBindwx, apiBindoa} from '@/api/user'
import {onShow, onLoad, onUnload} from '@dcloudio/uni-app'
import {ref} from 'vue'
import {useAppStore} from '@/stores/app'
import {useUserStore} from '@/stores/user'
import {isWeixinClient, getClient} from '@/utils/client'
import cache from '@/utils/cache'

// #ifdef H5
import wechatOa from '@/utils/wechat'
// #endif

const appStore = useAppStore()
const userStore = useUserStore()
const userInfo = ref({
    avatar: '',
    nickname: '',
    account: '',
    has_auth: '',
    has_password: ''
})
const list = ref([
    {
        text: '修改密码'
    },
    {
        text: '忘记密码'
    }
])

const isWeixin = ref(true)
// #ifdef H5
isWeixin.value = isWeixinClient()
// #endif

const show = ref(false)

// 获取用户信息
const getUser = async () => {
    const res = await apiUserInfoGet()
    userInfo.value = res
}

// 修改/忘记密码
const handleClick = (index: number) => {
    switch (index) {
        case 0:
            uni.navigateTo({url: '/pages/change_password/change_password'})
            break
        case 1:
            uni.navigateTo({url: '/pages/forget_pwd/forget_pwd'})
            break
    }
}

const handlePwd = () => {
    if (!userInfo.value.has_password)
        return uni.navigateTo({url: '/pages/change_password/change_password?type=set'})
    show.value = true
}

const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}

// 绑定微信
const handleBindwx = async () => {
    uni.showLoading({
        title: '请稍后...'
    })
    try {
        // #ifdef MP-WEIXIN
        const {code}: any = await uni.login({
            provider: 'weixin'
        })
        await apiBindwx({code})
        // #endif
        // #ifdef H5
        wechatOa.getUrl()
        // #endif
    } catch (error) {
        console.log('绑定授权报错', error)
    }
}

// 退出登录
const logoutHandle = () => {
	uni.showModal({
		content: '是否退出登录？',
		confirmColor: '#4173FF',
		success: ({ cancel }) => {
			if (cancel) return
			userStore.logout()
			uni.redirectTo({ url: '/pages/login/login' })
		}
	})
}

onShow(() => {
    getUser()
})

onLoad(async (options) => {
    // #ifdef H5
    const {code} = options

    if (code) {
        uni.showLoading({
            title: '请稍后...'
        })
        cache.set('code', code)
        //用于清空code
        try {
            await apiBindoa({code})
            uni.hideLoading();
            setTimeout(() => {
                history.go(-2)
                getUser();
            }, 1 * 500)
        } catch (error: any) {
            uni.hideLoading()
            setTimeout(() => {
                history.go(-2)
            }, 1 * 500)
            throw new Error(error)
        }
    }
    // #endif
})
onUnload(() => {
    cache.remove('code')
})
</script>

<style lang="scss" scoped>
.user-set {
    height: 100vh;
    .item {
        padding: 30rpx;
    }

    .btn-border {
        border-bottom: 2rpx solid #f8f8f8;
    }

    // 底部按钮
    .footer {
        left: 0;
        bottom: 0;
        width: 100%;
        position: fixed;
        padding: 20rpx 30rpx;
        background-color: #ffffff;
        box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);
        padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
    }
}
</style>
