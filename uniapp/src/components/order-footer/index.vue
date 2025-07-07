<template>
    <view class="flex">
        <!-- 取消订单 -->
        <template v-if="orderBtn.cancel_btn">
            <button
                class="bg-white ml-[20rpx] h-[60rpx] leading-[60rpx] text-base"
				style="border: solid 1rpx #c8c9cc;"
                @click.stop="handleOrderCancel(orderId)"
            >
                取消订单
            </button>
        </template>

        <!-- 去支付 -->
        <template v-if="orderBtn.pay_btn">
            <button
                class="bg-warning ml-[20rpx] h-[60rpx] leading-[60rpx] text-base text-white"
                @click.stop="handlePayment"
            >
                立即支付
            </button>
        </template>
		
        <!-- 加项 -->
        <template v-if="orderBtn.additional_btn">
            <button
                class="bg-warning ml-[20rpx] h-[60rpx] leading-[60rpx] text-base text-white"
                @click.stop="clickAdditional"
            >
                加项
            </button>
			<u-popup
			    v-model="additionalShow"
			    :closeable="true"
			    mode="center"
			    :maskCloseAble="false"
			    border-radius="20"
				:zoom="false"
			>
			    <view class="px-[30rpx] py-[40rpx] bg-white" style="width: 85vw">
			        <view class="mb-[70rpx] text-xl text-center">加项</view>
					<view>
						<scroll-view scroll-y="true" style="height: 380rpx;">
							<view
								class="bg-[#edf1f3] u-flex justify-between mb-[20rpx]" 
								style="border-radius: 16rpx;padding: 30rpx 20rpx;"
								v-for="item in additionalLists"
								:key="item.id"
							>
								<view class="u-flex-1 w-[100rpx]">
									<view class="truncate">{{ item.name }}</view>
									<view class="text-sm mt-[6rpx]">
										<text :style="{'color':$theme.primaryColor}">￥{{ item.price }}</text><text>/{{ item.duration }}分钟</text>
									</view>
								</view>
								<view>
									<u-number-box v-model="item.num" :input-width="60" bg-color="#edf1f3" @change="additionalChange"></u-number-box>
								</view>
							</view>
						</scroll-view>
					</view>
					
					<view class="popup-footer">
						<view class="text-[24rpx] text-muted mt-[30rpx]">*支付前需与服务人员协商一致，如有异议，请联系平台客服。系统只保障在线支付的项目，切勿线下支付。</view>
						<u-line color="#f4f4f5" margin="30rpx 0" />
						<view class="u-flex justify-between">
							<view>
								<text class="text-muted">总计：</text>
								<text :style="{'color':$theme.primaryColor}">￥{{ additionalPrice }}</text>
							</view>
							<view>
								<button
								    class="bg-primary ml-[20rpx] h-[60rpx] leading-[60rpx] text-base text-white"
								    @click.stop="additionalPriceConfirm"
								>
								    立即支付
								</button>
							</view>
						</view>
					</view>
			    </view>
			</u-popup>
        </template>
		
        <!-- 补差价 -->
        <template v-if="orderBtn.difference_price_btn">
            <button
                class="bg-primary ml-[20rpx] h-[60rpx] leading-[60rpx] text-base text-white"
                @click.stop="differencePriceShow = true"
            >
                补差价
            </button>
			<u-popup
			    v-model="differencePriceShow"
			    :closeable="true"
			    mode="center"
			    :maskCloseAble="false"
			    border-radius="20"
				:zoom="false"
			>
			    <view class="px-[50rpx] py-[40rpx] bg-white" style="width: 85vw">
			        <view class="mb-[70rpx] text-xl text-center">补差价</view>
					<view style="position: relative;height: 90rpx;">
						<view style="position: absolute;left: 20rpx;top: 26rpx;z-index: 1;">补差价金额</view>
						<u-input
							class="bg-[#edf1f3]"
							style="padding: 10rpx 20rpx 10rpx 190rpx;border-radius: 12rpx;position: absolute;"
							v-model="differencePrice" 
							:clearable="false" 
							input-align="right" 
							placeholder="￥0.00"
							type="digit"
						/>
					</view>
					
					<view class="popup-footer">
						<view class="text-[24rpx] text-muted mt-[30rpx]">*支付前需与服务人员协商一致，如有异议，请联系平台客服。系统只保障在线支付的项目，切勿线下支付。</view>
						<u-line color="#f4f4f5" margin="30rpx 0" />
						<view class="u-flex justify-between">
							<view>
								<text class="text-muted">总计：</text>
								<text :style="{'color':$theme.primaryColor}">￥{{ differencePrice }}</text>
							</view>
							<view>
								<button
								    class="bg-primary ml-[20rpx] h-[60rpx] leading-[60rpx] text-base text-white"
								    @click.stop="differencePriceConfirm"
								>
								    立即支付
								</button>
							</view>
						</view>
					</view>
			    </view>
			</u-popup>
        </template>

        <!-- 去评价 -->
        <template v-if="orderBtn.comment_btn">
            <button
                class="bg-warning ml-[20rpx] h-[60rpx] leading-[60rpx] text-base text-white"
                @click.stop="goPage('/bundle/pages/evaluate_submit/index?order_goods_id='+orderGoodsId)"
            >
                去评价
            </button>
        </template>
		
		<!-- 查看评价 -->
		<template v-if="orderBtn.look_comment_btn">
		    <button
		        class="bg-warning ml-[20rpx] h-[60rpx] leading-[60rpx] text-base text-white"
		        @click.stop="goPage('/bundle/pages/evaluate_detail/index?order_goods_id='+orderGoodsId)"
		    >
		        查看评价
		    </button>
		</template>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { apiOrderCancel,apiOrderDifferencePrice,apiOrderAdditional } from '@/api/order'
import { apiGoodsAdditionalCommonLists } from '@/api/goods'
import { apiSubscribe } from '@/api/app'

const emit = defineEmits(['refresh', 'backRefresh'])

const props = withDefaults(
    defineProps<{
        orderId?: string | number | null // 订单ID
        orderGoodsId?: string | number | null // 订单服务ID
        goodsId?: string | number | null // 服务ID
        orderBtn?: any // 取消订单
    }>(),
    {
        orderId: '',
        orderGoodsId: '',
        goodsId: '',
        orderBtn: {},
    }
)
const differencePriceShow = ref(false)
const differencePrice = ref('')
const additionalShow = ref(false)
const additionalPrice = ref<string | number>('')
const additionalLists = ref<Array<any>>([])

//获取用户消息授权
const getAuthMsg = () => {
    return new Promise((resolve, reject) => {
        apiSubscribe({'scene':'cancel_order'})
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

// 页面跳转
const goPage = (url: string) => {
    uni.navigateTo({ url: url })
}

// 取消订单
const handleOrderCancel = async (id: number | string): Promise<void> => {
    const modelRes = await uni.showModal({
        title: '温馨提示',
        content: '确认取消该订单吗？'
    })
    if (modelRes.cancel) return
	
	// #ifdef MP-WEIXIN
	await getAuthMsg()
	//#endif

    try {
		uni.showLoading({
			title: '订单取消中'
		});
        await apiOrderCancel({ id: props.orderId })
		uni.hideLoading();
    } catch (error) {
        console.log('错误信息：', error, props.orderId)
    }
    emit('refresh')
}

// 支付
const handlePayment = () => {
    uni.navigateTo({
        url: `/bundle/pages/order_pay/order_pay?order_id=${props.orderId}&from=order`
    })
}

//补差价
const differencePriceConfirm = () => {
	if (!differencePrice.value) return uni.$u.toast('请输入差价金额')
	uni.showModal({
		title: '温馨提示',
		content: '是否确认支付？',
		success: async (res) => {
			if (res.confirm) {
				try {
				    const result = await apiOrderDifferencePrice({ id: props.orderId,difference_price: differencePrice.value })
					
					uni.navigateTo({
					    url: `/bundle/pages/order_pay/order_pay?order_id=${result.order_id}&from=${result.type}`
					})
					
				} catch (err) {
				    console.log('补差价', err)
				}
			}
		}
	});
}

//加项点击
const clickAdditional = async() => {
	if (additionalLists.value.length === 0) {
		await initData()
	}
	additionalShow.value = true
}
//加项提交
const additionalPriceConfirm = () => {
	if (!additionalPrice.value) return uni.$u.toast('请选择需要加的项目')
	uni.showModal({
		title: '温馨提示',
		content: '是否确认支付？',
		success: async (res) => {
			if (res.confirm) {
				try {
				    const result = await apiOrderAdditional({ id: props.orderId,additional_info: additionalLists.value })
					
					uni.navigateTo({
					    url: `/bundle/pages/order_pay/order_pay?order_id=${result.order_id}&from=${result.type}`
					})
					
				} catch (err) {
				    console.log('加项', err)
				}
			}
		}
	});
}
//选择加项
const additionalChange = (value,index) => {
	let price = 0
	additionalLists.value.forEach(function(item,index){
		price = price + (item.price * item.num)
	})
	additionalPrice.value = price.toFixed(2)
}

//初始化
const initData = async () => {
	const additionalResult = await apiGoodsAdditionalCommonLists({goods_id:props.goodsId})
	//处理附加项目列表格式
	additionalResult.forEach(function(item,index){
		item.num = 0
		additionalLists.value.push(item)
	})
}
</script>

<style lang="scss" scoped>
.Btn {
    border: 1px solid rgba(187, 187, 187, 1);
    background-color: rgba(255, 255, 255, 1);
    color: rgba(16, 16, 16, 1);
    text-align: center;
}
.popup-footer {
    position: relative;
    left: 0;
    bottom: 0;
    width: 100%;
}
</style>
