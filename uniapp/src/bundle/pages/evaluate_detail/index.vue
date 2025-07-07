<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="card">
        <view class="card--header flex justify-between col-start">
            <view class="flex">
                <u-image :src="commentData.user?.avatar" width="80" height="80" border-radius="50%"></u-image>
                <view class="ml-[20rpx]">
                    <view class="text-base normal font-medium">{{ commentData.user?.nickname }}</view>
                    <view class="text-muted text-xs mt-[10rpx]">{{ commentData.create_time }}</view>
                </view>
            </view>
            <view class="flex">
                <u-rate
                    :count="5"
                    v-model="commentData.service_comment"
                    size="28"
                    inactive-icon="star-fill"
    				:active-color="$theme.primaryColor"
					:disabled="true"
                ></u-rate>
            </view>
        </view>
    
        <view class="card--main">
            <view class="content">
                {{ commentData.comment }}
            </view>
    
            <view class="flex flex-wrap">
                <block v-for="(item3, index) in commentData.goods_comment_image" :key="index">
                    <view
                        class="mt-[10rpx]"
                        :class="{ 'mr-[10rpx]': (index + 1) % 4 != 0 }"
                        @click.stop="previewImage(index)"
                    >
                        <u-image :src="item3.uri" width="150" height="150" border-radius="14rpx"></u-image>
                    </view>
                </block>
            </view>
    
            <view class="reply normal text-base mt-[20rpx]" v-if="commentData.reply">
                <text class="font-medium">商家回复: </text>
                <text class="text-[#909399]">
                    {{ commentData.reply }}
                </text>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiEvaluateGoodsDetail } from '@/api/goods'

const orderGoodsId = ref<number>(0)
const commentData = ref<any>([])

const getData = async () => {
    commentData.value = await apiEvaluateGoodsDetail({ order_goods_id: orderGoodsId.value })
}

// 查看评价图片
const previewImage = (current: number) => {
    uni.previewImage({
        current,
        urls: commentData.value.goods_comment_image.map((el) => el.uri)
    })
}

onLoad((options: any) => {
    orderGoodsId.value = options.order_goods_id || 0
    getData()
})
</script>

<style lang="scss">
.card {
    border-radius: 20rpx;
    background-color: white;
    margin: 20rpx 20rpx 0 20rpx;
    padding: 30rpx;
    &--header {
        width: 100%;
    }
    &--main {
        .content {
            padding: 20rpx 0;
            font-size: 28rpx;
            color: #222222;
        }
        .reply {
            word-break: break-all;
            padding: 24rpx 20rpx;
            background-color: #f6f6f6;
            border-radius: 10rpx;
        }
    }
}
</style>
