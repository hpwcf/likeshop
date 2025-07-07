<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="withdraw">

        <view class="amount mb-[40rpx]">
			<view class="font-bold text-2xl">提现金额</view>
			<view class="input u-flex mt-[20rpx] mb-[20rpx]">
				<text class="font-bold text-[36rpx]">￥</text>
				<u-input class="w-full ml-[10rpx]" v-model="formData.money" :clearable="false" placeholder="输入提现金额" />
			</view>
			<view class="u-flex justify-between">
				<view class="text-sm text-muted">可提现余额：{{ ableAmount }}</view>
				<view class="text-sm" :style="{'color':$theme.primaryColor}" @click="allWithdraw">全部提现</view>
			</view>
        </view>

		<view>
			<view class="font-bold text-2xl">选择提现账户</view>
			<u-radio-group v-model="formData.way" :active-color="$theme.primaryColor">
				<view v-for="item in withdrawConfig.type" :key="item.way" class="u-flex justify-between account w-full" @click="changeAccount(item.way)">
					<view class="u-flex">
						<view>
							<u-image width="50rpx" height="50rpx" :src="item.image"></u-image>
						</view>
						<view class="ml-[20rpx]">
							<view class="font-bold text-1xl">提现至{{ item.withdraw_way_name }}</view>
							<view class="text-sm text-[#909399] u-flex mt-[10rpx] text-[24rpx]" @click="goPage('/bundle/pages/withdraw_bind_account/index?type='+item.way)">
								<text>{{ item.name?.length ? item.name + ' ' + item.account : '请设置提现账户' }}</text>
								<u-icon name="arrow-right" color="#909399" size="22rpx"></u-icon>
							</view>
						</view>
					</view>
					<view>
						<u-radio :name="item.way"></u-radio>
					</view>
				</view>
			</u-radio-group>
		</view>

		<view class="footer">
			<button class="bg-primary text-lg text-white" @click="handleWithdraw">
				提交
			</button>
			<!-- <u-button type="primary" size="medium" @click="handleWithdraw">提交</u-button> -->
		</view>
    </view>
</template>

<script lang="ts" setup>
import { ref,computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { apiGetWithdrawConfig,apiWithdrawApply } from '@/api/wallet'
import { onLoad,onShow } from '@dcloudio/uni-app'
import { WithdrawSourceType,WithdrawWay } from '@/enums/appEnums'

interface FormDataObj {
	type: number | null
	way: number | null
	money: number | string
}
const formData = ref<FormDataObj>({
	type: WithdrawSourceType.DEPOSIT,
	way: WithdrawWay.WECHAT,
	money: ''
})
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo) as any
const withdrawConfig = ref<any>({})
const ableAmount = ref('')

//全部提现
const allWithdraw = () => {
	formData.value.money = ableAmount.value
}

// 获取提现配置
const getWithdrawConfig = async () => {
    withdrawConfig.value = await apiGetWithdrawConfig({})
}

//选择提现方式
const changeAccount = (index:number) => {
	formData.value.way = index
}

// 提现
const handleWithdraw = async() => {
    if (!formData.value.money) return uni.$u.toast('请输入提现金额')
    if (parseInt(formData.value.money as string) > parseInt(ableAmount.value as string)) return uni.$u.toast('可提现余额不足')

	uni.showLoading({
		title: '提交中...'
	})
    await apiWithdrawApply(formData.value).then((res: any) => {
		uni.hideLoading()
        uni.$u.toast('操作成功')
        formData.value.money = ''
        setTimeout(() => {
			useUserStore().getUser()
            uni.navigateTo({
                url: `/bundle/pages/withdrawal_details/index?id=${res.id}`
            })
        }, 1000)
    })
}

// 跳转页面
const goPage = (url: any) => {
    uni.navigateTo({ url: url })
}

onLoad(async (options:any) => {
    formData.value.type = parseInt(options.source_type)
	ableAmount.value = userInfo.value.staff_deposit
	if (formData.value.type === WithdrawSourceType.EARNINGS) {
		ableAmount.value = userInfo.value.staff_earnings
	}
	await getWithdrawConfig()
})

onShow(() => {
    ableAmount.value = userInfo.value.staff_deposit
    if (formData.value.type === WithdrawSourceType.EARNINGS) {
    	ableAmount.value = userInfo.value.staff_earnings
    }
    getWithdrawConfig()
})
</script>

<style lang="scss" scoped>
.withdraw {
    padding: 20rpx 30rpx;

    .amount {
        background-color: #fff;
        border-radius: 20rpx;
        margin-top: 20rpx;
        padding: 30rpx 24rpx;
		
		.input {
			padding: 16rpx 20rpx;
			background-color: #f5f7f9;
			border-radius: 14rpx;
		}
	}
	.account {
		margin-top: 20rpx;
		padding: 30rpx 24rpx;
		background-color: #ffffff;
        border-radius: 20rpx;
	}

	::v-deep u-radio .u-radio__icon-wrap {
		width: 50rpx !important;
		height: 50rpx !important;
	}
}

// 底部按钮
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 108rpx;
    position: fixed;
	z-index: 11;
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);

    ::v-deep button {
		width: 100% !important;
	}
}
</style>
