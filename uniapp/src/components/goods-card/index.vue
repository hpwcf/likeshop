<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <template v-if="type == 'list'">
        <view class="content-list">
        	<block v-for="goodsItem in goodsList" :key="goodsItem.id">
        		<view class="goods-item mt-[20rpx] flex w-full">
        		    <u-image :src="goodsItem.image" width="200" height="200" border-radius="20rpx"></u-image>
					<view class="goods-info flex-1 ml-[20rpx]">
						<view class="u-flex justify-between mt-[10rpx]">
							<view class="truncate font-bold text-1xl">
							    {{ goodsItem.name }}
							</view>
							<view class="text-[#707070] text-[24rpx]">已售{{ goodsItem.sale_num }}</view>
						</view>
						<view class="u-flex flex-wrap text-[#707070] mt-[24rpx] text-[24rpx]" v-if="goodsItem?.label">
							<text v-for="(labelItem,labelIndex) in goodsItem.label" :key="labelIndex">
								{{ labelItem }}<text class="mr-[10rpx] ml-[10rpx]" v-if="(labelIndex + 1) < goodsItem.label.length">|</text>
							</text>
						</view>
						<view class="item-footer u-flex justify-between items-center">
						    <price :price="goodsItem?.price" :priceFontSize="'40rpx'" :priceIconFontSize="'24rpx'"></price>
							<view>
								<u-button type="primary" size="mini" @click="goPage(`/pages/goods/index?id=${goodsItem.id}`)">立即下单</u-button>
							</view>
						</view>
					</view>
        		</view>
        	</block>
        </view>
    </template>

    <template v-if="type == 'grid'">
		<view class="content-grid">
			<block v-for="goodsItem in goodsList" :key="goodsItem.id">
				<view
				    class="goods-item w-[340rpx] mt-[20rpx] flex bg-white"
				    @click="goPage(`/pages/goods/index?id=${goodsItem.id}`)"
				>
				    <u-image :src="goodsItem.image" width="300" height="300" border-radius="20rpx"></u-image>
				    <view class="goods-name truncate pt-[20rpx]">
				        {{ goodsItem.name }}
				    </view>
					<view class="u-flex flex-wrap text-[#707070] mt-[16rpx] text-[24rpx]" v-if="goodsItem?.label">
						<text v-for="(labelItem,labelIndex) in goodsItem.label" :key="labelIndex">
							{{ labelItem }}<text class="mr-[10rpx] ml-[10rpx]" v-if="(labelIndex + 1) < goodsItem.label.length">|</text>
						</text>
					</view>
				    <view class="item-footer u-flex justify-between items-center">
				        <price :price="goodsItem?.price" :priceFontSize="'40rpx'" :priceIconFontSize="'24rpx'"></price>
						<view class="text-[#707070] text-[24rpx]">已售{{ goodsItem.sale_num }}</view>
				    </view>
				</view>
			</block>
		</view>
    </template>
</template>

<script lang="ts" setup>
import Price from '@/components/price/index.vue'

/** Props Start **/
const props = withDefaults(
    defineProps<{
        type: string // 列表类型
        goodsList?: any // 商品数据
    }>(),
    {
        type: 'list',
        goodsList: []
    }
)

/** Props End **/

/** Methods Start **/
/**
 * @param { string } url
 * @return { void }
 * @description 跳转到商品
 */
const goPage = (url: string) => {
    uni.navigateTo({ url })
}
/** Methods End **/
</script>

<style lang="scss" scoped>
.content-grid {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	
	.goods-item {
	    display: inline-block;
	    overflow: hidden;
	    border-radius: 20rpx;
		padding: 20rpx 20rpx 90rpx;
		position: relative;
	
	    .goods-name {
	        width: 100%;
	        overflow: hidden;
	        white-space: nowrap;
	        text-overflow: ellipsis;
	        font-size: 28rpx;
	        color: #222222;
	        font-weight: 500;
	    }
		.item-footer {
			position: absolute;
			bottom: 14rpx;
			left: 0;
			width: 100%;
			padding: 0 20rpx;
		}
	}
}
.content-list {
	.goods-item {
	    border-radius: 20rpx;
		padding: 20rpx;
		background-color: #ffffff;
	
		.goods-info {
			position: relative;

			.item-footer {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
			}
		}
	}
}
</style>
