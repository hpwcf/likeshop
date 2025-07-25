<template>
    <div>
        <el-form label-width="70px">
            <el-card shadow="never" class="!border-none flex mt-2">
                <div class="flex items-end">
                    <div class="text-base text-[#101010] font-medium">图片设置</div>
                    <div class="text-xs text-tx-secondary ml-2">
                        最多添加5张，建议图片尺寸：750px*200px
                    </div>
                </div>
                <div class="flex-1">
                    <draggable
                        class="draggable"
                        v-model="contentData.data"
                        animation="300"
                        handle=".drag-move"
                    >
                        <template v-slot:item="{ element: item, index }">
                            <del-wrap :key="index" @close="handleDelete(index)" class="w-full">
                                <div class="bg-fill-light w-full p-4 mt-4">
                                    <material-picker
                                        width="396px"
                                        height="196px"
                                        v-model="item.image"
                                        upload-class="bg-body"
                                        exclude-domain
                                    />
                                    <div class="flex-1">
                                        <el-form-item class="mt-[18px]" label="图片链接">
                                            <LinkPickerStaff
                                                v-if="type == 'mobile'"
                                                v-model="item.link"
                                            />
                                            <el-input
                                                v-if="type == 'pc'"
                                                placeholder="请输入链接"
                                                v-model="item.link.path"
                                            />
                                        </el-form-item>
                                        <el-form-item label="是否显示" class="mt-[18px] !mb-0">
                                            <div class="flex-1 flex items-center">
                                                <el-switch
                                                    v-model="item.is_show"
                                                    active-value="1"
                                                    inactive-value="0"
                                                />
                                                <div class="drag-move cursor-move ml-auto">
                                                    <icon name="el-icon-Rank" size="18" />
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </div>
                                </div>
                            </del-wrap>
                        </template>
                    </draggable>
                </div>
                <div class="mt-4" v-if="content.data?.length < limit">
                    <el-button class="w-full" type="primary" @click="handleAdd">添加图片</el-button>
                </div>
            </el-card>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import type { PropType } from 'vue'
import Draggable from 'vuedraggable'

import feedback from '@/utils/feedback'

import type options from './options'

const limit = 5
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
    },
    type: {
        type: String as PropType<'mobile' | 'pc'>,
        default: 'mobile'
    }
})

const contentData = computed({
    get: () => props.content,
    set: (newValue) => {
        emits('update:content', newValue)
    }
})

const handleAdd = () => {
    if (props.content.data?.length < limit) {
        const content = cloneDeep(props.content)
        content.data.push({
            is_show: '1',
            image: '',
            name: '',
            link: {}
        })
        emits('update:content', content)
    } else {
        feedback.msgError(`最多添加${limit}张图片`)
    }
}
const handleDelete = (index: number) => {
    if (props.content.data?.length <= 1) {
        return feedback.msgError('最少保留一张图片')
    }
    const content = cloneDeep(props.content)
    content.data.splice(index, 1)
    emits('update:content', content)
}
</script>

<style lang="scss" scoped></style>
