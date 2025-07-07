import request from '@/utils/request'

// 列表
export function apiMasterWorkerImproveInfoLists(params: any) {
    return request.get({ url: '/staff.staff_improve_info/lists', params })
}

// 详情
export function apiMasterWorkerImproveInfoDetail(params: any) {
    return request.get({ url: '/staff.staff_improve_info/detail', params })
}

// 审核
export function apiMasterWorkerImproveInfoVerify(params: any) {
    return request.post({ url: '/staff.staff_improve_info/verify', params })
}
