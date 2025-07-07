<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="container">

        <u-navbar :is-back="false" title="" class="flex">
            <!-- #ifdef MP -->
            <view class="navbar mp_navbar flex ml-[20rpx] pl-[20rpx]" @click="goPage('/bundle/pages/search/index')">
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <view class="navbar h5_navbar flex ml-[20rpx] pl-[20rpx]" @click="goPage('/bundle/pages/search/index')">
                    <!-- #endif -->
                    <u-icon name="search" size="34" color="#888888"></u-icon>
                    <text class="flex items-center ml-[20rpx]">请输入关键词搜索</text>
                </view>
        </u-navbar>

        <view class="flex main">
            <view class="content">
                <scroll-view scroll-y="true" class="menu">
                    <block v-for="(item, index) in categoryData" :key="item.id">
                        <view class="truncate menu--item" :class="{'text-primary': index === current}" @click="current = index">
                            {{ item.name }}
                        </view>
                    </block>
                </scroll-view>
                <view class="layout">
                    <z-paging ref="paging" v-model="categoryData" @query="queryList" :fixed="false" height="100%" :loading-more-enabled="false" empty-view-text>
                        <!-- Content Start -->
                        <view class="content-box">
                            <block v-for="(item2, index2) in categoryData" :key="item2.id">
                                <template v-if="index2 == current && !item2?.sons?.length">
                                    <cate-card :param="item2" />
                                </template>
                                <template v-if="index2 == current && item2?.sons?.length">
                                    <block v-for="(item3, index3) in item2.sons" :key="item3.id">
                                        <cate-card :param="item3" :pid="item2.id" />
                                    </block>
                                </template>
                            </block>
                        </view>
                        <!-- Content End -->
                    </z-paging>
                </view>
            </view>
        </view>

        <!-- 底部导航栏 -->
        <Tabbar />
    </view>

</template>

<script lang="ts" setup>
import { ref, shallowRef, nextTick } from "vue"
import CateCard from "./components/cate-card.vue"
import Tabbar from "@/components/tabbar/index.vue"
import { apiCategoryLists } from '@/api/store'
import { onShow } from '@dcloudio/uni-app'


const categoryData = ref<Array<any>>([])
const current = ref<number | null>(0)
const paging = shallowRef()

const queryList = async (pageNo: number, pageSize: number) => {
    try {
        const { lists } = await apiCategoryLists()
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}

const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}

onShow(async() => {
	await nextTick()
    paging.value?.reload()
})
</script>

<style lang="scss">
.container {
    display: flex;
    height: 100vh;
    overflow: hidden;
    flex-direction: column;

    .mp_navbar {
        width: 494rpx;
    }

    .h5_navbar {
        width: 710rpx;
    }

    .navbar {
        height: 68rpx;
        color: #C5C5C5;
        border-radius: 60rpx;
        font-size: 28rpx;
        background-color: #f2f2f2;
    }

    .main {
        flex: 1;
        min-height: 0;
        overflow: scroll;
        ::-webkit-scrollbar{
            display: none;
        }


        .content {
            width: 100%;
            height: 100%;
            display: flex;

            .layout {
                width: 100%;
            }

            // 左侧菜单分类
            .menu {
                width: 230rpx;
                height: 100%;
                padding-top: 10rpx;
                margin-right: 20rpx;
                background: #fff;
                box-sizing: border-box;

                &--item {
                    height: 88rpx;
                    line-height: 88rpx;
                    text-align: center;
                    font-size: 28rpx;
                }
            }

            // 右侧内容
            .content-box {
                width: 100%;
                height: 100%;
                padding: 24rpx 24rpx 0 0;
            }
        }
    }
}
</style>
