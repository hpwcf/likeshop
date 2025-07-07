<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
	<view v-show="isEmpty" class="master-detail">
		<!-- 轮播图 -->
		<la-swiper
			:content="{data:masterData.carousel_image}"
			height="750"
			indicatorPos="bottomRight"
			mode="number"
			:borderRadius="20"
		/>

		<!-- 信息 -->
		<view class="info">
			<view class="u-flex">
				<text class="font-bold text-3xl">{{ masterData.name }}</text>
				<text class="appoint">最早可约{{ masterData.earliest_booking_time }}</text>
			</view>
			<view class="u-flex mt-[20rpx] justify-between">
				<view class="text-[#82848a] text-[26rpx]">
					<text class="mr-[20rpx]">已服务{{ masterData.order_count }}单</text>
					<text v-if="masterData.good_rate">{{ masterData.good_rate }}%好评</text>
				</view>
				<view v-if="masterData.distance">
					<u-icon name="map-fill" color="#62cb81"></u-icon>
					<text class="text-[#909399] ml-[6rpx]">距你{{ masterData.distance }}</text>
				</view>
			</view>
			<view class="u-flex mt-[20rpx] flex-wrap">
				<view class="tag" v-if="masterData.sex_desc">{{ masterData.sex_desc }}</view>
				<view class="tag" v-if="masterData.age">{{ masterData.age }}岁</view>
				<view class="tag" v-if="masterData.education_name">{{ masterData.education_name }}</view>
				<view class="tag" v-if="masterData.nation_name">{{ masterData.nation_name }}</view>
				<view class="tag" v-if="masterData.skill_name">{{ masterData.skill_name }}</view>
			</view>
		</view>
		<view class="u-flex justify-between credential">
			<view class="u-flex">
				<u-icon name="/static/images/icon_auth.png" size="30"></u-icon>
				<text class="ml-[6rpx] text-[22rpx] text-[#000000]">实名认证</text>
			</view>
			<view class="u-flex">
				<u-icon name="/static/images/icon_auth.png" size="30"></u-icon>
				<text class="ml-[6rpx] text-[22rpx] text-[#000000]">资质认证</text>
			</view>
			<view class="u-flex">
				<u-icon name="/static/images/icon_auth.png" size="30"></u-icon>
				<text class="ml-[6rpx] text-[22rpx] text-[#000000]">平台担保</text>
			</view>
			<view class="u-flex" @click="goPage('/bundle/pages/master_worker_credential/index?avatar='+masterData.work_image+'&name='+masterData.name+'&identity_number='+masterData.identity_number)">
				<text class="ml-[6rpx] text-[22rpx] text-[#909399]">查看</text>
				<u-icon name="arrow-right" size="20" color="#909399"></u-icon>
			</view>
		</view>

		<!-- 自我介绍 -->
		<!-- <view class="mt-[30rpx] introduce">
			<view class="font-bold text-3xl mb-[30rpx]">
				自我介绍
			</view>
			<view class="text-[#909399]">
				
			</view>
		</view> -->

		<!-- 服务项目 -->
		<view class="mt-[30rpx] mb-[200rpx] service">
			<view class="font-bold text-3xl mb-[40rpx]">
				<u-tabs :list="tabsLists" :current="tabsCurrent" :is-scroll="false" font-size="38rpx" :active-color="$theme.primaryColor" bar-width="180rpx" @change="tabsChange" class="mt-[10rpx] mb-[10rpx]"></u-tabs>
			</view>
			<view>
				<view v-if="tabsCurrent == 0">
					<z-paging
					    ref="servicePaging"
					    v-model="serviceData"
					    @query="queryServiceList"
					    :fixed="false"
						:use-page-scroll="true"
						:use-cache="true"
						cache-key="servicePaging"
						cache-mode="always"
						:default-page-size="5"
					>
						<ServiceList :serviceData="serviceData"></ServiceList>
					</z-paging>
				</view>
				<view v-if="tabsCurrent == 1">
					<z-paging
					    ref="commentPaging"
					    v-model="commentData"
					    @query="queryCommentList"
					    :fixed="false"
						:use-page-scroll="true"
						:use-cache="true"
						cache-key="commentPaging"
						cache-mode="always"
						:default-page-size="5"
					>
						<CommentList :commentData="commentData"></CommentList>
					</z-paging>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<!-- <view class="footer u-flex fixed justify-around">
			<button
				class="bg-primary leading-[80rpx] h-[80rpx] m-0 w-full u-flex justify-center"
			>
				<u-icon name="heart" size="36" color="#ffffff"></u-icon>
				<text class="text-[#ffffff] text-[36rpx] ml-[6rpx]">收藏</text>
			</button>
		</view> -->
	</view>

	<view v-show="!isEmpty" class="empty">
		<u-empty
			text="抱歉，该师傅不存在~"
			:src="'/static/images/empty/collection.png'"
			:icon-size="300"
			color="#888888"
		>
			<template #bottom>
				<view class="empty-bottom">
					<button
						class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx]"
						@click="goPage(`/pages/index/index`)"
					>
						返回主页
					</button>
				</view>
			</template>
		</u-empty>
	</view>
</template>

<script lang="ts" setup>
import { ref,shallowRef } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiStaffDetail } from '@/api/store'
import LaSwiper from '@/components/la-swiper/index.vue'
import CommentList from './components/comment_list.vue'
import ServiceList from './components/service_list.vue'
import { apiStaffGoodsLists,apiStaffGoodsCommentLists } from '@/api/store'

const isEmpty = ref(true)
// 师傅id
const masterId = ref<number | string>('')
// 师傅数据
const masterData = ref<any>({})
//服务项目数据
const servicePaging = shallowRef()
const serviceData = ref<any>([])
//用户评价数据
const commentPaging = shallowRef()
const commentData = ref()

//获取师傅详情
const staffDetail = async () => {
    try {
        masterData.value = await apiStaffDetail({
            id: masterId.value
        })
    } catch (e) {
        console.log('报错=>', e)
        isEmpty.value = false
    }
}

//获取服务项目列表
const queryServiceList = async (pageNo: number, pageSize: number) => {
    try {
        const { lists } = await apiStaffGoodsLists({
            page_no: pageNo,
            page_size: pageSize,
            staff_id: masterData.value.id
        })
        servicePaging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        servicePaging.value.complete(false)
    }
}

//获取评价列表
const queryCommentList = async (pageNo: number, pageSize: number) => {
    try {
        const { lists } = await apiStaffGoodsCommentLists({
            page_no: pageNo,
            page_size: pageSize,
            staff_id: masterData.value.id
        })
        commentPaging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        commentPaging.value.complete(false)
    }
}

const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}

//标签切换
const tabsLists = ref()
const tabsCurrent = ref(0)
tabsLists.value = [
	{
		name: '服务项目',
		type: 1
	}, 
	{
		name: '用户评价',
		type: 2
	}
]
const tabsChange = (index:number) => {
	tabsCurrent.value = index
}

//加载更多
const loadmoreStatus = ref('loadmore')
const loadmoreText = {
	loadmore: '展开更多 ∨',
	loading: '加载中',
	nomore: '没有更多了'
}
const loadmoreLists = () => {
	console.log(111)
}

onLoad(async (options) => {
    masterId.value = options?.id || ''
	await staffDetail()
	servicePaging.value.reload()
})
</script>

<style lang="scss" scoped>
.master-detail {
	padding: 20rpx;
	.info {
		padding: 30rpx 24rpx 40rpx;
		background-color: #ffffff;
		margin-top: 30rpx;
		border-radius: 20rpx 20rpx 0 0;
		.appoint {
			padding: 8rpx 16rpx;
			background-color: #fdebeb;
			color: var(--color-primary, #FFC244);
			border-radius: 6rpx;
			font-size: 20rpx;
			margin-left: 20rpx;
		}
		.tag {
			color: #909399;
			font-size: 20rpx;
			padding: 4rpx 10rpx;
			background-color: #f4f4f5;
			border-radius: 4rpx;
			display: inline-block;
			margin-right: 10rpx;
			margin-top: 10rpx;
		}
		.tag:last-child {
			margin-right: 0;
		}
	}
	.credential {
		padding: 26rpx 26rpx;
		background-color: #edfbf0;
		border-radius: 0 0 20rpx 20rpx;
	}
	.introduce {
		padding: 36rpx 24rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
	}
	.service {
		padding: 36rpx 24rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
	}
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
}
</style>
