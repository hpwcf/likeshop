import request from '@/utils/request'

// 列表
export function apiMasterWorkerApplyLists(params: any) {
    return request.get({ url: '/staff.staff_apply/lists', params })
}

// 详情
export function apiMasterWorkerApplyDetail(params: any) {
    return request.get({ url: '/staff.staff_apply/detail', params })
}

// 审核
export function apiMasterWorkerApplyApply(params: any) {
    return request.post({ url: '/staff.staff_apply/apply', params })
}
