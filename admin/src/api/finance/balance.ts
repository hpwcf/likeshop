import request from '@/utils/request'

// 余额明细
export function apiAccountLogLists(params: any) {
    return request.get({ url: '/finance.account_log/lists', params })
}

export function changeTypeLists(params: any) {
    return request.get({ url: '/finance.account_log/changeTypeLists', params })
}
