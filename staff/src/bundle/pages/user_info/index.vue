<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
	<view class="main">
		<view>
			<u-alert-tips v-if="formData.verify_status === 0" :key="'verify_status'+formData.verify_status" type="primary" :show-icon="true" title="资料审核中" :title-style="{'color':'#2189ff'}"></u-alert-tips>
			<u-alert-tips v-if="formData.verify_status === 2" :key="'verify_status'+formData.verify_status" type="error" :show-icon="true" title="审核拒绝" :description="formData.verify_remarks" :title-style="{'color':'#fa3534'}" :desc-style="{'color':'#dd6161'}"></u-alert-tips>
		</view>
		<!-- 步骤条 -->
		<view class="pt-[50rpx] pb-[100rpx]">
			<u-steps :list="stepsLists" :current="stepsCurrent" mode="number" active-color="#ffffff" un-active-color="#d5d5d5"></u-steps>
		</view>
		<view class="content">
			<view v-if="stepsCurrent == 0">
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]">
					<view class="text-2xl font-bold">地址</view>
					<view class="u-flex" @click="goPage('/bundle/pages/location/index')">
						<text class="text-muted mr-[10rpx]">{{ formData.region || '请选择地址' }}</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
				<view class="padding-background mt-[40rpx] mb-[40rpx]">
					<view class="text-2xl font-bold">详细地址</view>
					<view class="mt-[30rpx]">
						<u-input v-model="formData.address" type="textarea" :auto-height="false" :clearable="false" placeholder="输入详细地址" :custom-style="{'height':'100rpx'}" />
					</view>
				</view>
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]">
					<view class="text-2xl font-bold">服务技能</view>
					<view class="u-flex" @click="skillShow = true">
						<text class="font-bold mr-[10rpx] text-muted">{{ skillName }}</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
				<u-select v-model="skillShow" :list="skillLists" title="服务技能" @confirm="selectSkill"></u-select>
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]">
					<view class="text-2xl font-bold">服务项目</view>
					<view class="u-flex" @click="selectService">
						<text class="font-bold mr-[10rpx] text-muted">{{ formData?.goods_id.length || 0 }}项目</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
			</view>
			<view v-if="stepsCurrent == 1">
				<!-- <view>
					<view class="text-2xl font-bold">工装照(头像)</view>
					<view class="pt-[30rpx] pb-[40rpx]">
						<uploader
							v-model="formData.work_image"
							:key="'work_image'+formData.work_image"
							:mutiple="false"
							:deletable="true"
							:width="200"
							:height="200"
						/>
					</view>
				</view> -->
				<view>
					<view class="text-2xl font-bold">证书(可上传多张)</view>
					<view class="pt-[30rpx] pb-[40rpx]">
						<uploader
							v-model="formData.credentials_image"
							:key="'credentials_image'+formData.credentials_image"
							:mutiple="true"
							:maxUpload="10"
							:deletable="true"
							:width="200"
							:height="200"
						/>
					</view>
				</view>
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]">
					<view class="text-2xl font-bold">学历</view>
					<view class="u-flex" @click="educationShow = true">
						<text class="font-bold mr-[10rpx] text-muted">{{ educationName }}</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
				<u-select v-model="educationShow" :list="educationLists" title="学历" @confirm="selectEducation"></u-select>
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]">
					<view class="text-2xl font-bold">民族</view>
					<view class="u-flex" @click="nationShow = true">
						<text class="font-bold mr-[10rpx] text-muted">{{ nationName }}</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
				<u-select v-model="nationShow" :list="nationLists" title="民族" @confirm="selectNation"></u-select>
			</view>
		</view>
	</view>
	
	<!-- 底部按钮 -->
	<view class="footer u-flex justify-around" v-if="formData.verify_status !== 0">
	    <u-button v-if="stepsCurrent === 0" class="custom-style" size="medium" @click="changeSteps('down')">下一步</u-button>
		<view v-if="stepsCurrent === 1" class="w-[200rpx] text-white text-center" @click="changeSteps('upper')">上一步</view>
	    <!-- <u-button v-if="stepsCurrent === 1" type="primary" size="medium" @click="changeSteps('upper')">上一步</u-button> -->
	    <u-button v-if="stepsCurrent === 1" class="custom-style" size="medium" @click="confirm">提交</u-button>
	</view>
</template>

<script lang="ts" setup>
import { ref,computed } from 'vue'
import { getGeocoderCoordinate } from '@/api/app'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import uploader from '@/components/uploader/index.vue'
import { apiUserGetImproveInfo,apiUserSkillLists,apiUserEnumLists,apiUserSetImproveInfo } from '@/api/user'

//步骤条
const stepsCurrent = ref(0)
const stepsLists = [
	{
		name: '服务技能'
	}, {
		name: '个人资料'
	}
]
//表单数据
interface FormDataObj {
	province_id: number | string | null
	city_id: number | string | null
	district_id: number | string | null
	region: string | null
	address: string | null
	longitude: number | string | null
	latitude: number | string | null
	skill_id: number | string
	goods_id: Array<any>
	// work_image: string | null
	credentials_image: Array<any>
	education: number | string
	nation: number | string
	verify_status: number | null
	verify_remarks: number | string
}
const formData = ref<FormDataObj>({
	province_id: null,
	city_id: null,
	district_id: null,
	region: null,
	address: null,
	longitude: null,
	latitude: null,
	skill_id: '',
	goods_id: [],
	// work_image: null,
	credentials_image: [],
	education: '',
	nation: '',
	verify_status: null,
	verify_remarks: '',
})
//服务技能
const skillShow = ref(false)
const skillName = ref('')
const skillLists = ref<any>([])
//学历
const educationShow = ref(false)
const educationName = ref('')
const educationLists = ref<any>([])
//民族
const nationShow = ref(false)
const nationName = ref('')
const nationLists = ref<any>([])

//初始化数据
const initData = async() => {
	//已有的师傅数据
	const res = await apiUserGetImproveInfo()
	for (const index in formData.value) {
		if (res[index] !== undefined ) {
			formData.value[index] = res[index]
		}
	}
	formData.value.region = res.province+' '+res.city+' '+res.district
	skillName.value = res.skill_name
	educationName.value = res.education_name
	nationName.value = res.nation_name
	
	//服务技能数据
	const skillRes = await apiUserSkillLists({})
	skillRes.forEach((item,index) => {
		skillLists.value.push({value:item.id,label:item.name})
	})
	
	//学历数据 民族数据
	const enumListsRes = await apiUserEnumLists({})
	enumListsRes.education.forEach((item,index) => {
		educationLists.value.push({value:index,label:item})
	})
	enumListsRes.nation.forEach((item,index) => {
		nationLists.value.push({value:index,label:item})
	})
}
//获取地址
// const getLocation = () => {
// 	uni.chooseLocation({
// 	    success: async (res) => {
// 			formData.value.longitude = res.longitude
// 			formData.value.latitude = res.latitude
// 			try {
// 			    const addressInfo = await getGeocoderCoordinate({
// 			        location: `${formData.value.latitude},${formData.value.longitude}`
// 			    })
				
// 			    if (addressInfo.status == 0) {
// 			        let city_id = addressInfo.result.ad_info.city_code.substr(3, 6)
// 			        if (city_id == 110000 || city_id == 310000 || city_id == 210000 || city_id == 410000) {
// 			            city_id = city_id * 1
// 			            city_id += 100
// 			        }
// 			        formData.value.city_id = city_id + ''
// 			        formData.value.province_id = formData.value.city_id.substr(0, 3) + '000'
// 			        formData.value.district_id = addressInfo.result.ad_info.adcode
// 			        formData.value.address = addressInfo.result.address_component.street_number?.length > 0 ? addressInfo.result.address_component.street_number : addressInfo.result.address_component.street
// 					formData.value.region = `${addressInfo.result.ad_info.province} ${addressInfo.result.ad_info.city} ${addressInfo.result.ad_info.district}`
// 			    } else {
// 					uni.showToast({
// 					    title: addressInfo.message,
// 					    icon: 'none'
// 					})
// 			    }
// 			} catch (error) {
// 			    console.log('逆解析地址错误：', error)
// 			}
// 	        console.log(res)
// 	    },
// 		fail: (result) => {
// 		    console.log('获取位置失败：', result)
// 		}
// 	})
// }
//切换步骤
const changeSteps = (val:string) => {
	if (val == 'upper') {
		stepsCurrent.value = stepsCurrent.value > 0 ? stepsCurrent.value -= 1 : 0
	}
	if (val == 'down') {
		stepsCurrent.value = stepsCurrent.value < stepsLists.length - 1 ? stepsCurrent.value += 1 : stepsLists.length - 1
	}
}
//选择服务技能
const selectSkill = (e) => {
	if (formData.value.skill_id !== e[0].value) {
		formData.value.goods_id = []
	}
	formData.value.skill_id = e[0].value
	skillName.value = e[0].label
}
//选择服务项目
const selectService = () => {
	if (!formData.value.skill_id) {
		uni.$u.toast('请先选择服务技能')
		return
	}
	goPage(`/bundle/pages/service_items/index?skill_id=${formData.value.skill_id}&goods_id=${JSON.stringify(formData.value.goods_id)}`)
}
//选择学历
const selectEducation = (e) => {
	formData.value.education = e[0].value
	educationName.value = e[0].label
}
//选择民族
const selectNation = (e) => {
	formData.value.nation = e[0].value
	nationName.value = e[0].label
}
//页面跳转
const goPage = (url: string) => {
    uni.navigateTo({ url: url })
}
//提交
const confirm = async() => {
	uni.showLoading({
		title: "请稍后...",
	});
	await apiUserSetImproveInfo(formData.value);
	uni.reLaunch({
		url: "/pages/user_set/index",
	});
}

onLoad(async (options: any) => {
    initData()
	// 监听选择的地址
	uni.$on('choiceAddress', async(event) => {
		formData.value.longitude = event.longitude
		formData.value.latitude = event.latitude
		try {
		    const addressInfo = await getGeocoderCoordinate({
		        location: `${formData.value.latitude},${formData.value.longitude}`
		    })
			
		    if (addressInfo.status == 0) {
		        let city_id = addressInfo.result.ad_info.city_code.substr(3, 6)
		        if (city_id == 110000 || city_id == 310000 || city_id == 210000 || city_id == 410000) {
		            city_id = city_id * 1
		            city_id += 100
		        }
		        formData.value.city_id = city_id + ''
		        formData.value.province_id = formData.value.city_id.substr(0, 3) + '000'
		        formData.value.district_id = addressInfo.result.ad_info.adcode
		        formData.value.address = addressInfo.result.address_component.street_number?.length > 0 ? addressInfo.result.address_component.street_number : addressInfo.result.address_component.street
				formData.value.region = `${addressInfo.result.ad_info.province} ${addressInfo.result.ad_info.city} ${addressInfo.result.ad_info.district}`
		    } else {
				uni.showToast({
				    title: addressInfo.message,
				    icon: 'none'
				})
		    }
		} catch (error) {
		    console.log('逆解析地址错误：', error)
		}
	})
    // 监听选择的服务项目
    uni.$on('serviceItems', (event) => {
    	formData.value.goods_id = event
    })
})
onUnload(() => {
    uni.$off(['choiceAddress'])
    uni.$off(['serviceItems'])
})
</script>
<style lang="scss" scoped>
.main {
	min-height: 100vh;
	background-color: var(--color-primary, #FFC244);

	.content {
		padding: 30rpx 24rpx 120rpx;
		background-color: #ffffff;
		border-radius: 30rpx 30rpx 0 0;
		margin-top: -30rpx;
		min-height: calc(100vh - 200rpx);
		
		.padding-background {
			padding: 30rpx 24rpx;
			background-color: #f5f7f9;
			border-radius: 14rpx;
		}
	}
}
::v-deep .u-steps .u-steps__item__num {
	background-color: #d5d5d5 !important;
}
::v-deep .u-steps .u-steps__item__num text {
	color: var(--color-primary, #FFC244) !important;
}
::v-deep .u-steps .u-icon .u-icon__icon {
	color: var(--color-primary, #FFC244) !important;
	background-color: #ffffff;
	padding: 44rpx;
}

.footer {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 108rpx;
    position: fixed;
	z-index: 1;
    padding: 20rpx 30rpx;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);
	background-color: var(--color-primary, #FFC244);
	
	.custom-style {
		width: 500rpx;
		::v-deep button {
			width: 100% !important;
			color: var(--color-primary, #FFC244);
		}
	}
}
</style>
