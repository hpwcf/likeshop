import config from '@/config'
import request from '@/utils/request'

// 登录
export function login(params: Record<string, any>) {
    return request.post({ url: '/login/account', params: { ...params, terminal: config.terminal } })
}

// 退出登录
export function logout() {
    return request.post({ url: '/login/logout' })
}

// 用户信息
export function getUserInfo() {
    return request.get({ url: '/auth.admin/mySelf' })
}

// 编辑管理员信息
export function setUserInfo(params: any) {
    return request.post({ url: '/auth.admin/editSelf', params })
}

// 用户列表
export function apiUserLists(params: any) {
    return request.get({ url: '/user.user/lists', params })
}

// 设置用户信息
export function apiSetUserInfo(params: {
    id: number | string
    field: string
    value: string | number
}) {
    return request.post({ url: '/user.user/editInfo', params })
}

// 用户详情
export function apiUserDetail(params: any) {
    return request.get({ url: '/user.user/detail', params })
}

//调整用户钱包
export function adjustUserWallet(params: any) {
    return request.post({ url: '/user.user/adjustBalance', params })
}
