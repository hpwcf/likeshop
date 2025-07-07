<template>
    <u-upload
        ref="uUploadRef"
        :file-list="fileList"
        :action="action"
        v-bind="props"
        :header="headers"
        @on-success="onSuccess"
        @on-uploaded="onUploaded"
        @on-progress="onProgress"
        @on-remove="onRemove"
    >
        <slot name="addBtn" />
    </u-upload>
</template>

<script setup lang="ts">
import config from '@/config'
import { RequestCodeEnum } from '@/enums/requestEnums'
import { computed, ref, shallowRef, watch } from 'vue'
import { useUserStore } from '@/stores/user'
const props = withDefaults(
    defineProps<{
        modelValue: string | string[]
        maxCount?: number
        width?: number | string
        height?: number | string
        customBtn?: boolean
        disabled?: boolean
        header?: Record<string, any>
        formData?: Record<string, any>
        name?: string
        multiple?: boolean
        deletable?: boolean
        withName: boolean
    }>(),
    {
        maxCount: 1,
        width: 180,
        height: 180,
        customBtn: false,
        disabled: false,
        header: () => ({}),
        formData: () => ({}),
        name: 'file',
        multiple: true,
        deletable: true,
        withName: false
    }
)

const emit = defineEmits<{
    (event: 'update:modelValue', modelValue: string | string[]): void
}>()

const uUploadRef = shallowRef()
const userStore = useUserStore()
const action = `${config.baseUrl}${config.urlPrefix}/upload/image`
const fileList = ref<any[]>([])
const headers = computed(() => ({
    token: userStore.token,
    version: config.version,
    ...props.header
}))
const onSuccess = (data: any, index: number, list: any[]) => {
    if (data.code !== RequestCodeEnum.SUCCESS) {
        list[index].progress = 0
        list[index].error = true
        uni.$u.toast(data.msg)
    } else {
        const url = data.data?.uri
        let result = url
        if (!props.withName) {
            if (props.maxCount <= 1) {
                result = url
            } else if (Array.isArray(props.modelValue)) {
                result = [...props.modelValue, url]
            } else {
                result = [url]
            }
        } else {
            result = [...props.modelValue, { url, name: data.data?.name }]
        }
        emit('update:modelValue', result)
    }
}
const isUploading = ref(false)
const onProgress = () => {
    isUploading.value = true
}
const onUploaded = () => {
    isUploading.value = false
}
const onRemove = (index: number) => {
    if (props.maxCount <= 1) {
        emit('update:modelValue', '')
    } else {
        if (Array.isArray(props.modelValue)) {
            const newValue = props.modelValue
            newValue.splice(index, 1)
            emit('update:modelValue', newValue)
        }
    }
}

watch(
    () => props.modelValue,
    (value) => {
        if (!value || isUploading.value) return
        uUploadRef.value?.clear()
        if (!props.withName) {
            if (Array.isArray(value)) {
                fileList.value = value.map((url) => ({ url }))
            } else if (typeof value === 'string') {
                fileList.value = [{ url: value }]
            }
        } else {
            console.log(value)
            fileList.value = (value as []).map((item: any) => {
                return { url: item.url }
            })
            // fileList.value = value.map((item) => {
            //     item.url
            // })
        }
    },
    {
        immediate: true
    }
)
</script>
