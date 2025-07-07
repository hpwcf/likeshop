<template>
    <attritube-tabs title="我的订单">
        <el-form label-width="70px" class="flex flex-col min-h-0 h-full">
            <el-card shadow="never" class="!border-none flex">
                <el-form-item label="标题" style="margin-bottom: 0;">
                    <el-input class="w-[396px]" v-model="contentData.title"/>
                </el-form-item>
            </el-card>
            <el-card shadow="never" class="!border-none flex flex-1 mt-2" body-class="flex-1">
                <div class="flex items-end mb-4">
                    <div class="text-base text-[#101010] font-medium">待支付</div>
                </div>
                <div class="flex flex-1 mt-4 bg-page rounded-xl p-4">
                    <material-picker
                        v-model="contentData.pay_icon"
                        upload-class="bg-body"
                        size="60px"
                        exclude-domain
                    >
                        <template #upload>
                            <div class="upload-btn w-[60px] h-[60px]">
                                <icon name="el-icon-Plus" :size="20" />
                            </div>
                        </template>
                    </material-picker>
                    <div>
                        <div class="flex items-center flex-1">
                            <span class="text-tx-regular flex-none mr-3">名称</span>
                            <el-input
                                maxlength="6"
                                show-word-limit
                                v-model="contentData.pay_name"
                                style="width: 100%"
                                placeholder="请输入名称"
                            />
                        </div>
                        <div class="flex items-center">
                            <span class="text-tx-regular flex-none mr-3">状态</span>
                            <el-switch v-model="contentData.pay_show" :active-value="1" :inactive-value="0" />
                        </div>
                    </div>
                </div>

                <div class="flex items-end my-4">
                    <div class="text-base text-[#101010] font-medium">预约中</div>
                </div>
                <div class="flex flex-1 mt-4 bg-page rounded-xl p-4">
                    <material-picker
                        v-model="contentData.subscribe_icon"
                        upload-class="bg-body"
                        size="60px"
                        exclude-domain
                    >
                        <template #upload>
                            <div class="upload-btn w-[60px] h-[60px]">
                                <icon name="el-icon-Plus" :size="20" />
                            </div>
                        </template>
                    </material-picker>
                    <div>
                        <div class="flex items-center flex-1">
                            <span class="text-tx-regular flex-none mr-3">名称</span>
                            <el-input
                                maxlength="6"
                                show-word-limit
                                v-model="contentData.subscribe_name"
                                style="width: 100%"
                                placeholder="请输入名称"
                            />
                        </div>
                        <div class="flex items-center">
                            <span class="text-tx-regular flex-none mr-3">状态</span>
                            <el-switch v-model="contentData.subscribe_show" :active-value="1" :inactive-value="0" />
                        </div>
                    </div>
                </div>

                <div class="flex items-end my-4">
                    <div class="text-base text-[#101010] font-medium">服务中</div>
                </div>
                <div class="flex flex-1 mt-4 bg-page rounded-xl p-4">
                    <material-picker
                        v-model="contentData.service_icon"
                        upload-class="bg-body"
                        size="60px"
                        exclude-domain
                    >
                        <template #upload>
                            <div class="upload-btn w-[60px] h-[60px]">
                                <icon name="el-icon-Plus" :size="20" />
                            </div>
                        </template>
                    </material-picker>
                    <div>
                        <div class="flex items-center flex-1">
                            <span class="text-tx-regular flex-none mr-3">名称</span>
                            <el-input
                                maxlength="6"
                                show-word-limit
                                v-model="contentData.service_name"
                                style="width: 100%"
                                placeholder="请输入名称"
                            />
                        </div>
                        <div class="flex items-center">
                            <span class="text-tx-regular flex-none mr-3">状态</span>
                            <el-switch v-model="contentData.service_show" :active-value="1" :inactive-value="0" />
                        </div>
                    </div>
                </div>

                <div class="flex items-end my-4">
                    <div class="text-base text-[#101010] font-medium">已完成</div>
                </div>
                <div class="flex flex-1 mt-4 bg-page rounded-xl p-4">
                    <material-picker
                        v-model="contentData.completed_icon"
                        upload-class="bg-body"
                        size="60px"
                        exclude-domain
                    >
                        <template #upload>
                            <div class="upload-btn w-[60px] h-[60px]">
                                <icon name="el-icon-Plus" :size="20" />
                            </div>
                        </template>
                    </material-picker>
                    <div>
                        <div class="flex items-center flex-1">
                            <span class="text-tx-regular flex-none mr-3">名称</span>
                            <el-input
                                maxlength="6"
                                show-word-limit
                                v-model="contentData.completed_name"
                                style="width: 100%"
                                placeholder="请输入名称"
                            />
                        </div>
                        <div class="flex items-center">
                            <span class="text-tx-regular flex-none mr-3">状态</span>
                            <el-switch v-model="contentData.completed_show" :active-value="1" :inactive-value="0" />
                        </div>
                    </div>
                </div>
            </el-card>
        </el-form>
    </attritube-tabs>
</template>
<script lang="ts" setup>
import type {PropType} from 'vue'
import type options from './options'

type OptionsType = ReturnType<typeof options>

import AddNav from '../../add-nav.vue'
import AttritubeTabs from '../../attritube-tabs.vue'

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
