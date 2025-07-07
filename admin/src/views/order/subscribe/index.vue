<template>
    <el-card shadow="never" class="!border-none">
        <div class="lg:flex">
            <div class="min-w-0">
                <el-form :model="formData" ref="formRef" label-width="auto">
                    <el-form-item label="可提前预约" prop="name">
                        <div>
                            <el-input
                                class="w-56 ls-input"
                                v-model="formData.time"
                                placeholder="请输入"
                            >
                                <template #append>天</template>
                            </el-input>
                            <div class="text-gray-400 form-tips">
                                用户可以提前预约的天数，默认7天
                            </div>
                        </div>
                    </el-form-item>

                    <div class="noflex">
                        <el-form-item label="时间段设置" prop="un_selected_icon">
                            <div>
                                <div class="w-[88px] flex">
                                    <subscribe-form
                                        @refresh="getLists"
                                        type="primary"
                                        btnText="添加时间段"
                                        v-perms="['order.order_time/add']"
                                    />
                                    <el-button
                                        @click="handleDeletes(selectionData, 'multiple')"
                                        :disabled="!selectionData.length"
                                        v-perms="['order.order_time/del']"
                                    >
                                        批量删除
                                    </el-button>
                                </div>
                                <div class="mt-2">
                                    <el-table
                                        size="large"
                                        ref="tableDataRef"
                                        :data="pager.lists"
                                        v-loading="pager.loading"
                                        :fit="true"
                                        style="width: 640px"
                                        @selection-change="handleSelectionChange"
                                    >
                                        <el-table-column type="selection" max-width="55" />
                                        <el-table-column
                                            property="time_desc"
                                            label="时间段"
                                            min-width="160"
                                        />
                                        <el-table-column
                                            property="sort"
                                            label="排序"
                                            min-width="160"
                                        >
                                            <template #default="{ row }">
                                                <div class="flex">
                                                    {{ row.sort }}
                                                    <popover-input
                                                        @confirm="
                                                            handleUserInfoEdit($event, row.id)
                                                        "
                                                        v-model="formData.sort"
                                                        type="text"
                                                        trigger="hover"
                                                        v-perms="['order.order_time/sort']"
                                                    >
                                                        <el-icon
                                                            style="vertical-align: middle"
                                                            color="#4A5DFF"
                                                            class="ml-2"
                                                        >
                                                            <edit-pen />
                                                        </el-icon>
                                                    </popover-input>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" min-width="110" fixed="right">
                                            <template #default="scope">
                                                <div class="flex leading-4">
                                                    <subscribe-form
                                                        :id="scope.row.id"
                                                        type="text"
                                                        btnText="编辑"
                                                        @refresh="getLists"
                                                        v-perms="['order.order_time/edit']"
                                                    />

                                                    <el-link
                                                        class="ml-2"
                                                        type="danger"
                                                        :underline="false"
                                                        @click="
                                                            handleDeletes(scope.row.id, 'single')
                                                        "
                                                        v-perms="['order.order_time/del']"
                                                    >
                                                        删除
                                                    </el-link>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="ml-4 lg:pt-[115px] 2xl:w-1/5 2xl:hot-search-phone 2xl:mr-5">
                <span class="mb-4 ml-24">- 预览图 -</span>
                <div class="hot-search-phone-content">
                    <!-- 热门搜索 -->
                    <div class="hot-search-text">
                        <span class="item" v-for="(text, index) in pager.lists" :key="index">
                            {{ text.time_desc }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </el-card>

    <footer-btns>
        <el-button v-perms="['order.order_time/setTime']" type="primary" @click="onSubmit"
            >保存</el-button
        >
    </footer-btns>
</template>

<script lang="ts" setup name="orderSubscribe">
import {
    apiGetOrderTime,
    apiSetOrderTime,
    apiOrderTimeLists,
    apiOrderTimeDel,
    apiTimeSort
} from '@/api/order/subscribe'
import { ref } from 'vue'
import FooterBtns from '@/components/footer-btns/index.vue'
import subscribeForm from './components/subscribe-form.vue'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import PopoverInput from '@/components/popover-input/index.vue'

interface formDataObj {
    time: string | number
    sort: number | string
}
const formData = ref<formDataObj>({
    time: '',
    sort: ''
})
const { pager, getLists, resetPage, resetParams } = usePaging({
    size: 999,
    fetchFun: apiOrderTimeLists
})

// 提交修改预约天数
const getOrderTime = async (): Promise<void> => {
    ;(formData.value as object) = await apiGetOrderTime()
}

// 提交修改预约天数
const onSubmit = async (): Promise<void> => {
    await apiSetOrderTime({ time: formData.value.time })
    getOrderTime()
}

// 表格多选选择的数据
const handleSelectionChange = (val: Event | any) => {
    selectionData.value = val.map((item: Event | any) => item.id)
}
// 选中的服务项目
const selectionData = ref<number[]>([])
// 删除
const handleDeletes = async (ids: number | Array<number>, type: 'single' | 'multiple') => {
    ids = Array.isArray(ids) ? ids : [ids]
    await feedback.confirm(`${type === 'single' ? '' : '批量'}确认删除？请谨慎操作。`)
    await apiOrderTimeDel({ ids })
    getLists()
}

const handleUserInfoEdit = async (sort: string, id): Promise<void> => {
    await apiTimeSort({ id, sort })
    getLists()
}

getLists()
getOrderTime()
</script>

<style lang="scss" scoped>
.ls-input {
    width: 223px;
}

.noflex :deep() .el-form-item__content {
    display: block;
}

.hot-search-phone {
    &-content {
        @apply grid grid-cols-3;
        width: 280px;
        height: 494px;
        padding: 10px 10px;
        border-radius: 10px;
        border: 1px solid #e6e6e6;

        .hot-search-text {
            @apply flex flex-wrap grid grid-cols-3 w-[260px] h-4;
            span {
                @apply flex-1 text-center;
                font-size: 12px;
                border-radius: 5px;
                border: 1px solid #e6e6e6;
                margin: 0 6px 6px 0;
                display: inline-block;
                background-color: #fff;
            }
        }
    }
}
</style>
