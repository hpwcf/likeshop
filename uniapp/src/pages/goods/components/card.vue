<template>
    <view class="card" @click="goPage">
        <!-- 卡片头部 -->
        <view
            class="card--header flex justify-between truncate"
            :class="{ bb: border_bottom }"
            v-if="title.length"
        >
            <view class="title truncate font-bold">{{ title }}</view>
            <slot name="header-right"></slot>
        </view>

        <!-- 内容商品 -->
        <slot></slot>
    </view>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue'

/** Props Start **/
const props = withDefaults(
    defineProps<{
        title?: string // 标题
        url?: string //跳转页面
        border_bottom?: boolean // 下划线
    }>(),
    {
        title: '',
        url: '',
        border_bottom: true
    }
)
/** Props End **/

/** Methods Start **/
const goPage = () => {
    if (!props.url) return
    uni.navigateTo({
        url: props.url
    })
}
/** Methods End **/
</script>

<style lang="scss" scoped>
.card {
    padding: 24rpx;
    margin-top: 20rpx;
    background-color: #fff;
    border-radius: 20rpx;

    &--header {
        padding-bottom: 30rpx;
        .title {
            color: #222222;
            font-size: 34rpx;
        }
    }

    .bb {
        border-bottom: 1px solid #e5e5e5;
    }
}
</style>
