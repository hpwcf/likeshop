<template>
    <attritube-tabs title="导航菜单">
        <template #content>
            <el-form label-width="70px" class="flex flex-col min-h-0 h-full">
                <el-card shadow="never" class="!border-none flex mt-[1px]" body-class="w-full">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">导航样式</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <el-radio-group v-model="content.navigator_type">
                            <el-radio :label="1" size="large" border>图+文</el-radio>
                            <el-radio :label="2" size="large" border>图片</el-radio>
                            <el-radio :label="3" size="large" border>文字</el-radio>
                        </el-radio-group>
                    </div>
                </el-card>
                <el-card shadow="never" class="!border-none flex mt-2" body-class="flex-1">
                    <div class="flex items-end mb-4">
                        <div class="text-base text-[#101010] font-medium">展示样式</div>
                    </div>
                    <el-radio-group v-model="contentData.style">
                        <el-radio :label="1">固定显示</el-radio>
                        <el-radio :label="2">分页滑动</el-radio>
                    </el-radio-group>
                    <el-form-item label="每行数量" class="mt-4">
                        <el-select v-model="contentData.per_line">
                            <el-option
                                v-for="item in 5"
                                :key="item"
                                :label="item + '个'"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="显示行数">
                        <el-select v-model="contentData.show_line">
                            <el-option
                                v-for="item in 2"
                                :key="item"
                                :label="item + '行'"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                </el-card>
                <el-card
                    shadow="never"
                    class="!border-none flex-1 mt-2 !rounded-b-lg"
                    body-class="flex flex-col h-full min-h-0"
                >
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">菜单设置</div>
                        <div class="text-xs text-tx-secondary ml-2">建议图片尺寸：100px*100px</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <AddNav v-model="contentData.data" />
                    </div>
                </el-card>
            </el-form>
        </template>

        <template #styles>
            <el-form label-width="70px" label-position="left" class="flex flex-col min-h-0 h-full">
                <el-card shadow="never" class="!border-none flex mt-[1px]" body-class="w-full">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">底部背景</div>
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
                        <el-form-item label="文字颜色" class="mt-4">
                            <div class="flex-1">
                                <color-picker v-model="styles.text_color" reset-color="#333333" />
                            </div>
                        </el-form-item>
                    </div>
                </el-card>
                <el-card shadow="never" class="!border-none flex mt-2" body-class="w-full">
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
                <el-card
                    shadow="never"
                    class="!border-none flex flex-1 mt-2"
                    body-class="w-full flex-1"
                >
                    <div class="flex items-end mb-4">
                        <div class="text-base text-[#101010] font-medium">圆角设置</div>
                    </div>
                    <div class="flex-1">
                        <el-form-item label="上圆角">
                            <el-slider
                                v-model="styles.border_top_radius"
                                :min="0"
                                :max="40"
                                :step="1"
                                :show-input="true"
                            ></el-slider>
                        </el-form-item>
                        <el-form-item label="下圆角">
                            <el-slider
                                v-model="styles.border_bottom_radius"
                                :min="0"
                                :max="40"
                                :step="1"
                                :show-input="true"
                            ></el-slider>
                        </el-form-item>
                        <el-form-item label="图片圆角">
                            <el-slider
                                v-model="styles.image_radius"
                                :min="0"
                                :max="40"
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

import AddNav from '../../add-nav.vue'
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
