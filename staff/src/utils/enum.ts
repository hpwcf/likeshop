import { createEnum } from 'enumtor'

// 余额提现类型
export const BalanceWithdrawalEnum = createEnum({
    WALLET: { text: '钱包余额', value: 1 },
    WECHAT_CHANGE: { text: '微信零钱', value: 2 },
    BANK_CARD: { text: '银行卡', value: 3 },
    WECHAT_COLLECTION_CODE: { text: '微信收款码', value: 4 },
    ALIPAY_COLLECTION_CODE: { text: '支付宝收款码', value: 5 }
})

// 支付状态
export const PaymentStatusEnum = {
    CLOSE: 0, // 取消
    SUCCESS: 1, // 成功
    FAIL: 2, // 失败
}