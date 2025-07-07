<template>
    <el-card shadow="never" class="!border-none">
        <el-form :model="formData" inline>
            <el-form-item label="师傅信息">
                <el-input class="ls-input" v-model="formData.staff_info" placeholder="工号/姓名" />
            </el-form-item>
            <el-form-item label="工作状态">
                <el-select v-model="formData.work_status" placeholder="全部" class="ls-input">
                    <el-option label="全部" value></el-option>
                    <el-option label="接单中" value="1"></el-option>
                    <el-option label="休息中" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务状态">
                <el-select v-model="formData.status" placeholder="全部" class="ls-input">
                    <el-option label="全部" value></el-option>
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="冻结" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务技能">
                <el-select v-model="formData.skill_id" placeholder="全部" class="ls-input">
                    <el-option label="全部" value></el-option>
                    <el-option
                        v-for="item in skillData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <data-picker
                    class="ls-input"
                    style="width: 280px"
                    v-model:start_time="formData.start_time"
                    v-model:end_time="formData.end_time"
                ></data-picker>
            </el-form-item>
            <el-form-item>
                <div class="flex">
                    <el-button type="primary" @click="getLists">查询</el-button>
                    <el-button @click="handleResetParams">重置</el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-card>

    <el-card shadow="never" class="mt-4 !border-none">
        <el-button type="primary" @click="$router.push('lists/edit')" v-perms="['staff.staff/add']"
            >新增师傅</el-button
        >
        <div class="mt-3">
            <el-table :data="pager.lists" style="width: 100%" v-loading="pager.loading">
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
                                    <el-tag
                                        class="ml-[5px]"
                                        :type="scope.row.work_status ? 'success' : 'info'"
                                        size="small"
                                        >{{ scope.row.work_status_desc }}</el-tag
                                    >
                                </div>
                                <div class="text-sm text-[#909399]">工号：{{ scope.row.sn }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="保证金" min-width="120">
                    <template #default="scope">
                        <div>￥{{ scope.row.staff_deposit }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="佣金" min-width="120">
                    <template #default="scope">
                        <div>￥{{ scope.row.staff_earnings }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="接单信息" min-width="200">
                    <template #default="scope">
                        <div>每日接单：{{ scope.row.deposit_info.order_num }}</div>
                        <div>累计接单：{{ scope.row.total_order_num }}</div>
                    </template>
                </el-table-column>
                <el-table-column property="status_desc" label="状态" min-width="80" />
                <el-table-column property="sort" label="排序" min-width="80" />
                <el-table-column property="create_time" label="创建时间" min-width="180" />
                <el-table-column label="操作" min-width="148" fixed="right">
                    <template #default="scope">
                        <div class="flex">
                            <router-link
                                v-perms="['staff.staff/edit']"
                                class="mr-2"
                                :to="{
                                    path: 'lists/edit',
                                    query: {
                                        id: scope.row.id
                                    }
                                }"
                            >
                                <el-link type="primary" :underline="false">编辑</el-link>
                            </router-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="flex justify-end mt-4">
            <pagination v-model="pager" @change="getLists" />
        </div>
    </el-card>
</template>

<script lang="ts" setup name="masterWorkerLists">
import {
    apiMasterWorkerLists,
    apiMasterWorkerDel,
    apiMasterWorkerStatusEdit
} from '@/api/master_worker'
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import DataPicker from '@/components/data-picker/index.vue'
import feedback from '@/utils/feedback'
import { usePaging } from '@/hooks/usePaging'
import { apiAllStaffSkillLists } from '@/api/master_worker/skill'

interface formDataObj {
    staff_info?: string
    start_time: string
    end_time: string
    work_status: number | string
    skill_id: number | string | undefined
    status: number | string
}

const cascaderPanelRef = shallowRef<any>()
const formData = ref<formDataObj>({
    staff_info: '',
    start_time: '',
    end_time: '',
    work_status: '',
    skill_id: '',
    status: ''
})
const skillData = ref<Array<object>>([])

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiMasterWorkerLists,
    params: formData.value
})

// 重置筛选框
const handleResetParams = () => {
    resetParams()
    cascaderPanelRef.value.cascaderPanelRef.clearCheckedNodes()
}

// 获取技能通用列表
const getStaffLists = async (): Promise<void> => {
    const res = await apiAllStaffSkillLists({})
    skillData.value = res
}

onMounted(() => {
    getLists()
    getStaffLists()
})
</script>

<style lang="scss">
.ls-input {
    width: 280px;
}
</style>
