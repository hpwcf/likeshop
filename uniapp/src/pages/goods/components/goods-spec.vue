<template>
    <u-popup
        v-model="showPop"
        height="860"
        mode="bottom"
        border-radius="0"
        :safe-area-inset-bottom="true"
    >
        <view class="p-[25rpx]">
            <!-- Header Start -->
            <view class="flex col-start">
                <view @click="previewImage(0)">
                    <u-image
                        :src="goodsImage[0]?.image"
                        width="140"
                        height="140"
                        border-radius="16rpx"
                    ></u-image>
                </view>
                <view class="ml-[20rpx] u-flex justify-between flex-1">
                    <view class="flex-1 text-xl font-medium normal mr-[20rpx]">{{ goodsName }}</view>
                    <view class="font-bold" :style="{'color':$theme.primaryColor}">￥{{ skuPrice }}</view>
                </view>
            </view>
            <!-- Header End -->

            <!-- Main Start -->
			<view class="sku">
				<scroll-view scroll-y="true" style="height: 380rpx;">
					<view class="mb-[30rpx]" v-for="(item,index) in skuNameList" :key="item.id">
						<view>{{ item.name }}</view>
						<view class="flex flex-wrap mt-[20rpx]">
							<view :class="{'sku-item':true,'sku-active':selectNameIds.indexOf(item2.id) != -1}" v-for="item2 in item.value" :key="item2.id" @click="choiceSkuItem(index,item2.id)">{{ item2.value }}</view>
						</view>
					</view>
				</scroll-view>
			</view>
            <!-- Main End -->

            <!-- Footer Start -->
            <view class="footer">
				<view class="mt-[10rpx] mb-[30rpx] flex justify-between">
					<view>数量</view>
					<view>
						<u-number-box bgColor="transparent" :min="1" v-model="goodsNum" :input-width="60" bg-color="#ffffff"></u-number-box>
					</view>
				</view>
                <view>
					<button
					    class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx]"
					    @click="onConfirm"
					>
					    确认预约
					</button>
				</view>
            </view>
            <!-- Footer End -->
        </view>
    </u-popup>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['confirm'])

const props = withDefaults(
    defineProps<{
        goodsImage: any // 商品图片
        goodsName: string // 商品名称
        goodsPrice: string // 商品价格
		sku: any
		skuNameList: any
    }>(),
    {
        goodsImage: [],
        goodsName: '',
        goodsPrice: '',
        sku: [],
        skuNameList: []
    }
)

const goodsNum = ref<number>(1)
const showPop = ref<boolean>(false)
const skuPrice = ref()
const selectNameIds = ref<any>([])
const selectSku = ref<any>({})

// 立即预约
const onConfirm = () => {
    emit('confirm', goodsNum.value, selectSku.value.id)
}
// 查看图片
const previewImage = (current: number) => {
    uni.previewImage({
        current,
        urls: props.goodsImage.map((el: any) => el.image)
    })
}
//选择规格
const choiceSkuItem = (index:number,id:number) => {
	selectNameIds.value[index] = id
}

// 暴露组件值
defineExpose({
    showPop
})

// 初始化数据
watch(
    () => props.skuNameList,
    (value) => {
		selectNameIds.value = []
		skuPrice.value = props.goodsPrice
        for(let i in props.skuNameList){
        	selectNameIds.value.push(props.skuNameList[i].value[0].id) 
        }
    },
    { immediate: true }
)
// 监听选择规格
watch(
    () => selectNameIds.value,
    (value) => {
		selectSku.value = props.sku.find(item => item.sku_value_ids.toString() === selectNameIds.value.toString())
		skuPrice.value = selectSku.value.price
    },
    { deep: true }
)
</script>
<style lang="scss" scoped>
.sku {
	margin-top: 30rpx;
	
	.sku-item {
		padding: 10rpx 16rpx;
		background-color: #f4f4f5;
		margin-right: 20rpx;
		border-radius: 8rpx;
		border: 1px solid #f4f4f5;
	}
	.sku-item.sku-active {
		background-color: #ffffff;
		border: 1px solid var(--color-primary, #FFC244);
		color: var(--color-primary, #FFC244);
	}
}

.padding {
    padding: 0 30rpx;
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
