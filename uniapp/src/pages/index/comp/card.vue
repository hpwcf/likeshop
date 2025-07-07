<template>
    <view class="card">
        <!-- 卡片头部 -->
        <view class="card--header flex justify-between">
            <view class="title">{{ title }}</view>
            <slot name="header-right"></slot>
        </view>

        <!-- 内容商品 -->
        <scroll-view class="scroll-view-box" scroll-x="true">
            <slot></slot>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue'

/** Props Start **/
const props = withDefaults(
    defineProps<{
        title?: string // 标题
    }>(),
    {
        title: ''
    }
)
/** Props End **/
</script>

<style lang="scss">
.card {
    margin-top: 20rpx;
    padding: 24rpx 0 24rpx 30rpx;
    background-color: #fff;
    border-radius: 10rpx;

    &--header {
        padding-bottom: 24rpx;
        padding-right: 30rpx;
        .title {
            font-weight: 500;
            color: #222222;
            font-size: 36rpx;
        }
    }

    .scroll-view-box {
        white-space: nowrap;
    }
}
</style>
