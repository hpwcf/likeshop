<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="flex flex-col min-h-0 h-full">
        <u-tabs
            :list="categoryLists"
            bg-color="#ffffff"
            :active-color="$theme.primaryColor"
            inactive-color="#000000"
            :is-scroll="true"
            v-model="categoryCurrent"
            @change="change"
            height="80"
        ></u-tabs>
        <view class="main h-full">
			<z-paging
			    auto-show-back-to-top
			    ref="paging"
			    v-model="dataList"
			    @query="queryList"
			    :fixed="false"
			    height="100%"
			>
				<view class="list" v-if="dataList?.length > 0">
					<u-checkbox-group @change="checkboxGroupChange" :active-color="$theme.primaryColor">
						<block v-for="(item, index) in dataList" :key="index">
							<view class="card u-flex justify-between w-full">
								<view class="flex flex-1">
									<u-image :src="item.image" width="130" height="130" border-radius="14rpx"></u-image>
									<view class="ml-[20rpx] service-text w-[400rpx]">
										<view class="u-flex mt-[10rpx]" @click="goPage('/bundle/pages/service_items_detail/index?id='+item.id)">
											<view class="truncate font-bold">{{ item.name }}</view>
											<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
										</view>
										<view class="u-flex justify-between mt-[30rpx]">
											<price :price="item.price" priceFontSize="36rpx" priceIconFontSize="26rpx"></price>
										</view>
									</view>
								</view>
								<view>
									<u-checkbox v-if="skillId" :name="item.id" v-model="item.checked" :disabled="item.skill_id.indexOf(parseInt(skillId)) == -1" @change="checkboxChange($event,index)"></u-checkbox>
								</view>
							</view>
						</block>
					</u-checkbox-group>
				</view>
			</z-paging>
        </view>

		<!-- Footer Start -->
		<view class="footer">
		    <!-- <u-button v-if="skillId" type="primary" size="medium" @click="confirm">确定</u-button>
		    <u-button v-else type="primary" size="medium" @click="goPage('/bundle/pages/user_info/index')">去修改</u-button> -->
			<button v-if="skillId" class="bg-primary text-lg text-white" @click="confirm">
				确定
			</button>
			<button v-else class="bg-primary text-lg text-white" @click="goPage('/bundle/pages/user_info/index')">
				去修改
			</button>
		</view>
		<!-- Footer End -->
    </view>
</template>

<script lang="ts" setup>
import { ref, shallowRef, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Price from '@/components/price/index.vue'
import { toast } from '@/utils/util'
import { apiGoodsCategoryLists,apiGoodsLists } from '@/api/goods'

const categoryLists = ref<any>([])
const categoryCurrent = ref<number>(0)
const paging = shallowRef<any>(null)
const dataList = ref<any>([])
const checkData = ref<any>([])
const checkCategoryData = ref<any>({})
const skillId = ref<number>(0)

//列表请求
const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists } = await apiGoodsLists({
            category_id: categoryLists.value[categoryCurrent.value].id,
            page_no,
            page_size
        })
		lists.map(item => {
		    if(checkData.value.indexOf(item.id) != -1){
		        item.checked = true
		    }
		    return item;
		});
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        paging.value.complete(false)
    }
}

//分类切换
const change = (index: number) => {
    categoryCurrent.value = Number(index)
	paging.value.reload()
}

//多选服务项目
const checkboxGroupChange = (e:any) => {
	checkCategoryData.value[categoryLists.value[categoryCurrent.value].id] = e
}
const checkboxChange = (e:any,index:number) => {
	dataList.value[index].checked = e.value
	if (!e.value) {
		checkData.value = checkData.value.filter(function(item) {
		  return item !== e.name
		});
	}
}

//确认选中
const confirm = () => {
	if (!checkData.value) {
		return toast('请选择服务项目')
	} 
	uni.$emit('serviceItems', checkData.value)
	uni.navigateBack({
		delta: 1
	});
}

//页面跳转
const goPage = (url: string) => {
    uni.navigateTo({ url: url })
}

//初始化数据
const initData= async() => {
	categoryLists.value = await apiGoodsCategoryLists({})
	paging.value.reload()
}

watch(
    () => checkCategoryData.value,
    (val) => {
        for (const item in checkCategoryData.value) {
        	checkData.value = [...checkData.value,...checkCategoryData.value[item]]
        }
		//去重
		const newData:any = []
		for (var i = 0; i < checkData.value.length; i++) {
			if (newData.indexOf(checkData.value[i]) === -1) {
				newData.push(checkData.value[i])
			}
		}
        checkData.value = newData
    },
    { deep: true }
)

onLoad(async (options) => {
    skillId.value = options?.skill_id || 0
	checkData.value = options.goods_id ? JSON.parse(options.goods_id) : [],
	checkData.value = checkData.value.map(Number)
	await initData()
})
</script>


<style>
	page {
		height: 100%;
	}
</style>
<style lang="scss" scoped>
.main {
    padding-bottom: 100rpx;
	
	.list {
		border-radius: 20rpx;
		margin: 20rpx;
		background-color: #ffffff;
		
		.card {
			border-bottom: 1px solid #f4f4f5;
			padding: 20rpx;
		}
	}
}
.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    position: fixed;
	z-index: 11;
    padding: 20rpx 30rpx 40rpx;
    background-color: #ffffff;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);

    ::v-deep button {
		width: 100% !important;
	}
}
</style>
