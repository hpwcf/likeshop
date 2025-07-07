<template>
    <div class="style-chose">
        <div class="chose-list flex flex-wrap justify-between">
            <div
                class="chose-item"
                v-for="(item, index) in data"
                :key="index"
                :class="{ active: select === item.value }"
                @click="select = item.value"
            >
                <div class="chose-content">
                    <span :style="{ 'padding-left': item.icon ? '8px' : '0' }">{{ item.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { defineProps } from 'vue'

const props = defineProps<{
    data: any[]
    modelValue: number | string
}>()

const select = useVModel(props, 'modelValue')
</script>

<style lang="scss" scoped>
.style-chose {
    .chose-list {
        .chose-item {
            width: 110px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            padding: 0 20px;
            border: 1px solid #e5e5e5;
            margin-top: 20px;
            border-radius: 4px;
            cursor: pointer;
            &.active {
                border-color: var(--el-color-primary);
                color: var(--el-color-primary);
            }
        }
    }
}
</style>