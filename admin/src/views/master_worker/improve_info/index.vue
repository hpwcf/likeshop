<template>
    <el-card shadow="never" class="!border-none">
        <el-form :model="formData" inline>
            <el-form-item label="姓名">
                <el-input class="ls-input" v-model="formData.name" placeholder="姓名" />
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="formData.sex" placeholder="全部" class="ls-input">
                    <el-option label="全部" value></el-option>
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="工号">
                <el-input class="ls-input" v-model="formData.sn" placeholder="工号" />
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
                                <div class="text-sm text-[#909399]">工号：{{ scope.row.sn }}</div>
                            </div>
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
                <el-table-column property="verify_status_desc" label="状态" min-width="80" />
                <el-table-column label="状态" min-width="200" align="center">
                    <template #default="scope">
                        <div class="text-center">
                            <el-text
                                class="mx-1"
                                type="primary"
                                v-if="scope.row.verify_status == 0"
                                >{{ scope.row.verify_status_desc }}</el-text
                            >
                            <el-text class="mx-1" v-if="scope.row.verify_status == 1">{{
                                scope.row.verify_status_desc
                            }}</el-text>
                            <el-text
                                class="mx-1"
                                type="danger"
                                v-if="scope.row.verify_status == 2"
                                >{{ scope.row.verify_status_desc }}</el-text
                            >
                        </div>
                        <div>
                            <el-text class="mx-1" type="danger" v-if="scope.row.verify_status == 2"
                                >原因：{{ scope.row.verify_remarks }}</el-text
                            >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="create_time" label="提交时间" min-width="180" />
                <el-table-column label="操作" min-width="80" fixed="right">
                    <template #default="scope">
                        <div class="flex">
                            <router-link
                                v-if="scope.row.verify_status == 0"
                                v-perms="['staff.staff_improve_info/detail']"
                                class="mr-2"
                                :to="{
                                    path: 'improve_info/detail',
                                    query: {
                                        id: scope.row.id
                                    }
                                }"
                            >
                                <el-link type="primary" :underline="false">审核</el-link>
                            </router-link>
                            <div v-else>-</div>
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

<script lang="ts" setup name="masterWorkerImproveInfo">
import { apiMasterWorkerImproveInfoLists } from '@/api/master_worker/improve_info'
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import { usePaging } from '@/hooks/usePaging'

interface formDataObj {
    name?: string
    sn: string
    sex: number | string
}

const cascaderPanelRef = shallowRef<any>()
const formData = ref<formDataObj>({
    name: '',
    sn: '',
    sex: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiMasterWorkerImproveInfoLists,
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
