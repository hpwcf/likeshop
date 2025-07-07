<template>
    <div class="w-[250px] ">
        <div class="flex flex-wrap gap-[20px]">
            <div
                class="w-[70px] h-[50px] flex items-center text-[14px] shadow rounded-lg cursor-pointer overflow-hidden"
                :class="{
                    'is-select': selectId == item.id,
                     unselect: selectId != item.id
                }"
                v-for="(item, index) in themeColors"
                :key="index"
                @click="handleSelect(item)"
            >
                <div
                    class="w-full h-full"
                    :style="`background: ${item.defaultColor}`"
                ></div>

            </div>
        </div>

        <!-- 动态生成的深浅色梯度展示 -->
        <div class="w-full rounded-lg overflow-hidden mt-6 cursor-pointer">
            <template v-for="(shade, index) in colorShades" :key="index">
                <div
                    class="flex items-center justify-end w-full h-[50px] pr-4"
                    :style="`background: ${shade.color}`"
                    @click="handleSelectItemColor(shade)"
                >
                    <Icon
                        v-if="selectId == shade.id && shade.color == selectColor"
                        name="el-icon-SuccessFilled"
                        class="text-white" size="20"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useVModel} from '@vueuse/core'
import colorFunction from 'css-color-function'

interface IThemeColors {
    id: number
    name: string
    color: string
    defaultColor: string
}

const props = defineProps<{
    themeColors: IThemeColors[]
    modelValue: number | string
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', id: number | string): void
    (event: 'change', item: IThemeColors): void
}>()

// 使用 useVModel 绑定 selectId
const selectId = useVModel(props, 'modelValue', emit)
const colorShades = ref<{ id: number; color: string }[]>([])

const selectColor = computed<string>(() => {
    return props.themeColors.find(item => item.id === selectId.value)?.color as string || ''
})

// 处理颜色选择
const handleSelect = (item: IThemeColors) => {
    selectId.value = item.id
    emit('change', item)
    generateColorShades(item.defaultColor, item.id) // 根据选择的颜色生成深浅色
}

const handleSelectItemColor = (shade: { color: string }) => {
    const item: IThemeColors = props.themeColors.find(item => item.id === selectId.value)
    item.color = shade.color
    emit('change', item)
}

const rgbToHex = (rgb: string): string => {
    const result = rgb.match(/\d+/g)
    if (!result || result.length < 3) return rgb
    const r = parseInt(result[0]).toString(16).padStart(2, '0')
    const g = parseInt(result[1]).toString(16).padStart(2, '0')
    const b = parseInt(result[2]).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
}

// 使用 css-color-function 生成颜色深浅变化
const generateColorShades = (baseColor: string, id?: number) => {
    const steps = [
        'lightness(80%)',
        'lightness(75%)',
        'lightness(65%)',
        '',
        'blackness(35%)',
        'blackness(45%)',
        'blackness(55%)',
        'blackness(65%)'
    ]

    colorShades.value = steps.map((step, index) => {
        const color = index === 3 ? baseColor : `color(${baseColor} ${step})`
        return {
            id: id ? id : selectId.value,
            color: rgbToHex(colorFunction.convert(color))
        }
    })
}

watch(selectId, (value) => {
    if (value !== -1) {
        const index = props.themeColors.findIndex(item => item.id === value)
        generateColorShades(props.themeColors[index].defaultColor)
    }
})
</script>

<style lang="scss" scoped>
.is-select {
    border: 2px solid #4153ff;
}

.unselect {
    border: 2px solid transparent;
}
</style>