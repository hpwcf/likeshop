<template>
    <view class="bg-white navbar-bg">
        <view class="flex navbar">
            <!-- 左侧城市 -->
            <view class="flex navbar--city" @click="goPage('/bundle/pages/city/index')">
                <text class="mr-[15rpx]">{{ cityInfo.name }}</text>
                <u-icon name="arrow-down" size="20"></u-icon>
            </view>
            <!-- 右侧搜索城市 -->
            <input type="text" class="flex-1 navbar--search" placeholder="请输入关键词搜索" disabled
                @click="goPage('/bundle/pages/search/index')" />
        </view>
    </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()

const cityInfo = computed(() => appStore.cityInfo)

const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}
</script>

<style lang="scss" scoped>
.navbar-bg {
    width: 100%;
    height: 100rpx;
    padding: 15rpx 24rpx;

    .navbar {
        height: 100%;
        padding: 15rpx 30rpx;
        border-radius: 40rpx;
        background-color: #f6f6f6;

        &--city {
            color: #222;
            font-size: 28rpx;
        }

        // 输入框
        &--search {
            margin-left: 30rpx;
            padding-left: 30rpx;
            border-left: 1px solid #ccc;
        }
    }
}
</style>
