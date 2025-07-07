<template>
    <attritube-tabs title="用户信息">
        <el-form label-width="70px" class="flex flex-col min-h-0 h-full">
            <el-card shadow="never" class="!border-none flex flex-1" body-class="flex-1">
                <div class="flex items-end mb-4">
                    <div class="text-base text-[#101010] font-medium">用户信息</div>
                </div>

                <el-form-item label="个人信息" class="mt-4">
                    <el-radio-group v-model="contentData.user_info">
                        <el-radio :label="1">用户ID</el-radio>
                        <el-radio :label="2">手机号</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- <el-form-item label="个人信息">
                    <el-checkbox-group v-model="contentData.content">
                        <el-checkbox label="关注技师" value="value1" />
                        <el-checkbox label="收藏项目" value="value2" />
                        <el-checkbox label="关注店铺" value="value3" />
                    </el-checkbox-group>
                </el-form-item> -->
            </el-card>
        </el-form>
    </attritube-tabs>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'

import type options from './options'
import AttritubeTabs from '../../attritube-tabs.vue'

const emits = defineEmits<(event: 'update:content', data: OptionsType['content']) => void>()
type OptionsType = ReturnType<typeof options>
const props = defineProps({
    content: {
        type: Object as PropType<OptionsType['content']>,
        default: () => ({})
    },
    styles: {
        type: Object as PropType<OptionsType['styles']>,
        default: () => ({})
    }
})

const contentData = computed({
    get: () => props.content,
    set: (newValue) => {
        emits('update:content', newValue)
    }
})
</script>

<style lang="scss" scoped></style>
