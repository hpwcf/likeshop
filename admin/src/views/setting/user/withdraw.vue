<!-- 网站信息 -->
<template>
    <div class="login-register">
        <el-form ref="formRef" :model="formData" label-width="120px">
            <el-card shadow="never" class="!border-none">
                <div class="font-medium mb-7">提现设置</div>

                <el-form-item label="提现方法" prop="withdraw_way">
                    <div>
                        <el-checkbox-group v-model="formData.withdraw_way">
                            <el-checkbox :label="1">微信</el-checkbox>
                            <el-checkbox :label="2">支付宝</el-checkbox>
                            <el-checkbox :label="3">银行卡</el-checkbox>
                        </el-checkbox-group>
                        <div class="form-tips">默认需要保留至少一种提现方法</div>
                    </div>
                </el-form-item>

                <el-form-item label="最低提现金额" prop="min_money">
                    <div>
                        <el-input
                            class="w-[280px]"
                            v-model="formData.min_money"
                            type="number"
                            placeholder="请输入"
                        >
                            <template #append>元</template>
                        </el-input>
                        <div class="form-tips">用户提现需满足最低提现金额，才能提交提现申请。</div>
                    </div>
                </el-form-item>

                <el-form-item label="最高提现金额" prop="max_money">
                    <div>
                        <el-input
                            class="w-[280px]"
                            v-model="formData.max_money"
                            type="number"
                            placeholder="请输入"
                        >
                            <template #append>元</template>
                        </el-input>
                        <div class="form-tips">用户提现允许的最高提现金额。</div>
                    </div>
                </el-form-item>

                <el-form-item label="提现手续费" prop="service_ratio">
                    <div>
                        <el-input
                            class="w-[280px]"
                            v-model="formData.service_ratio"
                            type="number"
                            placeholder="请输入"
                        >
                            <template #append>%</template>
                        </el-input>
                        <div class="form-tips">师傅进行余额提现时收取的手续费占比。</div>
                    </div>
                </el-form-item>
            </el-card>
        </el-form>

        <footer-btns v-perms="['config/set_user_withdraw']">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="settingWithdraw">
import { apiGetWithdrawConfig, apiSetWithdrawConfig } from '@/api/setting/user'
import type { FormInstance } from 'element-plus'
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref({
    withdraw_way: [1],
    min_money: 10,
    max_money: 100,
    service_ratio: 5
})

// 获取用户提现奢姿
const getData = async () => {
    formData.value = await apiGetWithdrawConfig()
}

// 保存用户提现设置
const handleSubmit = async () => {
    apiSetWithdrawConfig(formData.value)
}

getData()
</script>

<style lang="scss" scoped></style>
