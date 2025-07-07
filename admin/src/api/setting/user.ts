import request from '@/utils/request'

// 获取用户设置
export function apiUserConfigGet() {
    return request.get({ url: '/setting.user.user/getConfig' })
}

// 用户设置
export function apiUserConfigSet(params: any) {
    return request.post({ url: '/setting.user.user/setConfig', params })
}

// 获取登录注册设置
export function apiLoginConfigGet() {
    return request.get({ url: '/setting.user.user/getRegisterConfig' })
}

// 登录注册设置
export function apiLoginConfigSet(params: any) {
    return request.post({ url: '/setting.user.user/setRegisterConfig', params })
}

// 获取提现配置
export function apiGetWithdrawConfig() {
    return request.get({ url: '/setting.user.user/getWithdrawConfig' })
}

// 设置提现配置
export function apiSetWithdrawConfig(params: any) {
    return request.post({ url: '/setting.user.user/setWithdrawConfig', params })
}

export interface LoginSetup {
    login_way: any // 登录方式, 逗号隔开
    coerce_mobile: number // 强制绑定手机 0/1
    login_agreement?: number // 是否开启协议 0/1
    third_auth: number // 第三方登录 0/1
    wechat_auth: any // 第三方自动登录 逗号隔开
}
