<template>
    <el-card class="!border-none" shadow="never">
        <el-form :model="formData" inline>
            <el-form-item label="用户信息">
                <el-input
                    class="ls-input"
                    v-model="formData.user_info"
                    placeholder="用户账号/昵称"
                />
            </el-form-item>
            <el-form-item label="注册时间">
                <data-picker
                    class="ls-input"
                    style="width: 280px"
                    v-model:start_time="formData.start_time"
                    v-model:end_time="formData.end_time"
                ></data-picker>
            </el-form-item>
            <el-form-item label="注册来源">
                <el-select
                    v-model="formData.register_source"
                    class="ls-input w-56"
                    placeholder="请选择"
                >
                    <el-option label="全部" value></el-option>
                    <el-option label="微信小程序" :value="1"></el-option>
                    <el-option label="微信公众号" :value="2"></el-option>
                    <el-option label="手机H5" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <div class="flex">
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-card>

    <el-card shadow="never" class="mt-4 !border-none">
        <div class="mt-4">
            <el-table
                ref="tableDataRef"
                :data="pager.lists"
                style="width: 100%"
                v-loading="pager.loading"
            >
                <el-table-column label="头像" min-width="100">
                    <template #default="scope">
                        <el-image
                            style="width: 48px; height: 48px"
                            :src="scope.row.avatar"
                            :preview-src-list="[scope.row.avatar]"
                            :hide-on-click-modal="true"
                            :preview-teleported="true"
                            :fit="'cover'"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column property="nickname" label="用户昵称" min-width="200" />
                <el-table-column property="account" label="账号" min-width="200" />
                <el-table-column property="mobile" label="手机号码" min-width="200">
                    <template #default="scope">
                        <div>{{ scope.row.mobile || '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column property="source_desc" label="注册来源" min-width="200" />
                <el-table-column property="create_time" label="注册时间" min-width="200" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="scope">
                        <router-link :to="`/user/userList/detail?id=${scope.row.id}`">
                            <el-link
                                type="primary"
                                v-perms="['user.user/detail']"
                                :underline="false"
                                >详情</el-link
                            >
                        </router-link>
                        <el-button
                            class="ml-[10px]"
                            link
                            type="primary"
                            @click="handleadjust(scope.row.id, scope.row.user_money)"
                            >调整余额</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="flex justify-end mt-4">
            <pagination v-model="pager" @change="getLists" />
        </div>
    </el-card>

    <adjust-popup
        v-if="showAdjust"
        ref="adjustRef"
        @close="showAdjust = false"
        :id="adjustInfo?.id"
        :value="adjustInfo?.user_money"
        :type="1"
    ></adjust-popup>
</template>

<script lang="ts" setup name="userLists">
import { apiUserLists } from '@/api/user'
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import DataPicker from '@/components/data-picker/index.vue'
import { usePaging } from '@/hooks/usePaging'
import AdjustPopup from './components/adjust.vue'

interface formDataObj {
    user_info?: string
    register_source?: number | string // 1-微信小程序 2-微信公众号 3-手机H5
    start_time: string
    end_time: string
}
const formData = ref<formDataObj>({
    user_info: '',
    register_source: '',
    start_time: '',
    end_time: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiUserLists,
    params: formData.value
})
getLists()

const showAdjust = ref(false)
const adjustRef = shallowRef<InstanceType<typeof AdjustPopup>>()
const adjustInfo = ref()
const handleadjust = async (id: number, user_money: number) => {
    adjustInfo.value = { id, user_money }
    showAdjust.value = true
    await nextTick()
    adjustRef.value?.open()
}
</script>

<style lang="scss">
.ls-input {
    width: 280px;
}
</style>
