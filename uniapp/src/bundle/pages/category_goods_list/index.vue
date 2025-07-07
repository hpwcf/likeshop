<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="container">
        <scroll-view
            class="menu"
            scroll-x="true"
            :scroll-left="160 * idx"
            v-if="menuData.sons.length"
        >
            <view
                class="menu--item"
                :class="{ active: categoryId === menuData.info.id }"
                @click="changeTabs(menuData.info)"
            >
                <view class="flex justify-center">
                    <u-image src="@/bundle/static/images/icon_all.png" width="56" height="56" />
                </view>
                <view class="black font-medium mt-[14rpx]">{{ '全部服务' }}</view>
            </view>
            <block v-for="item in menuData.sons" :key="item.id">
                <view
                    class="menu--item"
                    :class="{ active: categoryId === item.id }"
                    @click="changeTabs(item)"
                >
                    <view class="flex justify-center">
                        <u-image :src="item.image" width="56" height="56" />
                    </view>
                    <view class="black font-medium mt-[14rpx]">{{ item.name }}</view>
                </view>
            </block>
        </scroll-view>

        <view class="main">
            <z-paging
                ref="paging"
                v-model="goodsData"
                @query="queryList"
                :fixed="false"
                height="100%"
            >
                <view class="px-[24rpx]">
                    <goods-card :goodsList="goodsData" type="grid"></goods-card>
                </view>
            </z-paging>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiGoodsCategoryLists, apiGoodsLists } from '@/api/store'
import GoodsCard from '@/components/goods-card/index.vue'

const categoryId = ref<number>()
const menuData = ref<any>({
    info: {},
    sons: []
})
const goodsData = ref<any>([])
const paging = shallowRef()
// 记录当前选中商品下标
const idx = ref(0)

onLoad((options: any) => {
    categoryId.value = options?.id * 1 || 0
    getCategoryList()
})

// 切换菜单
const changeTabs = (event: any) => {
    // 如果点击同一个2次的话那就是取消当前选择然后选择一级分类的商品
    categoryId.value = event.id === categoryId.value ? menuData.value.info.id : event.id
    paging.value.reload()
}

// 获取分类列表
const getCategoryList = async (): Promise<void> => {
    try {
        const res: any = await apiGoodsCategoryLists({ id: categoryId.value })
        uni.setNavigationBarTitle({
            title: res.info.name
        })
        menuData.value = res
        if (menuData.value.sons.length) {
            idx.value = menuData.value.sons.findIndex((item) => item.id === categoryId.value)
        }
    } catch (err) {
        console.log(err)
    }
}

// 获取商品列表
const queryList = async (pageNo: number, pageSize: number) => {
    try {
        const { lists } = await apiGoodsLists({
            page_no: pageNo,
            page_size: pageSize,
            category_id: categoryId.value
        })
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}
</script>

<style lang="scss">
.container {
    display: flex;
    height: 100vh;
    overflow: hidden;
    flex-direction: column;

    .menu {
        height: 188rpx;
        white-space: nowrap;
        box-sizing: border-box;
        padding: 20rpx 0 20rpx 24rpx;

        &--item {
            width: 160rpx;
            height: 148rpx;
            padding: 20rpx 0;
            margin-right: 20rpx;
            display: inline-block;
            text-align: center;
            font-size: 26rpx;
            border-radius: 10rpx;
            background-color: #ffffff;
        }

        .active {
            color: #ffffff;
            background-color: var(--color-primary, #FFC244);
        }
    }

    .main {
        flex: 1;
        min-height: 0;
        overflow: scroll;
    }
}
</style>
