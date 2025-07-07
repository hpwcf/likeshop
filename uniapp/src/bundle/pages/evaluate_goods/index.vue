<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="container" v-if="tabList.length">
        <tabs
            :current="current"
            @change="handleChange"
            height="70"
            bar-width="60"
            :barStyle="{ bottom: '0' }"
            :auth="true"
            :activeColor="$theme.primaryColor"
        >
            <tab v-for="(item, i) in tabList" :key="i" :name="`${item.name}(${item.count})`">
                <view class="List pt-[20rpx]" v-if="isLogin">
                    <List :cid="item.id" :i="i" :index="current" :goods_id="goodsId"></List>
                </view>
            </tab>
        </tabs>
    </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiEvaluateGoodsCategory } from '@/api/goods'
import List from './components/list.vue'
import { useUserStore } from '@/stores/user'

const goodsId = ref<number>(8)

const tabList = ref<any>([])
const current = ref<number>(0)
// 是否登录
const userStore = useUserStore()
const isLogin = computed(() => userStore.token)

const handleChange = (index: number) => {
    current.value = Number(index)
}

const getData = async () => {
    const data = await apiEvaluateGoodsCategory({ goods_id: goodsId.value })
    tabList.value = [...data.comment]
}

onLoad((options: any) => {
    goodsId.value = options.id || 0
    getData()
})
</script>

<style lang="scss">
.container {
    display: flex;
    height: 100vh;
    overflow: hidden;
    flex-direction: column;
}

.main {
    flex: 1;
    min-height: 0;
    overflow: scroll;
    swiper {
        height: 100%;
    }
}
.List {
    height: calc(100vh - 86rpx);
}
</style>
