<template>
    <el-form label-width="140px" class="flex items-stretch">
        <div class="">
            <div class="text-xl font-medium mb-[20px]">系统主题色</div>
            <el-form-item label-width="50">
                <ThemePicker
                    v-model="formData.themeColorId"
                    :theme-colors="themeColors"
                    @change="selectThemeColor"
                />
            </el-form-item>
        </div>
        <div class="ml-10 mt-10">
            <div class="flex">
                <img
                    class="w-[260px] rounded-lg"
                    :style="{
                       'background': formData.themeColor
                    }"
                    src="@/assets/images/style/style1.png"
                />
                <img
                    class="w-[260px] rounded-lg ml-[30px]"
                    :style="{
                       'background': formData.themeColor
                    }"
                     src="@/assets/images/style/style2.png"
                />
                <img
                    class="w-[260px] rounded-lg ml-[30px]"
                    :style="{
                       'background': formData.themeColor
                    }"
                    src="@/assets/images/style/style3.png"
                />
            </div>
        </div>
    </el-form>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core'

import ThemePicker from './theme-picker.vue'

const props = defineProps<{
    modelValue: Record<string, any>
}>()
const themeColors = ref([
    { id: 1, name: '配色1', color: '#e1313c', defaultColor: '#e1313c' },
    { id: 2, name: '配色2', color: '#e24024', defaultColor: '#e24024' },
    { id: 3, name: '配色3', color: '#f1b83f', defaultColor: '#f1b83f' },
    { id: 4, name: '配色4', color: '#e3c943', defaultColor: '#e3c943' },
    { id: 5, name: '配色5', color: '#25C373', defaultColor: '#25C373' },
    { id: 6, name: '配色6', color: '#a1d040', defaultColor: '#a1d040' },
    { id: 7, name: '配色7', color: '#5fbcbc', defaultColor: '#5fbcbc' },
    { id: 8, name: '配色8', color: '#3b62ed', defaultColor: '#3b62ed' },
    { id: 9, name: '配色9', color: '#0000f5', defaultColor: '#0000f5' },
    { id: 10, name: '配色10', color: '#531cc2', defaultColor: '#531cc2' },
    { id: 11, name: '配色11', color: '#b626cd', defaultColor: '#b626cd' }
])

const emit = defineEmits<{
    (event: 'update:modelValue', value: Record<string, any>): void
}>()

//选择主题颜色
const selectThemeColor = (item: any) => {
    formData.value.themeColor = item.color
}
//表单数据
const formData = useVModel(props, 'modelValue', emit)

watch(() => formData.value.themeColorId, (val) => {
    const index = themeColors.value.findIndex(item => item.id === val)
    themeColors.value[index].color = formData.value.themeColor
})
</script>
