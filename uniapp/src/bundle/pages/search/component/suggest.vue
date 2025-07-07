<template>
    <view class="bg-white suggest">
        <!-- 历史搜索 -->
        <view class="history" v-if="his_search.length">
            <view class="flex justify-between px-[24rpx] pb-[26rpx] pt-[26rpx]">
                <view class="text-sm text-muted">历史搜索</view>
                <view class="text-xs text-muted" @click="() => emit('clear')"><u-icon name="trash" color="#c8c9cc" size="36rpx"></u-icon></view>
            </view>

            <view class="w-full px-[24rpx] flex flex-wrap">
                <block v-for="(hisItem, index) in his_search" :key="index">
                    <view class="truncate keyword" @click="handleHistoreSearch(hisItem)">{{
                        hisItem
                    }}</view>
                </block>
            </view>
        </view>
		
        <!-- 热门搜索 -->
        <view class="hot" v-if="hot_search.length && status == 1">
            <view class="pl-[24rpx] pt-[36rpx] pb-[26rpx] text-sm text-muted">热门搜索</view>

            <view class="w-full px-[24rpx] flex flex-wrap">
                <view
                	v-for="(hotItem, index) in hot_search" :key="index"
                    class="truncate pt-[20rpx] pb-[20rpx] pr-[20rpx] w-1/2"
                    @click="handleHistoreSearch(hotItem.name)"
                    >{{ hotItem.name }}
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, onMounted } from 'vue'

const emit = defineEmits<{
    (event: 'search', value: string): void
    (event: 'clear', value: void): void
}>()

const props = withDefaults(
    defineProps<{
        hot_search?: any[]
        his_search?: string[]
        status: number
    }>(),
    {
        hot_search: [],
        his_search: [],
        status: 0
    }
)

const handleHistoreSearch = (text: string) => {
    emit('search', text)
}
onMounted(() => {
    console.log('props', props.hot_search)
})
</script>

<style lang="scss" scoped>
.suggest {
    height: 100%;
	
	.keyword {
		padding: 8rpx 12rpx;
		background-color: #f4f4f4;
		border-radius: 10rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}
}
</style>
