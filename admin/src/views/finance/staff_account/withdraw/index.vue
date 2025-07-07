<template>
    <div class="center">
        <el-card shadow="never" class="!border-none my-4">
            <el-form class="ls-form" :model="formData" inline>
                <el-form-item label="师傅">
                    <el-input
                        class="ls-input"
                        v-model="formData.staff_info"
                        placeholder="工号/姓名/手机号"
                    />
                </el-form-item>
                <el-form-item label="提现来源">
                    <el-select v-model="formData.source_type" class="ls-input" placeholder="">
                        <el-option label="全部" value></el-option>
                        <el-option
                            v-for="(item, index) in enumLists?.source_type"
                            :key="index"
                            :label="item"
                            :value="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提现方式">
                    <el-select v-model="formData.type" class="ls-input" placeholder="">
                        <el-option label="全部" value></el-option>
                        <el-option
                            v-for="(item, index) in enumLists?.type"
                            :key="index"
                            :label="item"
                            :value="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间">
                    <data-picker
                        style="width: 280px"
                        v-model:start_time="formData.start_time"
                        v-model:end_time="formData.end_time"
                    ></data-picker>
                </el-form-item>
                <el-form-item>
                    <div class="flex">
                        <el-button type="primary" @click="resetPage">查询</el-button>
                        <el-button @click="resetParams">重置</el-button>
                        <!-- <el-button @click="exportFrom">导出</el-button> -->
                    </div>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="mt-4 !border-none" shadow="never">
            <el-tabs class="-mt-2" v-model="formData.status" @tab-change="resetPage">
                <el-tab-pane :label="`全部(${pager.extend?.all})`" :name="0"> </el-tab-pane>
                <el-tab-pane :label="`待审核(${pager.extend?.status_wait})`" :name="1">
                </el-tab-pane>
                <el-tab-pane :label="`提现中(${pager.extend?.status_ing})`" :name="2">
                </el-tab-pane>
                <el-tab-pane :label="`提现成功(${pager.extend?.status_success})`" :name="3">
                </el-tab-pane>
                <el-tab-pane :label="`提现失败(${pager.extend?.status_fail})`" :name="4">
                </el-tab-pane>
            </el-tabs>
            <div class="mt-4">
                <el-table :data="pager.lists" size="large" v-loading="pager.loading">
                    <el-table-column label="师傅信息" min-width="200">
                        <template #default="scope">
                            <div class="flex col-center items-center">
                                <div class="w-[60px] h-[60px]">
                                    <el-image
                                        style="width: 60px; height: 60px"
                                        :src="scope.row.work_image"
                                        :preview-src-list="[scope.row.work_image]"
                                        :hide-on-click-modal="true"
                                        :preview-teleported="true"
                                        :fit="'cover'"
                                    />
                                </div>
                                <div class="ml-[10px]">
                                    <div class="truncate">
                                        <span>{{ scope.row.name }}</span>
                                    </div>
                                    <div class="text-sm text-[#909399]">
                                        工号：{{ scope.row.staff_sn }}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="提现金额" prop="money" min-width="140" />
                    <el-table-column label="手续费" prop="service_ratio" min-width="140" />
                    <el-table-column label="到账金额" prop="left_money" min-width="140" />
                    <el-table-column label="提现来源" prop="source_type_desc" min-width="160" />
                    <el-table-column label="提现方式" prop="type_desc" min-width="160" />
                    <el-table-column label="提现状态" prop="refund_status_desc" min-width="100">
                        <template #default="scope">
                            <el-text class="mx-1" type="primary" v-if="scope.row.status == 1">{{
                                scope.row.status_desc
                            }}</el-text>
                            <el-text class="mx-1" v-if="scope.row.status == 2">{{
                                scope.row.status_desc
                            }}</el-text>
                            <el-text class="mx-1" v-if="scope.row.status == 3">{{
                                scope.row.status_desc
                            }}</el-text>
                            <el-text class="mx-1" type="danger" v-if="scope.row.status == 4">{{
                                scope.row.status_desc
                            }}</el-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请时间" prop="create_time" min-width="200" />
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="scope">
                            <div class="flex">
                                <router-link
                                    v-perms="['finance.withdraw/detail']"
                                    class="mr-2"
                                    :to="{
                                        path: 'withdraw/detail',
                                        query: {
                                            id: scope.row.id
                                        }
                                    }"
                                >
                                    <el-link type="primary" :underline="false">详情</el-link>
                                </router-link>
                                <router-link
                                    v-if="scope.row.status == 1"
                                    v-perms="['finance.withdraw/verify']"
                                    class="mr-2"
                                    :to="{
                                        path: 'withdraw/detail',
                                        query: {
                                            id: scope.row.id
                                        }
                                    }"
                                >
                                    <el-link type="primary" :underline="false">审核</el-link>
                                </router-link>
                                <router-link
                                    v-if="scope.row.status == 2"
                                    v-perms="['finance.withdraw/transfer']"
                                    class="mr-2"
                                    :to="{
                                        path: 'withdraw/detail',
                                        query: {
                                            id: scope.row.id
                                        }
                                    }"
                                >
                                    <el-link type="primary" :underline="false">转账</el-link>
                                </router-link>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="financeStaffWithdraw">
import { apiWithdrawLists, apiWithdrawEnumLists } from '@/api/finance/withdraw'
import Pagination from '@/components/pagination/index.vue'
import { usePaging } from '@/hooks/usePaging'

const formData = ref<any>({
    staff_info: '', // 师傅信息
    source_type: '', // 提现来源
    type: '', // 提现方式
    status: 0, // 提现状态
    start_time: '', // 开始时间
    end_time: '' // 结束时间
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiWithdrawLists,
    params: formData.value
})

//获取枚举列表
const enumLists = ref<any>()
const getEnumLists = async (): Promise<void> => {
    enumLists.value = await apiWithdrawEnumLists({})
}

getLists()
getEnumLists()
</script>

<style lang="scss" scoped>
.ls-input {
    width: 280px;
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
.el-tabs__nav-wrap::after {
    height: 1px !important;
}
</style>
