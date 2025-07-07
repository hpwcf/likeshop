<template>
    <div>
        <el-card shadow="never" class="!border-none">
            <el-form :model="formData" inline>
                <el-form-item label="订单编号">
                    <el-input
                        class="ls-input"
                        v-model="formData.order_info"
                        placeholder="请输入订单编号"
                    />
                </el-form-item>
                <el-form-item label="用户信息">
                    <el-input
                        class="ls-input"
                        v-model="formData.user_info"
                        placeholder="编号/昵称/手机号"
                    />
                </el-form-item>
                <el-form-item label="服务名称">
                    <el-input
                        class="ls-input"
                        v-model="formData.goods_info"
                        placeholder="请输入服务名称"
                    />
                </el-form-item>
                <el-form-item label="服务师傅">
                    <el-input
                        class="ls-input"
                        v-model="formData.staff_info"
                        placeholder="工号/姓名/手机号"
                    />
                </el-form-item>
                <el-form-item label="订单类型">
                    <el-select v-model="formData.order_type" placeholder="全部" class="ls-input">
                        <el-option label="全部" value></el-option>
                        <el-option label="上门服务" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-select v-model="formData.pay_way" placeholder="全部" class="ls-input">
                        <el-option label="全部" value></el-option>
                        <el-option label="微信支付" :value="1"></el-option>
                        <el-option label="支付宝支付" :value="2"></el-option>
                        <el-option label="余额支付" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间类型">
                    <el-select v-model="formData.time_type" class="ls-input" style="width: 120px">
                        <el-option label="下单时间" :value="1"></el-option>
                        <el-option label="支付时间" :value="2"></el-option>
                        <el-option label="完成时间" :value="3"></el-option>
                    </el-select>
                    <data-picker
                        class="ls-input"
                        style="width: 280px"
                        v-model:start_time="formData.start_time"
                        v-model:end_time="formData.end_time"
                    ></data-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="never" class="mt-4 !border-none">
            <el-tabs v-model="formData.order_status" @tab-change="resetPage">
                <el-tab-pane
                    v-for="(value, key, index) in pager.extend"
                    :key="index"
                    :label="`${orderMode[key]}(${value})`"
                    :name="index ? index : 0"
                >
                </el-tab-pane>
            </el-tabs>
            <div class="mt-4">
                <el-table
                    ref="tableData"
                    size="large"
                    :data="pager.lists"
                    v-loading="pager.loading"
                >
                    <el-table-column property="sn" label="订单编号" min-width="180">
                        <template #default="scope">
                            <div>{{ scope.row.sn }}</div>
                            <div class="mt-[5px] text-[#909399]">
                                {{ scope.row.order_type_desc }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务名称" min-width="260">
                        <template #default="scope">
                            <div
                                class="flex items-center goods-box"
                                v-for="(item2, index2) in scope.row.order_goods"
                                :key="index2"
                            >
                                <div class="w-[70px] h-[70px]">
                                    <el-image
                                        style="width: 70px; height: 70px"
                                        :src="item2.goods_image"
                                        :preview-src-list="[item2.goods_image]"
                                        :hide-on-click-modal="true"
                                        :preview-teleported="true"
                                        :fit="'contain'"
                                    />
                                </div>
                                <router-link
                                    :to="`/service/lists/edit?id=${item2.goods_id}`"
                                    class="ml-2 xs"
                                >
                                    <div class="goods-name">{{ item2.goods_name }}</div>
                                    <div>
                                        <span class="form-tips">规格：</span>
                                        <span>{{ item2.goods_sku }}</span>
                                    </div>
                                    <div>
                                        <span class="form-tips">价格：</span>
                                        <span>{{ item2.goods_price }}</span>
                                        <span class="form-tips ml-[5px]">数量：</span>
                                        <span>{{ item2.goods_num }}</span>
                                    </div>
                                </router-link>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column property="nickname" label="用户信息" min-width="100">
                        <template #default="scope">
                            <el-popover placement="top-start" width="200px" trigger="hover">
                                <div class="flex">
                                    <span class="flex-none mr-2">头像：</span>
                                    <el-image
                                        :src="scope.row.user?.avatar"
                                        style="width: 40px; height: 40px; border-radius: 50%"
                                    >
                                    </el-image>
                                </div>
                                <div class="flex mt-2">
                                    <span class="flex-none mr-2">昵称：</span>
                                    <span>{{ scope.row.user?.nickname }}</span>
                                </div>
                                <div class="flex mt-2">
                                    <span class="flex-none mr-2">编号：</span>
                                    <span>{{ scope.row.user?.sn }}</span>
                                </div>
                                <template #reference>
                                    <div class="pointer normal">
                                        {{ scope.row.user?.nickname }}
                                    </div>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column property="appoint_time_desc" label="预约时间" width="160" />
                    <el-table-column label="师傅信息" min-width="100">
                        <template #default="scope">
                            <el-popover
                                placement="top-start"
                                width="200px"
                                trigger="hover"
                                v-if="scope.row.staff"
                            >
                                <div class="flex">
                                    <span class="flex-none mr-2">头像：</span>
                                    <el-image
                                        :src="scope.row.staff?.work_image"
                                        style="width: 40px; height: 40px; border-radius: 50%"
                                    >
                                    </el-image>
                                </div>
                                <div class="flex mt-2">
                                    <span class="flex-none mr-2">姓名：</span>
                                    <span>{{ scope.row.staff?.name }}</span>
                                </div>
                                <div class="flex mt-2">
                                    <span class="flex-none mr-2">工号：</span>
                                    <span>{{ scope.row.staff?.sn }}</span>
                                </div>
                                <template #reference>
                                    <div class="pointer normal">
                                        {{ scope.row.staff?.name }}
                                    </div>
                                </template>
                            </el-popover>
                            <div class="pointer normal" v-if="!scope.row.staff">-</div>
                        </template>
                    </el-table-column>
                    <el-table-column property="order_amount" label="实付金额" min-width="100">
                        <template #default="scope"> ¥{{ scope.row.order_amount }} </template>
                    </el-table-column>
                    <el-table-column property="order_status_desc" label="订单状态" width="100" />
                    <el-table-column label="操作" min-width="130" fixed="right">
                        <template #default="scope">
                            <router-link
                                class="mr-2"
                                :to="{
                                    path: '/order/detail',
                                    query: {
                                        id: scope.row.id
                                    }
                                }"
                            >
                                <el-link type="primary" :underline="false">详情</el-link>
                            </router-link>
                            <!-- 操作 -->
                            <operation
                                btnStyle="text"
                                :id="scope.row.id"
                                :admin_order_btn="scope.row.admin_order_btn"
                                :settlement_status="scope.row.settlement_status"
                                @refresh="resetPage"
                            />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="orderLists">
import { apiOrderLists } from '@/api/order/lists'
import { reactive } from 'vue'
import { OrderMode } from '@/enums/modeEnum'
import Operation from './components/operation.vue'
import Pagination from '@/components/pagination/index.vue'
import DataPicker from '@/components/data-picker/index.vue'
import { usePaging } from '@/hooks/usePaging'

interface formDataObj {
    order_info: string //订单编号
    user_info: string //用户信息
    goods_info: string //服务名称
    staff_info: string //师傅信息
    order_type: string | number //订单类型
    pay_way: string | number //支付方式
    time_type: string | number //时间类型
    start_time: string //开始时间
    end_time: string //结束时间
    order_status: string | number //订单状态
}

const orderMode: any = reactive<any>(OrderMode)
const formData = reactive<formDataObj>({
    order_info: '',
    user_info: '',
    goods_info: '',
    staff_info: '',
    order_type: '',
    pay_way: '',
    time_type: 1,
    start_time: '',
    end_time: '',
    order_status: 0
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiOrderLists,
    params: formData
})

getLists()
</script>

<style lang="scss" scoped>
.ls-input {
    width: 280px;
}

.error {
    color: #db2828;
}

.goods-box {
    .goods-name {
        color: #333333;
    }
}

.goods-box:hover {
    .goods-name {
        color: #4a5dff;
        text-decoration: underline;
    }
}
a {
    text-decoration: none !important; //去掉原有链接文字下划线
}
.el-tabs__nav-wrap::after {
    height: 1px !important;
}
</style>
