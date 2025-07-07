<template>
    <attritube-tabs title="标题栏">
        <template #content>
            <el-form label-width="70px" label-position="left" class="flex flex-col min-h-0 h-full">
                <el-card shadow="never" class="!border-none flex mt-[1px]" body-class="w-full">
                    <div class="flex items-end mb-4">
                        <div class="text-base text-[#101010] font-medium">主标题</div>
                    </div>
                    <div class="p-2">
                        <el-form-item label="主标题" class="mt-4">
                            <div class="flex-1">
                                <el-input
                                    v-model="contentData.title"
                                    maxlength="8"
                                    show-word-limit
                                    placeholder="请输入"
                                ></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="字体颜色" class="mt-4">
                            <div class="flex-1">
                                <color-picker v-model="styles.title_color" reset-color="#888888" />
                            </div>
                        </el-form-item>
                        <el-form-item label="字体大小">
                            <el-slider
                                v-model="styles.title_size"
                                :min="0"
                                :max="50"
                                :step="1"
                                :show-input="true"
                            ></el-slider>
                        </el-form-item>
                    </div>
                </el-card>

                <el-card shadow="never" class="!border-none flex mt-2" body-class="w-full">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">副标题</div>
                    </div>
                    <div class="p-2">
                        <el-form-item label="副标题" class="mt-4">
                            <div class="flex-1">
                                <el-input
                                    v-model="contentData.subtitle"
                                    maxlength="10"
                                    show-word-limit
                                    placeholder="请输入"
                                ></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="字体颜色" class="mt-4">
                            <div class="flex-1">
                                <color-picker
                                    v-model="styles.subtitle_color"
                                    reset-color="#888888"
                                />
                            </div>
                        </el-form-item>
                        <el-form-item label="字体大小">
                            <el-slider
                                v-model="styles.subtitle_size"
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
                    class="!border-none flex flex-1 mt-2 !rounded-b-lg"
                    body-class="flex-1"
                >
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">右侧按钮</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <div class="p-2">
                            <el-radio-group v-model="contentData.show_right_btn">
                                <el-radio :value="1">显示</el-radio>
                                <el-radio :value="0">隐藏</el-radio>
                            </el-radio-group>
                            <template v-if="contentData.show_right_btn">
                                <el-form-item label="文字内容" class="mt-4">
                                    <el-input
                                        v-model="contentData.btnText"
                                        maxlength="10"
                                        show-word-limit
                                        placeholder="请输入"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="按钮颜色" class="mt-4">
                                    <color-picker
                                        v-model="contentData.btnColor"
                                        reset-color="#888888"
                                    />
                                </el-form-item>
                                <el-form-item label="链接地址" class="mt-4">
                                    <link-picker v-model="contentData.link" />
                                </el-form-item>
                            </template>
                        </div>
                    </div>
                </el-card>
            </el-form>
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

import AddNav from '../../add-nav.vue'
import AttritubeTabs from '../../attritube-tabs.vue'
import type options from './options'

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
