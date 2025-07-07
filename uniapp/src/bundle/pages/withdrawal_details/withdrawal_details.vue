<template>
    <view class="withdrawal-details">
        <view class="bg-white withdrawal-details-item">
            <view class="whether-pass" v-if="formData.status == 1">
                <image src="@/bundle/static/images/icon_cashOut_wait.png" />
                <view class="mt-[12rpx]">{{ formData.status_desc }}</view>
            </view>

            <view class="whether-pass" v-if="formData.status == 2">
                <image src="@/bundle/static/images/icon_cashOut_wait.png" />
                <view class="mt-[12rpx]">{{ formData.status_desc }}</view>
            </view>

            <view class="whether-pass" v-if="formData.status == 3">
                <image src="@/bundle/static/images/icon_cashOut_success.png" />
                <view class="mt-[12rpx]">{{ formData.status_desc }}</view>
            </view>

            <view class="whether-pass" v-if="formData.status == 4">
                <image src="@/bundle/static/images/icon_cashOut_fail.png" />
                <view class="mt-[12rpx]">{{ formData.status_desc }}</view>
            </view>

            <view class="withdrawal-money">
                <view class="withdrawal-money-icon"> ¥ </view>
                <view class="withdrawal-money-text"> {{ formData.money }} </view>
            </view>

            <view class="ml-[30rpx] mt-[20rpx] mr-[30rpx] pb-[20rpx]">
                <view class="flex justify-between withdrawal-content">
                    <view>提现单号</view>
                    <view>{{ formData.sn }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>申请时间</view>
                    <view>{{ formData.create_time }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>提现至</view>
                    <view>{{ formData.type_desc }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>服务费</view>
                    <view>{{ formData.handling_fee }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>实际到账</view>
                    <view>{{ formData.left_money }}</view>
                </view>
            </view>

            <!-- 银行卡提现 -->
            <view
                class="ml-[30rpx] mt-[20rpx] mr-[30rpx] pt-[20rpx]"
                style="border-top: 1rpx solid #e5e5e5"
                v-if="formData.type == 3"
            >
                <view class="flex justify-between withdrawal-content">
                    <view>银行卡账号</view>
                    <view>{{ formData.account }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>持卡人姓名</view>
                    <view>{{ formData.real_name }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>提现银行</view>
                    <view>{{ formData.bank }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>银行支行</view>
                    <view>{{ formData.subbank }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>备注说明</view>
                    <view>{{ formData.transfer_remark }}</view>
                </view>
            </view>

            <!-- 支付宝收款码提现 -->
            <view
                class="ml-[30rpx] mt-[20rpx] mr-[30rpx] pt-[20rpx]"
                style="border-top: 1rpx solid #e5e5e5"
                v-if="formData.type == 5"
            >
                <view class="flex justify-between withdrawal-content">
                    <view>支付宝账号</view>
                    <view>{{ formData.account }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>真实姓名</view>
                    <view>{{ formData.real_name }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>支付宝收款码</view>
                    <u-image
                        height="160"
                        width="160"
                        :src="formData.money_qr_code"
                        @click="showImage([formData.money_qr_code])"
                    >
                    </u-image>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>备注说明</view>
                    <view>{{ formData.transfer_remark }}</view>
                </view>
            </view>

            <!-- 微信收款码提现 -->
            <view
                class="ml-[30rpx] mt-[20rpx] mr-[30rpx] pt-[20rpx]"
                style="border-top: 1rpx solid #e5e5e5"
                v-if="formData.type == 4"
            >
                <view class="flex justify-between withdrawal-content">
                    <view>微信账号</view>
                    <view>{{ formData.account }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>真实姓名</view>
                    <view>{{ formData.real_name }}</view>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>微信收款码</view>
                    <u-image
                        height="160"
                        width="160"
                        :src="formData.money_qr_code"
                        @click="showImage([formData.money_qr_code])"
                    >
                    </u-image>
                </view>
                <view class="flex justify-between withdrawal-content">
                    <view>备注说明</view>
                    <view>{{ formData.transfer_remark }}</view>
                </view>
            </view>

            <!-- 转账凭证 -->
            <view
                class="mx-[30rpx] my-[20rpx] pt-[20rpx]"
                style="border-top: 1rpx solid #e5e5e5"
                v-if="formData.status == 3 || formData.status == 4"
            >
                <view class="flex justify-between withdrawal-content">
                    <view>转账凭证</view>
                    <u-image
                        height="160"
                        width="160"
                        :src="formData.transfer_voucher"
                        v-if="formData.transfer_voucher"
                        @click="showImage([formData.transfer_voucher])"
                    >
                    </u-image>
                </view>

                <view class="flex justify-between withdrawal-content">
                    <view>转账说明</view>
                    <view>{{ formData.transfer_remark || '-' }}</view>
                </view>
            </view>

            <view class="check-withdrawal-record">
                <button class="Btn" @click="toRecord">查看历史提现记录</button>

                <view class="mt-[20rpx]">
                    <button class="Btn del_Btn" @click="toHome">返回首页</button>
                </view>
            </view>
        </view>

        <view class="review-success-tips">* 审核成功后约72小时内到账，请留意账户明细</view>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiWithdrawDetail } from '@/api/wallet'

const withdrawId = ref<number | string>('')

const formData = ref({
    type: '', // 提现类型：1-钱包余额；2-微信零钱；3-银行卡;4-微信收款码;5-支付宝收款码
    type_desc: '', // 提现类型描述
    status: '', // 提现状态:1-待提现2-提现中3-提现成功4-提现失败
    status_desc: '', // 提现状态描述
    money: '', // 提现金额
    money_qr_code: '', // 收款码
    create_time: '', // 提现申请时间
    sn: '', // 提现编号
    handling_fee: '', // 服务费
    account: '', // 提现账号
    real_name: '', // 提现人姓名
    bank: '', // 提现银行
    subbank: '', // 提现支行
    transfer_voucher: '', // 转账凭证
    transfer_remark: '' // 转账备注
})

// 获取提现申请详情
const getWithdrawDetail = () => {
    apiWithdrawDetail({ id: withdrawId.value }).then((res: any) => {
        formData.value = res
    })
}

const toRecord = () => {
    uni.redirectTo({
        url: '/bundle/pages/withdraw_record/withdraw_record'
    })
}

const toHome = () => {
    uni.reLaunch({
        url: '/pages/index/index'
    })
}

const showImage = (list: any) => {
    uni.previewImage({
        urls: list,
        current: 1
    })
}

onLoad((options) => {
    withdrawId.value = options?.id || ''
    getWithdrawDetail()
})
</script>

<style lang="scss" scoped>
.withdrawal-details {
    padding: 20rpx;

    .withdrawal-details-item {
        .whether-pass {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-size: 34rpx;
            font-weight: 500;
            padding-top: 40rpx;

            image {
                width: 100rpx;
                height: 100rpx;
            }
        }

        .withdrawal-money {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ff2c3c;
            margin-top: 20rpx;
            padding-bottom: 52rpx;

            .withdrawal-money-icon {
                font-size: 30rpx;
            }

            .withdrawal-money-text {
                font-size: 46rpx;
            }
        }

        .withdrawal-content {
            padding-bottom: 34rpx;
        }

        .check-withdrawal-record {
            padding: 40rpx 0rpx 50rpx 0;
            margin: 0 30rpx;
            border-top: 1px solid #ebebeb;

            .Btn {
                @apply bg-white text-base text-black leading-[72rpx] h-[72rpx] rounded-full;
                border: 1px solid $u-type-primary;
                background-color: $u-type-primary;
                color: white;
                text-align: center;
            }
            .del_Btn {
                border: 1px solid $u-type-primary;
                background-color: #c9c9c900;
                color: $u-type-primary;
            }
        }
    }

    .review-success-tips {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24rpx;
        color: #999;
        margin-top: 30rpx;
    }
}
button::after {
    border: none;
}
</style>
