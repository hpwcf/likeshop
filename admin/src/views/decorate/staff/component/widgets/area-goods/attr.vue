<template>
    <attritube-tabs title="区域商品">
        <template #content>
            <el-form label-width="80px" label-position="left" class="flex flex-col min-h-0 h-full">
                <el-card shadow="never" class="!border-none flex mt-[1px]" body-class="w-full">
                    <div class="flex items-end mb-4">
                        <div class="text-base text-[#101010] font-medium">选择商品</div>
                    </div>
                    <div class="bg-page py-2 px-4 rounded-lg">
                        <el-form-item label="添加商品" class="py-2" style="margin-bottom: 0px">
                            <div class="flex-1">
                                <div>
                                    <el-radio-group v-model="contentData.style">
                                        <el-radio :label="1">自动获取</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="显示数量" style="margin-bottom: 10px" class="mt-4">
                            <el-slider
                                v-model="contentData.show_num"
                                :min="1"
                                :max="50"
                                :step="1"
                                :show-input="true"
                                class="w-[250px]"
                            ></el-slider>
                        </el-form-item>
                    </div>
                </el-card>

                <el-card shadow="never" class="!border-none flex mt-2" body-class="w-full">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">商品风格</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <el-radio-group v-model="contentData.goods_type">
                            <el-radio class="!mr-2" :label="1" size="large" border>单列</el-radio>
                            <el-radio class="!mr-2" :label="2" size="large" border>两列</el-radio>
                            <el-radio class="!mr-2" :label="3" size="large" border
                                >横向滑动</el-radio
                            >
                            <el-radio :label="4" size="large" border>大图模式</el-radio>
                        </el-radio-group>
                    </div>
                </el-card>

                <el-card shadow="never" class="!border-none flex mt-2" body-class="w-full">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">显示内容</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <div class="flex gap-x-4">
                            <el-checkbox
                                v-model="contentData.show_title"
                                label="商品标题"
                                :true-value="1"
                                :false-value="0"
                            />
                            <color-picker v-model="styles.title_color" reset-color="#000000" />
                        </div>
                        <div class="flex gap-x-4 mt-8">
                            <el-checkbox
                                v-model="contentData.show_server"
                                label="服务时间"
                                :true-value="1"
                                :false-value="0"
                            />
                            <color-picker v-model="styles.server_color" reset-color="#888888" />
                        </div>
                        <div class="flex gap-x-4 mt-8">
                            <el-checkbox
                                v-model="contentData.show_price"
                                label="商品价格"
                                :true-value="1"
                                :false-value="0"
                            />
                            <color-picker v-model="styles.price_color" reset-color="#fc5447" />
                        </div>
                        <div class="flex gap-x-4 mt-8">
                            <el-checkbox
                                v-model="contentData.show_scribing_price"
                                label="划线价格"
                                :true-value="1"
                                :false-value="0"
                            />
                            <color-picker
                                v-model="styles.scribing_price_color"
                                reset-color="#888888"
                            />
                        </div>
                        <div class="flex gap-x-4 mt-8">
                            <el-checkbox
                                v-model="contentData.show_sales"
                                label="商品销量"
                                :true-value="1"
                                :false-value="0"
                            />
                            <color-picker v-model="styles.sales_color" reset-color="#888888" />
                        </div>
                    </div>
                </el-card>

                <el-card
                    shadow="never"
                    class="!border-none flex flex-1 mt-2"
                    body-class="w-full flex-1"
                >
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">购买按钮</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <el-form-item label="按钮文字">
                            <el-input
                                v-model="contentData.btn_text"
                                maxlength="4"
                                show-word-limit
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="按钮圆角" class="mt-8">
                            <el-slider
                                v-model="styles.btn_radius"
                                :min="0"
                                :max="50"
                                :step="1"
                                :show-input="true"
                                class="w-[250px]"
                            ></el-slider>
                        </el-form-item>
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
                    </div>
                </el-card>
                <el-card shadow="never" class="!border-none flex mt-2" body-class="w-full">
                    <div class="flex items-end mb-4">
                        <div class="text-base text-[#101010] font-medium">边距</div>
                    </div>
                    <div class="flex-1">
                        <el-form-item label="商品上下间距" label-width="100">
                            <el-slider
                                v-model="styles.goods_vertical"
                                :min="0"
                                :max="50"
                                :step="1"
                                :show-input="true"
                            ></el-slider>
                        </el-form-item>
                        <el-form-item label="商品左右间距" label-width="100">
                            <el-slider
                                v-model="styles.goods_horizontal"
                                :min="0"
                                :max="50"
                                :step="1"
                                :show-input="true"
                            ></el-slider>
                        </el-form-item>
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
                        <el-form-item label="按钮圆角">
                            <el-slider
                                v-model="styles.btn_radius"
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

console.log(contentData.value)
</script>

<style lang="scss" scoped></style>
