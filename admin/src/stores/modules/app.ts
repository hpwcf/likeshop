import { getConfig } from '@/api/app'
import { defineStore } from 'pinia'
interface AppSate {
    config: Record<string, any>
    isMobile: boolean
    isCollapsed: boolean
    isRouteShow: boolean
}

const useAppStore = defineStore({
    id: 'app',
    state: (): AppSate => {
        return {
            config: {},
            isMobile: true,
            isCollapsed: false,
            isRouteShow: true
        }
    },
    actions: {
        // 对url过滤，如url是完整地址则直接返回；如不完整则拼接域名前缀
        getImageUrl(url: string) {
            if (!url) return
            return url.includes('http://') || url.includes('https://')
                ? url
                : `${this.config.oss_domain}${url}`
        },
        getConfig() {
            return new Promise((resolve, reject) => {
                getConfig()
                    .then((data) => {
                        this.config = data
                        resolve(data)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
        setMobile(value: boolean) {
            this.isMobile = value
        },
        toggleCollapsed(toggle?: boolean) {
            this.isCollapsed = toggle ?? !this.isCollapsed
        },
        refreshView() {
            this.isRouteShow = false
            nextTick(() => {
                this.isRouteShow = true
            })
        },
        setConfig(value: string | any) {
            this.config = value
        }
    }
})

export default useAppStore
