<template>
    <el-form-item label="虚拟销量:" prop="virtual_sales">
        <el-input class="w-56 ls-input" type="number" v-model.trim="modelValue.virtual_sale_num" />
    </el-form-item>
    <el-form-item label="排序:">
        <el-input class="w-56 ls-input" v-model="modelValue.sort" />
    </el-form-item>
    <el-form-item label="服务佣金:" prop="earnings_ratio">
        <el-input class="ls-input" v-model="modelValue.earnings_ratio" type="number"
            ><template #append>%</template></el-input
        >
    </el-form-item>
    <el-form-item label="状态:" prop="status">
        <el-radio v-model="modelValue.status" :label="1">上架</el-radio>
        <el-radio v-model="modelValue.status" :label="0">下架</el-radio>
    </el-form-item>
</template>

<script lang="ts" setup>
withDefaults(
    defineProps<{
        modelValue?: any
    }>(),
    {
        modelValue: {}
    }
)
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
