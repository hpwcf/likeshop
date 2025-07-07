<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <!-- Main Start -->
    <uni-transition
        mode-class="zoom-in"
        needLayout="true"
        :show="collectData.length"
        :duration="500"
    >
        <block v-for="item in collectData" :key="item.id">
            <view class="collect flex justify-between" @click="toGoodsDetail(item.goods_id)">
                <view class="flex">
                    <u-image :src="item.image" width="140" height="140"></u-image>
                    <view class="ml-[20rpx]">
                        <view class="normal font-medium text-xl">{{ item.name }}</view>
                        <view class="mt-[24rpx]">
                            <price :price="item.price"></price>
                        </view>
                    </view>
                </view>
                <view class="pt-[30rpx]">
                    <u-button
                        size="mini"
                        :plain="true"
                        type="primary"
                        shape="circle"
                        @click="toGoodsDetail(item.goods_id)"
                        >去下单</u-button
                    >
                </view>
            </view>
        </block>
    </uni-transition>
    <!-- Main End -->
    <!-- empty Start -->
    <view class="empty" v-show="!collectData.length">
        <u-empty
            text="暂无收藏数据～"
            :src="'/static/images/empty/collection.png'"
            :icon-size="300"
            color="#888888"
        ></u-empty>
    </view>
    <!-- empty Start -->
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { apiCollectLists } from '@/api/user'
import Price from '@/components/price/index.vue'

/** Data Start **/
const collectData = ref([])
/** Data End **/

/** Methods Start **/
// 初始化收藏
const initCollect = async (): Promise<void> => {
    collectData.value = await apiCollectLists()
}
// 去商品详情
const toGoodsDetail = (id: number | null) => {
    uni.navigateTo({
        url: `/pages/goods/index?id=${id}`
    })
}
/** Methods End **/

/** Life Cycle Start **/
onShow(() => {
    initCollect()
})
/** Life Cycle End **/
</script>

<style lang="scss">
.collect {
    border-radius: 14rpx;
    background-color: white;
    margin: 20rpx 20rpx 0 20rpx;
    padding: 30rpx;
}

.empty {
    padding-top: 300rpx;
}
</style>
