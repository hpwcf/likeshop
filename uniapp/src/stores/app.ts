import { defineStore } from "pinia";
import { apiConfigGet, apiGetKefuConfig } from "@/api/app";
import { isWeixinClient } from "@/utils/client";
// #ifdef H5
import { getLocation } from "@/hooks/wechat";
// #endif
import { getGeocoderCoordinate } from "@/api/app";
import { apiIndexOpenCity } from "@/api/store";

interface City {
    name: string | null | undefined;
    city_id: number | null | undefined | string;
    latitude: string | null | undefined;
    longitude: string | null | undefined;
    addressName?: string | null | undefined;
}

interface AppModule {
    config: Record<string, any>;
    sysInfo: Record<string, any>;
    kefuInfo: Record<string, any>;
}

export const useAppStore = defineStore({
    id: "appStore",
    state: (): AppModule => ({
        // 公共配置
        config: {
            navigation_menu: [],
            style: {},
        },
        // 系统信息
        sysInfo: {},
        // 客服信息
        kefuInfo: {},
    }),
    getters: {
        appConfig: (state) => state.config,
    },
    actions: {
        // 对url过滤，如url是完整地址则直接返回；如不完整则拼接域名前缀
        getImageUrl(url: string) {
            if (!url) return;
            return url.includes("http://") || url.includes("https://")
                ? url
                : `${this.config.domain}${url}`;
        },

        //  获取公共数据
        async getConfig() {
            try {
                const res = await apiConfigGet();
                this.config = res;
            } catch (error) {
                console.log("公共数据请求", error);
            }
        },

        // 获取系统信息
        getSystemInfo() {
            uni.getSystemInfo({
                success: (res) => {
                    const { statusBarHeight, platform }: any = res;
                    let navHeight;
                    if (platform == "ios" || platform == "devtools") {
                        navHeight = statusBarHeight + 44;
                    } else {
                        navHeight = statusBarHeight + 48;
                    }
                    this.sysInfo = {
                        ...res,
                        navHeight,
                    };
                },
                fail(err) {
                    console.log(err);
                },
            });
        },

        // 获取客服配置
        async getKefuInfo() {
            try {
                const res = await apiGetKefuConfig();
                // #ifdef MP-WEIXIN
                this.kefuInfo = res.mnp;
                uni.$emit("refreshhome");
                // #endif

                // #ifdef H5
                if (isWeixinClient()) {
                    this.kefuInfo = res.oa;
                } else {
                    this.kefuInfo = res.h5;
                }
                uni.$emit("refreshhome");
                // #endif
                console.log("kefuInfo", this.kefuInfo);
            } catch (error) {
                console.log("获取客服配置错误", error);
            }
        },
    },
});
