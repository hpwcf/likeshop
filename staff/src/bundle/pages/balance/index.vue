<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="order_detail">
        <!-- Main Start -->
    	
    	<view class="top u-flex justify-between">
    		<view>
    			<price :price="userInfo.staff_earnings" priceFontSize="60rpx" priceIconFontSize="26rpx" priceColor="#ffffff"></price>
    			<view class="text-sm text-white">当前佣金（元）</view>
    		</view>
    		<view class="withdraw" @click="goPage('/bundle/pages/withdraw/index?source_type='+WithdrawSourceType.EARNINGS)">提现</view>
    	</view>
    	
    	<view class="info">
			<view class="u-flex justify-between mb-[30rpx]">
				<view class="font-bold text-2xl">账户流水</view>
				<view class="text-sm text-muted" @click="goPage('/bundle/pages/withdraw_record/index?source_type='+WithdrawSourceType.EARNINGS)">
					<text class="font-bold mr-[6rpx]">提现记录</text>
					<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
				</view>
			</view>
			<z-paging
			    auto-show-back-to-top
			    ref="paging"
			    v-model="accountLog"
			    @query="queryList"
			    :fixed="false"
			    height="100%"
			>
				<view class="card u-flex justify-between" v-for="item in accountLog" :key="item.id">
					<view>
						<view class="font-bold mr-[6rpx] truncate">{{ item.change_type_desc }}</view>
						<view class="text-sm text-muted mt-[10rpx]">{{ item.create_time }}</view>
					</view>
					<view v-if="item.action === 1" class="text-[#fa3534] font-bold">-{{ item.change_amount }}</view>
					<view v-else class="text-primary font-bold">+{{ item.change_amount }}</view>
				</view>
			</z-paging>
    	</view>
        
        <!-- Main End -->
    </view>
</template>

<script lang="ts" setup>
import { ref, computed, shallowRef, nextTick } from 'vue'
import Price from '@/components/price/index.vue'
import { useUserStore } from '@/stores/user'
import { apiAccountLogLists } from '@/api/wallet'
import { AccountLogChangeObject,WithdrawSourceType } from '@/enums/appEnums'
import { onShow } from '@dcloudio/uni-app'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo) as any
const accountLog = ref<Array<any>>([])
const paging = shallowRef<any>(null)

//获取佣金明细
const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists } = await apiAccountLogLists({
            change_object: AccountLogChangeObject.EARNINGS,
            page_no,
            page_size
        })
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}
//页面跳转
const goPage = (url: string) => {
    uni.navigateTo({ url: url })
}

onShow(async() => {
    await nextTick()
	paging.value.reload()
})
</script>

<style lang="scss">
.order_detail {
    height: 100%;
	background-color: #edf1f3;
	.top {
		background-color:var(--color-primary, #FFC244);
		padding: 40rpx 50rpx 80rpx;
		
		.withdraw {
			padding: 12rpx 24rpx;
			background-color: #ffffff;
			color: var(--color-primary, #FFC244);
			border-radius: 10rpx;
		}
	}
	.info {
		height: calc(100vh - 210rpx);
		overflow-y: auto;
		background-color: #edf1f3;
		border-radius: 30rpx 30rpx 0 0;
        padding: 30rpx 24rpx;
		margin-top: -30rpx;
	}

    .card {
        padding: 30rpx 24rpx;
        margin-bottom: 20rpx;
        background-color: #fff;
        border-radius: 20rpx;
    }
}
</style>
