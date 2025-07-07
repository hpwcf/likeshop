<template>
	<view class="search">
		<!-- 搜索框 -->
		<view class="px-[24rpx] py-[14rpx] bg-white">
			<u-search v-model="keyword" placeholder="请输入关键词搜索" :focus="true" height="84" @search="handleSearch" @custom="handleSearch"
				@clear="search.searching = false"></u-search>
		</view>

		<!-- 搜索 -->
		<view class="search-content">
			<!--  -->
			<suggest v-show="!search.searching" @search="handleSearch" @clear="handleClear"
				:hot_search="search.hot_search" :his_search="search.his_search" :status="search.status"></suggest>

			<!--  -->
			<view class="search-content-s" v-show="search.searching">
				<view class="bg-white u-flex justify-around p-[20rpx] text-[#82848a]">
					<view :class="{ 'sort-active': sortType === 'default' }"
						@click="handleSort('default')">
						综合排序
					</view>
					<view :class="{ 'sort-active': sortType === 'sale' }"
						@click="handleSort('sale')">
						销量
						<u-icon :name="sortType === 'sale' ? (sortValue === 'desc' ? 'arrow-down-fill' : 'arrow-up-fill') : 'arrow-down-fill'"
							:color="sortType === 'sale' ? '#000' : '#82848a'" size="18rpx"></u-icon>
					</view>
					<view :class="{ 'sort-active': sortType === 'price' }"
						@click="handleSort('price')">
						价格
						<u-icon :name="sortType === 'price' ? (sortValue === 'desc' ? 'arrow-down-fill' : 'arrow-up-fill') : 'arrow-down-fill'"
							:color="sortType === 'price' ? '#000' : '#82848a'" size="18rpx"></u-icon>
					</view>
					<view @click="listWay == 'list' ? listWay = 'grid' : listWay = 'list'">
						<u-icon :name="listWay === 'list' ? 'grid' : 'list-dot'" color="#82848a" size="36rpx"></u-icon>
					</view>
				</view>
				<z-paging ref="paging" v-model="search.result" @query="queryList" :fixed="false" height="100%">
					<view class="px-[24rpx]">
						<goods-card :goodsList="search.result" :type="listWay"></goods-card>
					</view>
				</z-paging>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive, shallowRef } from 'vue'
	import Suggest from './component/suggest.vue'
	import { HISTORY } from '@/enums/cacheEnums'
	import { getHotSearch, apiGoodsLists } from '@/api/store'
	import cache from '@/utils/cache'
	import GoodsCard from '@/components/goods-card/index.vue'

	interface Search {
		hot_search : string[]
		his_search : string[]
		result : any
		searching : boolean
		status : number
	}

	const search = reactive<Search>({
		hot_search: [],
		his_search: [],
		result: [],
		searching: false,
		status: 0
	})
	const keyword = ref<string>('')
	const paging = shallowRef()
	const sortType = ref('default')
	const sortValue = ref('desc')
	const listWay = ref('list')

	const handleSearch = (value : string) => {
		keyword.value = value
		if (keyword.value) {
			if (!search.his_search.includes(keyword.value)) {
				search.his_search.unshift(keyword.value)
				cache.set(HISTORY, search.his_search)
			}
		}
		paging.value.reload()
		search.searching = true
	}
	
	const handleSort = (value: string) => {
		if (value === 'default') {
			sortValue.value = 'desc'
		}
		if (value === 'sale' || value === 'price') {
			if (sortType.value !== value) {
				sortValue.value = 'desc'
			} else {
				sortValue.value = sortValue.value === 'desc' ? 'asc' : 'desc'
			}
		}
		sortType.value = value
		queryList(1,10)
	}

	const getHotSearchFunc = async () => {
		try {
			const data = await getHotSearch()
			search.hot_search = data.data
			search.status = data.status
		} catch (e) {
			//TODO handle the exception
			console.log('获取热门搜索失败=>', e)
		}
	}

	const handleClear = async () : Promise<void> => {
		const resModel : any = await uni.showModal({
			title: '温馨提示',
			content: '是否清空历史记录？'
		})
		if (resModel.confirm) {
			cache.set(HISTORY, '')
			search.his_search = []
		}
	}

	const queryList = async (pageNo : number, pageSize : number) => {
		try {
			const { lists } = await apiGoodsLists({
				keyword: keyword.value,
				page_no: pageNo,
				page_size: pageSize,
				sort_type: sortType.value,
				sort_value: sortValue.value
			})
			paging.value.complete(lists)
		} catch (e) {
			console.log('报错=>', e)
			//TODO handle the exception
			paging.value.complete(false)
		}
	}

	getHotSearchFunc()
	search.his_search = cache.get(HISTORY) || []
</script>

<style lang="scss" scoped>
	.search {
		&-content {
			height: calc(100vh - 46px - env(safe-area-inset-bottom));

			&-s {
				height: 100%;
			}
		}
	}

	.sort-active {
		color: #000;
		font-weight: 900;
	}
</style>