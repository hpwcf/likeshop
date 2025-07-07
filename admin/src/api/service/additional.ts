import request from '@/utils/request'

// 列表
export function apiServiceAdditionalLists(params: any) {
    return request.get({ url: '/goods.goods_additional/lists', params })
}

// 详情
export function apiServiceAdditionalDetail(params: any) {
    return request.get({ url: '/goods.goods_additional/detail', params })
}

// 添加
export function apiServiceAdditionalAdd(params: any) {
    return request.post({ url: '/goods.goods_additional/add', params })
}

// 编辑
export function apiServiceAdditionalEdit(params: any) {
    return request.post({ url: '/goods.goods_additional/edit', params })
}

// 状态
export function apiServiceAdditionalStatus(params: any) {
    return request.post({ url: '/goods.goods_additional/status', params })
}

// 删除
export function apiServiceAdditionalDel(params: any) {
    return request.post({ url: '/goods.goods_additional/del', params })
}
