<template>
    <view>
        <u-popup v-model="show" mode="bottom" border-radius="14" :closeable="true">
			<!-- Header Start -->
			<view class="font-bold mt-[20rpx] mb-[20rpx] text-center text-3xl">选择服务时间</view>
			<scroll-view class="scroll-view-box" scroll-x="true">
			   <block v-for="(item, index) in dayInfo" :key="index">
				   <view
					   class="day text-base"
					   :class="{ active: selectDayIndex == index }"
					   @click="selectAppoint(undefined,index)"
				   >
					   <view>{{ item.week }}</view>
					   <view class="mt-[10rpx]">{{ item.date }}</view>
				   </view>
			   </block>
			</scroll-view>
			<!-- Header End -->

			<!-- Main Start -->
			<scroll-view scroll-y="true" class="h-[900rpx] bg-[#edf1f3]">
				<view class="time-box flex flex-wrap" v-if="!appointTimeEmpty">
				   <block v-for="(item2, index2) in appointTimeData" :key="index2">
					   <view
						   v-if="!item2.disabled"
						   class="time-item"
						   :class="{
							   select: selectTimeIndex == index2,
							   disabled: item2.disabled
						   }"
						   @click="selectAppoint(index2,selectDayIndex)"
					   >
						   <view class="font-bold w-full">{{ item2.time }}</view>
						   <view class="text-[20rpx] w-full" v-if="item2.disabled">不可预约</view>
					   </view>
				   </block>
				</view>
				<view class="flex justify-center items-center h-[600rpx]" v-else>
					<text class="text-muted">今日暂无可用时间段</text>
				</view>
				<view class="h-[190rpx]"></view>
			</scroll-view>
			<!-- Main End -->
			
			<!-- Footer Start -->
			<view class="footer">
			    <button
			        class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx]"
			        @click="handleConfirm"
			    >
			        确定
			    </button>
			</view>
			<!-- Footer End -->
        </u-popup>
    </view>
</template>

<script lang="ts" setup>
import { ref,watch } from 'vue'
import { toast } from '@/utils/util'

const props = withDefaults(
    defineProps<{
        data: any // 预约时间数据
    }>(),
    {
        data: {},
    }
)

//显示弹窗
const show = ref(false)
// 可选择日期
const dayInfo = ref<any>([])
// 选中日期索引
const selectDayIndex = ref<number>(0)
// 选中时间索引
const selectTimeIndex = ref<number>()
//选中时间数据
const appointTime = ref()
// 时间段数据
const appointTimeData = ref<any>([])
const appointTimeEmpty = ref(false)

//选择上门时间段
const selectAppoint = (timeIndex: number | undefined,dayIndex: number) => {
	if (timeIndex !== undefined && appointTimeData.value[timeIndex].disabled) {
		return toast('该时间不可预约')
	}
	
    selectTimeIndex.value = timeIndex
    selectDayIndex.value = dayIndex
	
    const dateTime = dayInfo.value[selectDayIndex.value]
    appointTime.value = {
        year: dateTime.year,
        month: dateTime.month,
        week: dateTime.week,
        day: dateTime.day,
        appoint_time: props.data.appoint_time[selectTimeIndex.value],
    }
}

//根据返回可提前预约天数计算出日期
const handleAppointDay = (days: number) => {
    const timeArr = []
    // 现在时间戳
    const newTime = new Date().getTime()
    for (let i = 0; i < days; i++) {
        // 获取天数时间戳
        const millisecond = newTime + i * 24 * 60 * 60 * 1000
        // 年
        const year = new Date(millisecond).getFullYear()
        // 月
        const month = new Date(millisecond).getMonth() + 1
        // 星期
        const week = new Date(millisecond).getDay()
        // 日
        const day = new Date(millisecond).getDate()
        // 未来天数的数组
        timeArr.push({
            year: year,
            month: month,
            day: day,
            week: handleWeek(week, i),
            date: (month <= 9 ? '0' + month : month) + '-' + (day <= 9 ? '0' + day : day)
        })
    }
    return timeArr
}
//转换日期
const handleWeek = (week: number | string | undefined, i: number) => {
    if (i === 0) return '今天'
    else if (i === 1) return '明天'
    else if (week === 0) return '周日'
    else if (week === 1) return '周一'
    else if (week === 2) return '周二'
    else if (week === 3) return '周三'
    else if (week === 4) return '周四'
    else if (week === 5) return '周五'
    else if (week === 6) return '周六'
}

//确认选择
const handleConfirm = () => {
    if (!appointTime.value) {
		toast('请选择服务时间')
		return
	}

	uni.$emit('appointTime', appointTime.value)
	show.value = false
}

const open = () => {
    show.value = true
}
defineExpose({ open })

//计算时间是否可预约
const computeTime = () => {
	if (selectDayIndex.value === 0) {
		const date = new Date()
		const minutes = date.getMinutes()
		const nowTime = date.getHours() + '' + (minutes <= 9 ? '0' + minutes : minutes) //当前时间
		appointTimeEmpty.value = true
		appointTimeData.value.map((item:any) => {
		    const time = item.time.replace(':', '')
			//可预约时间必须大于当前时间一小时以上
		    item.disabled = Number(time) - (Number(nowTime) + 100) < 0
			if (!item.disabled) {
				appointTimeEmpty.value = false
			}
		})
	} else {
		appointTimeEmpty.value = false
		appointTimeData.value.map((item:any) => {
		    item.disabled = false
		})
	}
}

// 初始化数据
watch(
    () => props.data,
    (value) => {
		dayInfo.value = handleAppointDay(value.advance_reservation_time)
		for (const i in value.appoint_time) {
			appointTimeData.value.push({'time':value.appoint_time[i],disabled:false})
		}
		computeTime()
    },
    { immediate: true }
)

// 处理预约时间
watch(
    () => selectDayIndex.value,
    (value) => {
		computeTime()
    },
    { immediate: true,deep: true }
)

</script>

<style lang="scss" scoped>
.scroll-view-box {
	height: 140rpx;
	white-space: nowrap;
	box-sizing: border-box;
	background-color: #ffffff;
	padding: 30rpx 20rpx 0 20rpx;

	.day {
		width: 85rpx;
		text-align: center;
		display: inline-block;
		color: #222222;
		margin: 0 20rpx;
	}
	.active {
		color: var(--color-primary, #FFC244);
		border-bottom: 4px solid var(--color-primary, #FFC244);
		padding-bottom: 16rpx;
	}
}

.time-box {
	padding: 24rpx;

	.time-item {
		width: 160rpx;
		height: 90rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		background-color: #ffffff;
		margin: 0 20rpx 20rpx 0;
		border-radius: 10rpx;
		border: 1px solid #ffffff;
		text-align: center;
	}
	.time-item:nth-child(4n) {
		margin-right: 0;
	}

	.select {
		// background-color: rgba(255, 244, 244, 1);
		color: var(--color-primary, #FFC244);
		border: 1px solid var(--color-primary, #FFC244);
	}

	.disabled {
		color: rgba(153, 153, 153, 1);
		background-color: rgba(255, 255, 255, 1);
	}
}
// 底部按钮
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    position: fixed;
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);
    padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
}
</style>
