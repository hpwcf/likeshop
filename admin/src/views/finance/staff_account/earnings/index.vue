<template>
    <!-- 保证金明细 -->
    <div class="balance-statement">
        <el-card shadow="never" class="!border-none">
            <!-- Header Form Start -->
            <el-form :model="formData" label-width="90px" inline class="mt-4">
                <el-form-item label="师傅">
                    <el-input
                        class="w-[280px]"
                        v-model="formData.staff_info"
                        placeholder="工号/姓名/手机号"
                    />
                </el-form-item>
                <el-form-item label="变动类型">
                    <el-select
                        v-model="formData.change_type"
                        class="w-[280px]"
                        placeholder="请选择"
                    >
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="item in typeLists"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间">
                    <data-picker
                        v-model:start_time="formData.start_time"
                        v-model:end_time="formData.end_time"
                    >
                    </data-picker>
                </el-form-item>
                <el-form-item>
                    <div class="m-l-20">
                        <el-button type="primary" @click="resetPage">查询</el-button>
                        <el-button @click="resetParams">重置</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <!-- Header Form End -->
        </el-card>

        <el-card shadow="never" class="mt-4 !border-none">
            <!-- Main TableData Start -->
            <div class="m-t-20">
                <el-table
                    ref="tableData"
                    :data="pager.lists"
                    style="width: 100%"
                    v-loading="pager.loading"
                >
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
                    <el-table-column property="mobile" label="手机号码" max-width="140" />
                    <el-table-column prop="change_amount" label="变动金额(￥)" max-width="140">
                        <template #default="scope">
                            <span v-if="scope.row.action === 2"
                                >+{{ scope.row.change_amount }}</span
                            >
                            <span v-else class="red">-{{ scope.row.change_amount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="left_amount" label="剩余金额(￥)" max-width="140" />
                    <el-table-column property="change_type_desc" label="变动类型" max-width="140" />
                    <el-table-column property="association_sn" label="来源单号" max-width="140" />
                    <el-table-column property="create_time" label="记录时间" max-width="140" />
                </el-table>
            </div>
            <!-- Main TableData End -->

            <!-- Footer Pagination Start -->
            <div class="flex justify-end mr-2">
                <pagination v-model="pager" @change="getLists" />
            </div>
            <!-- Footer Pagination End -->
        </el-card>
    </div>
</template>

<script lang="ts" setup name="financeStaffEarnings">
import { apiStaffAccountLogLists, getStaffChangeTypeLists } from '@/api/finance/staff_account_log'
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import { usePaging } from '@/hooks/usePaging'
// import DataPicker from '@/components/data-picker/index.vue'

/** Interface Start **/
interface FormDataObj {
    change_object: number
    staff_info: string // 师傅信息
    change_type: number | string // 变动类型
    start_time: string // 记录开始时间
    end_time?: string // 记录结束时间
}
/** Interface End **/

/** Data Start **/
// 表单数据
const formData = ref<FormDataObj>({
    change_object: 2,
    staff_info: '',
    change_type: '',
    start_time: '',
    end_time: ''
})
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiStaffAccountLogLists,
    params: formData.value
})
/** Data End **/

/** LifeCycle Start **/
getLists()
/** LifeCycle End **/

const typeLists: any = ref([])
const getType = async () => {
    const res = await getStaffChangeTypeLists({ change_object: formData.value.change_object })
    //对象转数组
    typeLists.value = Object.keys(res).map((item) => {
        return { id: item, name: res[item] }
    })
}
getType()
</script>

<style lang="scss" scoped>
.ls-input {
    width: 170px;
}

.red {
    color: red;
}
.el-alert--success.is-light {
    background-color: #edefff;
    color: #4a5dff;
}
</style>
