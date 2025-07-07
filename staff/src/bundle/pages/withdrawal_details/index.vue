<template>
    <view class="content">
        <view class="card">
            <view class="text-center">
                <view class="text-[50rpx] font-bold mt-[20rpx] mb-[14rpx]">{{ withdrawDetail.money }}</view>
                <view>
					<view class="text-[#666]" v-if="withdrawDetail.status == 1">{{ withdrawDetail.status_desc }}</view>
					<view class="text-[#2189ff]" v-if="withdrawDetail.status == 2">{{ withdrawDetail.status_desc }}</view>
					<view class="text-[#0cc267]" v-if="withdrawDetail.status == 3">{{ withdrawDetail.status_desc }}</view>
					<view class="text-[#ff2c3c]" v-if="withdrawDetail.status == 4">{{ withdrawDetail.status_desc }}</view>
				</view>
            </view>

            <view class="mt-[50rpx]">
				<view class="flex justify-between mb-[30rpx]">
				    <view class="text-muted">提现账户</view>
				    <view>{{ withdrawDetail.type_desc }}</view>
				</view>
				<view v-if="withdrawDetail.type === 1">
					<view class="flex justify-between mb-[30rpx]">
					    <view class="text-muted">微信姓名</view>
					    <view>{{ withdrawDetail.real_name }}</view>
					</view>
					<view class="flex justify-between mb-[30rpx]">
					    <view class="text-muted">微信手机号</view>
					    <view>{{ withdrawDetail.account }}</view>
					</view>
				</view>
				<view v-else-if="withdrawDetail.type === 2">
					<view class="flex justify-between mb-[30rpx]">
					    <view class="text-muted">支付宝姓名</view>
					    <view>{{ withdrawDetail.real_name }}</view>
					</view>
					<view class="flex justify-between mb-[30rpx]">
					    <view class="text-muted">支付宝账号</view>
					    <view>{{ withdrawDetail.account }}</view>
					</view>
				</view>
				<view v-else>
					<view class="flex justify-between mb-[30rpx]">
					    <view class="text-muted">开户人</view>
					    <view>{{ withdrawDetail.real_name }}</view>
					</view>
					<view class="flex justify-between mb-[30rpx]">
					    <view class="text-muted">开户行</view>
					    <view>{{ withdrawDetail.opening_bank }}</view>
					</view>
					<view class="flex justify-between mb-[30rpx]">
					    <view class="text-muted">银行卡号</view>
					    <view>{{ withdrawDetail.bank }}</view>
					</view>
				</view>
                
                <view class="flex justify-between mb-[30rpx]">
                    <view class="text-muted">提现时间</view>
                    <view>{{ withdrawDetail.create_time }}</view>
                </view>
                <view class="flex justify-between mb-[30rpx]" v-if="withdrawDetail.source_type != 1">
                    <view class="text-muted">服务费</view>
                    <view>{{ withdrawDetail.service_ratio }}</view>
                </view>
                <view class="flex justify-between mb-[30rpx]">
                    <view class="text-muted">实际到账</view>
                    <view>{{ withdrawDetail.left_money }}</view>
                </view>
            </view>
        </view>
		<view class="card mt-[30rpx]" v-if="withdrawDetail.status !== 1">
		    <view class="flex justify-between">
		        <view class="text-muted">审核时间</view>
		        <view>{{ withdrawDetail.verify_time }}</view>
		    </view>
		    <view class="flex justify-between mt-[30rpx]" v-if="withdrawDetail.transfer_voucher">
		        <view class="text-muted ">转账凭证</view>
		        <u-image
		            height="160"
		            width="160"
		            :src="withdrawDetail.transfer_voucher"
		            @click="showImage([withdrawDetail.transfer_voucher])"
		        >
		        </u-image>
		    </view>
		    <view class="flex justify-between mt-[30rpx]" v-if="withdrawDetail.verify_status === 2">
		        <view class="text-muted">拒绝原因</view>
		        <view class="w-[500rpx]" style="text-align: justify;">
					<text style="float: right;">{{ withdrawDetail.verify_remarks }}</text>
				</view>
		    </view>
		    <view class="flex justify-between mt-[30rpx]" v-if="withdrawDetail.transfer_status === 2">
		        <view class="text-muted">失败原因</view>
		        <view class="w-[500rpx]" style="text-align: justify;">
					<text style="float: right;">{{ withdrawDetail.transfer_remark }}</text>
				</view>
		    </view>
		</view>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiWithdrawDetail } from '@/api/wallet'

const withdrawId = ref<number | string>('')
const withdrawDetail = ref<any>({})

// 获取提现申请详情
const getWithdrawDetail = async() => {
    withdrawDetail.value = await apiWithdrawDetail({ id: withdrawId.value })
}

const showImage = (list: any) => {
    uni.previewImage({
        urls: list,
        current: 1
    })
}

onLoad((options) => {
    withdrawId.value = options?.id || ''
    getWithdrawDetail()
})
</script>

<style lang="scss" scoped>
.content {
    padding: 20rpx;

	.card {
		padding: 30rpx 24rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
	}
}
</style>
