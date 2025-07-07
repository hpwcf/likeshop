<template>
    <u-popup
        v-model="showPop"
        height="860"
        mode="bottom"
        border-radius="0"
        :closeable="true"
        @close="showPop = false"
        :safe-area-inset-bottom="true"
    >
        <view class="p-[25rpx]">
            <!-- Header Start -->
            <view class="flex col-start">
                <view @click="previewImage(0)">
                    <u-image
                        :src="goodsImage"
                        width="200"
                        height="200"
                        border-radius="14rpx"
                    ></u-image>
                </view>
                <view class="m-[20rpx]">
                    <view class="text-xl font-medium normal h-[120rpx]">{{ goodsName }}</view>
                    <view class="text-primary">
						<price :price="goodsPrice" priceFontSize="36rpx" priceIconFontSize="26rpx"></price>
                    </view>
                </view>
            </view>
            <!-- Header End -->

            <!-- Main Start -->
            <view class="mt-[44rpx]">
                <view class="text-muted mb-[30rpx]">项目</view>
                <view class="list">
                    <view class="item u-flex justify-between font-bold" v-for="item in itemLists" :key="item.id">
						<view class="flex flex-1">
							<view v-for="(item2,index2) in item.sku_value_arr" :key="index2">
								<text>{{ item2 }}</text><text v-if="(index2 + 1) < item.sku_value_arr.length">/</text>
							</view>
						</view>
						<view>￥{{ item.price }}</view>
					</view>
                </view>
            </view>
            <!-- Main End -->

        </view>
    </u-popup>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import Price from '@/components/price/index.vue'

const emit = defineEmits(['confirm'])

const props = withDefaults(
    defineProps<{
        goodsImage: string // 服务图片
        goodsName: string // 服务名称
        goodsPrice: string // 服务价格
        itemLists: any[] // 项目列表
    }>(),
    {
        goodsImage: '',
        goodsName: '',
        goodsPrice: '',
        itemLists: []
    }
)

const goodsNum = ref<number>(1)
const showPop = ref<boolean>(false)

// const goodsImg = computed(() => props.goodsImage[0] || {})

// 立即预约
const onClick = () => {
    emit('confirm', goodsNum.value)
}
// 查看商品图片
const previewImage = (current: number) => {
    uni.previewImage({
        current,
        urls: props.goodsImage.map((el: any) => el.image)
    })
}

// 暴露组件值
defineExpose({
    showPop
})
</script>
<style lang="scss" scoped>
.padding {
    padding: 0 30rpx;
}

.list {
	// height: 420rpx;
	// overflow-y: auto;
		
	.item {
		padding: 30rpx 20rpx;
		background-color: #f5f7f9;
		margin-bottom: 20rpx;
		border-radius: 14rpx;
	}
}

// 底部按钮
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    position: fixed;
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);
    padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
}
</style>
