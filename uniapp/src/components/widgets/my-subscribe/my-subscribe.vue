<template>
    <view class="my-subscribe bg-white mx-[20rpx] mt-[20rpx] rounded-lg">
        <view
            v-if="content.title"
            class="title px-[30rpx] py-[20rpx] font-medium text-xl border-light border-solid border-0 border-b"
        >
            <view class="flex justify-between items-center">
                <view>{{ content.title }}</view>
                <view class="text-muted inline text-xs" @click="toOrderLists(0)">
                    查看<u-icon name="arrow-right" />
                </view>
            </view>
        </view>
        <view class="flex pt-[20px] pb-[10px]">
            <view
                v-for="(item, index) in content.data"
                :key="index"
                :class="{ 'flex-1': item.display }"
                @click="handleClick(item.link)"
            >
                <view
                    v-if="item.display"
                    class="order-menu-item flex flex-col items-center mb-[15px]"
                >
                    <u-image width="60" height="60" :src="getImageUrl(item.image)" alt="" />
                    <view class="mt-[7rpx]">{{ item.name }}</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { navigateTo } from '@/utils/util'

const props = defineProps({
    content: {
        type: Object,
        default: () => ({})
    },
    styles: {
        type: Object,
        default: () => ({})
    },
    userInfo: {
        type: Object,
        default: () => ({})
    }
})
const { getImageUrl } = useAppStore()
const handleClick = (link: any) => {
    navigateTo(link)
}

// 点击查看跳转至订单详情页
const toOrderLists = (type: number) => {
    uni.navigateTo({ url: `/pages/order/index?type=${type}` })
}
</script>

<style lang="scss">
.order-menu-item {
    flex: auto;
    text-align: center;
    position: relative;
    image {
        width: 60rpx;
        height: 60rpx;
    }
    &--text {
        color: var(--color-primary, #FFC244);
        font-size: 30rpx;
    }
}
// 徽章
.badge {
    width: 30rpx;
    height: 30rpx;
    text-align: center;
    line-height: 30rpx;
    top: -10rpx;
    right: 25rpx;
    color: #ffffff !important;
    border-radius: 50%;
    position: absolute;
    font-size: 26rpx !important;
    background-color: var(--color-primary, #FFC244);
}
</style>
