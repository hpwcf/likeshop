<template>
    <attritube-tabs title="搜索">
        <template #content>
            <div class="flex flex-col min-h-0 h-full">
                <el-card shadow="never" class="!border-none flex mt-[1px]" body-class="w-full">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">文字位置</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <el-radio-group v-model="styles.align">
                            <el-radio label="left" size="large" border>居左</el-radio>
                            <el-radio label="center" size="large" border>居中</el-radio>
                        </el-radio-group>
                    </div>
                </el-card>

                <el-card
                    shadow="never"
                    class="!border-none flex flex-1 mt-2 h-full !rounded-b-lg"
                    body-class="w-full h-full "
                >
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">搜索内容</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <el-form-item label="提示文字">
                            <el-input
                                v-model="contentData.placeholder"
                                maxlength="12"
                                show-word-limit
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </div>
                </el-card>
            </div>
        </template>

        <template #styles>
            <el-form label-width="70px" label-position="left" class="flex flex-col min-h-0 h-full">
                <el-card shadow="never" class="!border-none flex mt-[1px]" body-class="w-full">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">颜色设置</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <el-form-item label="底部背景" class="mt-4">
                            <div class="flex-1">
                                <color-picker v-model="styles.root_bg_color" reset-color="" />
                            </div>
                        </el-form-item>
                        <el-form-item label="组件背景" class="mt-4">
                            <div class="flex-1">
                                <color-picker
                                    v-model="styles.component_bg_color"
                                    reset-color="#ffffff"
                                />
                            </div>
                        </el-form-item>
                        <el-form-item label="图标颜色" class="mt-4">
                            <div class="flex-1">
                                <color-picker v-model="styles.icon_color" reset-color="#888888" />
                            </div>
                        </el-form-item>
                        <el-form-item label="文字颜色" class="mt-4">
                            <div class="flex-1">
                                <color-picker v-model="styles.text_color" reset-color="#888888" />
                            </div>
                        </el-form-item>
                    </div>
                </el-card>
                <el-card
                    shadow="never"
                    class="!border-none flex flex-1 mt-2"
                    body-class="w-full flex-1"
                >
                    <div class="flex items-end mb-4">
                        <div class="text-base text-[#101010] font-medium">边距设置</div>
                    </div>
                    <div class="flex-1">
                        <el-form-item label="上边距">
                            <el-slider
                                v-model="styles.padding_top"
                                :min="0"
                                :max="50"
                                :step="1"
                                :show-input="true"
                            ></el-slider>
                        </el-form-item>
                        <el-form-item label="下边距">
                            <el-slider
                                v-model="styles.padding_bottom"
                                :min="0"
                                :max="50"
                                :step="1"
                                :show-input="true"
                            ></el-slider>
                        </el-form-item>
                        <el-form-item label="左右边距">
                            <el-slider
                                v-model="styles.padding_horizontal"
                                :min="0"
                                :max="50"
                                :step="1"
                                :show-input="true"
                            ></el-slider>
                        </el-form-item>
                    </div>
                </el-card>
            </el-form>
        </template>
    </attritube-tabs>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'

import type options from './options'
import AttritubeTabs from '../../attritube-tabs.vue'

type OptionsType = ReturnType<typeof options>
const emits = defineEmits<(event: 'update:content', data: OptionsType['content']) => void>()
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
