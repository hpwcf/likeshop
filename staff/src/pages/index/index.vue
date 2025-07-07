<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
    <view class="container" :style="pageStyle" :key="pageStyle">
        <view class="main">
			<!-- #ifndef H5 -->
			<u-sticky h5-nav-height="0" bg-color="transparent">
				<u-navbar
					:is-back="false"
					:is-fixed="true"
					:title="decoratePage.meta.title"
					:custom-title="decoratePage.meta.title_type == 2"
					:border-bottom="false"
					:title-bold="true"
					:background="{ background: `rgba(256,256, 256, 0)` }"
					:title-color="decoratePage.meta.text_color == 1 ? '#fff' : '#000'"
				>
					<template #title>
						<image
							class="!h-[54rpx]"
							:src="decoratePage.meta.title_img"
							mode="widthFix"
						></image>
					</template>
				</u-navbar>
			</u-sticky>
			<!-- #endif -->
			<view class="top">
				<view class="u-flex">
					<u-image
						@click="goPage('/pages/user_set/index')"
						:src="userInfo?.avatar || config.default_avatar"
						width="80"
						height="80"
						border-radius="40"
					/>
					<view
						class="ml-[20rpx] text-[#ffffff]"
						@click="goPage('/pages/user_set/index')"
					>
						<view>{{ userStore.isLogin ? userInfo?.name || '未入驻' : '请登录' }}</view>
						<view class="text-[22rpx] text-[#c8c9cc]" v-if="userInfo?.sn && userStore.isLogin">工号：{{ userInfo?.sn }}</view>
					</view>
				</view>
				<view class="u-flex justify-between items-center text-[24rpx] address mt-[20rpx]">
					<view class="flex-1 w-full">
						上次位置：{{ userInfo?.last_address_info?.city }}
						{{ userInfo?.last_address_info?.district }}
						{{ userInfo?.last_address_info?.address }}
					</view>
					<view class="u-flex items-center" @click="updateLocation">
						<u-icon name="reload" :color="$theme.primaryColor"></u-icon>
						<view class="ml-[10rpx]" :style="{'color':$theme.primaryColor}">更新位置</view>
					</view>
				</view>
				<view class="u-flex justify-between items-center mt-[20rpx] service-time">
					<view>
						<!-- <u-button type="primary" size="medium" :custom-style="{'background-color':$theme.primaryColor}">服务时间</u-button> -->
						<button class="bg-primary text-lg text-white" @click="serviceTimeChange">
							服务时间
						</button>
					</view>
					<view class="u-flex items-center">
						<text class="mr-[16rpx] text-[#ffffff]">{{ workOpen ? '接单中' : '休息中' }}</text>
						<u-switch v-model="workOpen" :active-color="$theme.primaryColor" inactive-color="#e2e2e3" @change="workOpenChange"></u-switch>
					</view>
				</view>
			</view>
			<view class="lists">
				<view class="u-flex justify-between mb-[30rpx]">
					<view class="text-center time-item">
						<view class="text-[24rpx] text-muted mb-[6rpx]">待服务：{{ orderExtendData?.today_num || 0 }}单</view>
						<view class="font-bold text-1xl">今天</view>
					</view>
					<view class="text-center time-item">
						<view class="text-[24rpx] text-muted mb-[6rpx]">待服务：{{ orderExtendData?.tomorrow_num || 0 }}单</view>
						<view class="font-bold text-1xl">明天</view>
					</view>
					<view class="text-center time-item">
						<view class="text-[24rpx] text-muted mb-[6rpx]">待服务：{{ orderExtendData?.after_tomorrow_num || 0 }}单</view>
						<view class="font-bold text-1xl">后天</view>
					</view>
				</view>
				<view class="mb-[150rpx]">
					<view v-if="userStore.isLogin && userInfo?.is_staff">
						<z-paging
							auto-show-back-to-top
							ref="paging"
							v-model="orderData"
							@query="queryList"
							:fixed="false"
							:use-page-scroll="true"
							:use-cache="true"
							cache-key="servicePaging"
							cache-mode="always"
							:refresher-enabled="false"
						>
							<view class="lists-item" v-for="item in orderData" :key="item.id" @click="goPage(`/pages/order_detail/index?id=${item.id}`)">
								<view class="u-flex justify-between">
									<view class="text-muted">{{ item.order_type_desc }}</view>
									<view class="font-bold">{{ item.order_status_desc }}</view>
								</view>
								<view class="u-flex font-bold text-4xl mt-[30rpx] mb-[30rpx]">
									<view>{{ item.appoint_time_day }}</view>
									<view class="text-[#2189ff] ml-[20rpx]" :style="{'color':$theme.primaryColor}">{{ item.appoint_time_slot }}</view>
								</view>
								<view class="u-flex goods">
									<u-image :src="item.order_goods[0].goods_image" width="130" height="130" border-radius="14rpx"></u-image>
									<view class="ml-[20rpx] w-[460rpx]">
										<view class="u-flex justify-between">
											<view class="truncate">{{ item.order_goods[0].goods_name }}</view>
											<view><price :price="item.order_goods[0].goods_price" priceFontSize="30rpx" priceIconFontSize="22rpx"></price></view>
										</view>
										<view class="u-flex justify-between mt-[30rpx]">
											<view class="u-flex flex-wrap flex-1">
												<view class="tag" v-for="(item2,index2) in item.order_goods[0].goods_sku_arr" :key="index2">{{ item2 }}</view>
											</view>
											<view class="text-sm text-muted">x{{ item.order_goods[0].goods_num }}</view>
										</view>
									</view>
								</view>
							</view>
						</z-paging>
					</view>
					<view v-else>
						<view v-if="userStore.isLogin && userInfo.apply_status !== -1" class="mt-[40rpx]">
							<view class="card" v-if="userInfo.apply_status === 0">
								<view class="font-bold text-2xl pb-[40rpx] text-center">待审核</view>
								<view class="text-muted mb-[30rpx]">感谢您对我们平台工作的支持，我们将在1～3个工作日内审核</view>
							</view>
							<view v-if="userInfo.apply_status === 2">
								<view class="card">
									<view class="font-bold text-2xl pb-[40rpx] text-center">审核拒绝</view>
									<view class="text-muted mb-[30rpx]">{{ userInfo.apply_remarks }}</view>
								</view>
								<view class="text-center mt-[100rpx]">
									<u-button shape="square" type="primary" size="medium" :custom-style="{'background-color':$theme.primaryColor}" @click="goPage('/bundle/pages/apply/index')">重新申请</u-button>
								</view>
							</view>
						</view>
						<view v-else>
							<Empty />
						</view>
					</view>
				</view>
			</view>
        </view>

        <!-- 底部导航栏 -->
        <Tabbar />
    </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive, shallowRef, watch } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import Tabbar from '@/components/tabbar/index.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import Empty from '@/components/empty/index.vue'
import Price from '@/components/price/index.vue'
import { getGeocoderCoordinate } from '@/api/app'
import { apiUserUpdateLastAddress,apiUserChangeWorkStatus } from '@/api/user'
import { apiStaffOrderLists } from '@/api/order'
import { getDecoratePage } from '@/api/decorate'

const appStore = useAppStore()
const {getImageUrl} = useAppStore()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo) as any
const config = computed(() => appStore.config)
const workOpen = ref<boolean>(false)
const orderData = ref<any>([])
const orderExtendData = ref<any>({})
const decoratePage = reactive<{
    data: any[]
    meta: any[]
}>({
    data: [],
    meta: []
})
const paging = shallowRef<any>(null)

//更新定位
const updateLocation = async () => {
	if (!userStore.isLogin) {
		uni.$u.toast('请先登录')
		return
	}
	if (!userInfo.value?.is_staff) {
		uni.$u.toast('当前账号未入驻')
		return
	}
	uni.showLoading({
		title: '位置更新中...'
	})
	
	uni.getLocation({
	    // #ifndef APP
	    type: 'gcj02',
	    // #endif
	    success: async (res) => {
			try {
			    const addressRes = await getGeocoderCoordinate({
			        location: `${res.latitude},${res.longitude}`
			    })
			    if (addressRes.status == 0) {
					let city_id = addressRes.result.ad_info.city_code.substr(3, 6)
					if (city_id == 110000 || city_id == 310000 || city_id == 210000 || city_id == 410000) {
						city_id = city_id * 1
						city_id += 100
					}
					
					//更新师傅定位信息
					const lastAddressInfo = {
						province_id: city_id.substr(0, 3) + '000',
						city_id: city_id,
						district_id: addressRes.result.ad_info.adcode,
						address: addressRes.result.address_component.street_number?.length > 0 ? addressRes.result.address_component.street_number : addressRes.result.address_component.street,
						longitude: res.longitude,
						latitude: res.latitude,
					}
					await apiUserUpdateLastAddress(lastAddressInfo)
					
					//更新师傅信息
					await useUserStore().getUser()
					
					uni.$u.toast('位置更新成功')
			    } else {
			        uni.$u.toast(addressRes.message)
			    }
			} catch (error) {
				uni.$u.toast(error)
			    console.log('逆解析地址', error)
			}
	    },
	    fail(result) {
	        // #ifdef MP
	        if (!appStore.sysInfo.locationEnabled) {
	            return uni.showModal({
	                title: '温馨提示',
	                content: '您的手机定位还未开启后，开启后重新进入小程序或刷新'
	            })
	        }
	        appStore.getAuthorizeFunc()
	        console.log('获取位置失败：', result)
	        // #endif
			uni.hideLoading()
	    }
	})
}

//接单开关
const workOpenChange = () => {
	if (!userStore.isLogin) {
		workOpen.value = false
		uni.$u.toast('请先登录')
		return
	}
	if (!userInfo.value?.is_staff) {
		workOpen.value = false
		uni.$u.toast('当前账号未入驻，暂无法调整')
		return
	}
	apiUserChangeWorkStatus({})
}

//接单时间
const serviceTimeChange = () => {
	if (!userStore.isLogin) {
		uni.$u.toast('请先登录')
		return
	}
	if (!userInfo.value?.is_staff) {
		uni.$u.toast('当前账号未入驻，暂无法调整')
		return
	}
	goPage('/bundle/pages/service_time/index')
}

//获取师傅订单数据
const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists,extend } = await apiStaffOrderLists({
            page_no,
            page_size
        })
		orderExtendData.value = extend
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}

//初始化数据
const initData = async () => {
	//获取装修数据
    const pageRes = await getDecoratePage({
        id: 5
    })
	decoratePage.data = pageRes.data
	decoratePage.meta = pageRes.meta[0]?.content
	
    uni.setNavigationBarTitle({
        title: decoratePage.meta.title || '首页'
    })
	
	
}

const goPage = (url: string) => {
    uni.navigateTo({
        url: url
    })
}

// 根页面样式
const pageStyle = computed(() => {
    const {bg_type, bg_color, bg_image} = decoratePage.meta ?? {}
    return bg_type == 1 ? {'background-color': bg_color} : {'background-image': `url(${getImageUrl(bg_image)})`}
})

watch(
  () => userInfo.value,
  (value) => {
	  workOpen.value = userInfo.value?.work_status === 1
  },
  {
    immediate: true,
  }
);

onLoad(() => {
    initData()
	// paging.value.reload()
})

// #ifdef MP
const updateManager = wx.getUpdateManager()
updateManager.onUpdateReady(function () {
    wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
            if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
            }
        }
    })
})
updateManager.onUpdateFailed(function () {
    uni.$u.toast('新版本下载失败，请检查网络！')
})
// #endif

</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
	display: flex;
	// background-color: #edf1f3;

    .main {
		flex: 1;
		min-height: 0;
		overflow: scroll;

        .top {
			padding: 20rpx 20rpx 60rpx;
			// background-color: #2189ff;
			
			.address {
				background-color: #ffffff;
				border-radius: 16rpx;
				padding: 26rpx 20rpx;
			}
			::v-deep .service-time button {
				padding: 0 40rpx !important;
			}
		}
		.lists {
			background-color: #edf1f3;
			padding: 20rpx;
			border-radius: 30rpx 30rpx 0 0;
			margin-top: -40rpx;
			min-height: calc(100vh - 200px);
			
			.time-item {
				width: 210rpx;
				background-color: #ffffff;
				border-radius: 16rpx;
				padding: 10rpx 0;
			}
			.lists-item {
				padding: 30rpx 24rpx;
				margin-bottom: 20rpx;
				background-color: #ffffff;
				border-radius: 20rpx;
				
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
			}
		}
    }
}

.card {
	background-color: #ffffff;
	padding: 30rpx;
	border-radius: 20rpx;
}
</style>
