<template>
    <view class="h-full payment-result">
        <view class="m-[24rpx] rounded-[14rpx] bg-white px-[24rpx] py-[20rpx]">
            <!-- Header -->
            <view class="text-center py-[60rpx]">
                <image
                    class="w-[100rpx] h-[100rpx]"
                    :src="resultStatus[payResult.pay_status].image"
                />
                <view class="text-[#101010] font-medium text-2xl">
                    {{ resultStatus[payResult.pay_status].text }}
                </view>
            </view>
            <!-- Main -->
            <view class="text-main text-base leading-[70rpx]">
                <view class="flex justify-between">
                    <text>订单编号</text>
                    <text>{{ payResult.sn }}</text>
                </view>
                <view class="flex justify-between">
                    <text>付款时间</text>
                    <text>{{ payResult.pay_time || '-' }}</text>
                </view>
                <view class="flex justify-between">
                    <text>支付方式</text>
                    <text>{{ payResult.pay_way_desc || '-' }}</text>
                </view>
                <view class="flex justify-between">
                    <text>支付金额</text>
                    <text>{{ payResult.total_amount }}</text>
                </view>
            </view>
        </view>

        <!-- Footer -->
        <view class="mx-[24rpx] pt-[40rpx]">
            <template v-if="payForm.from === PayFromType.DEPOSIT">
                <button class="text-white btn bg-primary" @click="goToDeposit">查看保证金</button>
            </template>

            <navigator url="/pages/index/index" hover-class="none" open-type="reLaunch">
                <button class="btn bg-white text-main mt-[30rpx]">返回首页</button>
            </navigator>
        </view>

        <!-- Component -->
        <page-status ref="pageRef"></page-status>
    </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { getPayResult } from '@/api/app'
import { PayFromType } from '@/enums/appEnums'
import { reactive, shallowRef, unref, nextTick, ref } from 'vue'
import GoodsAbnormalImage from '@/static/images/empty/order.png'
import IconWait from '@/static/images/icon/icon_wait.png'
import IconSuccess from '@/static/images/icon/icon_pay_success.png'
import { getToken } from '@/utils/auth'
import { apiUserDepositRechargeDetail } from '@/api/user'

const pageRef = shallowRef()
const payForm = reactive({
    from: '',
    order_id: '',
})
const payResult = reactive<any>({
    pay_status: 1, // 0-待支付  1-已支付
    total_amount: 0,
    pay_time: '-',
    pay_way_desc: '-',
    sn: '-',
})
const orderId = ref(0)

const resultStatus = [
    {
        text: '等待支付',
        image: IconWait,
    },
    {
        text: '支付成功',
        image: IconSuccess,
    },
]

// 初始化订单详情
const initDetail = async (params: object): Promise<void> => {
    const data = await getPayResult(params,getToken())

    Reflect.ownKeys(payResult).map((item: any) => {
        payResult[item] = data[item]
    })
}

const goToDeposit = () => {
    uni.navigateTo({
        url: '/bundle/pages/deposit/index',
    })
}

onLoad(async ({ param }: any) => {
    console.log('paramm', param)

    await nextTick()
    try {
        param = JSON.parse(param)
        if (!param['from'] && !param['order_id']) {
            throw new Error('参数有误')
        }
        payForm['from'] = param['from']
        payForm['order_id'] = param['order_id']
		orderId.value = param['order_id']
        await initDetail(payForm)
		if (param['from'] === PayFromType.DEPOSIT) {
			const res = await apiUserDepositRechargeDetail({id:param['order_id']})
			orderId.value = res.order_id
		}
    } catch (error) {
        unref(pageRef).show({
            text: error,
            src: GoodsAbnormalImage,
        })
        console.log('初始化支付页面', error)
    }
})
</script>

<style lang="scss" scoped>
page {
    height: 100%;
}

.btn {
    width: 100%;
    height: 84rpx;
    line-height: 84rpx;
    border-radius: 60px;
}
</style>
