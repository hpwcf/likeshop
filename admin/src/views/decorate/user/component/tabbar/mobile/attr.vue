<template>
    <el-card
        shadow="never"
        class="!border-none flex flex-1"
        :body-style="{ 'padding-right': '0' }"
        body-class="w-full"
    >
        <div
            class="title flex items-center before:w-[3px] before:h-[14px] before:block before:bg-primary before:mr-2"
        >
            底部导航设置
            <span class="form-tips ml-[10px] !mt-0"> 至少添加2个导航，最多添加5个导航 </span>
        </div>
        <el-form class="mt-4" label-width="70px">
            <el-tabs model-value="content">
                <el-tab-pane label="导航图片" name="content">
                    <div class="mb-[18px] max-w-[400px] pr-4">
                        <Draggable
                            class="draggable"
                            v-model="data.list"
                            animation="300"
                            draggable=".draggable"
                            handle=".drag-move"
                            :move="onMove"
                        >
                            <template v-slot:item="{ element, index }">
                                <del-wrap
                                    @close="handleDelete(index)"
                                    class="max-w-[400px]"
                                    :show-close="index !== 0"
                                    :class="{ draggable: index != 0 }"
                                >
                                    <div class="bg-fill-light w-full p-4 mt-4">
                                        <el-form-item label="导航图标">
                                            <material-picker
                                                v-model="element.unselected"
                                                upload-class="bg-body"
                                                exclude-domain
                                                size="60px"
                                            >
                                                <template #upload>
                                                    <div class="upload-btn w-[60px] h-[60px]">
                                                        <icon name="el-icon-Plus" :size="16"/>
                                                        <span class="text-xs leading-5"> 未选中 </span>
                                                    </div>
                                                </template>
                                            </material-picker>
                                            <material-picker
                                                v-model="element.selected"
                                                exclude-domain
                                                upload-class="bg-body"
                                                size="60px"
                                            >
                                                <template #upload>
                                                    <div class="upload-btn w-[60px] h-[60px]">
                                                        <icon name="el-icon-Plus" :size="16"/>
                                                        <span class="text-xs leading-5"> 选中 </span>
                                                    </div>
                                                </template>
                                            </material-picker>
                                        </el-form-item>
                                        <el-form-item label="导航名称">
                                            <el-input v-model="element.name" placeholder="请输入名称"/>
                                        </el-form-item>
                                        <el-form-item label="链接地址">
                                            <link-picker
                                                :is-tab="true"
                                                :disabled="index === 0"
                                                v-model="element.link"
                                            />
                                        </el-form-item>
                                        <el-form-item label="是否显示">
                                            <div class="flex-1 flex items-center">
                                                <el-switch
                                                    :disabled="index == 0"
                                                    v-model="element.is_show"
                                                    active-value="1"
                                                    inactive-value="0"
                                                    @change="handleShowChange(element)"
                                                />
                                                <div class="drag-move cursor-move ml-auto">
                                                    <icon name="el-icon-Rank" size="18"/>
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </div>
                                </del-wrap>
                            </template>
                        </Draggable>
                    </div>

                    <el-form-item v-if="data.list?.length < max" label-width="0">
                        <el-button type="primary" @click="handleAdd"> 添加导航</el-button>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="样式设置" name="styles">
                    <el-form-item label="默认颜色">
                        <color-picker
                            class="max-w-[400px]"
                            v-model="data.style.default_color"
                            default-color="#999999"
                        />
                    </el-form-item>
                    <el-form-item label="选中颜色">
                        <color-picker
                            class="max-w-[400px]"
                            v-model="data.style.selected_color"
                            default-color="#4173ff"
                        />
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>
<script lang="ts" setup>
import feedback from '@/utils/feedback'
import type {PropType} from 'vue'
import Draggable from 'vuedraggable'

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            list: [],
            style: {}
        })
    }
})
const emit = defineEmits<{
    (event: 'update:modelValue', value: any): void
}>()
const data = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const max = 5
const min = 2
const showTabbarList = computed(() => {
    return data.value.list?.filter((tab: any) => tab.is_show == '1') || []
})
const handleAdd = () => {
    if (data.value.list?.length < max) {
        data.value.list.push({
            name: '',
            selected: '',
            unselected: '',
            is_show: 1,
            link: {}
        })
    } else {
        feedback.msgError(`最多添加${max}个`)
    }
}
const handleDelete = (index: number) => {
    if (data.value.list?.length <= min) {
        return feedback.msgError(`最少保留${min}个`)
    }
    data.value.list.splice(index, 1)
}

const onMove = (e: any) => {
    if (e.relatedContext.index == 0) {
        return false
    }
    return true
}

const handleShowChange = (item: any) => {
    if (showTabbarList.value.length < min) {
        item.is_show = '1'
        return feedback.msgError(`最少显示${min}个`)
    }
}
</script>
