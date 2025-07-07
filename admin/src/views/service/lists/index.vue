<template>
    <div class="lists">
        <el-card shadow="never" class="!border-none">
            <el-form :model="formData" inline>
                <el-form-item label="服务名称">
                    <el-input
                        class="ls-input"
                        v-model="formData.name"
                        placeholder="请输入服务名称"
                    />
                </el-form-item>
                <el-form-item label="服务分类">
                    <el-cascader
                        ref="cascaderRef"
                        class="ls-input"
                        v-model="formData.first_id"
                        :options="categoryData"
                        :props="{
                            checkStrictly: true,
                            label: 'name',
                            value: 'id',
                            children: 'sons',
                            emitPath: false
                        }"
                        clearable
                        filterable
                        @change="handleChange"
                    />
                </el-form-item>
                <el-form-item label="服务技能">
                    <el-select
                        v-model="formData.skill_id"
                        placeholder="请选择"
                        style="width: 280px"
                    >
                        <el-option
                            v-for="item in skillData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div class="m-l-20">
                        <el-button type="primary" @click="resetPage">查询</el-button>
                        <el-button @click="resetParams">重置</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="never" class="mt-4 !border-none">
            <el-tabs class="-mt-2" v-model="formData.status" @tab-change="resetPage">
                <el-tab-pane
                    v-for="(value, key, index) in pager.extend"
                    :key="index"
                    :label="`${serviceMode[key]}(${value})`"
                    :name="index ? index : ''"
                />
            </el-tabs>

            <div class="mt-2">
                <el-button
                    type="primary"
                    @click="$router.push('lists/edit')"
                    v-perms="['goods.goods/add']"
                    >添加服务</el-button
                >
                <el-button
                    @click="handleChangeStatus(selectionData, 0)"
                    :disabled="!selectionData.length"
                    v-perms="['goods.goods/status']"
                >
                    批量上架
                </el-button>
                <el-button
                    @click="handleChangeStatus(selectionData, 1)"
                    :disabled="!selectionData.length"
                    v-perms="['goods.goods/status']"
                >
                    批量下架
                </el-button>
                <el-button
                    @click="handleDelete(selectionData, 'multiple')"
                    :disabled="!selectionData.length"
                    v-perms="['goods.goods/del']"
                >
                    批量删除
                </el-button>
            </div>

            <div class="mt-4">
                <el-table
                    ref="tableData"
                    :data="pager.lists"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="pager.loading"
                >
                    <el-table-column type="selection" max-width="55" />
                    <el-table-column property="name" label="服务名称" min-width="260">
                        <template #default="scope">
                            <div class="flex items-center">
                                <div class="w-[60px] h-[60px]">
                                    <el-image
                                        style="width: 60px; height: 60px"
                                        :src="scope.row.image"
                                        :preview-src-list="[scope.row.image]"
                                        :hide-on-click-modal="true"
                                        :preview-teleported="true"
                                        :fit="'contain'"
                                    />
                                </div>
                                <div class="ml-[10px]">
                                    <div class="truncate">{{ scope.row.name }}</div>
                                    <div v-if="scope.row.sku_type">
                                        <el-tag type="primary" size="small">多规格</el-tag>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column property="category_desc" label="服务分类" min-width="145" />
                    <el-table-column property="price" label="价格" min-width="120">
                        <template #default="scope"> ¥{{ scope.row.min_price }} </template>
                    </el-table-column>
                    <el-table-column property="order_num" label="预约人数" min-width="120">
                        <template #default="scope"> {{ scope.row.sale_num }} </template>
                    </el-table-column>
                    <el-table-column property="status_desc" label="销售状态" min-width="100">
                        <template #default="scope">
                            <el-tag type="success" v-if="scope.row.status == 1">已上架</el-tag>
                            <el-tag type="info" v-if="scope.row.status == 0">已下架</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column property="sort" label="排序" min-width="90" />
                    <el-table-column property="update_time" label="更新时间" min-width="180" />
                    <el-table-column property="address" label="操作" width="200" fixed="right">
                        <template #default="scope">
                            <div class="flex items-center">
                                <router-link
                                    v-perms="['goods.goods/edit']"
                                    class="mr-4"
                                    :to="{
                                        path: 'lists/edit',
                                        query: {
                                            id: scope.row.id
                                        }
                                    }"
                                >
                                    <el-link type="primary" :underline="false">编辑</el-link>
                                </router-link>
                                <router-link
                                    v-perms="['goods.goods/additional']"
                                    class="mr-4"
                                    :to="{
                                        path: './additional',
                                        query: {
                                            goods_id: scope.row.id,
                                            goods_name: scope.row.name
                                        }
                                    }"
                                >
                                    <el-link type="primary" :underline="false">附加项目</el-link>
                                </router-link>

                                <el-dropdown>
                                    <span class="el-dropdown-link text-primary"
                                        >更多<el-icon class="el-icon--right"
                                            ><arrow-down
                                        /></el-icon>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item>
                                                <el-link
                                                    v-perms="['goods.goods/status']"
                                                    type="primary"
                                                    :underline="false"
                                                    @click="
                                                        handleChangeStatus(
                                                            scope.row.id,
                                                            scope.row.status
                                                        )
                                                    "
                                                >
                                                    {{ !scope.row.status ? '上架' : '下架' }}
                                                </el-link></el-dropdown-item
                                            >
                                            <el-dropdown-item>
                                                <el-link
                                                    v-if="!scope.row.status"
                                                    v-perms="['goods.goods/del']"
                                                    type="danger"
                                                    :underline="false"
                                                    @click="handleDelete(scope.row.id, 'single')"
                                                    >删除</el-link
                                                ></el-dropdown-item
                                            >
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists"></pagination>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="serviceLists">
import { apiServiceLists, apiServiceDel, apiServiceStatus } from '@/api/service/lists'
import { apiCategoryCommonLists } from '@/api/service/category'
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import Popup from '@/components/popup/index.vue'
import { usePaging } from '@/hooks/usePaging'
import { ServiceMode } from '@/enums/modeEnum'
import feedback from '@/utils/feedback'
import { apiAllStaffSkillLists } from '@/api/master_worker/skill'

interface formDataObj {
    name: string //服务名称
    status?: number | string //服务状态:1-销售中;0-仓库中
    first_id: number | string // 一级分类id
    second_id: number | string // 二级分类id
    skill_id: number | string // 技能id
}

interface Lists {
    name?: string
    id?: number | string
    sons?: object[] | null
    value?: string
    label?: number | string
    children?: object | null
}

// 服务枚举
const serviceMode = ref<any>(ServiceMode)
// 表单数据
const formData = ref<formDataObj>({
    name: '',
    status: '',
    first_id: '',
    second_id: '',
    skill_id: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiServiceLists,
    params: formData.value
})

// 选中的服务项目
const selectionData = ref<number[]>([])

// 服务分类下拉数据
const categoryData = ref([])
const cascaderRef = ref()

//服务技能数据
const skillData = ref<Array<object>>([])

// 表格多选选择的数据
const handleSelectionChange = (val: Event | any) => {
    console.log('val', val)
    val.forEach((item, index) => {
        console.log(index)
    })
    selectionData.value = val.map((item: Event | anyindex) => item.id)
}

// 服务状态 存放仓库 || 立即上架
const handleChangeStatus = async (ids: number | Array<number>, status: number) => {
    status = status === 0 ? 1 : 0
    ids = Array.isArray(ids) ? ids : [ids]
    if (status === 0) {
        await feedback.confirm('确认批量放入仓库？请谨慎操作。')
    } else if (status === 1) {
        await feedback.confirm('确认批量上架？请谨慎操作。')
    }
    await apiServiceStatus({ ids, status })
    getLists()
}

// 删除服务
const handleDelete = async (ids: number | Array<number>, type: 'single' | 'multiple') => {
    ids = Array.isArray(ids) ? ids : [ids]
    await feedback.confirm(`${type === 'single' ? '' : '批量'}确认删除？请谨慎操作。`)
    await apiServiceDel({ ids })
    getLists()
}

// 获取分类通用列表
const getCategoryLists = async (): Promise<void> => {
    const res = await apiCategoryCommonLists()
    categoryData.value = res
}

// 记录级联选择器所选中的最后一个元素的id
const handleChange = () => {
    const node = cascaderRef.value.getCheckedNodes()
    formData.value.first_id = node[0]?.pathValues[0]
    formData.value.second_id = node[0]?.pathValues[1]
}

// 获取技能通用列表
const getStaffLists = async (): Promise<void> => {
    const res = await apiAllStaffSkillLists({})
    skillData.value = res
}

onMounted(() => {
    getLists()
    getCategoryLists()
    getStaffLists()
})
</script>

<style lang="scss" scoped>
.lists {
    .el-radio-button__inner {
        padding: 8.5px 40px;
    }
}
.ls-input {
    width: 280px;
}

.el-tabs__nav-wrap::after {
    height: 1px !important;
}
:deep() .el-tabs__content {
    padding: 0;
}
</style>
