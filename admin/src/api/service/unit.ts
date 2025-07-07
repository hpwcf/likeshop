import request from '@/utils/request'

// 单位列表
export function apiUnitLists(params: any) {
    return request.get({ url: '/goods.goods_unit/lists', params })
}

// 添加单位
export function apiUnitAdd(params: any) {
    return request.post({ url: '/goods.goods_unit/add', params })
}

// 删除单位
export function apiUnitDel(params: any) {
    return request.post({ url: '/goods.goods_unit/del', params })
}

// 编辑单位
export function apiUnitEdit(params: any) {
    return request.post({ url: '/goods.goods_unit/edit', params })
}

// 单位详情
export function apiUnitDetail(params: any) {
    return request.get({ url: '/goods.goods_unit/detail', params })
}

// 通用单位列表
export function apiUnitCommonLists() {
    return request.get({ url: '/goods.goods_unit/commonLists' })
}
