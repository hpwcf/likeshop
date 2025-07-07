<template>
    <el-form-item label="规格类型" prop="sku_type">
        <div class="w-80">
            <el-radio-group v-model="modelValue.sku_type" class="ml-4">
                <el-radio :label="0">单规格</el-radio>
                <el-radio :label="1">多规格</el-radio>
            </el-radio-group>
        </div>
    </el-form-item>

    <div v-if="modelValue.sku_type">
        <specifications v-model="modelValue"></specifications>
    </div>

    <div v-else>
        <el-form-item
            label="服务价格"
            :rules="[
                {
                    required: true,
                    message: '请输入服务价格',
                    trigger: ['blur', 'change']
                }
            ]"
        >
            <div>
                <el-input v-model="modelValue.sku[0].price" type="number" class="ls-input">
                    <template #append>元</template>
                </el-input>
            </div>
        </el-form-item>
        <el-form-item label="划线价">
            <div>
                <el-input v-model="modelValue.sku[0].line_price" type="number" class="ls-input">
                    <template #append>元</template>
                </el-input>
            </div>
        </el-form-item>
        <el-form-item
            label="服务时长"
            :rules="[
                {
                    required: true,
                    message: '请输入服务时长',
                    trigger: ['blur', 'change']
                }
            ]"
        >
            <div>
                <el-input v-model="modelValue.sku[0].duration" type="number" class="ls-input">
                    <template #append>分钟</template>
                </el-input>
            </div>
        </el-form-item>
    </div>
</template>

<script lang="ts" setup>
import Specifications from './specifications.vue'
const emit = defineEmits(['change', 'update'])

withDefaults(
    defineProps<{
        modelValue?: any
    }>(),
    {
        modelValue: {}
    }
)
</script>
