<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <z-paging
        auto-show-back-to-top
        :auto="i == index"
        ref="paging"
        v-model="dataList"
        :data-key="i"
        @query="queryList"
        :fixed="false"
        height="100%"
    >
        <block v-for="(item2, index) in dataList" :key="index">
            <view class="card">
            	<view class="u-flex justify-between">
            		<view class="text-[#909399]">上门服务</view>
            		<view>{{ item2.is_comment === 0 ? '待评价' : '已评价' }}</view>
            	</view>
            	<view class="u-flex justify-between mt-[20rpx] mb-[30rpx]">
            		<view class="font-bold text-4xl flex">
            			<view>{{ item2.appoint_time_day }}</view>
            			<view class="text-primary ml-[10rpx]">{{ item2.appoint_time_slot }}</view>
            		</view>
            		<view class="u-flex staff" style="background-color: #f7f7f7;padding: 6rpx 10rpx;border-radius: 30rpx;">
            			<u-image :src="item2.staff.work_image" width="30" height="30" shape="circle"></u-image>
            			<view class="ml-[16rpx]">{{ item2.staff.name }}</view>
            		</view>
            	</view>
            
            	<view class="goods flex">
            		<u-image :src="item2.goods_image" width="130" height="130" border-radius="14rpx"></u-image>
            		<view class="ml-[20rpx] service-text w-[460rpx]">
            			<view class="u-flex justify-between">
            				<view class="service-text--name truncate">{{ item2.goods_name }}</view>
            				<view class="font-bold" :style="{'color':$theme.primaryColor}">¥{{ item2.goods_price }}</view>
            			</view>
						<view class="u-flex mt-[20rpx] flex-wrap flex-1">
							<view class="tag" v-for="(item3,index3) in item2.goods_sku_arr" :key="index3">{{ item3 }}</view>
						</view>
            		</view>
            	</view>
            
            	<view class="footer flex justify-between items-center">
            		<view class="font-bold text-2xl" :style="{'color':$theme.primaryColor}">¥{{ item2.goods_price }}</view>
					<view>
						<u-button v-if="item2.is_comment == 0" @click="goPage(`/bundle/pages/evaluate_submit/index?order_goods_id=${item2.id}`)" type="warning" size="mini" shape="square">去评价</u-button>
						<u-button v-else @click="goPage(`/bundle/pages/evaluate_detail/index?order_goods_id=${item2.id}`)" type="warning" size="mini" shape="square">查看评价</u-button>
					</view>
            	</view>
            </view>
        </block>
    </z-paging>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, shallowRef, unref } from 'vue'
import { apiEvaluateLists } from '@/api/user'
import { onShow } from '@dcloudio/uni-app'

const props = withDefaults(
    defineProps<{
        type: number
        count: number
        i: number
        index: number
    }>(),
    {
        type: 0,
        count: 0
    }
)

const paging = shallowRef<any>(null)
const dataList = ref<any>([])
const isFirst = ref<boolean>(true)

watch(
    () => props.index,
    async () => {
        await nextTick()
        if (props.i == props.index && unref(isFirst)) {
            isFirst.value = false
            paging.value?.reload()
        }
    },
    { immediate: true }
)

const queryList = async (pageNo: number, pageSize: number) => {
    try {
        const { lists } = await apiEvaluateLists({
            type: props.type,
            pageNo,
            pageSize
        })
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}

const goPage = (url:string) => {
    uni.navigateTo({
        url: url
    })
}

onShow(async() => {
	await nextTick()
    paging.value.reload()
})
</script>

<style scoped  lang="scss">
.card {
	border-radius: 20rpx;
	background-color: white;
	margin: 20rpx 20rpx 0 20rpx;
	padding: 30rpx 24rpx;
	
	.goods {
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: #f7f7f7;
		
		.tag {
			color: #909399;
			font-size: 20rpx;
			padding: 4rpx 10rpx;
			background-color: #ffffff;
			border-radius: 4rpx;
			display: inline-block;
			margin-right: 10rpx;
			margin-top: 10rpx;
		}
		.tag:last-child {
			margin-right: 0;
		}
	}
	.footer {
		border-top: 1px solid #f7f7f7;
		margin-top: 30rpx;
		padding: 30rpx 0 10rpx;
	}
}
</style>
