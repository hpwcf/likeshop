<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
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
			<view class="flex justify-between" style="align-items: center;">
			    <view class="text-primary">
			        <price
			            :price="goodsData.price"
			            :scribingPrice="goodsData.line_price"
			        ></price>
			    </view>
				<view class="text-xs normal text-[#707070]">
				    已售{{ goodsData.sale_num }}
				</view>
			</view>
			<view class="mt-[20rpx] mb-[30rpx] font-bold u-font-36">{{ goodsData.name }}</view>
			<view class="u-flex flex-wrap text-[#707070] text-[24rpx]" v-if="goodsData?.label">
				<text v-for="(labelItem,labelIndex) in goodsData.label" :key="labelIndex">
					{{ labelItem }}<text class="mr-[10rpx] ml-[10rpx]" v-if="(labelIndex + 1) < goodsData.label.length">|</text>
				</text>
			</view>
		</view>

        <!-- 用户评价 -->
		<view class="goods-comment" @click="goPage(`/bundle/pages/evaluate_goods/index?id=${goodsId}`)" v-if="goodsData.goods_comment?.num">
		    <view class="flex justify-between">
		        <text class="text-1xl font-bold">评价({{ goodsData.goods_comment.num  }})</text>
		        <view class="u-flex text-[#707070]">
		            <text class="mr-[10rpx] text-xs">好评率{{ goodsData.goods_comment.rate }}</text>
		            <u-icon name="arrow-right" color="#707070" size="20"></u-icon>
		        </view>
		    </view>
			<view>
			    <block v-for="commenItem in goodsData.goods_comment.lists" :key="commenItem.id">
			        <view class="goods-comment-item mt-[20rpx]">
			            <view class="flex justify-between">
							<view class="flex">
								<u-image
								    :src="commenItem.user?.avatar"
								    width="80"
								    height="80"
								    border-radius="50%"
								></u-image>
								<view class="ml-[20rpx]">
								    <view class="text-base normal">{{ commenItem.user.nickname }}</view>
								    <view class="text-xs text-muted">{{ commenItem.update_time }}</view>
								</view>
							</view>
							<view>
								<u-rate :count="5" v-model="commenItem.service_comment" :disabled="true" :active-color="$theme.primaryColor"></u-rate>
							</view>
			            </view>
			            <view class="text-base normal u-line-2 mt-[20rpx] mb-[20rpx]">{{ commenItem.comment }}</view>
			            <view class="flex flex-wrap">
			                <block v-for="(commentImage, index) in commenItem.goods_comment_image" :key="index">
			                    <view
			                        class="mt-[10rpx]"
			                        :class="{ 'mr-[10rpx]': (index + 1) % 4 != 0 }"
			                        @click.stop="previewImage(index)"
			                    >
			                        <u-image :src="commentImage.uri" width="160" height="160" border-radius="14rpx"></u-image>
			                    </view>
			                </block>
			            </view>
			        </view>
			    </block>
			</view>
		</view>

        <!-- 服务详情 -->
        <view style="padding-bottom: 200rpx">
			<view class="service-content">
				<view class="text-[34rpx] font-bold pb-[30rpx]">服务详情</view>
				<mp-html :content="goodsData.content" />
			</view>
        </view>

		<view class="footer u-flex fixed justify-around">
			<view class="flex-col col-center row-center w-[46rpx]" @click="handleCollection(!goodsData.is_collect)" style="line-height: 1;">
				<image
					class="w-[40rpx] h-[40rpx]"
					:src="
						goodsData.is_collect == 1
							? '/static/images/icon_collection_s.png'
							: '/static/images/icon_collection.png'
					"
				>
				</image>
				<text class="xxs lighter text-[22rpx]">收藏</text>
			</view>
			<view class="flex-col col-center row-center w-[46rpx]" @click="showShare = true" style="line-height: 1;">
				<image
					class="w-[40rpx] h-[40rpx]"
					src="/static/images/icon_share.png"
				>
				</image>
				<text class="xxs lighter text-[22rpx]">分享</text>
			</view>
			<button
			    class="bg-primary text-lg text-white leading-[70rpx] h-[70rpx] w-[400rpx] m-0"
			    @click="onAppointment()"
			>
			    立即预约
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
		:goodsImage="goodsData.goods_image?.data"
		:goodsName="goodsData.name"
		:goodsPrice="goodsData.price"
		:sku="goodsData.sku"
		:skuNameList="goodsData.sku_name_list"
		@confirm="handleOrder"
	/>
	<!-- 分享海报 -->
	<SharePopup
		v-model:show="showShare"
		:goodsId="goodsData.id"
		:goodsPrice="goodsData.price"
		:goodsName="goodsData.name"
		:goodsImage="goodsData.image"
		@close="showShare = false"
	></SharePopup>
</template>

<script setup lang="ts">
import { ref, computed, reactive, shallowRef, unref } from 'vue'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import LaSwiper from '@/components/la-swiper/index.vue'
import Card from './components/card.vue'
import GoodsSpec from './components/goods-spec.vue'
import Price from '@/components/price/index.vue'
import { apiGoodsDetail, apiGoodsCollection } from '@/api/goods'
import { removeStorageData } from '@/utils/util'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import{ locationState } from '@/hooks/useLocation'
import SharePopup from '@/components/share-popup/share-popup.vue'

const goodsData = ref<any>({})
const appStore = useAppStore()
const userStore = useUserStore()
const isLogin = computed(() => userStore.token)
const isEmpty = ref(true)
const goodsId = ref<number | string>('')
const goodsSpecRef = shallowRef<InstanceType<typeof GoodsSpec> | any>()
const showShare = ref(false)

/**
 * @description 获取商品详情
 */
const initGoodaDetail = async (): Promise<void> => {
    try {
        goodsData.value = await apiGoodsDetail({
            id: goodsId.value,
            city_id: locationState.city_id
        })
    } catch (error) {
        console.log(error)
        isEmpty.value = false
    }
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

// 处理预约
const handleOrder = (goodsNum: number = 1,skuId: number) => {
	if (!isLogin.value) {
		uni.showModal({
			content: '请先登录!',
			confirmText: '前往登录',
			success: function (res) {
				if (res.confirm) {
					goPage(`/pages/login/login`)
				}
			}
		})
		return 
	}
    try {
        const goods = {
            goods_num: goodsNum,
            id: goodsId.value,
            sku_id: skuId
        }

        const params = {
            goodsData: goods
        }
        goPage(`/pages/order_buy/index?params=${JSON.stringify(params)}`)
    } catch (error) {
        console.log('确认预约错误', error)
    }
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
::v-deep .u-numberbox .u-icon-minus {
	border-radius: 50% !important;
	width: 46rpx !important;
	height: 46rpx !important;
	border: 1px solid var(--color-primary, #FFC244) !important;
	background: unset !important;
	.num-btn {
		color: var(--color-primary, #FFC244) !important;
		top: 0 !important;
	}
}
::v-deep .u-numberbox .u-icon-plus {
	border-radius: 50% !important;
	width: 46rpx !important;
	height: 46rpx !important;
	border: 1px solid var(--color-primary, #FFC244) !important;
	background: var(--color-primary, #FFC244) !important;
	.num-btn {
		color: #FFFFFF !important;
		top: 0 !important;
	}
}
.goods {
	padding: 20rpx;
	.goods-desc {
		padding: 30rpx 24rpx 24rpx;
		margin: 30rpx 0;
		background-color: #ffffff;
		border-radius: 20rpx;
	}
	.goods-comment {
		margin-bottom: 30rpx;
		.goods-comment-item {
			padding: 20rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
		}
	}
	.service-content {
		padding: 24rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		
		::v-deep image,.service-content ::v-deep img {
			vertical-align:middle;
		}
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
    position: fixed;
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);
    padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
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
