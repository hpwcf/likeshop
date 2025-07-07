<template>
    <view class="container">
        <u-navbar
            :is-fixed="false"
            :border-bottom="false"
            :background="{ background: 'transparent' }"
            :is-back="false"
        >
            <!-- 城市 -->
            <view class="flex-1 flex row pb-[30rpx]" style="position: relative">
                <view class="flex row" @click="goPage('/bundle/pages/city/index')">
                    <!-- <u-icon class="mr-[16rpx]" name="/static/images/icon_address.png" size="30"></u-icon> -->
                    <text class="mr-[6rpx] text-[#000000] text-[34rpx] font-bold">{{
                        locationState.name
                    }}</text>
                    <u-icon name="arrow-right" size="20" color="#000000"></u-icon>
                </view>
            </view>
        </u-navbar>
        <u-search
            v-model="keyword"
            placeholder="请输入师傅名称"
            :height="80"
            :animation="true"
            bg-color="#ffffff"
            @search="search"
            @custom="search"
            @clear="queryList"
        ></u-search>
        <u-tabs
            :list="categoryLists"
            :current="categoryCurrent"
            bg-color=""
            @change="categoryChange"
            class="mt-[10rpx] mb-[10rpx]"
        ></u-tabs>

        <view class="main mt-[20rpx]">
            <z-paging
                auto-show-back-to-top
                :auto="true"
                ref="paging"
                v-model="dataList"
                @query="queryList"
                :fixed="false"
                height="100%"
            >
                <!-- 订单卡片 -->
                <navigator
                    v-for="item in dataList"
                    :key="item.id"
                    :url="`/bundle/pages/master_worker_detail/index?id=${item.id}`"
                >
                    <view class="flex master_worker_item col-start">
                        <u-image
                            :src="item.user_image"
                            width="140"
                            height="140"
                            border-radius="14rpx"
                        ></u-image>
                        <view class="ml-[20rpx] w-[500rpx]">
                            <view class="text-lg font-medium normal">{{ item.name }}</view>
                            <view class="u-flex mt-[6rpx] justify-between">
                                <view class="u-flex">
                                    <view class="tag">女</view>
                                    <view class="tag">22</view>
                                    <view class="tag truncate">{{ item.goods_name }}</view>
                                </view>
                                <view>
                                    <text class="text-[#909399]">0.9km</text>
                                </view>
                            </view>
                            <view class="u-flex mt-[16rpx] justify-between">
                                <view>
                                    <text class="text-[#82848a] text-[26rpx]"
                                        >已服务69单 98%好评</text
                                    >
                                </view>
                                <view>
                                    <button
                                        class="bg-primary text-[26rpx] text-white leading-[46rpx] h-[46rpx] w-[160rpx] m-0"
                                        style="border-radius: 50rpx"
                                    >
                                        立即预约
                                    </button>
                                </view>
                            </view>
                        </view>
                        <view
                            :class="{
                                working: 1,
                                resting: 0
                            }"
                        >
                            <text>最早可约16:00</text>
                        </view>
                    </view>
                </navigator>
            </z-paging>
        </view>

        <!-- 底部导航栏 -->
        <Tabbar />
    </view>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiStaffLists } from '@/api/store'
import { computed } from 'vue'
import { locationState } from '@/hooks/useLocation'
import Tabbar from '@/components/tabbar/index.vue'

// 页面状态
const searchStatus = ref<boolean>(false)
// 搜索关键字
const keyword = ref<string | number>('')
// 师傅列表数据
const dataList = ref<any>([])
// 下拉组件的Ref
const paging = shallowRef<any>(null)

// 处理搜索
const search = (flag: boolean) => {
    if (flag) {
        if (keyword.value !== '') searchStatus.value = true
    } else {
        keyword.value = ''
        searchStatus.value = false
    }
    paging.value?.reload()
}

const queryList = async (pageNo: number, pageSize: number) => {
    try {
        const { lists } = await apiStaffLists({
            pageNo,
            pageSize,
            name: keyword.value
        })
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}

//分类数据
const categoryLists = ref()
const categoryCurrent = ref(0)
categoryLists.value = [
    {
        name: '全部',
        id: 0
    },
    {
        name: '保洁清洗',
        id: 1
    },
    {
        name: '安装维修',
        id: 2
    },
    {
        name: '拉货搬家',
        id: 3
    },
    {
        name: '住家保姆',
        id: 4
    },
    {
        name: '家电清洗',
        id: 5
    },
    {
        name: '收纳整理',
        id: 6
    }
]
const categoryChange = (index: number) => {
    categoryCurrent.value = index
}

// 师傅详情
const toDetail = (id: number | string) => {
    uni.navigateTo({
        url: `/bundle/pages/master_worker_detail/index?id=${id}`
    })
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    height: 100vh;
    overflow: hidden;
    flex-direction: column;
    background-color: #edf1f3;
    padding: 20rpx;

    .u-search {
        flex: unset;
    }
    .main {
        flex: 1;
        min-height: 0;
        overflow: scroll;

        // 师傅
        .master_worker_item {
            padding: 30rpx 24rpx 28rpx 24rpx;
            border-radius: 20rpx;
            margin-bottom: 20rpx;
            background-color: #ffffff;
            position: relative;

            .tag {
                color: #909399;
                font-size: 20rpx;
                padding: 4rpx 10rpx;
                background-color: #f4f4f5;
                border-radius: 4rpx;
                display: inline-block;
                max-width: 300rpx;
                margin-right: 10rpx;
            }
            .tag:last-child {
                margin-right: 0;
            }
            .working {
                padding: 10rpx 20rpx;
                background-color: #fdebeb;
                color: var(--color-primary, #FFC244);
                position: absolute;
                top: 0;
                right: 0;
                border-radius: 0 20rpx;
                font-size: 20rpx;
            }
            .resting {
                padding: 10rpx 20rpx;
                background-color: #edf1f3;
                color: #000000;
                position: absolute;
                top: 0;
                right: 0;
                border-radius: 0 20rpx;
                font-size: 20rpx;
            }
        }
    }
}
</style>
