<template>
    <page-meta :page-style="$theme.pageStyle">
        <!-- #ifndef H5 -->
        <navigation-bar :front-color="$theme.navColor" :background-color="$theme.navBgColor" />
        <!-- #endif -->
    </page-meta>
	<view class="main">
		<!-- 步骤条 -->
		<view class="pt-[40rpx] pb-[70rpx]">
			<u-steps :list="stepsLists" :current="stepsCurrent" mode="number" active-color="#ffffff" un-active-color="#d5d5d5"></u-steps>
		</view>
		<view class="content">
			<view v-if="stepsCurrent == 0">
				<view>
					<view class="text-xl font-bold">姓名</view>
					<view class="u-flex pt-[30rpx] pb-[40rpx]">
						<u-input v-model="formData.name" :clearable="false" placeholder="输入你的姓名" :custom-style="inputStyle" />
						<u-radio-group v-model="formData.sex" class="ml-[30rpx]" :active-color="$theme.primaryColor">
							<u-radio :name="1">先生</u-radio>
							<u-radio :name="2">女士</u-radio>
						</u-radio-group>
					</view>
				</view>
				<view>
					<view class="text-xl font-bold">年龄/岁</view>
					<view class="pt-[30rpx] pb-[40rpx]">
						<u-input v-model="formData.age" type="number" :clearable="false" placeholder="输入年龄" :custom-style="inputStyle" />
					</view>
				</view>
				<view>
					<view class="text-xl font-bold">身份证号</view>
					<view class="pt-[30rpx] pb-[40rpx]">
						<u-input v-model="formData.identity_number" :clearable="false" placeholder="输入身份证号" :custom-style="inputStyle" />
					</view>
				</view>
				<view>
					<view class="text-xl font-bold">身份证照片(人像面)</view>
					<view class="pt-[30rpx] pb-[40rpx]">
						<uploader
							v-model="formData.identity_portrait_image"
							:key="'identity_portrait_image'+formData.identity_portrait_image"
							:mutiple="false"
							:deletable="true"
							:width="700"
							:height="260"
						/>
					</view>
				</view>
				<view>
					<view class="text-xl font-bold">身份证照片(国徽面)</view>
					<view class="pt-[30rpx] pb-[40rpx]">
						<uploader
							v-model="formData.identity_emblem_image"
							:key="'identity_emblem_image'+formData.identity_emblem_image"
							:mutiple="false"
							:deletable="true"
							:width="700"
							:height="260"
						/>
					</view>
				</view>
				<view>
					<view class="text-xl font-bold">实拍照(正面免冠素颜照片)</view>
					<view class="pt-[30rpx] pb-[40rpx]">
						<uploader
							v-model="formData.portrait_image"
							:key="'portrait_image'+formData.portrait_image"
							:mutiple="false"
							:deletable="true"
							:width="700"
							:height="260"
						/>
					</view>
				</view>
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]" @click="goPage('/bundle/pages/location/index')">
					<view class="text-xl font-bold">地址</view>
					<view class="u-flex">
						<text class="text-muted mr-[10rpx]">{{ formData.region || '请选择地址' }}</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
				<view class="padding-background mt-[40rpx] mb-[40rpx]">
					<view class="text-xl font-bold">详细地址</view>
					<view class="mt-[10rpx]">
						<u-input v-model="formData.address" type="textarea" :auto-height="false" :clearable="false" placeholder="输入详细地址" :custom-style="{'height':'100rpx'}" />
					</view>
				</view>
			</view>
			<view v-if="stepsCurrent == 1">
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]" @click="skillShow = true">
					<view class="text-xl font-bold">服务技能</view>
					<view class="u-flex">
						<text class="font-bold mr-[10rpx] text-muted">{{ skillName }}</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
				<u-select v-model="skillShow" :list="skillLists" title="服务技能" @confirm="selectSkill"></u-select>
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]" @click="selectService">
					<view class="text-xl font-bold">服务项目</view>
					<view class="u-flex">
						<text class="font-bold mr-[10rpx] text-muted">{{ formData.goods_id.length || 0 }}项目</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
			</view>
			<view v-if="stepsCurrent == 2">
				<view>
					<view class="text-xl font-bold">工装照(头像)</view>
					<view class="pt-[30rpx] pb-[40rpx]">
						<!-- <uploader
							v-model="formData.work_image"
							:key="'work_image'+formData.work_image"
							:mutiple="false"
							:deletable="true"
							:width="200"
							:height="200"
						/> -->
						<file-upload
							v-model="formData.work_image"
							:max-count="1"
							width="200"
							height="200"
						></file-upload>
					</view>
				</view>
				<view>
					<view class="text-xl font-bold">证书(可上传多张)</view>
					<view class="pt-[30rpx] pb-[40rpx]">
						<!-- <uploader
							v-model="formData.credentials_image"
							:key="'credentials_image'+formData.credentials_image"
							:mutiple="true"
							:maxUpload="10"
							:deletable="true"
							:width="200"
							:height="200"
						/> -->
						<file-upload
							v-model="formData.credentials_image"
							:max-count="10"
							width="200"
							height="200"
						></file-upload>
					</view>
				</view>
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]" @click="educationShow = true">
					<view class="text-xl font-bold">学历</view>
					<view class="u-flex">
						<text class="font-bold mr-[10rpx] text-muted">{{ educationName }}</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
				<u-select v-model="educationShow" :list="educationLists" title="学历" @confirm="selectEducation"></u-select>
				<view class="padding-background u-flex justify-between mt-[40rpx] mb-[40rpx]" @click="nationShow = true">
					<view class="text-xl font-bold">民族</view>
					<view class="u-flex">
						<text class="font-bold mr-[10rpx] text-muted">{{ nationName }}</text>
						<u-icon name="arrow-right" color="#c8c9cc"></u-icon>
					</view>
				</view>
				<u-select v-model="nationShow" :list="nationLists" title="民族" @confirm="selectNation"></u-select>
			</view>
		</view>
	</view>
	
	<!-- 底部按钮 -->
	<view class="footer u-flex justify-around">
		<view class="w-[200rpx] text-white text-center" @click="changeSteps('upper')">上一步</view>
	    <!-- <u-button type="primary" size="medium" :plain="true"></u-button> -->
	    <u-button v-if="stepsCurrent !== 2" class="custom-style" size="medium" @click="changeSteps('down')">下一步</u-button>
	    <u-button v-else class="custom-style" size="medium" @click="confirm">提交</u-button>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getGeocoderCoordinate } from '@/api/app'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { apiUserApplyDetail,apiUserSkillLists,apiUserEnumLists,apiUserApply } from '@/api/user'
import uploader from '@/components/uploader/index.vue'
import { useUserStore } from "@/stores/user"
import { apiSubscribe } from '@/api/app'
import FileUpload from '@/components/file-upload/file-upload.vue'

const userStore = useUserStore()
//步骤条
const stepsCurrent = ref(0)
const stepsLists = [
	{
		name: '基本信息'
	}, {
		name: '服务技能'
	}, {
		name: '个人资料'
	}
]
//表单数据
interface FormDataObj {
    name: string
    sex: number
	age: number | null
	identity_number: string | null
	identity_portrait_image: string | null
	identity_emblem_image: string | null
	portrait_image: string | null
	province_id: number | string | null
	city_id: number | string | null
	district_id: number | string | null
	region: string | null
	address: string | null
	longitude: number | string | null
	latitude: number | string | null
	skill_id: number | string
	goods_id: Array<any>
	work_image: string | null
	credentials_image: Array<any>
	education: number | string
	nation: number | string
}
const formData = ref<FormDataObj>({
    name: '',
    sex: 1,
	age: null,
	identity_number: null,
	identity_portrait_image: null,
	identity_emblem_image: null,
	portrait_image: null,
	province_id: null,
	city_id: null,
	district_id: null,
	region: null,
	address: null,
	longitude: null,
	latitude: null,
	skill_id: '',
	goods_id: [],
	work_image: null,
	credentials_image: [],
	education: '',
	nation: '',
})
//输入框样式
const inputStyle = {
	'background-color': '#f5f7f9',
	'order-radius': '10rpx',
	'padding': '5rpx 20rpx'
}
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
	const res = await apiUserApplyDetail()
	for (const index in formData.value) {
		if (res[index]) {
			formData.value[index] = res[index]
		}
	}
	formData.value.region = formData.value.province_id ? res.last_address_info.province+' '+res.last_address_info.city+' '+res.last_address_info.district : null
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
//获取用户消息授权
const getAuthMsg = () => {
    return new Promise((resolve, reject) => {
        apiSubscribe({'scene':'apply'})
            .then((res) => {
                if (!res.length) resolve('暂无可订阅信息')
                uni.requestSubscribeMessage({
                    tmplIds: res,
                    success(ress) {
                        console.log('requestSubscribeMessageRes', ress)
                    },
                    fail(res) {
                        console.log(res.errMsg)
                    },

                    complete() {
                        resolve(res)
                    }
                })
            })
            .catch((error) => reject(error))
    })
}
//提交
const confirm = async() => {
	// #ifdef MP-WEIXIN
	await getAuthMsg()
	//#endif
	uni.showLoading({
		title: "请稍后...",
	});
	await apiUserApply(formData.value);
	await userStore.getUser();
	uni.reLaunch({
		url: "/pages/index/index",
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
    position: fixed;
	z-index: 1;
    padding: 30rpx 30rpx 50rpx;
    box-shadow: 2rpx 2rpx 22rpx rgba($color: #000000, $alpha: 0.2);
	background-color: var(--color-primary, #FFC244);
	
	.custom-style {
		width: 500rpx;
		height: 80rpx;
		::v-deep button {
			width: 100% !important;
			height: 100% !important;
			color: var(--color-primary, #FFC244);
		}
	}
}
</style>
