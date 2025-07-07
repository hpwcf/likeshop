// 页面模式
export enum PageMode {
    'ADD' = 'add', // 添加
    'EDIT' = 'edit' // 编辑
}

export enum ServiceMode {
    'all_count' = '全部', //	int	全部
    'SHELVE' = '上架', //销售中
    'UNSHELVE' = '下架' //仓库中
}

export enum OrderMode {
    'all_count' = '全部',
    'wait_pay_count' = '待付款',
    'wait_receive_count' = '待接单',
    'received_count' = '待出发',
    'setout_count' = '已出发',
    'arrive_count' = '已到达',
    'service_count' = '服务中',
    'finish_count' = '已完成',
    'close_count' = '已关闭'
}

export enum RefundMode {
    'all_count' = '全部',
    'refund_wait_count' = '退款中',
    'refund_success_count' = '退款成功',
    'refund_fail_count' = '退款失败'
}
