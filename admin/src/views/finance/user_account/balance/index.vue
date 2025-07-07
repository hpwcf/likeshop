<template>
    <!-- 余额明细 -->
    <div class="balance-statement">
        <el-card shadow="never" class="!border-none">
            <el-alert
                title="温馨提示： 用户账户余额变动记录"
                type="success"
                :closable="false"
                show-icon
            />

            <!-- Header Form Start -->
            <el-form :model="formData" label-width="90px" inline class="mt-4">
                <el-form-item label="用户信息">
                    <el-input class="w-[280px]" v-model="formData.user_info" placeholder="请输入" />
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
                <el-form-item label="记录时间">
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
                    <el-table-column prop="nickname" label="用户昵称" max-width="140" />
                    <el-table-column property="mobile" label="手机号码" max-width="140">
                        <template #default="scope">
                            <div>{{ scope.row.mobile || '-' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="change_amount" label="变动金额" max-width="140">
                        <template #default="scope">
                            <span v-if="scope.row.action === 2"
                                >+{{ scope.row.change_amount }}</span
                            >
                            <span v-else class="red">-{{ scope.row.change_amount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="left_amount" label="剩余金额" max-width="140" />
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

<script lang="ts" setup name="financeUserAccount">
import { apiAccountLogLists, changeTypeLists } from '@/api/finance/balance'
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import { usePaging } from '@/hooks/usePaging'
// import DataPicker from '@/components/data-picker/index.vue'

/** Interface Start **/
interface FormDataObj {
    change_object: number
    order_sn: string // 变动编号
    user_info: string // 昵称搜索
    change_type: number | string // 变动类型
    start_time: string // 记录开始时间
    end_time?: string // 记录结束时间
}
/** Interface End **/

/** Data Start **/
const otherLists = ref({})
// 表单数据
const formData = ref<FormDataObj>({
    change_object: 1,
    order_sn: '',
    user_info: '',
    change_type: '',
    start_time: '',
    end_time: ''
})
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiAccountLogLists,
    params: formData.value
})
/** Data End **/

/** LifeCycle Start **/
getLists()
/** LifeCycle End **/

const typeLists: any = ref([])
const getType = async () => {
    const res = await changeTypeLists({ change_object: 1 })
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
