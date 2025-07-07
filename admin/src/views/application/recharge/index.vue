<template>
    <div>
        <!-- Header Form Start -->
        <el-card shadow="never" class="!border-none">
            <template #header>
                <span class="font-extrabold text-lg">充值设置</span>
            </template>
            <el-form :model="formData" label-width="120px">
                <el-form-item label="状态：">
                    <div>
                        <el-radio-group v-model="formData.recharge_open" class="ml-4">
                            <el-radio :label="1">开启</el-radio>
                            <el-radio :label="0">关闭</el-radio>
                        </el-radio-group>
                        <div class="form-tips">关闭或开启充值功能，关闭后商城将不显示充值入口</div>
                    </div>
                </el-form-item>
                <el-form-item label="最低充值金额：">
                    <div>
                        <el-input
                            class="ls-input"
                            v-model="formData.min_recharge_amount"
                            placeholder="请输入最低充值金额"
                        />
                        <div class="form-tips">
                            最低充值金额要求，不填或填0表示不限制最低充值金额
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-card>
        <!-- Header Form End -->
        <!-- Footer Start -->
        <footer-btns>
            <el-button v-perms="['marketing.recharge/setSettings']" type="primary" @click="onSubmit"
                >保存</el-button
            >
        </footer-btns>
        <!-- Footer End -->
    </div>
</template>

<script lang="ts" setup name="applicationRecharge">
import { apiRechargeGetRule, apiRechargeSetRule } from '@/api/application'
import FooterBtns from '@/components/footer-btns/index.vue'
import feedback from '@/utils/feedback'
import { ref } from 'vue'

/** Interface Start **/
interface FormDataObj {
    recharge_open: number // 是否开启充值
    min_recharge_amount: number | string // 最低充值金额
}
/** Interface End **/

/** Data Start **/
const formData = ref<FormDataObj>({
    recharge_open: 1,
    min_recharge_amount: ''
})
/** Data End **/

/** Methods Start **/
/**
 * @description 初始化充值数据
 */
const initChargeRule = async (): Promise<void> => {
    try {
        const res = await apiRechargeGetRule()
        formData.value.recharge_open = res.recharge_open
        formData.value.min_recharge_amount = res.min_recharge_amount
    } catch (err) {
        console.log('初始化充值数据', err)
    }
}

//提交数据
const onSubmit = async () => {
    await apiRechargeSetRule(formData.value)
    feedback.msgSuccess('保存成功！')
    await initChargeRule()
}

/** Methods End **/

/** LifeCycle Start **/
initChargeRule()
/** LifeCycle End **/
</script>

<style lang="scss" scoped>
.ls-input {
    width: 320px;
}
.form {
    &--item:last-child {
        margin: 0;
    }
    &--item {
        display: flex;
        margin-bottom: 20px;
        .label {
            width: 108px;
            font-size: 13px;
            padding-right: 12px;
            line-height: 50px;
            text-align: right;
        }
        .content {
            display: flex;
            flex-wrap: wrap;
            width: 800px;
            padding: 10px;
            background-color: #f7f7f7;
            &--label {
                line-height: 30px;
                margin: 0 10px;
                width: 70px;
            }
            &--input {
                width: 240px;
                margin-right: 40px;
            }
        }
        .content:hover {
            .close-icon {
                display: block;
            }
        }
    }
}
</style>
