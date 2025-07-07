<template>
    <view class="container">
        <!-- Mian Start -->
        <u-form :model="formData" ref="formRef" :error-type="['message', 'toast']" label-position="top" :border-bottom="false">
            <u-form-item prop="region" label="服务地址" :border-bottom="false">
                <u-input
                	class="bg-[#c0c4cc33] w-full"
					style="border-radius: 8rpx;padding: 8rpx 20rpx;"
                    v-model="formData.region"
                    placeholder="请选择服务地址"
                    :disabled="true"
                	@click="chooseLocation"
                />
            </u-form-item>
            <u-form-item prop="address" label="门牌号" :border-bottom="false">
                <u-input
                	class="bg-[#c0c4cc33] w-full"
					style="border-radius: 8rpx;padding: 8rpx 20rpx;"
                    v-model="formData.address"
                    placeholder="请输入详细地址 例:1号楼1单元201室"
                />
            </u-form-item>
            <u-form-item prop="contact" label="联系人" :border-bottom="false">
				<view class="u-flex">
					<u-input
						class="bg-[#c0c4cc33] w-[300rpx] mr-[40rpx]"
						style="border-radius: 8rpx;padding: 8rpx 20rpx;"
					    v-model="formData.contact"
					    placeholder="请输入联系人姓名"
					/>
					<u-radio-group v-model="formData.sex" :active-color="$theme.primaryColor">
						<u-radio :name="1">先生</u-radio>
						<u-radio :name="2">女士</u-radio>
					</u-radio-group>
				</view>
            </u-form-item>
            <u-form-item prop="mobile" label="联系号码" :border-bottom="false">
                <u-input
                	class="bg-[#c0c4cc33] w-full"
					style="border-radius: 8rpx;padding: 8rpx 20rpx;"
                    v-model="formData.mobile"
                    placeholder="请输入手机号码"
                />
            </u-form-item>
            <u-form-item prop="address" label="" :border-bottom="false">
				<view class="u-flex justify-between w-full">
					<view>
						<view class="font-bold">设为默认地址</view>
						<view class="text-sm text-muted">提示：下单时会优先使用该地址</view>
					</view>
					<view><u-checkbox v-model="formData.is_default" shape="circle" :active-color="$theme.primaryColor"></u-checkbox></view>
				</view>
            </u-form-item>
        </u-form>
        <!-- Mian End -->

        <!-- Footer Start -->
		<view class="fixed flex items-center justify-between bg-white footer">
		    <view>
		        <button
		            class="bg-primary text-lg text-white leading-[80rpx] h-[80rpx]"
		            @click="onSubmit"
		        >
		            确定
		        </button>
		    </view>
		</view>
        <!-- Footer End -->
    </view>
</template>

<script lang="ts" setup>
import { onLoad, onReady, onUnload } from '@dcloudio/uni-app'
import { ref, reactive, computed } from 'vue'
import { getGeocoderCoordinate } from '@/api/app'
import { apiAddressDetail, apiAddressEdit, apiAddressAdd, apiAddressDel } from '@/api/user'

type FORM = {
    contact: string // 联系人
    mobile: string | number // 手机号码
    province: string | number // 省
    province_id: string | number // 省
    city: string | number // 市
    city_id: string | number // 市
    district: string | number // 区
    district_id: string | number // 区
    address: string // 详细地址
    longitude: string // 经度
    latitude: string // 纬度
    is_default: number | boolean // 是否默认
    region: string
    sex: number | boolean
}

const formData = ref<FORM>({
    contact: '',
    mobile: '',
    province: '',
    province_id: '',
    city: '',
    city_id: '',
    district: '',
    district_id: '',
    address: '',
    longitude: '',
    latitude: '',
    is_default: 0,
    region: '',
    sex: 1
})
const formRef = ref()
const addressId = ref<string | number>('')
const rules = ref<object>({
    contact: [
        { required: true, message: '请输入联系人', trigger: ['change', 'blur'] },
        { min: 1, max: 20, message: '输入长度不得超过20位', trigger: ['blur', 'change'] }
    ],
    mobile: [
        { required: true, message: '请输入手机号码', trigger: ['change', 'blur'] },
        {
            pattern: /^1[3-9]\d{9}$/,
            transform(value: any) {
                return String(value)
            },
            message: '请输入正确的手机号'
        }
    ],
    region: [{ required: true, message: '请选择省市区', trigger: ['change', 'blur'] }],
    address: [{ required: true, message: '请输入门牌号', trigger: ['change', 'blur'] }]
})

// 获取地址详情
const getAddressDetail = async (): Promise<void> => {
    formData.value = await apiAddressDetail({ id: addressId.value })
    formData.value.region = `${formData.value.province} ${formData.value.city} ${formData.value.district}`
}

// 校验
const onSubmit = () => {
    formRef.value.validate((valid: boolean) => {
        if (!valid) return false
        if (!addressId.value) handleAddressAdd()
        else handleAddressEdit()
    })
}
// 添加地址
const handleAddressAdd = async (): Promise<void> => {
    await apiAddressAdd({ ...formData.value })
    setTimeout(() => {
        uni.navigateBack()
    }, 300)
}
// 编辑地址
const handleAddressEdit = async (): Promise<void> => {
    await apiAddressEdit({ ...formData.value })
    setTimeout(() => {
        uni.navigateBack()
    }, 300)
}
// 选择省市区
const chooseLocation = () => {
    uni.chooseLocation({
        success(res) {
            getLocation(res.latitude, res.longitude)
        },
        fail(error) {
            console.log(error)
        }
    })
}

// 逆解析地址
const getLocation = async (latitude: string | number, longitude: string | number) => {
    try {
        const res = await getGeocoderCoordinate({
            location: `${latitude},${longitude}`
        })
        const data = res.result
        handleAddressInfo(data)
    } catch (error) {
        console.log('地址逆解析', error)
    }
}

// 处理接口返回的地址数据
const handleAddressInfo = (event: any) => {
    let city_id = event.ad_info.city_code.substr(3, 6)
    if (city_id == 110000 || city_id == 310000 || city_id == 210000 || city_id == 410000) {
        city_id = city_id * 1
        city_id += 100
    }
    formData.value.city_id = city_id + ''
    formData.value.province_id = formData.value.city_id.substr(0, 3) + '000'
    formData.value.district_id = event.ad_info.adcode
    formData.value.region = `${event.ad_info.province} ${event.ad_info.city} ${event.ad_info.district}`
    formData.value.address = event.address_component.street_number
    formData.value.longitude = event.location.lng
    formData.value.latitude = event.location.lat
}

onLoad((options: { id?: number }) => {
    addressId.value = Number(options.id)
    if (options.id) {
        uni.setNavigationBarTitle({
            title: '编辑地址'
        })
        getAddressDetail()
    } else {
        uni.setNavigationBarTitle({
            title: '添加地址'
        })
        let wxAddress = uni.getStorageSync('wxAddress')

        if (!wxAddress) return
        wxAddress = JSON.parse(wxAddress)
        formData.value.contact = wxAddress.name
        formData.value.mobile = wxAddress.mobile
        getLocation(wxAddress.latitude, wxAddress.longitude)
    }
})

onReady(() => {
    formRef.value?.setRules(rules.value)
})

onUnload(() => {
    uni.removeStorageSync('wxAddress')
})
</script>
<style lang="scss">
	page {
		background-color: #ffffff;
	}
</style>
<style lang="scss" scoped>
.container {
    padding: 40rpx;

    .card {
        margin-bottom: 20rpx;
        padding: 0 24rpx;
        border-radius: 14rpx;
        background-color: #ffffff;

        .label {
            color: #222222;
            font-size: 28rpx;
            margin-right: 30rpx;
            line-height: 70rpx;
        }
    }

    .is-default {
        image {
            width: 34rpx;
            height: 34rpx;
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
