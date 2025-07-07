import request from '@/utils/request'

export function apiRechargeGetRule() {
    return request.get({ url: '/marketing.recharge/getSettings' })
}
export function apiRechargeSetRule(params: any) {
    return request.post({ url: '/marketing.recharge/setSettings', params })
}

// 获取在线客服
export function apiServiceGetConfig() {
    return request.get({ url: '/marketing.kefu_config/getConfig' })
}

// 设置在线客服
export function apiServiceSetConfig(params: any) {
    return request.post({ url: '/marketing.kefu_config/setConfig', params })
}
