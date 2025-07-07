import request from '@/utils/request'

// 钱包信息
export const apiUserWallet = (params: any) => request.get({ url: '/user/wallet', data: params })

// 账户明细列表
export const apiAccountLogLists = (params: any) =>
    request.get({ url: '/account_log/lists', data: params }, { ignoreCancel: true })

// 获取提现配置
export const apiGetWithdrawConfig = (params: any) =>
    request.get({ url: '/withdraw/getConfig', data: params })

// 提现申请
export const apiWithdrawApply = (params: any) =>
    request.post({ url: '/withdraw/apply', data: params })

// 提现申请列表
export const apiWithdrawLists = (params: any) =>
    request.get({ url: '/withdraw/lists', data: params })

// 提现申请详情
export const apiWithdrawDetail = (params: any) =>
    request.get({ url: '/withdraw/detail', data: params })
