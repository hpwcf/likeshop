<template>
    <el-card class="!border-none" shadow="never" :body-style="{ 'padding-right': '200px' }">
        <el-form class="ls-form" :model="formData" inline>
            <el-form-item label="服务名称">
                <el-input class="ls-input" v-model="formData.goods_info" placeholder="服务名称" />
            </el-form-item>
            <el-form-item label="用户信息">
                <el-input class="ls-input" v-model="formData.user_info" placeholder="昵称/手机号" />
            </el-form-item>
            <el-form-item label="回复状态">
                <el-select v-model="formData.status" class="ls-input" placeholder="请选择">
                    <el-option label="全部" value />
                    <el-option label="待回复" value="0" />
                    <el-option label="已回复" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="评价等级">
                <el-select v-model="formData.comment_level" class="ls-input" placeholder="请选择">
                    <el-option label="全部" value />
                    <el-option label="好评" value="good" />
                    <el-option label="中评" value="medium" />
                    <el-option label="差评" value="bad" />
                </el-select>
            </el-form-item>
            <el-form-item label="评价时间">
                <data-picker
                    class="ls-input"
                    style="width: 280px"
                    v-model:start_time="formData.start_time"
                    v-model:end_time="formData.end_time"
                />
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
        <el-table
            ref="tableDataRef"
            :data="pager.lists"
            style="width: 100%"
            v-loading="pager.loading"
        >
            <el-table-column label="服务名称" min-width="180">
                <template #default="scope">
                    <div class="flex items-center">
                        <el-image
                            style="width: 60px; height: 60px"
                            :src="scope.row.goods_image"
                            :preview-src-list="[scope.row.goods_image]"
                            :hide-on-click-modal="true"
                            :preview-teleported="true"
                            :fit="'cover'"
                        />
                        <div class="ml-2">{{ scope.row.goods_name }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column property="nickname" label="用户信息" min-width="160">
                <template #default="scope">
                    <el-popover placement="top-start" width="200px" trigger="hover">
                        <div class="flex">
                            <span class="flex-none mr-2">头像：</span>
                            <el-image
                                :src="scope.row.user.avatar"
                                style="width: 40px; height: 40px; border-radius: 50%"
                            />
                        </div>
                        <div class="flex mt-2">
                            <span class="flex-none mr-2">昵称：</span>
                            <span>{{ scope.row.user.nickname }}</span>
                        </div>
                        <div class="flex mt-2">
                            <span class="flex-none mr-6">ID：</span>
                            <span>{{ scope.row.user.sn }}</span>
                        </div>
                        <template #reference>
                            <div class="pointer">
                                {{ scope.row.user.nickname }}
                            </div>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="评价等级" min-width="160">
                <template #default="scope">
                    <el-rate
                        v-model="scope.row.service_comment"
                        disabled
                        :texts="['差评', '差评', '中评', '好评', '好评']"
                        show-text
                    >
                    </el-rate>
                </template>
            </el-table-column>
            <el-table-column label="评价内容" min-width="300">
                <template #default="scope">
                    <div class="m-l-10">{{ scope.row.comment }}</div>
                    <div class="m-t-10">
                        <div
                            v-for="item in scope.row.goods_comment_image"
                            :key="item.id"
                            class="inline mr-[10px]"
                        >
                            <el-image
                                style="width: 60px; height: 60px"
                                :src="item.uri"
                                :preview-src-list="[item.uri]"
                                :hide-on-click-modal="true"
                                :preview-teleported="true"
                                :fit="'cover'"
                            />
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column property="reply" label="回复内容" min-width="180">
                <template #default="scope">
                    {{ scope.row.reply || '-' }}
                </template>
            </el-table-column>
            <el-table-column property="status_desc" label="回复状态" width="140">
                <template #default="scope">
                    <el-tag type="danger" v-if="scope.row.status == 0">待回复</el-tag>

                    <el-tag type="success" v-if="scope.row.status == 1">已回复</el-tag>
                </template>
            </el-table-column>
            <el-table-column property="create_time" label="评价时间" width="180" />
            <el-table-column label="操作" width="160" fixed="right">
                <template #default="scope">
                    <div class="flex">
                        <evaluate-form
                            v-perms="['goods.goods_comment/reply']"
                            :id="scope.row.id"
                            :title="scope.row.status ? '编辑回复' : '回复评价'"
                            @refresh="getLists"
                        />
                        <el-link
                            class="ml-4"
                            type="danger"
                            :underline="false"
                            @click="handleDelete(scope.row.id)"
                            v-perms="['goods.goods_comment/del']"
                        >
                            删除
                        </el-link>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-end mt-4">
            <pagination v-model="pager" @change="getLists" />
        </div>
    </el-card>
</template>

<script lang="ts" setup name="serviceEvaluate">
import { apiCommentLists, apiCommentDel } from '@/api/service/evaluate'
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import DataPicker from '@/components/data-picker/index.vue'
import evaluateForm from './components/evaluate-form.vue'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

interface formDataObj {
    goods_info?: string
    user_info?: string
    status?: string
    comment_level: string
    start_time: string
    end_time: string
}

const formData = ref<formDataObj>({
    goods_info: '',
    user_info: '',
    status: '',
    comment_level: '',
    start_time: '',
    end_time: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiCommentLists,
    params: formData.value
})

// 删除广告位
const handleDelete = async (id: number): Promise<void> => {
    await feedback.confirm('确认要删除吗？')
    await apiCommentDel({ id })
    getLists()
}
getLists()
</script>

<style lang="scss">
.ls-input {
    width: 280px;
}

.el-rate__item {
    line-height: 12px;

    i {
        margin-right: 2px !important;
    }
}
</style>
