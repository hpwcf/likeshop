<template>
	<widget-root :styles="styles" v-if="content.data.length && content.enabled">
		<view class="banner translate-y-0">
			<LSwiper
				:content="content"
				:height="content.style === 2 ? '1100' : '321'"
				:circular="true"
				:effect3d="styles.effect3d"
				:mode="styles.mode"
				:border-radius="styles.border_radius"
				:indicator-pos="styles.indicator_pos"
				interval="7000"
				bgColor="transparent"
				@change="handleChange"
			></LSwiper>
		</view>
	</widget-root>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { navigateTo } from '@/utils/util'
import LSwiper from '@/components/l-swiper/l-swiper.vue'

const emit = defineEmits(['change'])
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
const handleClick = (link: any) => {
    navigateTo(link)
}

const handleChange = (index: number) => {
    emit('change', getImageUrl(props['content'].data[index].bg))
}
</script>

<style></style>
