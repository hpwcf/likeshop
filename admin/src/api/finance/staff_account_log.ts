import request from '@/utils/request'

export function apiStaffAccountLogLists(params: any) {
    return request.get({ url: '/finance.staff_account_log/lists', params })
}

export function getStaffChangeTypeLists(params: any) {
    return request.get({ url: '/finance.staff_account_log/changeTypeLists', params })
}
