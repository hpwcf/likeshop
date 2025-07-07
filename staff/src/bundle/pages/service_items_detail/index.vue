<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view v-show="isEmpty" class="goods">
        <!-- 轮播图 -->
        <la-swiper
            :content="goodsData.goods_image"
            height="750"
            indicatorPos="bottomRight"
            mode="number"
			:borderRadius="20"
        />

        <!-- 商品信息 -->
		<view class="goods-desc">
			<view class="u-flex justify-between">
				<view class="text-primary">
					<price :price="goodsData.price"></price>
				</view>
				<view class="text-xs normal text-[#707070]">
					已售{{ goodsData.sale_num }}
				</view>
			</view>
			<view class="mt-[16rpx] mb-[20rpx]">
				<text class="font-bold u-font-36 mt-[20rpx] mb-[20rpx]">{{ goodsData.name }}</text>
			</view>
			<view class="u-flex flex-wrap text-[#707070] text-[24rpx]" v-if="goodsData?.label">
				<text v-for="(labelItem,labelIndex) in goodsData.label" :key="labelIndex">
					{{ labelItem }}<text class="mr-[10rpx] ml-[10rpx]" v-if="(labelIndex + 1) < goodsData.label.length">|</text>
				</text>
			</view>
		</view>

        <!-- 服务详情 -->
        <view class="pb-[140rpx]">
           <card title="服务详情" :border_bottom="false">
                <view class="service-content">
                    <mp-html :content="goodsData.content" />
                </view>
            </card>
        </view>

		<view class="footer">
			<!-- <u-button type="primary" size="medium" @click="onAppointment">查看规格</u-button> -->
			<button class="bg-primary text-lg text-white" @click="onAppointment">
				查看规格
			</button>
		</view>
    </view>

    <view v-show="!isEmpty" class="empty">
        <u-empty
            text="抱歉，该服务项目不存在~"
            :src="'/static/images/empty/collection.png'"
            :icon-size="300"
            color="#888888"
        >
            <template #bottom>
                <view class="empty-bottom">
                    <button
                        class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx]"
                        @click="goHome"
                    >
                        去看看其它
                    </button>
                </view>
            </template>
        </u-empty>
    </view>

	<!-- 规格选择 -->
	<goods-spec
		ref="goodsSpecRef"
		:goodsImage="goodsData.image"
		:goodsName="goodsData.name"
		:goodsPrice="goodsData.price"
		:itemLists="goodsData.sku"
	/>
</template>

<script setup lang="ts">
import { ref, computed, reactive, shallowRef, unref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import LaSwiper from '@/components/la-swiper/index.vue'
import Card from './components/card.vue'
import GoodsSpec from './components/goods-spec.vue'
import Price from '@/components/price/index.vue'
import { apiGoodsDetail } from '@/api/goods'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'


type TIME = {
    year: string
    date: string
    start_time: string
    end_time: string
}

const goodsData = ref<any>({})

// 是否登录
const userStore = useUserStore()
const isLogin = computed(() => userStore.token)
const isEmpty = ref(true)
const goodsId = ref<number | string>('')
const goodsSpecRef = shallowRef<InstanceType<typeof GoodsSpec> | any>()
const appointTime = ref<TIME>({
    year: '',
    date: '',
    start_time: '',
    end_time: ''
})

/**
 * @description 获取商品详情
 */

const appStore = useAppStore()
const initGoodaDetail = async (): Promise<void> => {
    goodsData.value = await apiGoodsDetail({ id: goodsId.value })
}

// 收藏
const handleCollection = async (collect: boolean | number | null): Promise<void> => {
    if (!isLogin.value) {
        return uni.$u.toast('请先登录!')
    }
    try {
        await apiGoodsCollection({
            id: unref(goodsId),
            is_collect: collect ? 1 : 0
        })
        initGoodaDetail()
    } catch (error) {
        //TODO handle the exception
        console.log('收藏请求错误', error)
    }
}

// 立即预约
const onAppointment = () => {
    goodsSpecRef.value.showPop = true
}

const goPage = (url: string) => {
    uni.navigateTo({ url: url })
}

// 返回首页
const goHome = () => {
    uni.reLaunch({ url: '/pages/index/index' })
}

onLoad((options) => {
    goodsId.value = options?.id || 0
    initGoodaDetail()
})

</script>

<style lang="scss" scoped>
.goods {
	padding: 20rpx;
	.goods-desc {
		padding: 30rpx 24rpx 24rpx;
		margin: 30rpx 0;
		background-color: #ffffff;
		border-radius: 20rpx;
		.service-desc .line {
			font-size: 24rpx;
			margin: 0 10rpx;
		}
		.service-desc:last-child .line {
			display: none;
		}
	}
	.goods-comment {
		.goods-comment-item {
			padding: 20rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
		}
	}
	.service-content ::v-deep image,.service-content ::v-deep img {
		vertical-align:middle;
	}
}
// 收藏图标
.collection {
    width: 44rpx;
    height: 44rpx;
}

.padding {
    padding: 0 30rpx;
}

// 底部按钮
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 108rpx;
    position: fixed;
	z-index: 11;
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);

    ::v-deep button {
		width: 100% !important;
	}
}

// 服务下架或不存在时
.empty {
    padding-top: 200rpx;

    .empty-bottom {
        width: 90vw;
        margin-top: 130rpx;
    }
}
</style>
