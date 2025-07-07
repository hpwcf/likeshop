import request from '@/utils/request'

// 师傅列表
export function apiMasterWorkerLists(params: any) {
    return request.get({ url: '/staff.staff/lists', params })
}

// 师傅详情
export function apiMasterWorkerDetail(params: any) {
    return request.get({ url: '/staff.staff/detail', params })
}

// 师傅添加
export function apiMasterWorkerAdd(params: any) {
    return request.post({ url: '/staff.staff/add', params })
}

// 师傅编辑
export function apiMasterWorkerEdit(params: any) {
    return request.post({ url: '/staff.staff/edit', params })
}

// 师傅状态
export function apiMasterWorkerStatusEdit(params: any) {
    return request.post({ url: '/staff.staff/status', params })
}

// 师傅删除
export function apiMasterWorkerDel(params: any) {
    return request.post({ url: '/staff.staff/del', params })
}

// 枚举列表
export function apiMasterWorkerEnumLists(params: any) {
    return request.get({ url: '/staff.staff/enumLists', params })
}

// 调整金额
export function apiMasterWorkerAdjustAmount(params: any) {
    return request.post({ url: '/staff.staff/adjustAmount', params })
}
