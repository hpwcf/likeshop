import { defineStore } from 'pinia'
import { apiConfigGet,getGeocoderCoordinate,apiGetKefuConfig } from '@/api/app'
import { isWeixinClient } from '@/utils/client'
import { apiUserUpdateLastAddress } from '@/api/user'
import { useUserStore } from '@/stores/user'

interface City {
    city_id: number | null | undefined | string
    latitude: string | null | undefined
    longitude: string | null | undefined
    cityName: string | null | undefined
}

interface AppModule {
    config: Record<string, any>
    cityInfo: City
    sysInfo: Record<string, any>
    kefuInfo: Record<string, any>
}

export const useAppStore = defineStore({
    id: 'appStore',
    state: (): AppModule => ({
        // 公共配置
        config: {
            navigation_menu: [],
            style: {}
        },
        // 城市信息
        cityInfo: {
            city_id: '',
            latitude: '',
            longitude: '',
            cityName: ''
        },
        // 系统信息
        sysInfo: {},
        // 客服信息
        kefuInfo: {}
    }),
    getters: {
        appConfig: (state) => state.config,
        cityData: (state) => state.cityInfo
    },
    actions: {
        // 对url过滤，如url是完整地址则直接返回；如不完整则拼接域名前缀
        getImageUrl(url: string) {
            if (!url) return
            return url.includes('http://') || url.includes('https://')
                ? url
                : `${this.config.domain}${url}`
        },

        setCityInfo(city: City) {
            this.cityInfo = city
            uni.$emit('refreshhome')
        },

        //  获取公共数据
        async getConfig() {
            try {
                const res = await apiConfigGet()
                this.config = res
            } catch (error) {
                console.log('公共数据请求', error)
            }
        },

        // 获取系统信息
        getSystemInfo() {
            uni.getSystemInfo({
                success: (res) => {
                    const { statusBarHeight, platform }: any = res
                    let navHeight
                    if (platform == 'ios' || platform == 'devtools') {
                        navHeight = statusBarHeight + 44
                    } else {
                        navHeight = statusBarHeight + 48
                    }
                    this.sysInfo = {
                        ...res,
                        navHeight
                    }
                },
                fail(err) {
                    console.log(err)
                }
            })
        },

        // 初始化获取位置
        async getLocationFunc() {
			const slef = <any>this
			return new Promise(async (resolve, reject) => {
				uni.getLocation({
				    // #ifndef APP
				    type: 'gcj02',
				    // #endif
				    async success(res) {
				        await slef.initCityFunc(res.latitude, res.longitude)
						resolve(res)
				    },
				    fail(result) {
				        // #ifdef MP
				        if (!slef.sysInfo.locationEnabled) {
				            return uni.showModal({
				                title: '温馨提示',
				                content: '您的手机定位还未开启后，开启后重新进入小程序或刷新'
				            })
				        }
				        slef.getAuthorizeFunc()
				        // #endif
				        console.log('获取位置失败：', result)
						reject(result)
				    }
				})
			})
            
            
        },

        // 小程序未开启定位或拒绝授权
        async getAuthorizeFunc() {
            const data: any = await uni.showModal({
                title: '您已拒绝地理位置权限',
                content: '是否进入权限管理，调整授权？'
            })
            if (data.confirm) {
                const data: any = await uni.openSetting()
                if (data.authSetting['scope.userLocation']) this.getLocationFunc()
            }
        },

        // 逆解析地址
        async initCityFunc(latitude: string, longitude: string) {
            try {
                const res = await getGeocoderCoordinate({
                    location: `${latitude},${longitude}`
                })
                if (res.status == 0) {
					let city_id = res.result.ad_info.city_code.substr(3, 6)
					if (city_id == 110000 || city_id == 310000 || city_id == 210000 || city_id == 410000) {
						city_id = city_id * 1
						city_id += 100
					}
					
					//根据开通城市 设置城市信息
                    let obj = {
                        city_id: city_id,
                        latitude: latitude,
                        longitude: longitude,
                        cityName: res.result.address_component.city
                    }
                    this.setCityInfo(obj)
					
					//更新师傅定位信息
					const lastAddressInfo = {
						province_id: city_id.substr(0, 3) + '000',
						city_id: city_id,
						district_id: res.result.ad_info.adcode,
						address: res.result.address_component.street_number.length > 0 ? res.result.address_component.street_number : res.result.address_component.street,
						longitude: longitude,
						latitude: latitude,
					}
					await apiUserUpdateLastAddress(lastAddressInfo)

					//更新师傅信息
					useUserStore().getUser()
                } else {
                    uni.$u.toast(res.message)
                }
            } catch (error) {
                console.log('逆解析地址', error)
            }
        },
    
		// 获取客服配置
		async getKefuInfo() {
		    try {
				const res = await apiGetKefuConfig()
				// #ifdef MP-WEIXIN
				this.kefuInfo = res.mnp
				// #endif
				
				// #ifdef H5
				if (isWeixinClient()) {
					this.kefuInfo = res.oa
				} else {
					this.kefuInfo = res.h5
				}
				// #endif
				console.log('kefuInfo',this.kefuInfo)
		        
		    } catch (error) {
		        console.log('获取客服配置错误', error)
		    }
		}
    }
})
