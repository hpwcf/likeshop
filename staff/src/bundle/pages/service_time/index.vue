<template>
    <!-- Main Start -->
    <view class="time-box">
        <block v-for="(item2, index2) in timeData" :key="index2">
            <view
                class="time-item"
                :class="{
                    booked: item2.status === 1,
                    disabled: item2.status === 2
                }"
                @click="setServiceTime(item2)"
            >
				<view class="text-[22rpx] text-muted" v-if="item2.status === 2">不可预约</view>
				<view class="text-[22rpx] text-muted" v-if="item2.status === 1">已预约</view>
				<view class="text-[22rpx] text-muted" v-if="item2.status === 0">可预约</view>
				<view class="font-bold text-[34rpx]">{{ item2.time }}</view>
            </view>
        </block>
    </view>
    <!-- Main End -->
    <!-- Footer Start -->
	<view class="footer">
		<scroll-view class="scroll-view-box" scroll-x="true">
			<view
				v-for="(item, index) in serviceTimeData.day"
				:key="index"
				class="day text-base flex-1 w-1/4"
				:class="{ active: selectDayIndex == index }"
				@click="clickDay(index)"
			>
				<view class="text-sm text-muted">{{ item.desc }}</view>
				<view class="font-bold">{{ item.date }}</view>
			</view>
		</scroll-view>
		<view class="pt-[30rpx] pb-[30rpx]">
			<!-- <u-button type="primary" v-if="allBusytimeBtn" @click="setAllServiceTime(true)">全部忙</u-button> -->
			<button v-if="allBusytimeBtn" class="bg-primary text-lg text-white" @click="setAllServiceTime(true)">
				全部忙
			</button>
			<u-button type="warning" v-else @click="setAllServiceTime(false)">全部闲</u-button>
		</view>
	</view>
    <!-- Footer End -->
</template>

<script lang="ts" setup>
import { ref,watch } from 'vue'
import { toast } from '@/utils/util'
import { onLoad } from '@dcloudio/uni-app'
import { apiUserServiceTime,apiUserSetBusytime } from '@/api/user'

// 服务时间数据
const serviceTimeData = ref<any>({})
// 选中日期索引
const selectDayIndex = ref(0)
// 选中日期值
const selectDayValue = ref('')
// 时间点数据
const timeData = ref<any>([])
// 全部忙按钮显示控制
const allBusytimeBtn = ref(true)


//初始化服务时间
const initServiceTime = async (): Promise<void> => {
    serviceTimeData.value = await apiUserServiceTime({})
	selectDayValue.value = serviceTimeData.value.day[selectDayIndex.value].date
	timeData.value = serviceTimeData.value.service_time[selectDayValue.value]
}

//选择日期
const clickDay = (index:number) => {
	selectDayIndex.value = index
	selectDayValue.value = serviceTimeData.value.day[selectDayIndex.value].date
	timeData.value = serviceTimeData.value.service_time[selectDayValue.value]
	console.log(timeData.value)
}

//设置服务时间
const setServiceTime = async(item:any) => {
    if (item.status === 1) return toast('时间点已预约，不可操作')
	
    uni.showLoading({
    	title: '操作中...'
    })
	
	let busytimeValue = [];
	serviceTimeData.value.service_time[selectDayValue.value].forEach(timeItem => {
		if (item.time === timeItem.time) {
			timeItem.status = timeItem.status === 2 ? 0 : 2
		}
		if (timeItem.status === 2) {
			busytimeValue.push(timeItem.time)
		}
	})
	await apiUserSetBusytime({day:selectDayValue.value,busytime:busytimeValue})
	timeData.value = serviceTimeData.value.service_time[selectDayValue.value]
}

//设置所有服务时间
const setAllServiceTime = async(isBusytime:Boolean) => {
	uni.showLoading({
		title: '操作中...'
	})
	
	let busytimeValue = [];
	serviceTimeData.value.service_time[selectDayValue.value].forEach(timeItem => {
		if (timeItem.status !== 1) {
			timeItem.status = isBusytime ? 2 : 0
		}
		if (timeItem.status === 2) {
			busytimeValue.push(timeItem.time)
		}
	})
	await apiUserSetBusytime({day:selectDayValue.value,busytime:busytimeValue})
	timeData.value = serviceTimeData.value.service_time[selectDayValue.value]
	// allBusytimeBtn.value = isBusytime
}

//跳转页面方法
const goPage = (url: string) => {
    uni.redirectTo({ url: url })
}

//监听时间点时数据变化
watch(
	() => timeData.value,
	(value) => {
		let idleNum = 0
		value.forEach(timeItem => {
			if (timeItem.status === 0) {
				idleNum += 1
			}
		})
		if (idleNum > 0) {
			allBusytimeBtn.value = true
		} else {
			allBusytimeBtn.value = false
		}
	},
	{
		immediate: true,
		deep: true
	}
);

onLoad((options) => {
    initServiceTime()
})
</script>
<style lang="scss">
.footer {
	width: 100%;
	position: fixed;
	bottom: 0;
	background-color: #f8f8f8;
	padding: 30rpx 30rpx;
	margin-top: 260rpx;
	.scroll-view-box {
		white-space: nowrap;
		box-sizing: border-box;
		.day {
			display: inline-block;
			background-color: #ffffff;
			padding: 10rpx 0;
		    text-align: center;
			border-radius: 14rpx;
			margin: 0 10rpx;
			border: 1px solid #ffffff;
		}
		.active {
		    color: var(--color-primary, #FFC244);
		    border: 1px solid var(--color-primary, #FFC244);
			.text-muted {
				color: var(--color-primary, #FFC244);
			}
		}
	}
}


.time-box {
	min-height: 100vh;
	background-color: #edf1f3;
    padding: 18rpx 20rpx 300rpx;

    .time-item {
        width: 220rpx;
        padding: 14rpx 0;
        text-align: center;
        display: inline-block;
        background-color: #ffffff;
        margin: 0 20rpx 20rpx 0;
        border-radius: 10rpx;
    }
    .time-item:nth-child(3n) {
        margin-right: 0;
    }
    .booked {
        color: #ff1a1a;
        background-color: #feebeb;
    }
    .disabled {
        color: #7a7b7c;
        background-color: #f5f7f9;
    }
}
</style>
