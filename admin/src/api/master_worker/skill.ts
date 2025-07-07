import request from '@/utils/request'

// 列表
export function apiStaffSkillLists(params: any) {
    return request.get({ url: '/staff.staff_skill/lists', params })
}

// 详情
export function apiStaffSkillDetail(params: any) {
    return request.get({ url: '/staff.staff_skill/detail', params })
}

// 添加
export function apiStaffSkillAdd(params: any) {
    return request.post({ url: '/staff.staff_skill/add', params })
}

// 编辑
export function apiStaffSkillEdit(params: any) {
    return request.post({ url: '/staff.staff_skill/edit', params })
}

// 状态
export function apiStaffSkillStatus(params: any) {
    return request.post({ url: '/staff.staff_skill/status', params })
}

// 删除
export function apiStaffSkillDel(params: any) {
    return request.post({ url: '/staff.staff_skill/del', params })
}

// 通用列表
export function apiAllStaffSkillLists(params: any) {
    return request.get({ url: '/staff.staff_skill/allLists', params })
}
