import request from '@/utils/request'

// 地图key列表
export function apiMapKeyLists(params: any) {
    return request.get({ url: '/setting.map_key/lists', params })
}

// 地图key公共列表
export function apiMapKeyCommonLists(params: any) {
    return request.get({ url: '/setting.map_key/commonLists', params })
}

// 新增key
export function apiMapKeyAdd(params: any) {
    return request.post({ url: '/setting.map_key/add', params })
}

// 编辑key
export function apiMapKeyEdit(params: any) {
    return request.post({ url: '/setting.map_key/edit', params })
}

// key详情
export function apiMapKeyDetail(params: any) {
    return request.get({ url: '/setting.map_key/detail', params })
}

// 删除key
export function apiMapKeyDel(params: any) {
    return request.post({ url: '/setting.map_key/del', params })
}
