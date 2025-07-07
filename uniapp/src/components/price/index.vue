<template>
    <view class="primary">
		<text class="text-[28rpx] mr-[6rpx] text" :style="{'font-size':priceIconFontSize,'color':priceColor || $theme.primaryColor}">¥</text>
        <text class="text-4xl font-medium text" :style="{'font-size':priceFontSize,'color':priceColor || $theme.primaryColor}">{{ price }}</text>
        <text class="text-xs text">{{ desc }}</text>
		<text v-if="scribingPrice > 0" class="text-xs line-through ml-2 text-muted"
		    >￥{{ scribingPrice }}元</text
		>
    </view>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue'

/** Props Start **/
const props = withDefaults(
    defineProps<{
        price?: string // 价格
        desc?: string // 介绍
		scribingPrice?: string // 划线价
		priceFontSize?: string
		priceIconFontSize?: string
		priceColor?: string
    }>(),
    {
        price: '',
        desc: '',
		scribingPrice: '',
		priceFontSize: '40rpx',
		priceIconFontSize: '28rpx',
		priceColor: ''
    }
)
/** Props End **/

/** Methods Start **/

/** Methods End **/
</script>

<style lang="scss" scoped>
.text {
    // color: var(--color-primary, #FFC244) !important;
}
</style>
