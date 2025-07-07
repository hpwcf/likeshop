<template>
    <div
        class="user-service bg-white mx-[20rpx] mt-[20rpx] rounded-lg p-[30rpx]"
        v-if="content.enabled"
    >
        <div
            v-if="content.title"
            class="title font-medium text-lg"
        >
            <div>{{ content.title }}</div>
        </div>
        <!-- 横排 -->
        <div v-if="content.style == 1" class="grid grid-cols-4 gap-x-6">
            <div
                v-for="(item, index) in content.data"
                :key="index"
                class="flex flex-col items-center pt-[40rpx]"
                @click="handleClick(item)"
            >
                <u-image width="68" height="68" :src="getImageUrl(item.image)" alt="" />
                <div class="mt-2 text-xs">{{ item.name }}</div>
            </div>
        </div>
        <!-- 竖排 -->
        <div v-if="content.style == 2">
            <div
                v-for="(item, index) in content.data"
                :key="index"
                class="flex items-center h-[100rpx] px-[24rpx]"
                @click="handleClick(item)"
            >
                <u-image width="52" height="52" :src="getImageUrl(item.image)" alt="" />
                <div class="ml-[20rpx] flex-1">{{ item.name }}</div>
                <div class="text-muted">
                    <u-icon name="arrow-right" />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { navigateTo } from '@/utils/util'
import { computed } from 'vue'

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
const { getImageUrl } = useAppStore()
const kefuInfo = computed(() => useAppStore().kefuInfo)
const handleClick = (item: any) => {
	if (item.link.path === '/bundle/pages/contact_service/index') {
		switch (parseInt(kefuInfo.value.way)) {
		    case 1:
		        navigateTo(item.link)
		        break
		    case 2:
		        if (!kefuInfo.value.phone) {
					uni.$u.toast('请在后台配置客服电话号码')
		        } else {
					uni.makePhoneCall({
					    phoneNumber: kefuInfo.value.phone
					})
				}
		        break
		    default:
		        break
		}
	} else {
		navigateTo(item.link)
	}
}
</script>

<style lang="scss"></style>
