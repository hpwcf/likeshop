<template>
    <div class="charge-record">
        <el-card shadow="never" class="!border-none">
            <el-alert title="温馨提示： 用户充值记录" type="success" :closable="false" show-icon />

            <el-form :model="formData" label-width="90px" inline class="mt-[16px]">
                <el-form-item label="充值单号">
                    <el-input
                        class="w-[280px]"
                        v-model="formData.sn"
                        placeholder="请输入充值单号"
                    />
                </el-form-item>
                <el-form-item label="用户信息">
                    <el-input
                        class="w-[280px]"
                        v-model="formData.user_info"
                        placeholder="请输入用户信息"
                    />
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-select v-model="formData.pay_way" class="w-[280px]" placeholder="请选择">
                        <el-option label="全部" value></el-option>
                        <el-option label="微信支付" :value="1"></el-option>
                        <el-option label="支付宝支付" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付状态">
                    <el-select v-model="formData.pay_status" class="w-[280px]" placeholder="请选择">
                        <el-option label="全部" value></el-option>
                        <el-option label="未支付" :value="0"></el-option>
                        <el-option label="已支付" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间">
                    <data-picker
                        v-model:startTime="formData.start_time"
                        v-model:endTime="formData.end_time"
                    >
                    </data-picker>
                </el-form-item>
                <el-form-item>
                    <div class="ml-[20px]">
                        <el-button type="primary" @click="resetPage">查询</el-button>
                        <el-button @click="resetParams">重置</el-button>
                        <!-- <el-button @click="resetParams">导出</el-button> -->
                    </div>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="never" class="!border-none mt-4">
            <div class="m-t-20">
                <el-table
                    ref="tableData"
                    :data="pager.lists"
                    style="width: 100%"
                    v-loading="pager.loading"
                >
                    <el-table-column prop="id" label="ID" min-width="50" />
                    <el-table-column prop="nickname" label="用户信息" min-width="180">
                        <template #default="{ row }">
                            <div class="flex items-center">
                                <div class="w-[60px] h-[60px]">
                                    <el-image
                                        style="width: 60px; height: 60px"
                                        :src="row?.avatar"
                                        :preview-src-list="[row.image]"
                                        :hide-on-click-modal="true"
                                        :preview-teleported="true"
                                        :fit="'contain'"
                                    />
                                </div>
                                <el-tooltip :content="row.nickname" placement="top">
                                    <div class="ml-2 truncate">{{ row.nickname }}</div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sn" label="充值单号" min-width="180" />
                    <el-table-column prop="order_amount" label="充值金额" min-width="120" />
                    <el-table-column prop="pay_way_desc" label="支付方式" min-width="120" />
                    <el-table-column prop="pay_status_desc" label="支付状态" min-width="120">
                        <template #default="{ row }">
                            <div style="color: red" v-if="!row.pay_status">
                                {{ row.pay_status_desc }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column property="create_time" label="提交时间" min-width="180" />
                    <el-table-column property="pay_time" label="支付时间" min-width="180" />
                </el-table>
            </div>

            <div class="flex justify-end mr-2">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="financeRecharge">
import { apiRechargeRecord } from '@/api/finance/recharge'
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import { usePaging } from '@/hooks/usePaging'
// import DataPicker from "@/components/data-picker/index.vue";

interface FormDataObj {
    sn: number | any // 充值订单编号
    user_info?: string // 用户信息
    pay_way: number | string // 支付方式:1-微信支付;2-支付宝支付;3-余额支付;
    pay_status?: number | string // 支付状态：0-待支付 1-已支付
    start_time: string // 开始下单时间
    end_time: string // 结束下单时间
}

// 表单数据
const formData = ref<FormDataObj>({
    sn: '',
    user_info: '',
    pay_way: '',
    pay_status: '',
    start_time: '',
    end_time: ''
})
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiRechargeRecord,
    params: formData.value
})

getLists()
</script>

<style lang="scss">
.ls-input {
    width: 170px;
}
.el-alert--success.is-light {
    background-color: #edefff;
    color: #4a5dff;
}
</style>
