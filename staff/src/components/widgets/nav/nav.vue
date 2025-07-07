<template>
    <view 
	class="nav pt-[30rpx] pb-[16rpx] bg-white" 
	v-if="content.data.length && content.enabled"
	style="border-radius: 20rpx;overflow: hidden;"
	>
        <view class="nav-item flex flex-wrap">
            <view
                v-for="(item, index) in content.data"
                :key="index"
                class="flex flex-col items-center w-1/5 mb-[30rpx]"
                @click="handleClick(item.link)"
            >
                <u-image width="50px" height="50px" :src="getImageUrl(item.image)" alt="" border-radius="10rpx" />
                <view class="mt-[14rpx]">{{ item.name }}</view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
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
    }
})

const handleClick = (link: any) => {
    console.log('link', link)
    uni.navigateTo({ url: link.path })
}
const { getImageUrl } = useAppStore()
</script>

<style></style>
