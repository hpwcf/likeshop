<template>
	<!-- 列表页按钮 -->
	<view class="flex" v-if="type === 'list'">
		<template v-if="orderBtn.grab_btn">
		    <button
		        class="bg-primary ml-[20rpx] h-[60rpx] leading-[60rpx] text-base text-white"
				style="border: solid 1rpx #c8c9cc;"
		        @click.stop="handleGrab"
		    >
		        立即抢单
		    </button>
		</template>
		<template v-if="orderBtn.receive_btn">
		    <button
		        class="bg-primary ml-[20rpx] h-[60rpx] leading-[60rpx] text-base text-white"
				style="border: solid 1rpx #c8c9cc;"
		        @click.stop="handleReceive"
		    >
		        立即接单
		    </button>
		</template>
	</view>
	
	<!-- 详情页按钮 -->
    <view v-if="type === 'detail'">
        <template v-if="orderBtn.grab_btn">
			<button
				class="bg-primary h-[80rpx] leading-[80rpx] text-base text-white"
				@click.stop="handleGrab"
			>
				立即抢单
			</button>
			<!-- <u-button class="h-[80rpx] leading-[80rpx]" type="primary" @click="handleGrab">立即抢单</u-button> -->
        </template>
        <template v-if="orderBtn.receive_btn">
			<button
				class="bg-primary h-[80rpx] leading-[80rpx] text-base text-white"
				@click.stop="handleReceive"
			>
				立即接单
			</button>
			<!-- <u-button class="h-[80rpx] leading-[80rpx]" type="primary" @click="handleReceive">立即接单</u-button> -->
        </template>
		<template v-if="orderBtn.setout_btn">
			<button
				class="bg-primary h-[80rpx] leading-[80rpx] text-base text-white"
				@click.stop="handleSetout"
			>
				立即出发
			</button>
			<!-- <u-button class="h-[80rpx] leading-[80rpx]" type="primary" @click="handleSetout">立即出发</u-button> -->
        </template>
		<template v-if="orderBtn.arrive_btn">
			<button
				class="bg-primary h-[80rpx] leading-[80rpx] text-base text-white"
				@click.stop="arrivePopupShow = true"
			>
				已到达
			</button>
			<!-- <u-button class="h-[80rpx] leading-[80rpx]" type="primary" @click="arrivePopupShow = true">已到达</u-button> -->
			<u-popup v-model="arrivePopupShow" mode="bottom" :border-radius="20">
				<view class="h-full" style="position: relative;">
					<view class="text-center py-[30rpx] text-1xl">请上传图片</view>
					<view class="pl-[30rpx] mt-[20rpx] pb-[200rpx]">
						<uploader
							v-model="imageInfo"
							:mutiple="true"
							:maxUpload="6"
							:deletable="true"
							:width="200"
							:height="200"
						/>
					</view>
					<view style="position: absolute;bottom: 60rpx;" class="w-full px-[30rpx]">
						<button
							class="bg-primary h-[80rpx] leading-[80rpx] text-base text-white"
							@click.stop="handleArrive"
						>
							已到达
						</button>
						<!-- <u-button class="h-[80rpx] leading-[80rpx]" type="primary" @click="handleArrive">已到达</u-button> -->
					</view>
				</view>
			</u-popup>
        </template>
		<template v-if="orderBtn.start_btn">
			<button
				class="bg-primary h-[80rpx] leading-[80rpx] text-base text-white"
				@click.stop="handleStart"
			>
				开始服务
			</button>
			<!-- <u-button type="primary" @click="handleStart">开始服务</u-button> -->
        </template>
		<template v-if="orderBtn.finish_btn">
			<button
				class="bg-primary h-[80rpx] leading-[80rpx] text-base text-white"
				@click.stop="finishPopupShow = true"
			>
				服务完成
			</button>
			<!-- <u-button class="h-[80rpx] leading-[80rpx]" type="primary" @click="finishPopupShow = true">服务完成</u-button> -->
			<u-popup v-model="finishPopupShow" mode="bottom" :border-radius="20">
				<view class="h-full" style="position: relative;">
					<view class="text-center py-[30rpx] text-1xl">请上传图片</view>
					<view class="pl-[30rpx] mt-[20rpx] pb-[200rpx]">
						<uploader
							v-model="imageInfo"
							:mutiple="true"
							:maxUpload="6"
							:deletable="true"
							:width="200"
							:height="200"
						/>
					</view>
					<view style="position: absolute;bottom: 60rpx;" class="w-full px-[30rpx]">
						<button
							class="bg-primary h-[80rpx] leading-[80rpx] text-base text-white"
							@click.stop="handleFinish"
						>
							服务完成
						</button>
						<!-- <u-button class="h-[80rpx] leading-[80rpx]" type="primary" @click="handleFinish">服务完成</u-button> -->
					</view>
				</view>
			</u-popup>
        </template>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { apiOrderGrab,apiOrderReceive,apiOrderSetout,apiOrderArrive,apiOrderStart,apiOrderFinish } from '@/api/order'
import uploader from '@/components/uploader/index.vue'
import { apiSubscribe } from '@/api/app'

const emit = defineEmits(['refresh', 'backRefresh'])

const props = withDefaults(
    defineProps<{
		type?: string
        orderId?: string | number | null // 订单ID
        orderBtn?: any // 取消订单
    }>(),
    {
        type: 'list',
        orderId: '',
        orderBtn: {},
    }
)
const imageInfo = ref<Array<any>>([])
const arrivePopupShow = ref(false)
const finishPopupShow = ref(false)

//获取用户消息授权
const getAuthMsg = (scene:string) => {
    return new Promise((resolve, reject) => {
        apiSubscribe({'scene':scene})
            .then((res) => {
                if (!res.length) resolve('暂无可订阅信息')
                uni.requestSubscribeMessage({
                    tmplIds: res,
                    success(ress) {
                        console.log('requestSubscribeMessageRes', ress)
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
// 抢单
const handleGrab = async () => {
    uni.showModal({
    	title: '温馨提示',
    	content: '是否确认抢单？',
    	success: async (res) => {
    		if (res.confirm) {
    			try {
					// #ifdef MP-WEIXIN
					await getAuthMsg('order')
					//#endif
    			    await apiOrderGrab({ id: props.orderId })
					if (props.type === 'detail') {
						emit('refresh')
					} else {
						uni.navigateTo({
						    url: `/pages/order_detail/index?id=${props.orderId}`
						})
					}
    			} catch (err) {
    			    console.log('抢单', err)
    			}
    		}
    	}
    });
}

// 接单
const handleReceive = async () => {
    uni.showModal({
    	title: '温馨提示',
    	content: '是否确认接单？',
    	success: async (res) => {
    		if (res.confirm) {
    			try {
					// #ifdef MP-WEIXIN
					await getAuthMsg('order')
					//#endif
    			    await apiOrderReceive({ id: props.orderId })
					if (props.type === 'detail') {
						emit('refresh')
					} else {
						uni.navigateTo({
						    url: `/pages/order_detail/index?id=${props.orderId}`
						})
					}
    			} catch (err) {
    			    console.log('接单', err)
    			}
    		}
    	}
    });
}

//已出发
const handleSetout = () => {
	uni.showModal({
		title: '温馨提示',
		content: '是否确认已出发？',
		success: async (res) => {
			if (res.confirm) {
				try {
					// #ifdef MP-WEIXIN
					await getAuthMsg('service')
					//#endif
				    await apiOrderSetout({ id: props.orderId })
					emit('refresh')
				} catch (err) {
				    console.log('已出发', err)
				}
			}
		}
	});
}

//已到达
const handleArrive = () => {
	if (!imageInfo.value) return uni.$u.toast('请上传图片')
	uni.showModal({
		title: '温馨提示',
		content: '是否确认已到达？',
		success: async (res) => {
			if (res.confirm) {
				try {
				    await apiOrderArrive({ id: props.orderId,image_info: imageInfo.value })
					imageInfo.value = []
					emit('refresh')
				} catch (err) {
				    console.log('已到达', err)
				}
			}
		}
	});
}

//开始服务
const handleStart = () => {
	uni.showModal({
		title: '温馨提示',
		content: '是否确认开始服务？',
		success: async (res) => {
			if (res.confirm) {
				try {
				    await apiOrderStart({ id: props.orderId })
					emit('refresh')
				} catch (err) {
				    console.log('开始服务', err)
				}
			}
		}
	});
}

//完成服务
const handleFinish = () => {
	if (!imageInfo.value) return uni.$u.toast('请上传图片')
	uni.showModal({
		title: '温馨提示',
		content: '是否确认完成服务？',
		success: async (res) => {
			if (res.confirm) {
				try {
				    await apiOrderFinish({ id: props.orderId,image_info: imageInfo.value })
					imageInfo.value = []
					emit('refresh')
				} catch (err) {
				    console.log('完成服务', err)
				}
			}
		}
	});
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
