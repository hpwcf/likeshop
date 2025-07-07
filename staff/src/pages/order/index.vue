<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="order-list">
        <u-tabs
            :list="tabList"
            bg-color="#ffffff"
            :active-color="$theme.primaryColor"
            inactive-color="#000000"
            :is-scroll="false"
            v-model="tabCurrent"
            @change="change"
            height="80"
        ></u-tabs>
        <view class="orderList pt-[20rpx]" v-if="userStore.isLogin">
            <orderList :type="tabList[tabCurrent].type" @refresh="handleTabs"></orderList>
        </view>
        <view v-else>
            <Empty />
        </view>
    </view>

    <!-- 底部导航栏 -->
    <Tabbar />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import orderList from './components/order-list.vue'
import Tabbar from '@/components/tabbar/index.vue'
import { useUserStore } from '@/stores/user'
import { removeStorageData } from '@/utils/util'
import Empty from '@/components/empty/index.vue'

const userStore = useUserStore()
const tabList = ref<any>([
    {
        name: '接单池',
        type: 1,
		count: 0
    },
    {
        name: '待接单',
        type: 2,
		count: 0
    },
    {
        name: '进行中',
        type: 3,
		count: 0
    },
    {
        name: '已完成',
        type: 4
    },
    {
        name: '已关闭',
        type: 5
    }
])
const tabCurrent = ref<number>(0)

const change = (index: number) => {
    tabCurrent.value = Number(index)
}

const handleTabs = (extend: any) => {
	tabList.value[0].count = extend.grab_num || 0
	tabList.value[1].count = extend.receive_num || 0
	tabList.value[2].count = extend.service_num || 0
}

onShow(() => {
    removeStorageData('selectDate')
})

/**
 * @param { string } url
 * @return { void }
 * @description 跳转页面方法
 */
const goPage = (url: string) => {
    uni.redirectTo({ url: url })
}

onLoad(async (options: { type?: any }) => {
    tabCurrent.value = options?.type * 1 || 0
    if (!Object.keys(options).length) {
        tabCurrent.value = 0
    }
})
</script>

<style lang="scss" scoped>
.element.style {
    background-color: red;
}
.orderList {
    height: calc(100vh - 190rpx - env(safe-area-inset-bottom));
}
</style>
