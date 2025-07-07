<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
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
            <template v-if="payForm.from === PayFromType.ORDER">
                <button class="text-white btn bg-primary" @click="switchTab('/pages/order/index')">查看订单</button>
            </template>
            <template v-if="payForm.from === PayFromType.DIFFERENCE || payForm.from === PayFromType.ADDITIONAL">
                <button class="text-white btn bg-primary" @click="navigateTo(`/pages/order_detail/index?id=${orderId}`)">返回订单</button>
            </template>

            <!-- <template v-if="payForm.from === PayFromType.USERRECHARGE">
                <button class="text-white btn bg-primary" @click="goToRecharge">继续充值</button>
            </template> -->

            <template>
                <button class="btn bg-white text-main mt-[30rpx]" @click="switchTab('/pages/index/index')">返回首页</button>
            </template>
        </view>

        <!-- Component -->
        <page-status ref="pageRef"></page-status>
    </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { getPayResult,apiSubscribe } from '@/api/app'
import { PayFromType } from '@/enums/appEnums'
import { reactive, shallowRef, unref, nextTick, ref } from 'vue'
import GoodsAbnormalImage from '@/static/images/empty/order.png'
import IconWait from '@/static/images/icon/icon_wait.png'
import IconSuccess from '@/static/images/icon/icon_pay_success.png'
import { getToken } from '@/utils/auth'
import { apiOrderDifferencePriceDetail,apiOrderAdditionalDetail } from '@/api/order'

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

const switchTab = async (url:string) => {
	// #ifdef MP-WEIXIN
	await getAuthMsg()
	//#endif
    uni.switchTab({
        url: url,
    })
}

const navigateTo = async (url:string) => {
	// #ifdef MP-WEIXIN
	await getAuthMsg()
	//#endif
	uni.navigateTo({
	    url: url
	})
}

//获取用户消息授权
const getAuthMsg = () => {
    return new Promise((resolve, reject) => {
        apiSubscribe({'scene':'after_pay'})
            .then((res) => {
				console.log('授权列表',res)
                if (!res.length) resolve('暂无可订阅信息')
                uni.requestSubscribeMessage({
                    tmplIds: res,
                    success(ress) {
                        console.log('res', ress)
                    },
                    fail(res) {
                        console.log(res.errMsg)
                    },

                    complete() {
                        resolve(res)
                    }
                })
            })
            .catch((error) => reject(error))
    })
}

// const goToRecharge = () => {
//     uni.redirectTo({
//         url: '/packageA/pages/user_charge/user_charge'
//     })
// }

onLoad(async ({ param }: any) => {
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
		//支付未完成 增加定时器定时器 等待两秒重新查询订单
		if (payResult.pay_status == 0) {
			uni.showLoading({
				title: '加载中'
			});
			const initDetailTimer = setTimeout(async () => {
				uni.hideLoading();
				clearTimeout(initDetailTimer)
				
				await initDetail(payForm)
				if (param['from'] === PayFromType.DIFFERENCE) {
					const res = await apiOrderDifferencePriceDetail({id:param['order_id']})
					orderId.value = res.order_id
				}
				if (param['from'] === PayFromType.ADDITIONAL) {
					const res = await apiOrderAdditionalDetail({id:param['order_id']})
					orderId.value = res.order_id
				}
			}, 2000)
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
