import request from '@/utils/request'
import { client } from '@/utils/client'

//用户中心
export const getUserCenter = (header?: any) => request.get({ url: '/staff/center', header })

//用户信息
export const apiUserInfo = () => request.get({ url: '/staff/info' }, { isAuth: true })

//设置用户信息
export function apiUserSetInfo(params: any) {
	return request.post({ url: '/staff/setInfo', data: { ...params, terminal: client } })
} 

//忘记密码
export function apiUserForgetPassword(params: any) {
    return request.post({ url: '/staff/forgetPassword', data: { ...params, terminal: client } })
}

//修改密码
export function apiUserChangePassword(params: any) {
    return request.post({ url: '/staff/changePassword', data: { ...params, terminal: client } })
}

//更新最后一次定位地址
export function apiUserUpdateLastAddress(params: any) {
    return request.post({ url: '/staff/updateLastAddress', data: { ...params, terminal: client } })
}

//切换工作状态
export function apiUserChangeWorkStatus(params: any) {
    return request.post({ url: '/staff/changeWorkStatus', data: params })
}

//技能列表
export function apiUserSkillLists(params: any) {
    return request.get({ url: '/staff/skillLists', data: params })
}

//枚举列表
export function apiUserEnumLists(params: any) {
    return request.get({ url: '/staff/enumLists', data: params })
}

//申请入驻
export function apiUserApply(params: any) {
    return request.post({ url: '/staff/apply', data: params })
}

//申请详情
export const apiUserApplyDetail = () => request.get({ url: '/staff/applyDetail' }, { isAuth: true })

//服务时间
export function apiUserServiceTime(params: any) {
    return request.post({ url: '/staff/serviceTime', data: params })
}

//设置忙时
export function apiUserSetBusytime(params: any) {
    return request.post({ url: '/staff/setBusytime', data: params })
}

//获取完善资料信息
export const apiUserGetImproveInfo = () => request.get({ url: '/staff/getImproveInfo' }, { isAuth: true })

//完善资料
export function apiUserSetImproveInfo(params: any) {
    return request.post({ url: '/staff/setImproveInfo', data: params })
}

//获取提现账户
export const apiUserGetWithdrawAccount = () => request.get({ url: '/staff/getWithdrawAccount' }, { isAuth: true })

//完善资料
export function apiUserSetWithdrawAccount(params: any) {
    return request.post({ url: '/staff/setWithdrawAccount', data: params })
}

//收入列表
export const apiUserIncomeLists = (params: any) => request.get({ url: '/staff/incomeLists', data: params }, { isAuth: true })

/** Profile End **/


/** Deposit start **/

//获取提现账户
export const apiUserDepositLists = () => request.get({ url: '/staff_deposit/lists' }, { isAuth: true })

//充值保证金
export function apiUserDepositRecharge(params: any) {
    return request.post({ url: '/staff_deposit/recharge', data: params })
}

/**
 * @param { Object } params
 * @return { Promise }
 * @description 充值保证金详情
 */
export const apiUserDepositRechargeDetail = (params: any) => request.get({ url: '/staff_deposit/rechargeDetail', data: params })

/** Deposit end **/
