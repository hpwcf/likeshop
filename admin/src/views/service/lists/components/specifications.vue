<template>
    <div class="ml-[80px] pr-8">
        <div class="flex m-4">
            <el-button type="primary" :disabled="specItem.length >= 3" @click="addSpecItem"
                >添加规格项</el-button
            >
            <div class="ml-4 form-tips">最多支持3个规格项</div>
        </div>

        <template v-for="(item, index) in specItem" :key="index">
            <del-wrap @close="handleDelSpecItem(index)">
                <div class="flex p-[16px] ml-4 mt-[16px] spec-item">
                    <div class="flex-none mr-[10px]">
                        <div class="mt-2">规格项</div>
                        <div class="mt-6"></div>
                    </div>
                    <div class="spec-item__content">
                        <div>
                            <el-input
                                v-model="item.name"
                                style="width: 300px"
                                maxlength="30"
                                show-word-limit
                            >
                            </el-input>
                        </div>
                        <div class="flex flex-wrap col-top">
                            <div
                                class="mt-4 mr-4"
                                v-for="(subItem, subIndex) in item.value"
                                :key="subIndex"
                            >
                                <del-wrap @close="removeSpecValue(index, subIndex)">
                                    <el-input
                                        class="w-40"
                                        v-model="subItem.value"
                                        maxlength="20"
                                        show-word-limit
                                        @blur="checkValue(index, subIndex)"
                                    ></el-input>
                                </del-wrap>
                            </div>
                            <div class="mt-4">
                                <el-button @click="addSpecValue(index)">+ 添加规格值</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </del-wrap>
        </template>
    </div>

    <el-form-item label="规格明细" class="mt-8">
        <div class="flex pl-[10px] mb-4">
            <popover-input
                class="mr-2"
                :disabled="disabledBatchBtn"
                @confirm="batchSetting($event, 'duration')"
            >
                <el-button :disabled="disabledBatchBtn">设置时长</el-button>
            </popover-input>
            <popover-input
                class="mr-2"
                :disabled="disabledBatchBtn"
                @confirm="batchSetting($event, 'price')"
            >
                <el-button :disabled="disabledBatchBtn">设置价格</el-button>
            </popover-input>
            <popover-input
                class="mr-2"
                :disabled="disabledBatchBtn"
                @confirm="batchSetting($event, 'line_price')"
            >
                <el-button :disabled="disabledBatchBtn">设置划线价</el-button>
            </popover-input>
        </div>

        <el-table
            class="pl-[10px]"
            :data="specParams.tableData"
            max-height="600"
            :row-height="75"
            tooltip-effect="dark"
            :border="false"
            big-data-checkbox
            @selection-change="selectDataChange"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column
                v-for="(item, index) in specItem"
                :key="index"
                :label="item.name"
                min-width="140"
                :show-overflow-tooltip="true"
            >
                <template #default="{ row }">
                    {{  row?.sku_value_arr?.length ? row?.sku_value_arr[index] : '' }}
                </template>
            </el-table-column>
            <el-table-column min-width="100">
                <template #header> <span class="require-text">*</span> 时长 </template>
                <template #default="{ row }">
                    <el-input v-model="row.duration" type="number" class="spec-input">
                        <template #append>分钟</template>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column min-width="100">
                <template #header> <span class="require-text">*</span> 价格 </template>
                <template #default="{ row }">
                    <el-input v-model="row.price" type="number" class="spec-input">
                        <template #append>元</template>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column min-width="100">
                <template #header> 划线价 </template>
                <template #default="{ row }">
                    <el-input v-model="row.line_price" type="number" class="spec-input">
                        <template #append>元</template>
                    </el-input>
                </template>
            </el-table-column>
        </el-table>
    </el-form-item>
</template>

<script lang="ts" setup>
import feedback from '@/utils/feedback'
import { flatten } from '@/utils/util'
import type { SkuItemList, SkuNameList } from '@/api/service/lists'

const props = withDefaults(
    defineProps<{
        modelValue: any
    }>(),
    {
        modelValue: {}
    }
)

const specParams = reactive<any>({
    tableData: props.modelValue.sku,
    selectData: [],
    tableDataIndex: 0 as number
})

const disabledBatchBtn = computed(() => !specParams.selectData.length)

const specItem = computed(() => props.modelValue.sku_name_list || [])
const specSubItem = computed(() => props.modelValue.sku || [])

// 新增规格项
const addSpecItem = () => {
    const len = props.modelValue.sku_name_list.length
    if (len >= 3) return feedback.msgError('最多添加3个规格项')
    props.modelValue.sku_name_list.push({
        id: '',
        name: '',
        value: [
            {
                value: ''
            }
        ]
    })
}

// 删除规格项
const handleDelSpecItem = (index: number) => {
    const len = props.modelValue.sku_name_list.length
    if (len <= 1) return feedback.msgError('至少一个规格项')
    props.modelValue.sku_name_list.splice(index, 1)
}

// 新增规格值
const addSpecValue = (index: number) => {
    props.modelValue.sku_name_list[index].value.push({
        // id: "",
        value: ''
    })
}

// 删除规格值
const removeSpecValue = (index: number, subIndex: number) => {
    props.modelValue.sku_name_list[index].value.splice(subIndex, 1)
}

// 校验规格值
const checkValue = (index: number, subIndex: number) => {
    const skuItem = props.modelValue?.sku_name_list[index]
    const value = skuItem?.value[subIndex].value
    const res = skuItem?.value.filter(
        (item: { value: string }) => item.value == value && value != '' && value.length != 0
    )
    const lessTops = res.length >= 2
    if (lessTops) {
        feedback.msgWarning('已存在相同规格值')
        skuItem.value[subIndex].value = ''
    }
}

const selectDataChange = (value: SkuItemList[]) => {
    specParams.selectData = value.map((item) => item.ids)
}

const batchSetting = (value: string, fields: string | never) => {
    specParams.tableData.forEach((item: { [x: string]: string; ids: any }) => {
        if (specParams.selectData.includes(item.ids)) {
            item[fields] != undefined && (item[fields] = value)
        }
    })
}

//设置字段名称
const setFields = (prev: any, next: any) => {
    let valueArr = [prev, next]
    valueArr = valueArr.filter((item) => item.value !== undefined)
    const ids = flatten(valueArr.map((item) => item.ids)).join()
    const value = flatten(valueArr.map((item) => item.value))
    return {
        id: prev.id ? prev.id : '',
        ids: ids,
        value,
        sku_value_arr: value,
        price: prev.price ? prev.price : '',
        line_price: prev.line_price ? prev.line_price : '',
        duration: prev.duration ? prev.duration : ''
    }
}

// 通过规格项和规格值得到一个表格data
const getTableData = (arr: any[]) => {
    arr = JSON.parse(JSON.stringify(arr))
    return arr.reduce(
        (prev, next) => {
            const newArr = []
            for (let i = 0; i < prev.length; i++) {
                if (!next.length) {
                    newArr.push(setFields(prev[i], {}))
                }
                for (let j = 0; j < next.length; j++) {
                    next[j].ids = j
                    newArr.push(setFields(prev[i], next[j]))
                }
            }
            return newArr
        },
        [{}]
    )
}

const setTableData = () => {
    const skuNameList = props.modelValue.sku_name_list
    const tableData = specParams.tableData
    const specList = skuNameList.map((item: SkuNameList) => item.value)
    const newData = getTableData(specList)
    const rawData = JSON.parse(JSON.stringify(tableData))
    const rawObject: any = {}
    rawData.forEach((item: any) => {
        if (item.sku_value_arr !== undefined) {
            rawObject[item.sku_value_arr] = item
        }
    })
    specParams.tableData = newData.map((item: any) =>
        rawObject[item.sku_value_arr]
            ? {
                  ...rawObject[item.sku_value_arr],
                  value: item.value,
                  ids: item.ids
              }
            : item
    )
}

watch(
    () => specItem.value,
    () => {
        setTableData()
    },
    { deep: true, immediate: true }
)

watch(
    () => props.modelValue.sku,
    (value) => {
        specParams.tableData = value
    }
)

watch(
    () => specParams.tableData,
    (value) => {
        props.modelValue.sku = value
    },
    { deep: true, immediate: true }
)
</script>

<style>
.spec-item {
    transition: all 1s;
    background-color: var(--el-color-primary-light-9);
}

.spec-image {
    width: 50px;
    height: 50px;
    cursor: pointer;
    border: 1px dashed #e5e5e5;
}
</style>
