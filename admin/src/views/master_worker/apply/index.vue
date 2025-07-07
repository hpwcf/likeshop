<template>
    <el-card shadow="never" class="!border-none">
        <el-form :model="formData" inline>
            <el-form-item label="师傅信息">
                <el-input class="ls-input" v-model="formData.staff_info" placeholder="工号/姓名" />
            </el-form-item>
            <el-form-item label="申请时间">
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
        <el-tabs class="-mt-2" v-model="formData.apply_status" @tab-change="resetPage">
            <el-tab-pane :label="'全部(' + (pager.extend.all || 0) + ')'" name="" />
            <el-tab-pane :label="'待审核(' + (pager.extend.wait || 0) + ')'" :name="0" />
            <el-tab-pane :label="'审核通过(' + (pager.extend.success || 0) + ')'" :name="1" />
            <el-tab-pane :label="'审核拒绝(' + (pager.extend.fail || 0) + ')'" :name="2" />
        </el-tabs>
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
                                </div>
                                <div class="text-sm text-[#909399]">
                                    手机号：{{ scope.row.mobile }}
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="所属区域" min-width="200">
                    <template #default="scope">
                        <div>
                            {{ scope.row.province }} {{ scope.row.city }} {{ scope.row.district }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="skill_name" label="服务技能" min-width="80" />
                <el-table-column label="服务项目数量" min-width="200" align="center">
                    <template #default="scope">
                        <div>
                            {{ scope.row.goods_id.length }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="apply_status_desc" label="状态" min-width="80" />
                <el-table-column property="create_time" label="申请时间" min-width="180" />
                <el-table-column label="操作" min-width="80" fixed="right">
                    <template #default="scope">
                        <div class="flex">
                            <router-link
                                v-perms="['staff.staff_apply/detail']"
                                class="mr-2"
                                :to="{
                                    path: 'apply/detail',
                                    query: {
                                        id: scope.row.id
                                    }
                                }"
                            >
                                <el-link type="primary" :underline="false">{{
                                    scope.row.apply_status == 0 ? '审核' : '详情'
                                }}</el-link>
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

<script lang="ts" setup name="masterWorkerApply">
import { apiMasterWorkerApplyLists } from '@/api/master_worker/apply'
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import DataPicker from '@/components/data-picker/index.vue'
import { usePaging } from '@/hooks/usePaging'

interface formDataObj {
    staff_info?: string
    start_time: string
    end_time: string
    apply_status: number | string
}

const cascaderPanelRef = shallowRef<any>()
const formData = ref<formDataObj>({
    staff_info: '',
    start_time: '',
    end_time: '',
    apply_status: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiMasterWorkerApplyLists,
    params: formData.value
})

// 重置筛选框
const handleResetParams = () => {
    resetParams()
    cascaderPanelRef.value.cascaderPanelRef.clearCheckedNodes()
}

onMounted(() => {
    getLists()
})
</script>

<style lang="scss">
.ls-input {
    width: 280px;
}
</style>
