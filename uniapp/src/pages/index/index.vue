<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar
            :front-color="$theme.navColor"
            :background-color="$theme.navBgColor"
        />
        <!-- #endif -->
    </page-meta>
    <view class="index" :style="pageStyle">
        <!-- 组件 -->
        <template
            v-for="(item, index) in state.pages"
            :key="index"
        >
            <template v-if="item.name == 'search'">
                <w-search
                    :pageMeta="state.meta"
                    :content="item.content"
                    :styles="item.styles"
                    :percent="percent"
                    :location="locationState"
                    :isLargeScreen="isLargeScreen"
                />
            </template>
            <template v-if="item.name == 'banner'">
                <w-banner
                    :content="item.content"
                    :styles="item.styles"
                    :isLargeScreen="isLargeScreen"
                    @change="(url) => { state.bannerImage = url }"
                />
            </template>
            <template v-if="item.name == 'nav'">
                <w-nav :content="item.content" :styles="item.styles"/>
            </template>
            <template v-if="item.name == 'title-bar'">
                <w-title-bar :content="item.content" :styles="item.styles"/>
            </template>
            <template v-if="item.name == 'rubik'">
                <w-rubik :content="item.content" :styles="item.styles"/>
            </template>
            <template v-if="item.name == 'area-goods'">
                <w-area-goods :content="item.content" :styles="item.styles"/>
            </template>
        </template>
		
        <!-- #ifdef H5 -->
		 <!-- 备案版权 -->
		 <view v-if="appStore.config?.copyright_list" style="margin-top: 50rpx;">
			 <view class="record_number" v-for="(item,index) in appStore.config?.copyright_list" :key="index">
			     <a :href="item.value" style="color: #495770; text-decoration: none">
			         {{ item.key }}
			     </a>
			 </view>
		 </view>
        <!-- #endif -->

        <!-- 返回顶部按钮 -->
        <u-back-top
            :scroll-top="scrollTop"
            :top="100"
            :customStyle="{
                backgroundColor: '#FFF',
                color: '#000',
                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)'
            }"
        >
        </u-back-top>

        <!--  #ifdef MP  -->
        <!--  微信小程序隐私弹窗  -->
        <!-- <mp-privacy-popup></mp-privacy-popup> -->
        <!--  #endif  -->

        <!-- 底部导航栏 -->
        <Tabbar />

        <!-- 定位提示弹窗 -->
        <modal-popup
            v-model:show="showLocationModal"
            :title="errorTitle"
            :content="errorContent"
            @refresh="getAllData"
        />
    </view>
</template>

<script setup lang="ts">
import { reactive, shallowRef, ref } from 'vue'
import { onShow, onPageScroll } from '@dcloudio/uni-app'
import { getDecoratePage } from '@/api/store'
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'
import { locationState, useLocation } from '@/hooks/useLocation'

import Tabbar from '@/components/tabbar/index.vue'
// #ifdef MP
// import MpPrivacyPopup from './component/mp-privacy-popup.vue'
// #endif

const appStore = useAppStore()
const paging = shallowRef()
const {
    showLocationModal,
    errorTitle,
    errorContent,
    getLocationData
} = useLocation()

const scrollTop = ref<number>(0)
const percent = ref<number>(0)
const state = reactive<{
    pages: any[]
    meta: any[]
    article: any[]
    bannerImage: string
}>({
    pages: [],
    meta: [],
    article: [],
    bannerImage: ''
})

// 是否联动背景图
const isLinkage = computed(() => {
    return state.pages.find((item: any) => item.name === 'banner')?.content.bg_style === 1
})
// 是否大屏banner
const isLargeScreen = computed(() => {
    return state.pages.find((item: any) => item.name === 'banner')?.content.style === 2
})

// 根页面样式
const pageStyle = computed(() => {
    const {bg_type, bg_color, bg_image} = state.meta[0]?.content || {}
    if (!isLinkage.value) {
        return bg_type == 1 ?
            {'background-color': bg_color} :
            {'background-image': `url(${appStore.getImageUrl(bg_image)})`}
    }
    else return {'background-image': `url(${appStore.getImageUrl(state.bannerImage)})`}
})

const getAllData = async () => {
	await getIndexData()
    if (!locationState.city_id) {
        await getLocationData()
        await getIndexData()
    }
}

const getIndexData = async () => {
    const res = await getDecoratePage({
        type: 1,
        city_id: locationState.city_id
    })
    state.pages = res?.data
    state.meta = res?.meta
    uni.setNavigationBarTitle({
        title: state.meta[0].content.title
    })
}

onPageScroll((event: any) => {
    scrollTop.value = event.scrollTop
    const top = uni.upx2px(100)
    percent.value = event.scrollTop / top > 1 ? 1 : event.scrollTop / top
})

onShow( () => { getAllData() })

// #ifdef MP
const updateManager = uni.getUpdateManager()
updateManager.onUpdateReady(function () {
    uni.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res: any) {
            if (res.confirm) {
                // 新的版本已经下载好 应用新版本并重启
                updateManager.applyUpdate()
            }
        }
    })
})
updateManager.onUpdateFailed(function () {
    uni.$u.toast('新版本下载失败，请检查网络！')
})
// #endif
</script>

<style lang="scss" scoped>
.index {
    padding-bottom: 100px;
    background-size: contain;
    background-repeat: no-repeat;
}
.record_number {
    text-align: center;
    font-size: 21rpx;
	padding: 5px 0;
}
</style>