import { reactive, ref } from "vue";
import { isWeixinClient } from "@/utils/client";
import { getNearbyCity } from "@/api/store";
// #ifdef H5
import { getLocation as getWeChatLocation } from "@/hooks/wechat";

// #endif

export interface LocationType {
    latitude: string | number;
    longitude: string | number;
    name?: string;
    city_id?: number | null;
    id?: string;
}

export const locationState: LocationType = reactive({
    latitude: "",
    longitude: "",
    name: "",
    city_id: null,
    id: "",
});

export function useLocation() {
    const errorTitle = ref<string | null>(null);
    const errorContent = ref<string | null>(null);
    const showLocationModal = ref<boolean>(false);

    // 获取微信或浏览器位置信息
    const getLocationData = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                //定时器 两秒后没有获取到定位城市，获取默认城市
                const reverseGeocodeTimer = setTimeout(() => {
                    clearTimeout(reverseGeocodeTimer);
                    if (!locationState.city_id) {
                        resolve(reverseGeocode("", ""));
                    }
                }, 2000);
                if (isWeixinClient()) {
                    // 微信客户端获取定位
                    try {
                        const wechatLocation: any = await getWeChatLocation();
                        locationState.latitude = wechatLocation.latitude;
                        locationState.longitude = wechatLocation.longitude;
                        await reverseGeocode(
                            String(wechatLocation.latitude),
                            String(wechatLocation.longitude)
                        );
                        resolve(locationState);
                    } catch (err) {
                        errorTitle.value = "微信定位获取失败";
                        errorContent.value = "微信定位失败：" + err;
                        console.error("微信定位失败：", err);
                    }
                } else {
                    // H5或其他客户端获取定位
                    uni.getLocation({
                        type: "gcj02", // 常用坐标系
                        async success(res) {
                            locationState.latitude = res.latitude;
                            locationState.longitude = res.longitude;
                            await reverseGeocode(
                                String(res.latitude),
                                String(res.longitude)
                            );
                            resolve(locationState);
                        },
                        fail(err) {
                            handleLocationFailure(err);
                        },
                    });
                }
            } catch (err) {
                errorTitle.value = "定位获取失败";
                errorContent.value = "定位失败原因：" + err;
                reject();
                console.error("定位失败原因：", err);
            }
        });
    };

    // 定位失败处理
    const handleLocationFailure = (err: any) => {
        if (!uni.getSystemInfoSync().locationEnabled) {
            showLocationModal.value = true;
            errorTitle.value = "定位服务未开启";
            errorContent.value = "请开启定位服务后重新进入应用";
        } else {
            showLocationModal.value = true;
            errorTitle.value = "定位权限未授权";
            errorContent.value =
                "请在设置中打开授权，以便我们能够更好的提供服务。";
        }
        console.error("获取位置失败：", err);
    };

    const reverseGeocode = async (latitude: string, longitude: string) => {
        try {
            const data = await getNearbyCity({ latitude, longitude });
            setLocationData(data);
        } catch (error) {
            console.error("Error reverse geocoding location:", error);
        }
    };

    const setLocationData = (data: LocationType) => {
        // @ts-ignore
        Reflect.ownKeys(data).map((key) => (locationState[key] = data[key]));
    };

    return {
        locationState,
        errorTitle,
        errorContent,
        showLocationModal,
        getLocationData,
        setLocationData,
    };
}
