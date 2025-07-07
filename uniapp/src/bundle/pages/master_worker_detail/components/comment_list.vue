<template>
    <view class="card" v-for="(item,index) in commentData" :key="index">
        <view class="card--header flex justify-between col-start">
            <view class="flex">
                <u-image :src="item.user.avatar" width="80" height="80" border-radius="50%"></u-image>
                <view class="ml-[20rpx]">
                    <view class="text-base normal font-medium">{{ item.user.nickname }}</view>
                    <view class="text-muted text-xs mt-[10rpx]">{{ item.create_time }}</view>
                </view>
            </view>
            <view class="flex">
                <u-rate
                    :count="5"
                    v-model="item.service_comment"
                    size="28"
                    inactive-icon="star-fill"
					:active-color="$theme.primaryColor"
                ></u-rate>
            </view>
        </view>

        <view class="card--main">
            <view class="content">
                {{ item.comment }}
            </view>

            <view class="flex flex-wrap">
                <block v-for="(imageItem, imageIndex) in item.goods_comment_image" :key="imageIndex">
                    <view
                        class="mt-[10rpx]"
                        :class="{ 'mr-[10rpx]': (imageIndex + 1) % 4 != 0 }"
                        @click.stop="previewImage(imageItem.uri)"
                    >
                        <u-image :src="imageItem.uri" width="150" height="150" border-radius="14rpx"></u-image>
                    </view>
                </block>
            </view>

            <view class="reply normal text-base mt-[20rpx]" v-if="item.reply">
                <text class="font-medium">商家回复: </text>
                <text class="text-[#909399]">
                    {{ item.reply }}
                </text>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>

const props = withDefaults(
    defineProps<{
        commentData: any
    }>(),
    {
        commentData: []
    }
)

// 查看评价图片
const previewImage = (url: string) => {
    uni.previewImage({
        urls: [url]
    })
}
</script>

<style lang="scss" scoped>
.card {
    margin-bottom: 40rpx;
    padding-bottom: 40rpx;
	border-bottom: solid #f4f4f5 1px;
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
.card:last-child {
	border-bottom: 0;
}
</style>
