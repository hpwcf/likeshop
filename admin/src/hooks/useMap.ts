import feedback from '@/utils/feedback'
import { importCDN } from '@/utils/importCDN'
import { jsonp, matchAreaName, matchProvinceId, matchCityId } from '@/utils/util'
import { useDebounceFn } from '@vueuse/core'
import useAppStore from '@/stores/modules/app'
import { getTencentMapKey, checkTencentMapResult } from '@/api/app'

const appStore = useAppStore()
const config = computed(() => appStore.config)

export function useMap() {
    //地图
    let map = null
    let TMap: any = null
    let markerLayer: any = null
    const tencent_map_key = ref(config.value.tencent_map_key)

    const obj = reactive({
        province_id: '' as number | string,
        city_id: '' as number | string,
        district_id: '' as number | string,
        address: '',
        latitude: '',
        longitude: ''
    })

    const loadTencentMapScript = useDebounceFn((lat: number | string, lng: number | string) => {
        const TENTCENT_MAP_API = `https://map.qq.com/api/gljs?v=1.exp&key=${tencent_map_key.value}`
        importCDN(TENTCENT_MAP_API).then(() => initTencentMap(lat, lng))
    }, 2000)

    //初始化地图
    const initTencentMap = (lat: number | string, lng: number | string) => {
        TMap = (window as any).TMap // TMap地图实例
        const LatLng = TMap.LatLng // 用于创建经纬度坐标实例
        const center = new LatLng(lat, lng) //设置中心点坐标

        // 销毁上一次地图
        new TMap.Map('container', {
            center
        }).destroy()

        //初始化地图
        map = new TMap.Map('container', {
            center
        })

        //创建并初始化MultiMarker:表示地图上的多个标注点，可自定义标注的图标。,
        markerLayer = new TMap.MultiMarker({
            map, //指定地图容器
            //样式定义
            styles: {
                //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
                myStyle: new TMap.MarkerStyle({
                    // width: 34, // 点标记样式宽度（像素）
                    // height: 34, // 点标记样式高度（像素
                    // src: iconMarker, //图片路径
                    //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
                    anchor: { x: 17, y: 34 }
                })
            },
            //点标记数据数组
            geometries: [
                {
                    id: '1', //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
                    styleId: 'myStyle', //指定样式id
                    position: center //点标记坐标位置
                }
            ]
        })
        //监听地图点击事件
        map.on('click', (event: any) => {
            const { lat, lng } = event.latLng
            markerLayer.updateGeometries([
                {
                    styleId: 'myStyle',
                    id: '1',
                    position: new TMap.LatLng(lat, lng)
                }
            ])
            getGeocoder(lat, lng)
        })
        // getGeocoder(lat, lng)
    }

    // 地址解析
    const addressGeocoder = async (
        province_id: number | string,
        city_id: number | string,
        district_id: number | string,
        address: string
    ) => {
        try {
            const areaName = matchAreaName(province_id, city_id, district_id)
            const res: any = await jsonp(`https://apis.map.qq.com/ws/geocoder/v1/`, {
                key: tencent_map_key.value,
                address: `${areaName?.province}, ${areaName?.city}, ${areaName?.district}, ${address}`,
                output: 'jsonp'
            })
            if (res.status === 0) {
                const { lat, lng } = res.result.location
                loadTencentMapScript(lat, lng)
                // getGeocoder(lat, lng)
                map?.setCenter({ lat, lng })
            } else {
                const ckeckResult = await checkTencentMapResult(res)
                if (ckeckResult.result === false) {
                    const newKey = await getTencentMapKey({ is_delete: true })
                    if (newKey.tencent_map_key) {
                        tencent_map_key.value = newKey.tencent_map_key
                        config.value.tencent_map_key = tencent_map_key.value
                        appStore.setConfig(config.value)
                        await addressGeocoder(province_id, city_id, district_id, address)
                        return
                    }
                }

                feedback.msgError(res.message)
            }
        } catch (error) {
            feedback.msgError(error)
        }
    }

    // 地址逆解析
    const getGeocoder = async (lat: number | string, lng: number | string) => {
        try {
            const res: any = await jsonp(`https://apis.map.qq.com/ws/geocoder/v1/`, {
                key: tencent_map_key.value,
                location: `${lat},${lng}`,
                output: 'jsonp'
            })
            if (res.status === 0) {
                obj.province_id = matchProvinceId(res.result.address_component.province)

                if (
                    res.result.address_component.city == '北京市' ||
                    res.result.address_component.city == '天津市' ||
                    res.result.address_component.city == '上海市' ||
                    res.result.address_component.city == '重庆市'
                ) {
                    obj.city_id = matchCityId(obj.province_id, res.result.address_component.city)
                } else {
                    obj.city_id = res.result.ad_info.city_code.substring(3, 9)
                }

                obj.district_id = Number(res.result.ad_info.adcode)
                ;(obj.address = res.result.formatted_addresses.recommend),
                    (obj.latitude = lat),
                    (obj.longitude = lng)
            } else {
                const ckeckResult = await checkTencentMapResult(res)
                if (ckeckResult.result === false) {
                    const newKey = await getTencentMapKey({ is_delete: true })
                    if (newKey.tencent_map_key) {
                        tencent_map_key.value = newKey.tencent_map_key
                        config.value.tencent_map_key = tencent_map_key.value
                        appStore.setConfig(config.value)
                        await getGeocoder(lat, lng)
                        await loadTencentMapScript(lat, lng)
                        return
                    }
                }

                feedback.msgError(res.message)
            }
        } catch (error) {
            feedback.msgError(error)
        }
    }

    return {
        obj,
        loadTencentMapScript,
        addressGeocoder
    }
}
