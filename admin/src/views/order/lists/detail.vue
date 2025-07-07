<template>
    <div>
        <!-- Header Start -->
        <el-card class="!border-none mt-4" shadow="never">
            <el-page-header content="订单详情" @back="$router.back()" />
        </el-card>
        <!-- Header End -->

        <div class="order-detail-main">
            <!-- 订单信息 Start -->
            <el-card class="!border-none mt-4" shadow="never" style="padding: 0 20px">
                <template #header>
                    <div class="card-header">
                        <span class="font-medium nr">订单信息</span>
                    </div>
                </template>
                <!-- 订单信息 -->
                <el-form :inline="true" :model="formData" label-width="auto">
                    <div class="flex justify-around">
                        <div class="w-3/12">
                            <el-form-item label="订单状态: ">
                                <div class="content text-warning">
                                    {{ formData.order_status_desc || '-' }}
                                </div>
                            </el-form-item>
                            <el-form-item label="支付方式: ">
                                <div class="content">{{ formData.pay_way_desc || '-' }}</div>
                            </el-form-item>
                            <el-form-item label="下单时间: ">
                                <div class="content">{{ formData.create_time || '-' }}</div>
                            </el-form-item>
                        </div>
                        <div class="w-3/12">
                            <el-form-item label="支付状态: ">
                                <div class="content">{{ formData.pay_status_desc || '-' }}</div>
                            </el-form-item>
                            <el-form-item label="订单类型: ">
                                <div class="content">{{ formData.order_type_desc || '-' }}</div>
                            </el-form-item>
                            <el-form-item label="支付时间: ">
                                <div class="content">{{ formData.pay_time || '-' }}</div>
                            </el-form-item>
                        </div>
                        <div class="w-3/12">
                            <el-form-item label="订单编号: ">
                                <div class="content">{{ formData.sn || '-' }}</div>
                            </el-form-item>
                            <el-form-item label="订单来源: ">
                                <div class="content">{{ formData.order_terminal_desc || '-' }}</div>
                            </el-form-item>
                            <el-form-item label="完成时间: ">
                                <div class="content">{{ formData.finish_time || '-' }}</div>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
                <!-- Button Group Start -->
                <div class="button-group">
                    <operation
                        btnStyle="primary"
                        :id="id"
                        :admin_order_btn="formData.admin_order_btn"
                        :staff_id="formData.staff_id"
                        :settlement_status="formData.settlement_status"
                        @refresh="getOrderDetail"
                    />
                </div>
                <!-- Button Group End -->
            </el-card>
            <!-- 订单信息 End -->

            <!-- 预约信息 Start -->
            <el-card class="!border-none mt-4" shadow="never" style="padding: 0 20px">
                <template #header>
                    <span class="font-medium nr">预约信息</span>
                </template>
                <div class="flex justify-around">
                    <div class="w-3/12">
                        <div class="font-bold text-[18px] mb-[10px]">预约信息</div>
                        <el-form :inline="true" :model="formData" label-width="auto">
                            <el-form-item label="预约人: ">
                                <div class="content">
                                    {{ formData.contact }}
                                    {{ formData.mobile }}
                                </div>
                            </el-form-item>
                            <el-form-item label="预约时间: ">
                                <div class="content">{{ formData.appoint_time_desc || '-' }}</div>
                            </el-form-item>
                            <el-form-item label="服务地址: ">
                                <div class="content">
                                    {{ formData.address_info?.province }}
                                    {{ formData.address_info?.city }}
                                    {{ formData.address_info?.district }}
                                    {{ formData.address_info?.address }}
                                </div>
                            </el-form-item>
                            <el-form-item label="买家留言: ">
                                <div class="content">{{ formData.user_remark || '-' }}</div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="w-3/12">
                        <div class="font-bold text-[18px] mb-[10px]">交易信息</div>
                        <el-form :inline="true" :model="formData" label-width="auto">
                            <el-form-item label="实付金额: ">
                                <div class="content">{{ formData.order_amount }}</div>
                            </el-form-item>
                            <el-form-item label="商家留言: ">
                                <div class="content">{{ formData.order_remarks || '-' }}</div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="w-3/12">
                        <div class="font-bold text-[18px] mb-[10px]">买家信息</div>
                        <el-form :inline="true" :model="formData" label-width="auto">
                            <el-form-item label="ID: ">
                                <div class="content">{{ formData.user?.sn }}</div>
                            </el-form-item>
                            <el-form-item label="昵称: ">
                                <div class="content">{{ formData.user?.nickname }}</div>
                            </el-form-item>
                            <el-form-item label="联系电话: ">
                                <div class="content">{{ formData.user?.mobile }}</div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-card>
            <!-- 预约信息 End -->

            <!-- 服务师傅 Start -->
            <el-card
                class="!border-none mt-4"
                shadow="never"
                style="padding: 0 20px"
                v-if="formData.staff"
            >
                <template #header>
                    <span class="font-medium nr">师傅信息</span>
                </template>
                <el-form :inline="true" :model="formData" label-width="auto">
                    <div class="flex justify-around">
                        <div class="w-3/12">
                            <el-form-item label="头像: ">
                                <div class="content">
                                    <el-image
                                        :src="formData.staff?.work_image"
                                        style="width: 40px; height: 40px; border-radius: 50%"
                                    />
                                </div>
                            </el-form-item>
                            <el-form-item label="联系电话: ">
                                <div class="content">{{ formData.staff?.mobile }}</div>
                            </el-form-item>
                        </div>
                        <div class="w-3/12">
                            <el-form-item label="姓名: ">
                                <div class="content">{{ formData.staff?.name }}</div>
                            </el-form-item>
                        </div>
                        <div class="w-3/12">
                            <el-form-item label="工号: ">
                                <div class="content">{{ formData.staff?.sn }}</div>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </el-card>
            <!-- 服务师傅 End -->

            <!-- 服务信息 Start -->
            <el-card class="!border-none mt-4" shadow="never" style="padding: 0 20px">
                <template #header>
                    <span class="font-medium nr">服务信息</span>
                </template>
                <!-- 服务信息 -->
                <el-table
                    ref="tableDataRef"
                    :data="formData.order_goods"
                    table-layout="auto"
                    style="width: 100%"
                >
                    <el-table-column label="服务信息">
                        <template #default="scope">
                            <div class="flex items-center">
                                <el-image
                                    style="width: 58px; height: 58px"
                                    :src="scope.row.goods_image"
                                    :fit="'cover'"
                                ></el-image>
                                <div class="justify-center ml-2">{{ scope.row.goods_name }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column property="goods_sku" label="规格" />
                    <el-table-column property="goods_num" label="数量" />
                    <el-table-column property="goods_price" label="单价" />
                    <template #append>
                        <div
                            class="mt-[15px] mb-[15px] w-full flex justify-between pl-[30px] pr-[30px]"
                        >
                            <div>
                                <span class="text-info">商品总额: </span>
                                <span>{{ formData.goods_price }}</span>
                            </div>
                            <div>
                                <span class="text-info">补差价: </span>
                                <span>{{ formData.difference_price }}</span>
                            </div>
                            <div>
                                <span class="text-info">加项费: </span>
                                <span class="mr-[5px]">{{ formData.additional_price }}</span>
                                <el-popover placement="top-start" width="200px" trigger="hover">
                                    <div v-for="item in formData.order_additional" :key="item.id">
                                        {{ item.name }}/数量:{{ item.num }}/￥{{ item.price }}
                                    </div>
                                    <template #reference>
                                        <el-icon><QuestionFilled /></el-icon>
                                    </template>
                                </el-popover>
                            </div>
                        </div>
                    </template>
                </el-table>
                <div class="flex justify-end mt-[20px] items-end mr-[40px]">
                    <span>合计：</span
                    ><span class="text-[#F56C6C] font-bold text-[18px]">{{
                        formData.order_amount
                    }}</span>
                </div>
            </el-card>
            <!-- 服务信息 End -->

            <!-- 结算信息 Start -->
            <el-card class="!border-none mt-4" shadow="never" style="padding: 0 20px">
                <template #header>
                    <span class="font-medium nr">结算信息</span>
                </template>
                <el-table
                    ref="tableDataRef"
                    :data="formData.settlement_info"
                    style="width: 100%"
                    table-layout="auto"
                >
                    <el-table-column property="order_amount" label="支付总金额" />
                    <el-table-column property="refund_amount" label="退款金额" />
                    <el-table-column property="earnings" label="结算金额" />
                    <el-table-column property="settlement_status_desc" label="结算状态" />
                </el-table>
            </el-card>
            <!-- 结算信息 End -->

            <!-- 服务打卡记录 Start -->
            <el-card
                class="!border-none mt-4"
                shadow="never"
                style="padding: 0 20px"
                v-if="formData.order_checkin"
            >
                <template #header>
                    <span class="font-medium nr">服务打卡记录</span>
                </template>
                <el-table ref="tableDataRef" :data="formData.order_checkin" style="width: 100%">
                    <el-table-column property="order_status_desc" label="状态" />
                    <el-table-column label="位置" min-width="200px">
                        <template #default="scope">
                            <div>
                                <div>{{ scope.row.address_info?.address }}</div>
                                <div class="text-sm text-info">
                                    {{ scope.row.address_info?.province }}-
                                    {{ scope.row.address_info?.city }}-
                                    {{ scope.row.address_info?.district }}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column property="create_time" label="图片" min-width="300px">
                        <template #default="scope">
                            <div>
                                <el-image
                                    v-for="(item, index) in scope.row.image_info"
                                    :key="index"
                                    style="width: 58px; height: 58px; margin-right: 5px"
                                    :src="item"
                                    :preview-src-list="[item]"
                                    :fit="'cover'"
                                    :preview-teleported="true"
                                ></el-image>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column property="create_time" label="上传时间" min-width="120px" />
                </el-table>
            </el-card>
            <!-- 订单日志 End -->

            <!-- 订单日志 Start -->
            <el-card class="!border-none mt-4" shadow="never" style="padding: 0 20px">
                <template #header>
                    <span class="font-medium nr">订单日志</span>
                </template>
                <!-- 订单日志 -->
                <el-table ref="tableDataRef" :data="formData.order_log" style="width: 100%">
                    <el-table-column property="operator" label="操作人" max-width="300" />
                    <el-table-column property="channel_desc" label="操作事件" max-width="300" />
                    <el-table-column property="create_time" label="操作时间" max-width="300" />
                </el-table>
            </el-card>
            <!-- 订单日志 End -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { apiOrderDetail, apiDispatchStaff } from '@/api/order/lists'
import { ref } from 'vue'
import Operation from './components/operation.vue'
import area from '@/utils/area'
import feedback from '@/utils/feedback'

const route = useRoute()
const id = ref<any>(route.query.id)

const formData = ref<any>({})
const staffData = ref<any>([])
const value = ref('') // 当前选中的师傅
const region = ref<any>(null) // 当前选中地区
const btnStatus = ref(0) // 0-显示指派 1-显示确认和取消 2-显示重新指派
const staff = ref<any>({})
const options = ref<any>(area) // 地区列表
const props2 = {
    checkStrictly: true
}

// 获取订单详情
const getOrderDetail = async (): Promise<void> => {
    ;(formData.value as object) = await apiOrderDetail({ id: id.value })
}

// 记录所选中的数据对象
const handleChange = (val: any) => {
    staff.value = val
    return val
}

if (id.value) getOrderDetail()
onMounted(() => {
    setTimeout(() => {
        if (formData.value.staff && formData.value.order_status == 1) {
            btnStatus.value = 2
        }
    }, 200)
})
</script>

<style lang="scss">
.order-detail-main .el-card__header,
.order-detail-main .el-card__body {
    padding: calc(var(--el-card-padding) - 2px) 0;
}
.content {
    width: 24vw;
}
.button-group {
    border-top: 1px solid #f2f2f2;
}
</style>
