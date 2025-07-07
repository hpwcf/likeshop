<template>
    <div class="transaction_settings">
        <el-form :model="formData" label-width="160px" ref="formRef">
            <el-card class="!border-none mt-4" shadow="never">
                <div class="font-medium mb-7">订单设置</div>
                <el-form-item label="系统取消待付款订单" prop="cancel_unpaid_orders">
                    <el-radio-group v-model="formData.cancel_unpaid_orders">
                        <div class="flex flex-col">
                            <el-radio class="mb-[14px]" :label="0"
                                >关闭系统自动取消待付款订单</el-radio
                            >
                            <el-radio :label="1">
                                订单提交后
                                <el-input
                                    v-model="formData.cancel_unpaid_orders_times"
                                    type="number"
                                    class="w-20 mx-2 ls-input"
                                ></el-input>
                                分钟内未付款，系统自动取消
                            </el-radio>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="超时未评价好评" prop="auto_highopinion_times">
                    <div>
                        <div class="flex items-center">
                            <el-radio checked>
                                订单完成后
                                <el-input
                                    v-model="formData.auto_highopinion_times"
                                    type="number"
                                    class="w-20 mx-2 ls-input"
                                ></el-input>
                                天
                            </el-radio>
                        </div>
                        <div class="mt-[10px]">
                            <el-input
                                v-model="formData.auto_highopinion_content"
                                class="ls-input w-[380px]"
                            ></el-input>
                            <div class="form-tips">超过设置时间未评价，将自动好评</div>
                        </div>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="系统自动核销订单" prop="verification_orders">
                    <el-radio-group v-model="formData.verification_orders">
                        <div class="flex flex-col">
                            <el-radio class="mb-[14px]" :label="0">关闭系统自动核销订单</el-radio>
                            <el-radio :label="1">
                                师傅未在
                                <el-input
                                    required
                                    v-model="formData.verification_orders_times"
                                    class="w-20 mx-2 ls-input"
                                ></el-input>
                                小时内核销订单，系统自动核销
                            </el-radio>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="系统随机派单" prop="is_auth_dispatch">
                    <div>
                        <el-radio-group v-model="formData.is_auth_dispatch">
                            <el-radio :label="1">开启</el-radio>
                            <el-radio :label="0">关闭</el-radio>
                        </el-radio-group>
                        <div class="form-tips">
                            开启之后，用户下单系统会在符合条件的情况随机派单给师傅
                        </div>
                    </div>
                </el-form-item> -->
            </el-card>
            <el-card class="!border-none mt-4" shadow="never">
                <div class="font-medium mb-7">结算设置</div>
                <el-form-item label="订单结算周期" prop="settlement_type">
                    <div>
                        <div>
                            <el-radio-group v-model="formData.settlement_type">
                                <el-radio class="mb-[14px]" :label="1">按状态</el-radio>
                                <el-radio class="mb-[14px]" :label="2">按周期</el-radio>
                            </el-radio-group>
                        </div>

                        <div v-if="formData.settlement_type == 1">
                            <!-- <el-select
                                v-model="formData.settlement_status_value"
                                style="width: 240px"
                            >
                                <el-option label="订单结束后结算" :value="1" />
                            </el-select> -->
                            <view class="u-flex">
                                <view class="mr-[10px]">订单结束</view>
                                <el-input
                                    v-model="formData.settlement_status_value"
                                    type="number"
                                    class="w-[100px] ls-input mr-[10px]"
                                    input-style="text-align: center;"
                                ></el-input>
                                <view>天后结算</view>
                            </view>
                        </div>
                        <div v-if="formData.settlement_type == 2">
                            <el-select
                                v-model="formData.settlement_period_value1"
                                class="w-[100px] mr-[20px]"
                                @change="changePeriod"
                            >
                                <el-option label="每周" :value="1" />
                                <el-option label="每月" :value="2" />
                            </el-select>
                            <el-select
                                v-model="formData.settlement_period_value2"
                                class="w-[100px]"
                            >
                                <el-option
                                    v-for="item in periodData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </div>
                    </div>
                </el-form-item>
            </el-card>
            <el-card class="!border-none mt-4" shadow="never">
                <div class="font-medium mb-7">服务设置</div>
                <el-form-item label="用户可提前预约" prop="advance_reservation_time">
                    <el-input
                        v-model="formData.advance_reservation_time"
                        type="number"
                        class="w-[200px] ls-input mr-[10px]"
                        input-style="text-align: center;"
                    ></el-input>
                    天
                </el-form-item>
                <el-form-item label="默认技师接单数量" prop="default_order_num">
                    <el-input
                        v-model="formData.default_order_num"
                        type="number"
                        class="w-[200px] ls-input mr-[10px]"
                        input-style="text-align: center;"
                    ></el-input>
                    单
                </el-form-item>
                <el-form-item label="技师服务范围" prop="service_distance">
                    <el-input
                        v-model="formData.service_distance"
                        type="number"
                        class="w-[200px] ls-input mr-[10px]"
                        input-style="text-align: center;"
                    ></el-input>
                    公里
                </el-form-item>
            </el-card>
        </el-form>
    </div>

    <footer-btns>
        <el-button
            v-perms="['setting.transaction_settings/setConfig']"
            type="primary"
            @click="onSubmit"
            >保存</el-button
        >
    </footer-btns>
</template>

<script lang="ts" setup name="settingTransactionSettings">
import { getConfig, setConfig, monthLists, weekLists } from '@/api/transaction_settings/index'
import FooterBtns from '@/components/footer-btns/index.vue'

const formData = ref<any>({
    cancel_unpaid_orders: 1, // 未付款订单自动取消开关：0-关闭；1-开启；
    cancel_unpaid_orders_times: 30, // 未付款订单自动取消时间（单位：分钟）
    auto_highopinion_times: 1, // 自动好评时间（单位：天）
    auto_highopinion_content: '此用户未填写评价内容', // 自动好评内容
    settlement_type: 1, // 订单结算周期：1-按状态；2-按周期；
    settlement_status_value: 1, // 按状态结算值：订单结束多少天后结算；
    settlement_period_value1: 1, // 按周期结算值1：1-每周；2-每月；
    settlement_period_value2: 1, // 按周期结算值2：数值对应的是每周或每月的第几天
    advance_reservation_time: 7, // 提前预约时间（单位：天）
    default_order_num: 1, // 默认接单数量
    service_distance: 100 // 技师服务范围（单位：公里）
    // verification_orders: '', // 是否开启：1-是；0-否
    // verification_orders_times: '', // 自动核销订单时间
    // is_auth_dispatch: '' // 是否系统随机派单：1-是；0-否
})

const periodData = ref(weekLists)
const changePeriod = (value: any) => {
    if (value == 1) {
        periodData.value = weekLists
    }
    if (value == 2) {
        periodData.value = monthLists
    }
}

// 获取
const toGetConfig = async () => {
    const res = await getConfig()
    formData.value = res
}

// 保存
const onSubmit = async () => {
    await setConfig({ ...formData.value })
}

toGetConfig()
</script>
