import request from '@/utils/request'

// 列表
export function apiProtocolLists(params: any) {
    return request.get({ url: '/setting.web.protocol/lists', params })
}

// 详情
export function apiProtocolDetail(params: any) {
    return request.get({ url: '/setting.web.protocol/detail', params })
}

// 添加
export function apiProtocolAdd(params: any) {
    return request.post({ url: '/setting.web.protocol/add', params })
}

// 编辑
export function apiProtocolEdit(params: any) {
    return request.post({ url: '/setting.web.protocol/edit', params })
}

// 删除
export function apiProtocolDel(params: any) {
    return request.post({ url: '/setting.web.protocol/del', params })
}
