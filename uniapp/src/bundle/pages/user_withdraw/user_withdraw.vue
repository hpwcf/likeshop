<template>
    <page-meta :page-style="$theme.pageStyle">
		<!-- #ifndef H5 -->
		<navigation-bar
			:front-color="$theme.navColor"
			:background-color="$theme.navBgColor"
		/>
		<!-- #endif -->
	</page-meta>
    <view class="user-withdraw">
        <view class="balance-withdrawal-card">
            <u-tabs
                :list="withdrawConfigData.type"
                :is-scroll="true"
                :current="operationCurrent"
                @change="operationChange"
                inactive-color="#666"
                active-color="#33D192"
                itemWidth="240"
            />
        </view>

        <!-- 微信收款码 -->
        <template
            v-if="
                withdrawConfigData.type[operationCurrent]?.value ==
                BalanceWithdrawalEnum.WECHAT_COLLECTION_CODE
            "
        >
            <view class="payment-code-card">
                <u-form :model="withdrawApplyData" ref="uForm" label-width="150rpx">
                    <u-form-item label="微信账号">
                        <u-input v-model="withdrawApplyData.account" placeholder="请输入微信账号" />
                    </u-form-item>

                    <u-form-item label="真实姓名">
                        <u-input
                            v-model="withdrawApplyData.real_name"
                            placeholder="请输入真实姓名"
                        />
                    </u-form-item>

                    <u-form-item label="备注">
                        <u-input
                            v-model="withdrawApplyData.apply_remark"
                            placeholder="请输入备注(选填)"
                        />
                    </u-form-item>
                </u-form>

                <view class="mt-[20rpx]">
                    <uploader v-model="withdrawApplyData.money_qr_code"></uploader>
                    <view class="ml-[10rpx]"> 微信收款码 </view>
                </view>
            </view>
        </template>

        <!-- 支付宝收款码 -->
        <template
            v-if="
                withdrawConfigData.type[operationCurrent]?.value ==
                BalanceWithdrawalEnum.ALIPAY_COLLECTION_CODE
            "
        >
            <view class="payment-code-card">
                <u-form :model="withdrawApplyData" ref="uForm" label-width="150rpx">
                    <u-form-item label="支付宝账号">
                        <u-input
                            v-model="withdrawApplyData.account"
                            placeholder="请输入支付宝账号"
                        />
                    </u-form-item>

                    <u-form-item label="真实姓名">
                        <u-input
                            v-model="withdrawApplyData.real_name"
                            placeholder="请输入真实姓名"
                        />
                    </u-form-item>

                    <u-form-item label="备注">
                        <u-input
                            v-model="withdrawApplyData.apply_remark"
                            placeholder="请输入备注(选填)"
                        />
                    </u-form-item>
                </u-form>

                <view class="mt-[20rpx]">
                    <uploader v-model="withdrawApplyData.money_qr_code"></uploader>
                    <view class="ml-[10rpx]"> 支付宝收款码 </view>
                </view>
            </view>
        </template>

        <!-- 银行卡 -->
        <template
            v-if="
                withdrawConfigData.type[operationCurrent]?.value == BalanceWithdrawalEnum.BANK_CARD
            "
        >
            <view class="payment-code-card">
                <u-form :model="withdrawApplyData" ref="uForm" label-width="150rpx">
                    <u-form-item label="银行卡账号">
                        <u-input
                            v-model="withdrawApplyData.account"
                            placeholder="请输入银行卡账号"
                        />
                    </u-form-item>

                    <u-form-item label="持卡人姓名">
                        <u-input
                            v-model="withdrawApplyData.real_name"
                            placeholder="请输入持卡人姓名"
                        />
                    </u-form-item>

                    <u-form-item label="提现银行">
                        <u-input v-model="withdrawApplyData.bank" placeholder="请输入提现银行" />
                    </u-form-item>

                    <u-form-item label="银行支行">
                        <u-input v-model="withdrawApplyData.subbank" placeholder="如：荔湾支行" />
                    </u-form-item>

                    <u-form-item label="备注">
                        <u-input
                            v-model="withdrawApplyData.apply_remark"
                            placeholder="请输入备注(选填)"
                        />
                    </u-form-item>
                </u-form>
            </view>
        </template>

        <!-- 钱包余额 / 微信钱包 -->
        <view class="wallet-balance-card">
            <view class="wallet-balance-input flex">
                <text style="font-size: 46rpx">¥</text>
                <input
                    class="flex-1"
                    placeholder="0.00"
                    type="digit"
                    v-model="withdrawApplyData.money"
                />

                <view class="withdrawal-text">
                    <view
                        class="all-withdrawal"
                        @click="withdrawApplyData.money = withdrawConfigData.user_earnings"
                    >
                        全部提现
                    </view>
                    <view class="can-withdrawal">
                        可提现余额 ¥ {{ withdrawConfigData.user_earnings }}
                    </view>
                </view>
            </view>

            <view
                class="wallet-balance-tips"
                v-if="
                    withdrawConfigData.type[operationCurrent]?.value != BalanceWithdrawalEnum.WALLET
                "
            >
                提示：提现需要扣除服务费{{ withdrawConfigData.percentage }}%
            </view>
        </view>

        <view class="mt-[30rpx]">
            <u-button
                @click="handleWithdraw()"
                :ripple="true"
                :hair-line="false"
                shape="circle"
                type="primary"
                hover-class="none"
            >
                确认提现
            </u-button>

            <view
                class="withdrawal-record"
                @click="goPage('/bundle/pages/withdraw_record/withdraw_record')"
            >
                提现记录
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { BalanceWithdrawalEnum } from '@/utils/enum'
import { apiGetWithdrawConfig, apiWithdrawApply } from '@/api/wallet'
import uploader from '@/components/uploader/index.vue'
import formCard from './components/form-card.vue'

const operationCurrent = ref<any>(0)

// 提现配置数据
const withdrawConfigData = ref({
    user_earnings: '', // 可提现金额
    min_withdraw: '', // 最低提现金额
    max_withdraw: '', // 最高提现金额
    percentage: '', // 	手续费百分比
    type: '' // 提现类型
})

// 提现申请数据
const withdrawApplyData = ref({
    type: '', // 提现类型 1-余额 2-微信零钱 3-银行卡 4-微信收款码 5-支付宝收款码
    money: '', // 提现金额
    account: '', // 账号; 提现方式：银行卡、微信收款码、支付宝收款码 必填
    real_name: '', // 真实姓名; 提现方式：银行卡、微信收款码、支付宝收款码 必填
    money_qr_code: '', // 收款码 提现方式：微信收款码、支付宝收款码 必填
    bank: '', // 提现银行 提现方式：银行卡 必填
    subbank: '', // 提现支银行 提现方式：银行卡 必填
    apply_remark: '' // 备注
})

const operationChange = (e: any) => {
    operationCurrent.value = e
}

// 获取提现配置
const getWithdrawConfig = async () => {
    const res = await apiGetWithdrawConfig('')
    withdrawConfigData.value = res
}

// 提现
const handleWithdraw = () => {
    if (withdrawApplyData.value.money == '') return uni.$u.toast('请输入提现金额')

    const params = {
        type: withdrawConfigData.value.type[operationCurrent.value]?.value,
        money: withdrawApplyData.value.money,
        account: withdrawApplyData.value.account,
        real_name: withdrawApplyData.value.real_name,
        money_qr_code: withdrawApplyData.value.money_qr_code.toString(),
        bank: withdrawApplyData.value.bank,
        subbank: withdrawApplyData.value.subbank,
        apply_remark: withdrawApplyData.value.apply_remark
    }

    apiWithdrawApply({ ...params }).then((res: any) => {
        uni.$u.toast('添加成功')
        withdrawApplyData.value.money = ''
        setTimeout(() => {
            uni.navigateTo({
                url: `/bundle/pages/withdrawal_details/withdrawal_details?id=${res.id}`
            })
        }, 1000)
    })
}

// 跳转页面
const goPage = (url: any) => {
    uni.navigateTo({ url: url })
}

onShow(() => {
    getWithdrawConfig()
})
</script>

<style lang="scss" scoped>
.user-withdraw {
    padding: 15rpx 30rpx;

    // tab栏
    .balance-withdrawal-card {
        background-color: #fff;
        border-radius: 20rpx;
        padding: 10rpx;
    }

    // 收款码/银行卡
    .payment-code-card {
        background-color: #fff;
        border-radius: 20rpx;
        margin-top: 20rpx;
        padding: 0 36rpx 30rpx 36rpx;

        .u-list-item.data-v-f8c23944 {
            background-color: #fff !important;
            margin: 0;
            border: 1rpx dashed #ccc;
            margin-top: 20rpx;
            padding-top: 20rpx;
        }
    }

    // 钱包余额 / 微信钱包
    .wallet-balance-card {
        background-color: #fff;
        border-radius: 20rpx;
        margin-top: 20rpx;
        padding: 35rpx 0 66rpx 66rpx;

        .wallet-balance-input {
            margin-top: 20rpx;
            margin-right: 66rpx;

            input {
                height: 94rpx;
                text-align: left;
                font-size: 66rpx;
                margin-left: 30rpx;
            }

            border-bottom: 1rpx solid #ebebeb;

            .withdrawal-text {
                font-size: 24rpx;

                .all-withdrawal {
                    color: $u-type-primary;
                    display: subgrid;
                    display: flex;
                    justify-content: flex-end;
                    padding-bottom: 10rpx;
                }

                .can-withdrawal {
                    color: #999;
                }
            }
        }

        .wallet-balance-tips {
            margin-top: 30rpx;
            font-size: 24rpx;
            color: #999;
            font-weight: 400;
        }
    }

    .withdrawal-record {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28rpx;
        color: #666;
        margin-top: 40rpx;
    }
}
</style>
