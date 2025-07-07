import request from '@/utils/request'

//列表
export function apiWithdrawLists(params: any) {
    return request.get({ url: '/finance.withdraw/lists', params })
}

//详情
export function apiWithdrawDetail(params: any) {
    return request.get({ url: '/finance.withdraw/detail', params })
}

//审核
export function apiWithdrawVerify(params: any) {
    return request.post({ url: '/finance.withdraw/verify', params })
}

//转账
export function apiWithdrawTransfer(params: any) {
    return request.post({ url: '/finance.withdraw/transfer', params })
}

//枚举列表
export function apiWithdrawEnumLists(params: any) {
    return request.post({ url: '/finance.withdraw/enumLists', params })
}
