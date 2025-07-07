<template>
    <el-form-item label="服务类型" prop="type">
        <div class="flex goods-type">
            <div
                v-for="(item, index) in goodsType"
                :key="index"
                :class="{ active: item.value == 1 }"
                @click="modelValue.type == 1"
            >
                <div>{{ item.name }}</div>
            </div>
        </div>
        <el-input type="hidden" v-model.trim="modelValue.type" />
    </el-form-item>
    <el-form-item label="服务名称:" prop="name">
        <el-input
            class="w-56 ls-input"
            maxlength="64"
            show-word-limit
            v-model.trim="modelValue.name"
            placeholder="请输入服务名称"
        />
    </el-form-item>
    <!-- <el-form-item label="服务简介:" prop="remarks">
        <el-input class="w-56 ls-input" v-model="modelValue.remarks" placeholder="请输入服务简介" />
    </el-form-item> -->
    <el-form-item label="服务分类:" prop="category_id">
        <!-- 选择分类 -->
        <el-cascader
            class="mr-2 w-[340px]"
            v-model="modelValue.category_id"
            :options="categoryData"
            :props="props"
            clearable
        />

        <!-- 新增分类 -->
        <el-button type="text" @click="toAddCategory">新增分类</el-button>
        <el-button type="text">|</el-button>
        <el-button type="text" @click="getCategoryLists">刷新</el-button>
    </el-form-item>
    <el-form-item label="服务技能:" prop="skill_id">
        <!-- 选择技能 -->
        <el-select
            class="mr-2 w-[340px]"
            v-model="modelValue.skill_id"
            placeholder="请选择"
            :multiple="true"
        >
            <el-option
                v-for="item in skillData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
        </el-select>

        <!-- 新增分类 -->
        <el-button type="text" @click="toAddSkill">新增技能</el-button>
        <el-button type="text">|</el-button>
        <el-button type="text" @click="getSkillLists">刷新</el-button>
    </el-form-item>
    <el-form-item label="标签:" prop="name" :required="false">
        <el-input
            class="w-56 ls-input"
            maxlength="30"
            show-word-limit
            v-model.trim="modelValue.label"
            placeholder="标签用 | 符号间隔"
        />
    </el-form-item>
    <el-form-item label="轮播图:" prop="goods_image">
        <div>
            <material-picker v-model="modelValue.goods_image" :limit="10"></material-picker>
            <div class="form-tips">
                建议尺寸：800*800，可拖拽改变图片顺序，默认首张图为主图，最多上传10张
            </div>
        </div>
    </el-form-item>
    <el-form-item label="限定城市:" prop="city_id">
        <el-cascader
            class="w-[460px]"
            v-model="modelValue.open_city_id"
            :options="cityData"
            :props="{
                multiple: true,
                label: 'label',
                value: 'value',
                children: 'children',
                emitPath: false
            }"
            clearable
            placeholder="全国"
        />
    </el-form-item>
    <el-form-item label="预约开始时间:" prop="appoint_start_time">
        <el-input
            class="ls-input"
            v-model="modelValue.appoint_start_time"
            type="number"
            placeholder="0~24"
            ><template #append>小时</template></el-input
        >
    </el-form-item>
    <el-form-item label="预约结束时间:" prop="appoint_end_time">
        <el-input
            class="ls-input"
            v-model="modelValue.appoint_end_time"
            type="number"
            placeholder="0~24"
            ><template #append>小时</template></el-input
        >
    </el-form-item>
</template>

<script lang="ts" setup>
import { apiCategoryLists } from '@/api/service/category'
import { apiUnitCommonLists } from '@/api/service/unit'
import { reactive, ref } from 'vue'
import MaterialPicker from '@/components/material/picker.vue'
import { apiAllStaffSkillLists } from '@/api/master_worker/skill'
import { apiOpenCityCommonLists } from '@/api/setting/open_city'

interface Lists {
    name: string
    id: number | string
}

withDefaults(
    defineProps<{
        modelValue?: any
    }>(),
    {
        modelValue: {}
    }
)

const categoryData = ref<Array<Lists> | null>([])
const unitData = ref<Array<Lists> | null>([])
const props = reactive({
    multiple: false,
    checkStrictly: false,
    label: 'name',
    value: 'id',
    children: 'sons',
    emitPath: false
})
const goodsType = [
    {
        value: 1,
        name: '上门服务'
    }
]
const skillData = ref<Array<Lists> | null>([])
const cityData = ref<Array<Lists> | null>([])

// 获取分类通用列表
const getCategoryLists = async (): Promise<void> => {
    const res: any = await apiCategoryLists({})
    categoryData.value = res.lists
}

// 获取技能通用列表
const getSkillLists = async (): Promise<void> => {
    const res = await apiAllStaffSkillLists({})
    skillData.value = res
}

// 获取城市通用列表
const getOpenCityLists = async (): Promise<void> => {
    const res = await apiOpenCityCommonLists({})
    cityData.value = res
}

// 获取单位通用列表
const getUnitCommonLists = async (): Promise<void> => {
    const res: any = await apiUnitCommonLists()
    unitData.value = res
}

// 去新建分类
const toAddCategory = () => {
    window.open(window.origin + '/admin/service/category', '_blank')
}

// 去新建技能
const toAddSkill = () => {
    window.open(window.origin + '/admin/master_worker/skill', '_blank')
}

getCategoryLists()
getUnitCommonLists()
getSkillLists()
getOpenCityLists()
</script>

<style lang="scss" scoped>
.ls-input {
    width: 460px;
}
.select {
    width: 340px;
    margin-right: 10px;
}
.goods-type {
    & > div {
        cursor: pointer;
        line-height: 1.3;
        border: 1px solid #909399;
        padding: 14px 20px;
        margin-right: 20px;
        &.active {
            color: var(--el-color-primary);
            border-color: var(--el-color-primary);
            background-color: var(--el-color-primary-light-9);
        }
    }
}
</style>
