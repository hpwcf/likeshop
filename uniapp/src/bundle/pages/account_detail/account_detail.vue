<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="main">
        <tabs
            :current="current"
            height="80"
            bar-width="60"
            :auth="true"
            bgColor="#fff"
            :activeColor="$theme.primaryColor"
            inactiveColor="#666"
            :itemWidth="150"
            :is-scroll="false"
        >
            <tab v-for="(item, i) in tabList" :key="i" :name="item.name">
                <view class="list pt-[20rpx]">
                    <list :status="item.status" :i="i" :index="current" />
                </view>
            </tab>
        </tabs>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import list from './components/list.vue'
import tab from '@/components/tab/tab.vue'
import tabs from '@/components/tabs/tabs.vue'

const tabList = ref<any>([
    // {
    //     name: '全部',
    //     status: ''
    // },
    {
        name: '支出',
        status: 1
    },
    {
        name: '收入',
        status: 2
    }
])
const current = ref<number>(0)
</script>

<style lang="scss" scoped>
.list {
    height: calc(100vh - 44px - env(safe-area-inset-bottom));
}
</style>
