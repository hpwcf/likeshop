import request from '@/utils/request'

// 评价列表
export function apiCommentLists(params: any) {
    return request.get({ url: '/goods.goods_comment/lists', params })
}

// 评价回复
export function apiCommentReply(params: any) {
    return request.post({ url: '/goods.goods_comment/reply', params })
}

// 删除评价
export function apiCommentDel(params: any) {
    return request.post({ url: '/goods.goods_comment/del', params })
}

// 评价详情
export function apiCommentDetail(params: any) {
    return request.get({ url: '/goods.goods_comment/detail', params })
}
