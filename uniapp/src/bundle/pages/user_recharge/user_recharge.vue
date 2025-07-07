<template>
    <view class="user-recharge">
        <view class="wrapper">
            <view class="balance">充值金额</view>
            <view class="flex items-center balance-recharge-input">
                <text style="font-size: 46rpx">¥</text>
                <input class="input" placeholder="0.00" type="digit" v-model="rechargeData.money" />
            </view>
            <view class="balance-recharge-tips mt-[20rpx]">
                <view>当前可用余额为 ¥ {{ walletData.user_money }}</view>
            </view>
        </view>

        <view class="px-[30rpx]">
            <button class="bg-primary text-lg text-white rounded-full" @click="handleRecharge()">
                立即充值
            </button>

            <navigator
                class="record"
                hover-class="none"
                url="/bundle/pages/recharge_record/recharge_record"
            >
                充值记录
            </navigator>
        </view>
    </view>

    <!-- 充值成功组件 -->
    <u-popup v-model="rechargeSuccess" :closeable="true" mode="center" border-radius="14">
        <view class="bg-white recharge-success-card" style="width: 70vw">
            <view class="recharge-success">
                <image src="@/static/images/recharge_uccess.png" />
                <view class="recharge-success-text"> 充值成功 </view>
            </view>

            <view class="p-[40rpx]">
				<button class="bg-primary text-lg text-white" @click="changeRechargeComplete">
					完成
				</button>
                <!-- <u-button
                    @click="changeRechargeComplete"
                    type="primary"
                    :ripple="true"
                    :hair-line="false"
                    shape="circle"
                >
                    完成
                </u-button> -->
            </view>
        </view>
    </u-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onShow, onUnload, onLoad } from '@dcloudio/uni-app'
import { apiRecharge, apiUserWallet } from '@/api/wallet'
import { PaymentStatusEnum } from '@/utils/enum'

const rechargeAmountLists = ref<Array<any>>([])

const walletData = ref({
    user_money: '' // 可用余额
})

const rechargeData = ref({
    money: '', // 充值金额
    template_id: '', // 充值模板id
    pay_way: 1 // 支付方式
})

// 充值弹窗
const rechargeSuccess = ref<boolean | null>(false)

// 获取钱包数据
const getWalletData = () => {
    apiUserWallet('').then((res: any) => {
        walletData.value.user_money = res.user_money
    })
}

// 获取充值模板
// const getRechargeAmountLists = () => {
//     apiRechargeTemplateLists('').then((res: any) => {
//         rechargeAmountLists.value = res
//     })
// }

// 充值
const handleRecharge = (id = '') => {
    // await apiRecharge({ ...rechargeData.value }).then(() => {
    //     rechargeSuccess.value = true
    // })
    delete rechargeData.value.template_id

    if (id !== '') {
        rechargeData.value.template_id = id
        delete rechargeData.value.money
    }

    apiRecharge({ ...rechargeData.value }).then((res: any) => {
        rechargeData.value.template_id = ''
        const params = {
            from: res.from,
            order_id: res.order_id
        }
        // 支付方式hooks
        try {
            // 支付方式hooks
            uni.navigateTo({
                url: `/bundle/pages/order_pay/order_pay?order_id=${params.order_id}&from=${params.from}&order_amount=${rechargeData.value.money}`
            })
        } catch (err) {
            console.log('下单', err)
        }
    })
}

// const changeRechargeValue = (index: any) => {
//     rechargeData.value.money = rechargeAmountLists.value[index].money
// }

const changeRechargeComplete = () => {
    rechargeSuccess.value = false
}

// 跳转页面
const goPage = (url: any) => {
    uni.navigateTo({ url: url })
}

onLoad(async (options) => {
    // 监听全局duringPayment事件
    uni.$on('duringPayment', (params) => {
        if (params.result === PaymentStatusEnum['SUCCESS']) {
            // uni.navigateBack()
            // setTimeout(() => toast('支付成功'), 0.5 * 1000)
        }
    })
    uni.$emit('send')

    if (options.rechargeSuccess == 1) {
        rechargeSuccess.value = true
    }
})

onUnload(() => {
    uni.$off(['duringPayment', 'send'])
})

onShow(() => {
    getWalletData()
    // getRechargeAmountLists()
})
</script>

<style lang="scss" scoped>
.user-recharge {
    .wrapper {
        margin: 20rpx 30rpx;
        padding: 40rpx;
        width: 690rpx;
        height: 330rpx;
        border-radius: 20rpx;
        background: #fff;
        .balance {
            font-weight: 500;
            font-size: 30rpx;
            line-height: 36rpx;
            color: #666;
            margin-bottom: 38rpx;
        }
        .balance-recharge-input {
            margin-top: 35rpx;
            margin-right: 66rpx;

            .input {
                height: 94rpx;
                text-align: left;
                font-size: 66rpx;
                margin-left: 30rpx;
                position: relative;
                z-index: 2;
            }

            border-bottom: 1rpx solid #ebebeb;
        }
        .balance-recharge-tips {
            font-size: 24rpx;
            color: #999;
        }
    }
    .btn {
        background: $u-type-primary;
    }
    .record {
        margin-top: 24rpx;
        font-size: 28rpx;
        text-align: center;
        color: #666;
    }
}
</style>
