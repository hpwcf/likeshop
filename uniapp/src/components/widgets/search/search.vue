<template>
    <view>
        <!-- #ifndef H5 -->
        <u-sticky h5-nav-height="0" bg-color="transparent">
            <u-navbar
                :class="{ 'fixed top-0 z-10': isLargeScreen }"
                :is-back="false"
                :is-fixed="true"
                :title="metaData.title"
                :custom-title="metaData.title_type == 2"
                :border-bottom="false"
                :title-bold="true"
                :background="{ background: `rgba(256,256, 256, ${percent})` }"
                :title-color="percent > 0.5 ? '#000' : metaData.text_color == 1 ? '#fff' : '#000'"
            >
                <template #default>
                    <!-- 城市 -->
                    <router-navigate
                        class="flex-1 flex row "
                        to="/bundle/pages/location/index"
                    >
                        <view class="flex row pl-3">
                            <u-icon
                                class="mr-[10rpx]"
                                name="map"
                                size="34"
                            ></u-icon>
                            <text class="mr-[6rpx] text-main text-lg font-medium">{{ location.name }}</text>
                            <u-icon name="arrow-right" size="20" color="#333"></u-icon>
                        </view>
                    </router-navigate>
                </template>
                <template #title>
                    <image
                        class="!h-[54rpx] w-[54rpx]"
                        :src="appStore.getImageUrl(metaData.title_img)"
                        mode="widthFix"
                    ></image>
                </template>
            </u-navbar>
        </u-sticky>
        <!-- #endif -->
        <widget-root :styles="styles" v-if="content.enabled">
            <view class="search flex items-center">
                <!--  #ifdef H5  -->
                <div
                    class="flex items-center mr-4"
                    @click="router.navigateTo('/bundle/pages/location/index')"
                >
                    <u-icon name="map" size="32"></u-icon>
                    <view
                        style="width: 100rpx;"
                        class="text-main text-base line-clamp-1"
                    >
                        {{ location.name || '请选择' }}
                    </view>
                    <u-icon name="arrow-down" size="20"></u-icon>
                </div>
                <!--  #endif  -->
                <view
                    class="search-con flex-1 flex items-center px-[30rpx]"
                    :style="{ 'background': styles.component_bg_color }"
                    @click="router.navigateTo('/bundle/pages/search/index')"
                >
                    <u-icon name="search" size="30" :color="styles.icon_color"></u-icon>
                    <view
                        class="flex-1"
                        :style="{
                            'text-align': styles.align,
                            'color': styles.text_color
                        }"
                    >
                        <text class="mr-[10rpx]">{{ content.placeholder }}</text>
                    </view>
                </view>
            </view>
        </widget-root>
    </view>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {useRouter} from "uniapp-router-next";
import { useAppStore } from "@/stores/app";


const router = useRouter()
const appStore = useAppStore()
const props = defineProps({
    content: {
        type: Object,
        default: () => ({})
    },
    styles: {
        type: Object,
        default: () => ({})
    },
    isLargeScreen: {
        type: Boolean
    },
    location: {
        type: Object,
        default: () => ({})
    },
    percent: {
        type: Number
    }
})

const metaData: any = computed(() => {
    return props.pageMeta[0].content
})
</script>

<style lang="scss" scoped>
.search {
    height: 84rpx;

    .search-con {
        height: 100%;
        height: 40px;
        border-radius: 44px;
        background: #ffffff;
        color: #999999;
    }
}
</style>
