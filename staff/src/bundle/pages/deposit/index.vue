<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="order_detail">
        <!-- Main Start -->
    	
    	<view class="top text-center">
    		<price :price="userInfo.staff_deposit" priceFontSize="60rpx" priceIconFontSize="26rpx" priceColor="#ffffff"></price>
    		<view class="text-sm text-[#ffffffd1]">当前保证金（元）</view>
    	</view>
    	
    	<view class="info">
			<view class="u-flex justify-between mb-[30rpx]">
				<view class="font-bold text-2xl">保证金套餐</view>
				<view class="text-sm text-muted" @click="goPage('/bundle/pages/account_detail/index?change_object='+AccountLogChangeObject.DEPOSIT)">
					<text class="font-bold mr-[6rpx]">账户流水</text>
					<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
				</view>
			</view>
			<view class="flex flex-wrap">
				<view v-for="item in setmealLists" :key="item.id" :class="{'card':true,'card-selected':selectedValue == item.id}" @click="changeSelect(item.id)">
					<view>
						<price :price="item.amount" priceFontSize="42rpx" priceIconFontSize="24rpx" priceColor="#000000"></price>
					</view>
					<view class="mt-[14rpx] mb-[26rpx]">{{ item.name }}</view>
					<view class="text-[20rpx] text-muted u-flex justify-center">
						<text>日限</text>
						<text class="ml-[10rpx] mr-[10rpx] text-[22rpx]" :style="{'color':$theme.primaryColor}">{{ item.order_num }}</text>
						<text>单</text>
					</view>
				</view>
			</view>
    	</view>

		<view class="footer">
			<button class="bg-primary text-lg text-white" @click="handlePayment">
				缴纳保证金
			</button>
			<!-- <u-button type="primary" size="medium" @click="handlePayment">缴纳保证金</u-button> -->
			<view class="text-center mt-[20rpx] mb-[20rpx]" :style="{'color':$theme.primaryColor}" @click="goPage('/bundle/pages/withdraw/index?source_type='+WithdrawSourceType.DEPOSIT)">提现</view>
		</view>
    </view>
</template>

<script lang="ts" setup>
import { ref,computed } from 'vue'
import Price from '@/components/price/index.vue'
import { useUserStore } from '@/stores/user'
import { AccountLogChangeObject,WithdrawSourceType } from '@/enums/appEnums'
import { apiUserDepositLists } from '@/api/user'
import { onLoad } from '@dcloudio/uni-app'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo) as any
const selectedValue = ref(0)
const setmealLists = ref<any>([])

// 初始化数据
const initData = async() => {
    setmealLists.value = await apiUserDepositLists()
}

//选择套餐
const changeSelect = (id:number) => {
	selectedValue.value = id
}

// 支付
const handlePayment = () => {
	const setmeal = setmealLists.value.filter(item => item.id === selectedValue.value)
    uni.navigateTo({
        url: `/bundle/pages/deposit_pay/index?order_amount=${setmeal[0]?.amount || ''}`
    })
}

//页面跳转
const goPage = (url: string) => {
    uni.navigateTo({ url: url })
}

onLoad((options) => {
	if(options.isPay) {
		uni.$u.toast('支付成功')
	}
    initData()
})
</script>

<style lang="scss">
.order_detail {
    height: 100%;
	background-color: #edf1f3;
	.top {
		background-color: var(--color-primary, #FFC244);
		padding: 50rpx 50rpx 90rpx;
		
		.withdraw {
			padding: 12rpx 24rpx;
			background-color: #ffffff;
			color: var(--color-primary, #FFC244);
			border-radius: 10rpx;
		}
	}
	.info {
		height: calc(100vh - 230rpx);
		overflow-y: auto;
		background-color: #edf1f3;
		border-radius: 30rpx 30rpx 0 0;
        padding: 30rpx 24rpx 210rpx;
		margin-top: -30rpx;
	}

    .card {
        padding: 30rpx 24rpx;
        margin: 0 14rpx 20rpx 0;
        background-color: #fff;
        border-radius: 14rpx;
		width: 220rpx;
		text-align: center;
    }
    .card:nth-child(3n) {
        margin-right: 0;
    }
	.card-selected {
		border: 1px solid var(--color-primary, #FFC244);
	}
}

// 底部按钮
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 200rpx;
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
