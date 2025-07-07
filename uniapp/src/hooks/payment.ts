import { apiPayPayWay, apiPayPrepay } from '@/api/app'
import { wxpay,alipay } from '@/utils/pay'
// import { toast } from '@/utils/util'
import { getClient } from '@/utils/client'
import { useUserStore } from '@/stores/user'

/**
 * @description 支付函数钩子
 * @param { emit } 是否刷新页面
 * @return { Function } 暴露钩子
 */
export function usePay() {
    /**
     * @description 1. 初始化获取支付方式
     * @param { params } 支付订单数据
     */
    const initPayWay = async (params: any): Promise<void> => {
        try {
            const res = await apiPayPayWay({
                //支付方式
                from: params.from || 'order',
                order_id: params.order_id,
                scene: getClient()
            })
            return res
        } catch (err) {
            console.log('获取支付方式', err)
        }
    }

    /**
     * @description 2. 预支付
     * @param { params } 支付订单数据
     */
    const handlePayPrepay = async (params: any): Promise<void> => {
        try {
			const userStore = useUserStore()
			if (userStore.userInfo.pay_auth && params.pay_way == 1) {
				uni.showModal({
					content: '当前账号未微信授权，请前往个人设置授权',
					confirmText: '前往授权',
					success: function (res) {
						if (res.confirm) {
							uni.reLaunch({
							    url: '/pages/user_set/user_set'
							})
						}
					}
				})
				return
			}
			
            const res = await apiPayPrepay({
                from: params.from || 'order',
                pay_way: params.pay_way,
                order_id: params.order_id
            })

            const param = JSON.stringify({
                order_id: params.order_id,
                from: params.from
            })

            // 支付方式:1-微信支付;2-支付宝支付;3-余额支付;
            if (params.pay_way !== 3) {
                handlePay(res, params)
            } else {
                uni.reLaunch({
                    url: `/bundle/pages/payment_result/payment_result?param=${param}`
                })
                uni.$u.toast('支付成功')
            }
        } catch (err) {
            uni.$u.toast(err)
        }
    }

    /**
     * @description 3. 吊起支付并处理支付结构
     * @param { res } 支付订单数据
     */
    const handlePay = async (res: any, params: any): Promise<void> => {
        try {
            // // #ifdef MP
            // await wxpay(res.config)
            // uni.$u.toast('支付成功')
            // // #endif

            // // #ifdef H5
            // await wxpay(res.config)
            // // #endif
			//支付方式:1-微信支付;2-支付宝支付;3-余额支付;
			switch (params.pay_way) {
			  case 1:
			    await wxpay(res.config)
			    break;
			  case 2:
			    await alipay(res.config)
			    break;
			  default:
				uni.$u.toast('支付异常')
			}

            const param = JSON.stringify({
                order_id: params.order_id,
                from: params.from
            })

            if (params.from === 'recharge') {
                return uni.reLaunch({
                    url: '/bundle/pages/user_wallet/user_wallet?isPay=true'
                })
            }
            uni.reLaunch({ url: `/bundle/pages/payment_result/payment_result?param=${param}` })
        } catch (err) {
            if (params.from === 'order') uni.reLaunch({ url: `/pages/order/index` })

            if (Number(params.order_amount) == 0) {
                return uni.$u.toast('下单成功')
            }
            uni.$u.toast('支付取消')
        }
    }
    return {
        initPayWay,
        handlePayPrepay,
        handlePay
    }
}
