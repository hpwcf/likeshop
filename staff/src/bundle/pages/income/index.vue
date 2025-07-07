<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="container">
        <view class="main">
            <z-paging
                ref="paging"
                v-model="incomeData"
                @query="upCallback"
                :fixed="false"
                height="100%"
            >
				<view>
					<view class="text-sm u-flex justify-between mb-[30rpx]">
						<view class="u-flex" @click="calendarShow = true">
							<text class="mr-[10rpx]" :key="startDate">{{ startDate }} - {{ endDate }}</text>
							<u-icon name="arrow-down" color="#909399"></u-icon>
						</view>
						<view class="u-flex">
							<text class="text-muted">总结算金额：</text>
							<text :style="{'color':$theme.primaryColor}">{{ totalSettlementAmount }}元</text>
						</view>
					</view>
					<view v-if="userStore.isLogin">
						<view class="lists-item" v-for="item in incomeData" :key="item.id" @click="goPage('/pages/order_detail/index?id='+item.id)">
							<view class="u-flex justify-between mb-[30rpx]">
								<view>订单编号：{{ item.sn }}</view>
								<view class="font-bold">{{ item.settlement_status_desc }}</view>
							</view>
							<view class="u-flex goods">
							    <u-image :src="item.order_goods[0].goods_image" width="130" height="130" border-radius="14rpx"></u-image>
							    <view class="ml-[20rpx] w-[460rpx]">
									<view class="truncate">{{ item.order_goods[0].goods_name }}</view>
									<view class="u-flex flex-wrap items-center">
										<view class="tag" v-for="(item2,index2) in item.order_goods[0].goods_sku_arr" :key="index2">{{ item2 }}</view>
									</view>
							    </view>
							</view>
							<view class="mt-[30rpx] mb-[30rpx]">
								<text class="font-bold">服务完成时间：</text>
								<text>{{ item.finish_time || '-' }}</text>
							</view>
							<u-line color="#f4f4f5" />
							<view v-if="item.settlement_status === 1" class="u-flex justify-between pt-[30rpx] pb-[10rpx]">
								<view>
									<view class="text-muted text-sm">总金额：</view>
									<view><price :price="item.order_amount" priceColor="#000000" /></view>
								</view>
								<view>
									<view class="text-muted text-sm">结算佣金：</view>
									<view><price :price="item.settlement_amount" /></view>
								</view>
							</view>
							<view v-else class="flex justify-end pt-[30rpx] pb-[10rpx]" style="align-items: baseline;">
								<view class="text-muted text-sm">总金额：</view>
								<price :price="item.order_amount" priceColor="#000000" />
							</view>
						</view>
					</view>
					<view v-else>
						<Empty />
					</view>
				</view>
            </z-paging>
        </view>
		<u-calendar v-model="calendarShow" mode="range" @change="calendarChange"></u-calendar>
    </view>
</template>

<script setup lang="ts">
import { ref,shallowRef } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import Empty from '@/components/empty/index.vue'
import Price from '@/components/price/index.vue'
import { apiUserIncomeLists } from '@/api/user'

const userStore = useUserStore()
const paging = shallowRef()
const calendarShow = ref(false)
const startDate = ref('')
const endDate = ref('')
const incomeData = ref<any>([])
const totalSettlementAmount = ref(0)

//选择日期
const calendarChange = (e:any) => {
	startDate.value = e.startDate
	endDate.value = e.endDate
}
const upCallback = async (): Promise<void> => {
    try {
        const data = await apiUserIncomeLists({
            start_time: startDate.value,
            end_time: endDate.value
        })
		startDate.value = data.extend.startTime
		endDate.value = data.extend.endTime
		totalSettlementAmount.value = data.extend.total_settlement_amount

        paging.value.complete(data.lists)
    } catch (err) {
        console.log(err)
        // refreshRef.value.endErr()
        paging.value.complete(false)
    }
}
//页面跳转
const goPage = (url: string) => {
    uni.navigateTo({ url: url })
}
</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
	display: flex;
	background-color: #edf1f3;

    .main {
    	flex: 1;
    	min-height: 0;
    	overflow: scroll;
		padding: 30rpx 24rpx;
		
		.lists-item {
			padding: 30rpx 24rpx;
			margin-bottom: 20rpx;
			background-color: #ffffff;
			border-radius: 20rpx;
			
			.goods {
				padding: 20rpx;
				border-radius: 20rpx;
				background-color: #f7f7f7;
				
				.tag {
					color: #909399;
					font-size: 20rpx;
					padding: 4rpx 10rpx;
					background-color: #ffffff;
					border-radius: 4rpx;
					display: inline-block;
					margin-right: 10rpx;
					margin-top: 10rpx;
				}
				.tag:last-child {
					margin-right: 0;
				}
			}
		}
	}
}
</style>
