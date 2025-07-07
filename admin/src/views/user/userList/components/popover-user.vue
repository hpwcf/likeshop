<template>
    <div class="popover-input">
        <el-popover
            placement="top"
            v-model:visible="visible"
            :width="width"
            trigger="manual"
        >
            <div class="flex">
                <div class="popover-input__input m-r-10 flex-1">
                    <!-- select选择器-性别 -->
                    <el-select
                        v-if="changeType === 'sex'"
                        class="ls-select"
                        v-model="value"
                        placeholder="请选择性别"
                        size="mini"
                    >
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="2"></el-option>
                    </el-select>
                </div>
                <div class="popover-input__btns flex-none">
                    <el-button type="text"  @click="close"
                        >取消</el-button
                    >
                    <el-button type="primary"  @click="handleConfirm"
                        >确定</el-button
                    >
                </div>
            </div>
            <template #reference>
                <div class="inline" type="text" @click="open">
                    <slot></slot>
                </div>
            </template>
        </el-popover>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
    props: {
        modelValue: {
            type: String
        },
        type: {
            type: String,
            default: 'number',
        },
        changeType: {
            type: String
        },
        width: {
            type: Number,
            default: 250,
        },
        placeholder: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['confirm'],
    setup(props, { emit }) {
        const visible = ref(false)
        const value = ref<string | undefined>('')
        watch(() => props.modelValue,(curVal, preVal) => {
            value.value = curVal
        })
        const open = () => {
            if (props.disabled) return
            visible.value = true
        }
        const close = () => {
            visible.value = false
        }

        const handleConfirm = () => {
            if (value.value) {
                emit('confirm', value.value)
                value.value = ''
            }
            close()
        }
        return {
            visible,
            value,
            open,
            close,
            handleConfirm,
        }
    },
})
</script>


