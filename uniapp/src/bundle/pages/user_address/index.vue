<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <!-- 收货地址的列表数据 -->
    <view class="address-list">
        <!-- 可用的 -->
		<view>
			<view
				v-for="(item, index) in addressList.usable"
				:key="item.id"
			    class="address-list--item u-flex justify-between mb-[20rpx]"
			    :data-id="item.id"
			    @click.stop="onSelect"
			>
			    <view class="flex-1">
			        <view class="sm text-muted text-[26rpx] mb-[20rpx]">
			            {{ item.province }}
			            {{ item.city }}
			            {{ item.district }}
			        </view>
			        <view>
			            <text class="text-[30rpx] font-bold">{{ item.address }}</text>
						<text class="default" v-if="item.is_default">默认</text>
			        </view>
			        <view class="mt-[20rpx] sm text-muted text-[26rpx]">
			            {{ item.contact }} {{ item.sex_desc }} {{ item.mobile }}
			        </view>
			    </view>
				<view class="flex">
					<view class="mr-[40rpx]" @click.stop="goEditAddress(item.id)">
						<u-icon name="edit-pen" color="#909399" :size="40"></u-icon>
					</view>
					<view  @click.stop="goDelAddress(item.id)">
						<u-icon name="trash" color="#909399" :size="40"></u-icon>
					</view>
				</view>
			</view>
		</view>
        
        <!-- 不可用的 -->
        <view v-if="addressList.unusable_goods?.length" class="mt-[40rpx]">
        	<view class="mb-[20rpx] text-sm text-muted">以下地址暂不在服务范围</view>
        	<view
        		v-for="(item, index) in addressList.unusable_goods"
        		:key="item.id"
        	    class="address-list--item u-flex justify-between mt-[20rpx]"
        	>
        	    <view class="flex-1">
        	        <view class="sm text-[#c8c9cc] text-[26rpx] mb-[20rpx]">
        	            {{ item.province }}
        	            {{ item.city }}
        	            {{ item.district }}
        	        </view>
        	        <view class="text-[#c8c9cc]">
        	            <text class="text-[30rpx] font-bold">{{ item.address }}</text>
        				<text class="default" v-if="item.is_default">默认</text>
        	        </view>
        	        <view class="mt-[20rpx] sm text-[#c8c9cc] text-[26rpx]">
        	            {{ item.contact }} {{ item.mobile }}
        	        </view>
        	    </view>
        		<view class="flex">
        			<view class="mr-[40rpx]" @click.stop="goEditAddress(item.id)">
        				<u-icon name="edit-pen" color="#c8c9cc" :size="40"></u-icon>
        			</view>
        			<view  @click.stop="goDelAddress(item.id)">
        				<u-icon name="trash" color="#c8c9cc" :size="40"></u-icon>
        			</view>
        		</view>
        	</view>
        </view>
        
        <!-- 不可用的 -->
        <view v-if="addressList.unusable_address?.length" class="mt-[40rpx]">
        	<view class="mb-[20rpx] text-sm text-muted">以下地址暂不在开通范围</view>
        	<view
        		v-for="(item, index) in addressList.unusable_address"
        		:key="item.id"
        	    class="address-list--item u-flex justify-between mt-[20rpx]"
        	>
        	    <view class="flex-1">
        	        <view class="sm text-[#c8c9cc] text-[26rpx] mb-[20rpx]">
        	            {{ item.province }}
        	            {{ item.city }}
        	            {{ item.district }}
        	        </view>
        	        <view class="text-[#c8c9cc]">
        	            <text class="text-[30rpx] font-bold">{{ item.address }}</text>
        				<text class="default" v-if="item.is_default">默认</text>
        	        </view>
        	        <view class="mt-[20rpx] sm text-[#c8c9cc] text-[26rpx]">
        	            {{ item.contact }} {{ item.mobile }}
        	        </view>
        	    </view>
        		<view class="flex">
        			<view class="mr-[40rpx]" @click.stop="goEditAddress(item.id)">
        				<u-icon name="edit-pen" color="#c8c9cc" :size="40"></u-icon>
        			</view>
        			<view  @click.stop="goDelAddress(item.id)">
        				<u-icon name="trash" color="#c8c9cc" :size="40"></u-icon>
        			</view>
        		</view>
        	</view>
        </view>

        <view class="fixed flex items-center justify-between bg-white footer">
            <view>
                <button
                    class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx]"
                    @click="goEditAddress('')"
                >
                    添加地址
                </button>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { shallowRef, ref } from 'vue'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { apiAddressLists, apiAddressDel } from '@/api/user'

const type = ref(false)
const goodsId = ref(0)
const addressList = ref<any>([]) // 地址数据列表

// 选择当前地址作为支付地址
const onSelect = async (event: any) => {
    const id = event?.currentTarget?.dataset?.id
    try {
        if (type.value) {
            uni.$emit('address', id)
            uni.navigateBack()
        }
    } catch (error) {
        console.log(error, '设置默认地址捕捉错误')
    }
}

// 编辑地址
const goEditAddress = (params = '') => {
    uni.navigateTo({
        url: `/bundle/pages/user_address_edit/index?id=${params}`,
    })
}

// 删除地址
const goDelAddress = (id:number) => {
    uni.showModal({
        title: '温馨提示',
        content: '确认删除该地址？',
        success: async (res) => {
			if (res.confirm) {
				await apiAddressDel({ id })
				getAddressLists()
			}
        }
    })
}

// 获取地址列表
const getAddressLists = async () => {
    addressList.value = await apiAddressLists({ goods_id:goodsId.value })
}

onLoad((options: { type?: boolean,goods_id?: number }) => {
	goodsId.value = options?.goods_id as number
    if (options.type) type.value = options.type
})

onShow(() => {
	getAddressLists()
})

onUnload(() => {
    uni.$emit('changeAddress')
})
</script>
<style lang="scss">
page {
    // overflow: hidden;
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}

.icon-md {
    width: 48rpx;
    height: 48rpx;
    vertical-align: top;
}

.address-list {
	padding: 20rpx;
	
    &--item {
        border-radius: 20rpx;
        background-color: #ffffff;
        padding: 30rpx 30rpx 36rpx 30rpx;

        .default {
            padding: 2px 10rpx;
            margin-left: 20rpx;
            color: var(--color-primary, #FFC244);
            font-size: 22rpx;
            background: rgba(var(--color-primary, #FFC244), 0.1);
        }

        .setting {
            height: 90rpx;
            width: 100rpx;
            line-height: 90rpx;
            text-align: right;
            color: var(--color-primary, #FFC244);
            font-size: 26rpx;
        }
    }
}

.footer {
    z-index: 999;
    left: 0;
    right: 0;
    bottom: 0;
    height: 118rpx;
    line-height: 118rpx;
    position: fixed;
    padding: 0 30rpx;
    box-sizing: content-box;
    padding-bottom: env(safe-area-inset-bottom);

    > view {
        width: 100%;
    }
}
</style>
