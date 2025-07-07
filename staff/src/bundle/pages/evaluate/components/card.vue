<template>
    <view class="card">
        <view class="card--header flex justify-between col-start">
            <view class="flex">
                <u-image :src="data.user.avatar" width="80" height="80" border-radius="50%"></u-image>
                <view class="ml-[20rpx]">
                    <view class="text-base normal font-medium">{{ data.user.nickname }}</view>
                    <view class="text-muted text-xs mt-[10rpx]">{{ data.create_time }}</view>
                </view>
            </view>
            <view>
                <u-rate
                    :count="5"
                    v-model="data.service_comment"
                    size="28"
                    inactive-icon="star-fill"
					active-color="#ff9600"
					:disabled="true"
                ></u-rate>
            </view>
        </view>

        <view class="card--main">
			<!-- <view class="flex flex-wrap">
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
				<u-tag class="mt-[10rpx] mr-[10rpx]" text="专业负责" type="info" size="mini" color="#657390" bg-color="#f5f7f9" border-color="#f5f7f9" />
			</view> -->
			
            <view class="pt-[20rpx] pb-[30rpx] text-[#222222] text-[28rpx]">
                {{ data.comment }}
            </view>

            <view class="flex flex-wrap mb-[20rpx]">
                <block v-for="(item3, index) in data.goods_comment_image" :key="index">
                    <view
                        class="mt-[10rpx]"
                        :class="{ 'mr-[10rpx]': (index + 1) % 4 != 0 }"
                        @click.stop="previewImage(item3.uri)"
                    >
                        <u-image :src="item3.uri" width="150" height="150" border-radius="14rpx"></u-image>
                    </view>
                </block>
            </view>
			
			<view class="text-sm text-muted">已购  {{ data.goods_sku_desc }}</view>
        </view>
    </view>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        data: any
    }>(),
    {
        data: {},
    }
)

// 预览图片
const previewImage = (url:string) => {
	uni.previewImage({
		urls: [url]
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
}
</style>
