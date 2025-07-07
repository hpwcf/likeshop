<template>
    <el-scrollbar class="pages-preview-container">
        <div v-if="pageMeta !== null" class="absolute right-4 top-4" @click="handleClickPageMeta">
            <el-button>页面设置</el-button>
        </div>
        <div class="shadow mx-[30px] pages-preview" :style="[bodyStyle]">
            <div class="pages-preview-header">
                <div class="phone-title text-lg font-medium">
                    <div v-if="meta.title_type == 1">
                        <span :style="{ color: meta.text_color == 1 ? '#ffffff' : '#000000' }">
                            {{ meta?.title || '页面' }}
                        </span>
                    </div>
                    <img v-else-if="meta.title_type == 2" :src="meta?.title_img" class="h-[20px]" />
                </div>
            </div>
            <div
                v-for="(widget, index) in pageData"
                :key="widget.id"
                class="relative"
                :class="{
                    'cursor-pointer': !widget?.disabled
                }"
                @click="handleClick(widget, index)"
            >
                <!--  选中的边框  -->
                <div
                    class="absolute w-full h-full z-[100] border-dashed"
                    :class="{
                        select: index == modelValue,
                        hide: canShowCom(widget.content),
                        'border-[transparent] border-2': !widget?.disabled
                    }"
                ></div>
                <!--  选中的组件  -->
                <slot>
                    <component
                        :is="widgets[widget?.name]?.content"
                        :content="widget.content"
                        :styles="widget.styles"
                        :key="widget.id"
                    />
                </slot>
                <!--  部件操作按钮组  -->
                <div class="widget-btns py-[5px]" v-if="index == modelValue">
                    <div>
                        <el-tooltip
                            effect="dark"
                            :content="canShowCom(widget.content) ? '显示' : '隐藏'"
                            placement="right"
                        >
                            <el-button
                                class="py-[5px]"
                                type="primary"
                                :icon="canShowCom(widget.content) ? View : Hide"
                                @click="changeShowCom(widget.content)"
                            />
                        </el-tooltip>
                    </div>
                    <div>
                        <el-tooltip effect="dark" content="复制" placement="right">
                            <el-button
                                class="py-[5px]"
                                type="primary"
                                :icon="CopyDocument"
                                @click.stop="copyArray(index, index)"
                            />
                        </el-tooltip>
                    </div>
                    <div>
                        <el-tooltip effect="dark" content="删除" placement="right">
                            <el-button
                                class="py-[5px]"
                                type="primary"
                                :icon="Delete"
                                @click.stop="deleteArray(index)"
                            />
                        </el-tooltip>
                    </div>
                    <div>
                        <el-tooltip effect="dark" content="上移" placement="right">
                            <el-button
                                class="py-[5px]"
                                type="primary"
                                :icon="ArrowUpBold"
                                :disabled="canMoveUpCom(index)"
                                @click.stop="rearrangeArray(index, index - 1)"
                            />
                        </el-tooltip>
                    </div>
                    <div>
                        <el-tooltip effect="dark" content="下移" placement="right">
                            <el-button
                                class="py-[5px]"
                                type="primary"
                                :icon="ArrowDownBold"
                                :disabled="canMoveDownCom(index)"
                                @click.stop="rearrangeArray(index, index + 1)"
                            />
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>

<script lang="ts" setup>
import {
    ArrowDownBold,
    ArrowUpBold,
    Hide,
    View,
    CopyDocument,
    Delete
} from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import { ref, computed } from 'vue'
import widgets from '../widgets'
import feedback from '@/utils/feedback'

const props = defineProps({
    pageMeta: {
        type: Object as any,
        default: () => null
    },
    pageData: {
        type: Array as PropType<any[]>,
        default: () => []
    },
    modelValue: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits<{
    (event: 'update:modelValue', value: number): void
    (event: 'updatePageData', value: any[]): void
}>()

const oldModelValue = ref<number>(-1)

const meta = computed(() => {
    if (Array.isArray(props.pageMeta)) {
        return props.pageMeta[0].content || {}
    }
    return {}
})

const bodyStyle = computed(() => {
    const { bg_color, bg_image, bg_type } = meta.value
    switch (bg_type) {
        case '1':
            return { 'background-color': bg_color }
        case '2':
            return { 'background-image': `url(${bg_image})` }
        default:
            return {}
    }
})

const handleClickPageMeta = () => {
    if (props.modelValue === -1) {
        emit('update:modelValue', oldModelValue.value)
    } else {
        oldModelValue.value = props.modelValue
        emit('update:modelValue', -1)
    }
}

const handleClick = (widget: any, index: number) => {
    if (widget.disabled) return
    emit('update:modelValue', index)
}

// 是否可以移动组件
const canMoveUpCom = computed(() => {
    return (index: number) => {
        return index === 0
    }
})

// 是否可以移动组件
const canMoveDownCom = computed(() => {
    return (index: number) => {
        return props.pageData?.length === index + 1
    }
})

// 是否显示组件
const canShowCom = computed(() => {
    return (data: any) => {
        return data?.enabled == 0
    }
})

// 修改组件显示/隐藏
const changeShowCom = (data: any) => {
    if (data.enabled === undefined) return
    data.enabled = data.enabled ? 0 : 1
}

const rearrangeArray = (currentIdx: number, targetIdx: number) => {
    if (
        currentIdx < 0 ||
        currentIdx >= props.pageData.length ||
        targetIdx < 0 ||
        targetIdx >= props.pageData.length
    ) {
        return
    }

    const newPageData = cloneDeep(props.pageData)
    const element = newPageData.splice(currentIdx, 1)[0]
    newPageData.splice(targetIdx, 0, element)

    emit('updatePageData', newPageData)
    emit('update:modelValue', targetIdx)
}

const copyArray = (currentIdx: number, targetIdx: number) => {
    if (
        currentIdx < 0 ||
        currentIdx >= props.pageData.length ||
        targetIdx < 0 ||
        targetIdx >= props.pageData.length
    ) {
        return
    }

    const newPageData = cloneDeep(props.pageData)
    const element = cloneDeep(newPageData[currentIdx])
    newPageData.splice(targetIdx, 0, element)

    console.log(newPageData)

    emit('updatePageData', newPageData)
    emit('update:modelValue', targetIdx)
}

const deleteArray = async (index: number) => {
    const filterDel = props.pageData.filter((item: any) => item.name === props.pageData[index].name)
    if (filterDel.length > 1) {
        await feedback.confirm(`确定要删除当前组件吗？`)
    } else {
        feedback.msgError('不能删除最后一个组件, 如需可以隐藏此组件。')
        return
    }

    const newPageData = cloneDeep(props.pageData)
    newPageData.splice(index, 1)

    emit('updatePageData', newPageData)
    emit('update:modelValue', index > 0 ? index - 1 : 0)
}
</script>

<style lang="scss" scoped>
.pages-preview-container {
    position: relative;
    :deep(.el-scrollbar__wrap) {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .pages-preview {
        background-color: #f8f8f8;
        background-repeat: no-repeat;
        background-size: 100% auto;
        width: 360px;
        min-height: 615px;
        color: #333;

        .pages-preview-header {
            overflow: hidden;
            cursor: pointer;
            background: url('../../image/phone_header.png') no-repeat;
            background-repeat: no-repeat;
            background-size: 100% auto;
            width: 100%;
            height: 95px;
            box-sizing: border-box;
            .phone-title {
                display: flex;
                justify-content: center;
                align-content: center;
                margin-top: 48px;
                padding-top: 10px;
            }
        }

        .select {
            @apply border-primary border-solid;
        }

        .hide::before {
            content: '已隐藏';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 14px;
            background-color: rgba(0, 0, 0, 0.4);
        }

        .widget-btns {
            position: absolute;
            top: 10px;
            right: -60px;
            overflow: hidden;

            width: 46px;
            border-radius: 8px;
            @apply bg-primary;

            :deep(.el-button) {
                width: 46px;
                border-radius: 0;
            }
        }
    }
}
</style>
