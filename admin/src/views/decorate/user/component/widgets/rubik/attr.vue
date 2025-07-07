<template>
    <attritube-tabs title="图片魔方">
        <template #content>
            <el-form label-width="70px" label-position="left" class="flex flex-col min-h-0 h-full">
                <el-card shadow="never" class="!border-none flex mt-[1px]" body-class="w-full">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">图片风格</div>
                    </div>
                    <div class="flex-1">
                        <style-chose v-model="contentData.style" :data="styleData"/>
                    </div>
                </el-card>
                <el-card shadow="never" class="!border-none flex mt-2" body-class="w-full">
                    <div class="flex items-end mb-4">
                        <div class="text-base text-[#101010] font-medium">图片布局</div>
                    </div>
                    <div class="flex-1">
                        <cube-layout v-model="contentData.data" :facade="content.style" @change="currentChange"/>
                    </div>
                </el-card>

                <el-card shadow="never" class="flex-1 !border-none flex mt-2" body-class="flex-1 rounded-t-lg">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">图片设置</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <div style="background: #f9f9f9" class="flex items-center p-6 rounded-xl">
                            <div class="flex">
                                <material-picker
                                    width="80px"
                                    height="80px"
                                    :limit="1"
                                    v-model="currentData.url"
                                    upload-class="bg-body"
                                    exclude-domain
                                />
                            </div>
                            <div class="flex-1">
                                <link-picker class="flex-1" v-model="currentData.link"/>
                            </div>
                        </div>
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
                                <color-picker v-model="styles.root_bg_color" reset-color=""/>
                            </div>
                        </el-form-item>
                    </div>
                </el-card>
                <el-card shadow="never" class="!border-none flex mt-2" body-class="w-full">
                    <div class="flex items-end mb-4">
                        <div class="text-base text-[#101010] font-medium">边距设置</div>
                    </div>
                    <div class="flex-1">
                        <el-form-item label="图片间距">
                            <el-slider
                                v-model="styles.image_gap"
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

                <el-card shadow="never" class="flex-1 !border-none flex mt-2 !rounded-b-lg" body-class="flex-1">
                    <div class="flex items-end">
                        <div class="text-base text-[#101010] font-medium">圆角设置</div>
                    </div>
                    <div class="flex-1 mt-4">
                        <el-form-item label="上圆角">
                            <el-slider
                                v-model="styles.border_top_radius"
                                :min="0"
                                :max="50"
                                :step="1"
                                :show-input="true"
                            ></el-slider>
                        </el-form-item>
                        <el-form-item label="下圆角">
                            <el-slider
                                v-model="styles.border_bottom_radius"
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
import type {PropType} from 'vue'
import type options from './options'

import StyleChose from './style-chose.vue'
import CubeLayout from './cube-layout.vue'
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

const active = ref<string>('content')
const current = ref<number>(0)
const styleData = [
    {
        name: '一行1个',
        value: 1,
        num: 1
    },
    {
        name: '一行2个',
        value: 2,
        num: 2
    },
    {
        name: '一行3个',
        value: 3,
        num: 3
    },
    {
        name: '左1右2',
        value: 4,
        num: 3
    },
    {
        name: '左2右2',
        value: 5,
        num: 4
    },
    {
        name: '上1下2',
        value: 6,
        num: 3
    }
]

const currentData = computed(() => {
    const index = current.value
    if (props.content.data.length > 0) {
        return contentData.value.data[index]
    }
})

const contentData = computed({
    get: () => props.content,
    set: (newValue) => {
        emits('update:content', newValue)
    }
})

const currentChange = (val: number) => {
    current.value = val
}

const handleArray = (num: number) => {
    const data = JSON.parse(JSON.stringify(props.content.data))
    const array = []
    for (let i = 0; i < num; i++) {
        if (data[i]) {
            array.push(data[i])
        } else {
            array.push({
                url: '',
                link: {}
            })
        }
    }
    return array
}

watch(() => props.content.style, (val) => {
    current.value = 0
    const num = styleData.find(item => item.value == val)?.num || 1
    contentData.value.data = handleArray(num)
})

</script>

<style lang="scss" scoped>
.tabs-header {
    height: 34px;
    line-height: 34px;
    background: #f5f5f5;
    border-radius: 50px;

    &__item {
        flex: 1;
        text-align: center;
        cursor: pointer;
        padding: 0 28px;

        &.active {
            border-radius: 50px;
            color: #fff;
            @apply bg-primary;
        }
    }
}
</style>
