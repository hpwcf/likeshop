<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="order-list">
        <!-- <u-tabs
            :list="tabList"
            :bg-color="$theme.primaryColor"
            active-color="#fff"
            inactive-color="#fff"
            :is-scroll="true"
            v-model="current"
            @change="change"
            height="80"
        ></u-tabs> -->
        <tabs
            :current="current"
            @change="change"
            height="80"
            bar-width="60"
            :barStyle="{ bottom: '0' }"
            :auth="true"
            :bgColor="$theme.primaryColor"
            activeColor="#fff"
            inactiveColor="#fff"
        >
            <tab v-for="(item, i) in tabList" :key="i" :name="item.name"> </tab>
        </tabs>
        <view class="orderList pt-[20rpx]" v-if="userStore.isLogin">
            <orderList :order_status="current"></orderList>
        </view>
        <view v-else>
            <u-empty
                :src="'/static/images/empty/order.png'"
                text="您还没有登录～"
                mode="data"
                :icon-size="300"
                margin-top="300"
                color="#888888"
            >
                <template #bottom>
                    <view class="mt-4">
                        <u-button
                            shape="circle"
                            @click="goPage('/pages/login/login')"
                            :ripple="true"
                            :hair-line="false"
                            type="info"
                        >
                            去登录</u-button
                        >
                    </view>
                </template>
            </u-empty>
        </view>
    </view>

    <!-- 底部导航栏 -->
    <Tabbar />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import orderList from './components/order-list.vue'
import Tabbar from '@/components/tabbar/index.vue'
import tab from '@/components/tab/tab.vue'
import tabs from '@/components/tabs/tabs.vue'
import { useUserStore } from '@/stores/user'
import { removeStorageData } from '@/utils/util'

const userStore = useUserStore()

const tabList = ref<any>([
    {
        name: '全部',
        order_status: 0
    },
    {
        name: '待支付',
        order_status: 1
    },
    {
        name: '预约中',
        order_status: 2
    },
    {
        name: '服务中',
        order_status: 3
    },
    {
        name: '已完成',
        order_status: 4
    },
    {
        name: '已关闭',
        order_status: 5
    }
])
const current = ref<number>(0)

const change = (index: number) => {
    current.value = Number(index)
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
    uni.navigateTo({ url: url })
}

onLoad(async (options: { type?: any }) => {
    current.value = options?.type * 1 || 0
    if (!Object.keys(options).length) {
        current.value = 0
    }
})
</script>

<style lang="scss" scoped>
::v-deep .u-numberbox .u-icon-minus {
	border-radius: 50% !important;
	width: 40rpx !important;
	height: 40rpx !important;
	border: 1px solid var(--color-primary, #FFC244) !important;
	background: unset !important;
	.num-btn {
		color: var(--color-primary, #FFC244) !important;
		top: 0 !important;
	}
}
::v-deep .u-numberbox .u-icon-plus {
	border-radius: 50% !important;
	width: 40rpx !important;
	height: 40rpx !important;
	border: 1px solid var(--color-primary, #FFC244) !important;
	background: var(--color-primary, #FFC244) !important;
	.num-btn {
		color: #FFFFFF !important;
		top: 0 !important;
	}
}
::v-deep .u-numberbox .uni-input-input {
	// color: var(--color-primary, #FFC244) !important;
	// font-size: 36rpx !important;
}
.element.style {
    background-color: red;
}
.orderList {
    height: calc(100vh - 190rpx - env(safe-area-inset-bottom));
}
</style>
