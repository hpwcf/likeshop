<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar
            :front-color="$theme.navColor"
            :background-color="$theme.navBgColor"
        />
        <!-- #endif -->
    </page-meta>
    <view class="user-wallet flex flex-col min-h-0 h-full">
        <view class="user-wallet-view flex flex-col min-h-0 h-full">
			<!-- #ifndef H5 -->
            <!-- <u-sticky h5-nav-height="0" bg-color="transparent">
                <u-navbar
                    :is-back="true"
                    :is-fixed="false"
                    title="我的钱包"
                    :immersive="false"
                    :border-bottom="false"
                    :title-bold="false"
                    :background="{ background: $theme.primaryColor }"
                    title-color="#000"
                    back-icon-color="#000"
                >
                </u-navbar>
            </u-sticky> -->
			<u-sticky h5-nav-height="0" bg-color="transparent">
				<u-navbar
					:is-back="true"
					:is-fixed="true"
					:title="'我的钱包'"
					:border-bottom="false"
					:title-bold="false"
					:background="{ background: $theme.primaryColor }"
					:title-color="'#000'"
				>
				</u-navbar>
			</u-sticky>
			<!-- #endif -->

			<view class="wrapper-bg">
				<view class="wrapper backdrop-blur-sm">
				    <view class="flex items-center">
				        <u-image
				            :src="userStore.userInfo.avatar"
				            width="60"
				            height="60"
				            border-radius="50%"
				        ></u-image>
				        <view class="text-base text-white ml-2">
				            {{ userStore.userInfo.nickname }}
				        </view>
				    </view>
				    <view
				        class="flex justify-between"
				        style="margin-top: 32rpx"
				    >
				        <view>
							<price
							    :price="walletData.total_money"
								priceColor="#ffffff"
								priceFontSize="60rpx"
								priceIconFontSize="40rpx"
							></price>
				            <view class="text-base text-white font-medium mt-[10rpx]">
				                当前余额(元)
				            </view>
				        </view>
				        <view
				            class="text-primary text-center text-xs bg-white inline"
				            style="height: 72rpx; margin-top: 30px; padding: 18rpx 28rpx; border-radius: 30px 0 0 30px;"
				            @click="router.navigateTo('/bundle/pages/account_detail/account_detail')"
				        >
				            <text>余额明细</text>
				            <u-icon name="arrow-right" size="24"></u-icon>
				        </view>
				    </view>
				</view>
			</view>

            <view class="flex-1 m-[30rpx]">
                <view class="title-bar text-lg font-medium">
                    <text class="ml-3">余额充值</text>
                </view>

                <!-- <view class="grid grid-cols-3 gap-y-2 gap-x-2 mt-4">
                    <view
                        v-for="(item, index) in template"
                        :key="item"
                        style="transition: all 0.5s linear"
                        class="py-[24rpx] text-center rounded-[20rpx]"
                        :class="{
                            'bg-primary text-white': currentIndex == index,
                            'bg-primary-light-9 text-primary': currentIndex != index
                        }"
                        @tap="currentIndex = index"
                    >
                        <price
                            :content="item"
                            main-size="48rpx"
                            minor-size="28rpx"
                            font-weight="900"
                            color="inherit"
                        ></price>
                    </view>
                </view> -->

                <view
                    style="transition: all 0.5s linear"
                    class="flex items-center rounded-[20rpx] mt-4 px-[30rpx] py-[20rpx] bg-white text-primary"
                >
                    <view class="text-[40rpx] font-bold">¥</view>
                    <input
                        type="digit"
                        v-model="inputMoney"
                        placeholder="请输入自定义金额"
                        class="text-2xl font-medium pl-3"
                        @focus="currentIndex = -1"
                    >
                </view>

                <view class="mt-4 text-muted text-xs font-medium leading-6">
                    <view>充值说明:</view>
                    <view>1.本次充值仅限于在平台上消费，无法跨地区使用。</view>
                    <view>2.若遇到充值未到账，请联系客服</view>
                </view>
            </view>

            <view
                class="footer bg-white px-[30rpx] pt-[30rpx] pb-[40rpx]"
                style="box-shadow: 0 -4px 48px 0 #141a231f;"
            >
                <u-button
                    type="primary"
					style="border-radius: 16rpx !important;"
                    @click="handleRecharge"
                >
                    <text class="text-base font-medium ml-1">充值</text>
                </u-button>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {onShow, onLoad} from '@dcloudio/uni-app'
import {apiRecharge, apiUserWallet} from '@/api/wallet'
import {useUserStore} from "@/stores/user"
import {useRouter} from "uniapp-router-next"
import Price from '@/components/price/index.vue'

const router = useRouter()
const userStore = useUserStore()

const walletData = ref<any>({
    user_money: 0, // 可用余额
    user_earnings: 0, // 可提现余额
    total_money: 0, // 总资产
})
const inputMoney = ref('')
const currentIndex = ref(0)

const getWalletData = async () => {
    walletData.value = await apiUserWallet({})
}

const handleRecharge = async () => {
    const res = await apiRecharge({
        money: inputMoney.value,
        template_id: ''
    })
    router.navigateTo({
        path: '/bundle/pages/order_pay/order_pay',
        query: {
            from: res.from,
            order_id: res.order_id,
            order_amount: inputMoney.value
        }
    })
}

onShow(() => {
    getWalletData()
})
</script>

<style lang="scss" scoped>
.user-wallet {
    position: relative;
	height: 100vh;

    .user-wallet-view {
        position: relative;
        z-index: 10;
    }

	.wrapper-bg {
		position: relative;
	}
	.wrapper-bg::after {
	    content: '';
	    position: absolute;
	    top: -450rpx;
	    left: 50%;
	    transform: translateX(-50%);
	    width: 1400rpx;
	    height: 800rpx;
	    z-index: 1;
	    border-radius: 50%;
	    background-color: var(--color-primary, #FFC244);
	}
    .wrapper {
		position: relative;
		z-index: 10;
		height: 316rpx;
		margin: 60rpx 30rpx 0;
		padding: 32rpx 0 52rpx 32rpx;
		flex-shrink: 0;
		border-radius: 32rpx;
		border: 2rpx solid #ffffffcc;
		background: #ffffff4d;
		box-shadow: 0 6rpx 72rpx 0 #10653333;
		backdrop-filter: blur(48rpx);
    }

    .title-bar {
        position: relative;

        &::before {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);

            width: 8rpx;
            height: 70%;
            border-radius: 8rpx;
            @apply bg-primary;
        }
    }
}
</style>
