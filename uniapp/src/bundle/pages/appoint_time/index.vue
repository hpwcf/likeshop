<template>
    <!-- Header Start -->
    <scroll-view class="scroll-view-box" scroll-x="true">
        <block v-for="(item, index) in date" :key="index">
            <view
                class="day text-base"
                :class="{ active: dayIndex == index }"
                @click="dayIndex = index"
            >
                <view>{{ item.week }}</view>
                <view class="mt-[10rpx]">{{ item.date }}</view>
            </view>
        </block>
    </scroll-view>
    <!-- Header End -->

    <!-- Main Start -->
    <view class="time-box">
        <block v-for="(item2, index2) in timeSlot" :key="index2">
            <view
                class="time-item"
                :class="{
                    select: selectIndex == index2,
                    disabled: dayIndex === 0 && item2.disabled
                }"
                @click="selectAppoint(index2, dayIndex === 0 && item2.disabled)"
            >
                {{ item2.start_time }} - {{ item2.end_time }}
            </view>
        </block>
    </view>
    <!-- Main End -->
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { toast } from '@/utils/util'
import { apiAppointTime } from '@/api/goods'
import { onLoad, onShow } from '@dcloudio/uni-app'

interface DateObj {
    year: number
    week: string | undefined
    date: string
}

interface TimeSlotObj {
    start_time: string
    end_time: string
    disabled: boolean
}

// 日期
const date = ref<DateObj[]>([])
// 当天日期索引
const dayIndex = ref<number>(0)
// 时间段选择索引
const selectIndex = ref<number>(0)
// 预约时间段
const timeSlot = ref<TimeSlotObj[]>([])
// 商品数据
const goodsForm = ref<any | null>({
    goods_num: '' as string,
    id: '' as string
})

/**
 * @param { number } index
 * @param { boolean } disabled
 * @return { void }
 * @description 选择上门时间段
 */
const selectAppoint = (index: number, disabled: boolean) => {
    if (disabled) return toast('服务时间段已过！请选择其他时间段')
    selectIndex.value = index
    // 缓存用户所选的预约时间
    uni.setStorage({
        key: 'selectDate',
        data: [dayIndex.value, selectIndex.value]
    })
    const dateTime = date.value[dayIndex.value]
    const timeSlotItem = timeSlot.value[index]
    const appointTime = {
        year: dateTime.year,
        date: dateTime.date,
        start_time: timeSlotItem.start_time,
        end_time: timeSlotItem.end_time
    }
    if (goodsForm.value.id != '') {
        const params = {
            goodsData: goodsForm.value,
            appointData: appointTime
        }
        goPage(`/pages/order_buy/index?params=${JSON.stringify(params)}`)
        return
    }
    uni.$emit('appointTime', appointTime)
    uni.navigateBack()
}

/**
 * @return { Promise } void
 * @description 请求获取预约时间
 */
const getAppointTime = async (): Promise<void> => {
    const { appoint_time, order_time } = await apiAppointTime()
    timeSlot.value = handleTimeSlot(appoint_time)
    date.value = handleAppointDay(order_time)

    // 获取用户所选的预约时间
    uni.getStorage({
        key: 'selectDate',
        success: (res) => {
            dayIndex.value = res.data[0]
            selectIndex.value = res.data[1]
        }
    })
}

/**
 * @param { TimeSlotObj[] } timeSlot
 * @return { TimeSlotObj[] } 时间段
 * @description 计算已过期时间
 */
const handleTimeSlot = (timeSlot: TimeSlotObj[]) => {
    const time = new Date() //	时间戳转换成标准日期时间
    const min = time.getMinutes()
    const startTime = time.getHours() + '' + (min <= 9 ? '0' + min : min) //	获取时分并组合成标准格式（时分）
    timeSlot.map((item) => {
        const end = item.end_time.replace(':', '')
        item.disabled = Number(startTime) - Number(end) >= 0
    })
    return timeSlot
}

/**
 * @param { number } days
 * @return { string } 日期
 * @description 根据返回预约天数计算出日期
 */
const handleAppointDay = (days: number | string | undefined) => {
    const timeArr = []
    // 现在时间戳
    const newTime = new Date().getTime()
    for (let i = 0; i <= days; i++) {
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
            week: handleWeek(week, i),
            date: (month <= 9 ? '0' + month : month) + '-' + (day <= 9 ? '0' + day : day)
        })
    }
    return timeArr
}

/**
 * @param { number } week
 * @param { number } i
 * @return { string } 日期
 * @description 转换日期
 */
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

/**
 * @param { string } url
 * @return { void }
 * @description 跳转页面方法
 */
const goPage = (url: string) => {
    uni.redirectTo({ url: url })
}

onLoad((options) => {
    if (options.params) {
        const goodsData = JSON.parse(options.params)
        goodsForm.value = goodsData
    }
})
onShow(() => {
    getAppointTime()
})
</script>
<style lang="scss">
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
        width: 220rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        display: inline-block;
        background-color: #ffffff;
        margin: 0 20rpx 20rpx 0;
        border-radius: 10rpx;
    }
    .time-item:nth-child(3n) {
        margin-right: 0;
    }

    .select {
        background-color: rgba(255, 244, 244, 1);
        color: rgba(243, 97, 97, 1);
        // border: 1px solid rgba(243, 97, 97, 1);
    }

    .disabled {
        color: rgba(153, 153, 153, 1);
        background-color: rgba(255, 255, 255, 1);
    }
}
</style>
