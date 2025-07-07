import request from '@/utils/request'

// 列表
export function apiStaffDepositLists(params: any) {
    return request.get({ url: '/staff.staff_deposit/lists', params })
}

// 详情
export function apiStaffDepositDetail(params: any) {
    return request.get({ url: '/staff.staff_deposit/detail', params })
}

// 添加
export function apiStaffDepositAdd(params: any) {
    return request.post({ url: '/staff.staff_deposit/add', params })
}

// 编辑
export function apiStaffDepositEdit(params: any) {
    return request.post({ url: '/staff.staff_deposit/edit', params })
}

// 删除
export function apiStaffDepositDel(params: any) {
    return request.post({ url: '/staff.staff_deposit/del', params })
}
