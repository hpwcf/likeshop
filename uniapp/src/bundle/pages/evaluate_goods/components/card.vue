<template>
    <view class="card">
        <view class="card--header flex justify-between col-start">
            <view class="flex">
                <u-image :src="user.avatar" width="80" height="80" border-radius="50%"></u-image>
                <view class="ml-[20rpx]">
                    <view class="text-base normal font-medium">{{ user.nickname }}</view>
                    <view class="text-muted text-xs mt-[10rpx]">{{ create_time }}</view>
                </view>
            </view>
            <view class="flex">
                <u-rate
                    :count="5"
					:current="service_comment"
                    size="28"
                    inactive-icon="star-fill"
					:active-color="$theme.primaryColor"
					:disabled="true"
                ></u-rate>
            </view>
        </view>

        <view class="card--main">
            <view class="content">
                {{ comment }}
            </view>

            <view class="flex flex-wrap">
                <block v-for="(item3, index) in goods_comment_image" :key="index">
                    <view
                        class="mt-[10rpx]"
                        :class="{ 'mr-[10rpx]': (index + 1) % 4 != 0 }"
                        @click.stop="previewImage(index)"
                    >
                        <u-image :src="item3.uri" width="150" height="150" border-radius="14rpx"></u-image>
                    </view>
                </block>
            </view>

            <view class="reply normal text-base mt-[20rpx]" v-if="reply">
                <text class="font-medium">商家回复: </text>
                <text class="text-[#909399]">
                    {{ reply }}
                </text>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        goods_id: string | number
        comment: string | null
        goods_comment_image: string | null
        reply: string | null
        create_time: string | null
        service_comment: string | number | any
        user: any
    }>(),
    {
        goods_id: '',
        comment: '',
        goods_comment_image: '',
        reply: '',
        create_time: '',
        service_comment: '',
        user: {
            avatar: '',
            nickname: ''
        }
    }
)

// 查看评价图片
const previewImage = (current: number) => {
    uni.previewImage({
        current,
        urls: props.goods_comment_image.map((el) => el.uri)
    })
}
</script>

<style lang="scss" scoped>
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
