<template>
    <div class="center">
        <el-card class="!border-none" shadow="never">
            <div class="title font-bold">经营概况</div>
            <div class="flex mt-[20px]">
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.total_amount.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{ data.total_amount.desc }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.total_amount.amount }}</div>
                </div>
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.total_order.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{ data.total_order.desc }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.total_order.amount }}</div>
                </div>
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.refund_success_amount.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{
                                data.refund_success_amount.desc
                            }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.refund_success_amount.amount }}</div>
                </div>
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.refund_fail_amount.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{
                                data.refund_fail_amount.desc
                            }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.refund_fail_amount.amount }}</div>
                </div>
            </div>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <div class="title font-bold">用户概况</div>
            <div class="flex mt-[20px]">
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.user_recharge_amount.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{
                                data.user_recharge_amount.desc
                            }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.user_recharge_amount.amount }}</div>
                </div>
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.user_money.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{ data.user_money.desc }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.user_money.amount }}</div>
                </div>
            </div>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <div class="title font-bold">师傅概况</div>
            <div class="flex mt-[20px]">
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.settled_earnings.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{ data.settled_earnings.desc }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.settled_earnings.amount }}</div>
                </div>
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.withdrawn_earnings.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{
                                data.withdrawn_earnings.desc
                            }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.withdrawn_earnings.amount }}</div>
                </div>
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.wait_withdrawn_earnings.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{
                                data.wait_withdrawn_earnings.desc
                            }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.wait_withdrawn_earnings.amount }}</div>
                </div>
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.wait_settled_earnings.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{
                                data.wait_settled_earnings.desc
                            }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.wait_settled_earnings.amount }}</div>
                </div>
            </div>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <div class="title font-bold">保证金概况</div>
            <div class="flex mt-[20px]">
                <div class="w-1/4">
                    <div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="data.staff_deposit.tips"
                            placement="top-start"
                        >
                            <span class="text-info text-sm">{{ data.staff_deposit.desc }}</span>
                        </el-tooltip>
                    </div>
                    <div class="text-[20px]">{{ data.staff_deposit.amount }}</div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="financeCenter">
import { getFinanceCenter } from '@/api/finance/center'
const data = ref<any>({
    total_amount: {
        amount: 0,
        desc: '累计营业额（元）',
        tips: '成交订单金额，只要支付过，无论订单是否取消，皆计为营业额。'
    },
    total_order: {
        amount: 0,
        desc: '累计成交订单（笔）',
        tips: '已付款就算成交订单数'
    },
    refund_success_amount: {
        amount: 0,
        desc: '退款成功金额（元）',
        tips: '已顺利完成退款、资金到账的金额'
    },
    refund_fail_amount: {
        amount: 0,
        desc: '退款失败金额（元）',
        tips: '因各种原因未能退款成功的金额'
    },
    user_recharge_amount: {
        amount: 0,
        desc: '用户充值金额（元）',
        tips: '用户充值成功的金额'
    },
    user_money: {
        amount: 0,
        desc: '用户可用余额（元）',
        tips: '用户当前剩余可用的余额'
    },
    settled_earnings: {
        amount: 0,
        desc: '已结算佣金（元）',
        tips: '完成结算流程的佣金'
    },
    withdrawn_earnings: {
        amount: 0,
        desc: '已提现佣金（元）',
        tips: '从账户提取成功的佣金'
    },
    wait_withdrawn_earnings: {
        amount: 0,
        desc: '可提现佣金（元）',
        tips: '剩余可提现的佣金'
    },
    wait_settled_earnings: {
        amount: 0,
        desc: '待结算佣金（元）',
        tips: '未完成结算的佣金'
    },
    staff_deposit: {
        amount: 0,
        desc: '师傅保证金（元）',
        tips: '师傅当前剩余的保证金'
    }
})

const getCenterData = async () => {
    const res = await getFinanceCenter('')
    for (const key in res) {
        data.value[key].amount = res[key]
    }
}
getCenterData()
</script>

<style lang="scss" scoped>
.title {
    font-size: 16px;
}
.amount {
    font-family: 'PingFang HK';
    font-weight: 400;
    font-size: 32px;
    text-align: left;
    color: #333;
}
.text {
    font-family: 'PingFang HK';
    font-weight: 400;
    font-size: 14px;
    text-align: left;
    color: #666;
}
</style>
