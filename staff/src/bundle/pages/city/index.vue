<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="container">
        <view class="text-3xl font-bold mb-[30rpx]">选择城市</view>
        <!-- 搜索 -->
        <u-search
            placeholder="搜索城市名"
            v-model="keyword"
            shape="round"
            :clearabled="true"
            :animation="true"
            :height="70"
            bg-color="#f2f2f2"
            @search="getCityData"
            @custom="getCityData"
        ></u-search>

        <!-- 定位城市 -->
        <view class="text-[24rpx] text-[#c8c9cc] mt-[30rpx] mb-[30rpx]">已开通以下城市</view>
        <view>
            <view>
                <!-- 城市列表 -->
                <view
                    v-for="(cityItem, cityIndex) in cityList"
                    :key="cityIndex"
                    class="anchor flex mb-[10rpx]"
                >
                    <view class="font-bold text-[32rpx]">{{ cityIndex }}</view>
                    <view class="ml-[20rpx]">
                        <block v-for="(cityItem2, cityIndex2) in cityItem" :key="cityIndex2">
                            <view
                                @click="chooseCity(cityItem2)"
                                class="pb-[40rpx] pt-[4rpx] w-[500rpx]"
                            >
                                <view v-if="cityInfo.city_id != cityItem2.id">
                                    {{ cityItem2.name }}
                                </view>
                                <view v-else class="u-flex justify-between">
                                    <view class="text-[#fa3534]">{{ cityItem2.name }}</view>
                                    <u-icon name="checkmark" color="#fa3534"></u-icon>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiRegionCity } from '@/api/store'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const cityInfo = computed(() => appStore.cityInfo)

// 搜索关键字
const keyword = ref<string | number>('')
// 城市列表
const cityList = ref<any>([])

// 选择城市
const chooseCity = (param: any) => {
	const info = {
		city_id: param.id,
		latitude: param.db09_lat,
		longitude: param.db09_lng,
		cityName: param.name,
	}
    appStore.setCityInfo(info)
    uni.navigateBack()
}

// 获取城市数据
const getCityData = async (): Promise<void> => {
    const data = await apiRegionCity({keyword:keyword.value})
    cityList.value = data
}

onLoad(() => {
    getCityData()
})
</script>

<style lang="scss" scoped>
.container {
    padding: 20rpx;
    background-color: #ffffff;
    min-height: 100vh;
}
</style>
