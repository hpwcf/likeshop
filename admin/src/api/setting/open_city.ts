import request from '@/utils/request'

// 列表
export function apiOpenCityLists(params: any) {
    return request.get({ url: '/setting.open_city/lists', params })
}

// 详情
export function apiOpenCityDetail(params: any) {
    return request.get({ url: '/setting.open_city/detail', params })
}

// 添加
export function apiOpenCityAdd(params: any) {
    return request.post({ url: '/setting.open_city/add', params })
}

// 编辑
export function apiOpenCityEdit(params: any) {
    return request.post({ url: '/setting.open_city/edit', params })
}

// 删除
export function apiOpenCityDel(params: any) {
    return request.post({ url: '/setting.open_city/del', params })
}

// 通用列表
export function apiOpenCityCommonLists(params: any) {
    return request.get({ url: '/setting.open_city/commonLists', params })
}

// 通用完整列表
export function apiOpenCityCommonIntactLists(params: any) {
    return request.get({ url: '/setting.open_city/commonIntactLists', params })
}
