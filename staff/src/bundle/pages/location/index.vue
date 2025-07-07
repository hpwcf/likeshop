<template>
    <view class="container">
        <!-- 搜索框 -->
        <view class="flex search">
            <!-- 左侧城市 -->
            <view class="flex search--city" @click="goPage('/bundle/pages/city/index')">
                <text class="mr-[15rpx]">{{ cityInfo.cityName }}</text>
                <u-icon name="arrow-down" size="20"></u-icon>
            </view>
            <!-- 右侧搜索城市 -->
            <input
                type="text"
                class="flex-1 search--search"
                placeholder="搜索地点"
                v-model="keyword"
                @confirm="search"
            />
        </view>

        <!-- 地图组件 -->
        <view class="mt-[30rpx] mb-[30rpx] map">
            <map
                id="myMap"
                theme="normal"
                style="width: 100%; height: 400rpx; border-radius: 20rpx; overflow: hidden"
                show-location
                :enable-overlooking="false"
                :scale="13"
                @regionchange="regionchange"
                :latitude="latitude"
                :longitude="longitude"
                :markers="markersList"
				v-if="!isSearch"
            >
                <cover-view class="iconImg">
                    <cover-image
                        class="img"
                        src="https://hellouniapp.dcloud.net.cn/static/location.png"
                    ></cover-image>
                </cover-view>

                <!-- #ifdef MP  -->
                <cover-view class="origin" @click="originLocation">
                    <cover-image
                        class="origin_icon"
                        src="@/bundle/static/images/map/origin.png"
                    ></cover-image>
                    <cover-view class="text-xs mt-[15rpx]">定位</cover-view>
                </cover-view>
                <!-- #endif -->
            </map>
        </view>

        <view class="address">
            <!-- 地址列表 -->
            <view v-if="addressList?.length">
                <scroll-view scroll-y="true" class="scroll-Y" :show-scrollbar="false">
                    <view
                        class="address-item"
                        v-for="(item, index) in addressList"
                        :key="index"
                        @click="choiceAddress(item)"
                    >
                        <view class="u-flex justify-between">
                            <view class="u-flex">
                                <u-icon name="map"></u-icon>
                                <view class="font-bold ml-[10rpx] w-[500rpx] truncate">{{
                                    item.title
                                }}</view>
                            </view>
                            <view class="text-[#909399] text-[24rpx]">{{ computeDistance(item._distance) }}</view>
                        </view>
                        <view
                            class="text-[#909399] text-[24rpx] ml-[40rpx] mt-[10rpx] w-[500rpx] truncate"
                            >{{ item.address }}</view
                        >
                    </view>
                </scroll-view>
            </view>

            <!-- 无地址 -->
            <view class="flex flex-col items-center pb-3" v-else>
                <view class="mt-[40rpx]">
                    <u-image src="@/bundle/static/images/map/good.png" width="290" height="200" />
                </view>
                <view class="my-[30rpx]">
                    <text>没有数据哦</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { getAddress } from '@/api/app'

const appStore = useAppStore()
const cityInfo = computed(() => appStore.cityInfo)
//经纬度
const latitude = ref()
const longitude = ref()
//搜索关键词
const keyword = ref('')

const isSearch = ref(false)

// 创建map的上下文对象, 从而操控map组件
const mapCtx = uni.createMapContext('myMap')

// 地图标记点
const markersList = ref<any>([])

// 获取地址列表
const addressList = ref<any>([])
const getAddressList = async () => {
    const { data } = await getAddress({
        keyword: keyword.value,
        latitude: latitude.value,
        longitude: longitude.value
    })
    addressList.value = data
    renderPointToMap(addressList.value)
}

//计算地址距离
const computeDistance = (distance:number) => {
	let res = distance + 'm'
	if (distance > 1000) {
		res = (distance / 1000).toFixed(3) + 'km'
	}
	return res
}

// 渲染所有地址
const renderPointToMap = (arr: any[]) => {
    if (!arr.length) return
    markersList.value = []
    arr.forEach((item) => {
        if (!item.status) return
        markersList.value.push({
            id: item.id,
            latitude: +item.latitude,
            longitude: +item.longitude,
            iconPath: '/bundle/static/images/map/end_point_icon.png',
            height: 30,
            width: 20
        })
    })
}

// 滑动地图更新当前定位
const regionchange = (e: any) => {
	if (e.detail.type == 'end' && (e.detail.causedBy == 'update' || e.detail.causedBy == 'drag')) {
	    mapCtx.getCenterLocation({
	        success: async (res: any) => {
	            latitude.value = res.latitude
	            longitude.value = res.longitude
	            getAddressList()
	        }
	    })
	}
    if (e.type == 'end' && (e.causedBy == 'update' || e.causedBy == 'drag')) {
        mapCtx.getCenterLocation({
            success: async (res: any) => {
                latitude.value = res.latitude
                longitude.value = res.longitude
                getAddressList()
            }
        })
    }
}

// 回到我的位置
const originLocation = async () => {
    mapCtx.moveToLocation({latitude:latitude.value,longitude:longitude.value})
    await appStore.getLocationFunc()
    getAddressList()
}

//搜索
const search = async () => {
    uni.showLoading({
        title: '搜索中...',
        mask: true
    })
    await getAddressList()
	isSearch.value = true
    uni.hideLoading()
}

//选择地址
const choiceAddress = (res: any) => {
	const latitude = res.location.lat
	const longitude = res.location.lng
	const info = {
		cityName: cityInfo.value.cityName,
		city_id: cityInfo.value.city_id,
		latitude: latitude,
		longitude: longitude
	}
	appStore.setCityInfo(info)
	uni.$emit('choiceAddress', { latitude: latitude,longitude: longitude })
	uni.navigateBack()
}

// 监听位置变化并更新
watch(
    () => cityInfo.value.latitude,
    (val) => {
        if (val) {
            latitude.value = cityInfo.value.latitude
            longitude.value = cityInfo.value.longitude
            getAddressList()
        }
    },
    { immediate: true }
)

const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}
</script>

<style lang="scss" scoped>
.container {
    padding: 20rpx;

    .search {
        height: 100%;
        padding: 15rpx 30rpx;
        border-radius: 40rpx;
        background-color: #ffffff;

        &--city {
            color: #222;
            font-size: 28rpx;
        }
        &--search {
            margin-left: 30rpx;
            padding-left: 30rpx;
            border-left: 1px solid #ccc;
        }
    }
    .map {
        position: relative;
        .iconImg {
            position: absolute;
            top: 46%;
            left: 47%;
            .img {
                width: 50rpx;
                height: 50rpx;
            }
        }
        .origin {
            position: absolute;
            top: 10rpx;
            right: 10rpx;
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 1);
            text-align: center;
            border: 1rpx solid rgba(187, 187, 187, 1);
            .origin_icon {
                position: relative;
                top: 15%;
                left: 30%;
                width: 30rpx;
                height: 30rpx;
            }
        }
    }
    .address {
        background-color: #ffffff;
        padding: 30rpx 24rpx;
        border-radius: 20rpx;
        .address-item {
            padding-bottom: 30rpx;
            margin: 20rpx 0;
            border-bottom: 1px solid #f4f4f5;
        }
    }
}
</style>
