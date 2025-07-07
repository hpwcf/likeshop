import request from '@/utils/request'

// 设置微信小程序配置
export function setWeappConfig(params: any) {
    return request.post({ url: '/channel.mnp_settings/setConfig', params })
}

// 获取微信小程序配置
export function getWeappConfig() {
    return request.get({ url: '/channel.mnp_settings/getConfig' })
}
