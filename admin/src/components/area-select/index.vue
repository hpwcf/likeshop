<template>
    <div class="area-select">
        <el-cascader
            :style="{ width }"
            v-model="areaValue"
            :options="props.data"
            :props="props2"
        ></el-cascader>
    </div>
</template>

<script lang="ts" setup>
import area from '@/utils/area'
import { ref, computed } from 'vue'

/** Emit Start **/
const emit = defineEmits(['update:province', 'update:city', 'update:district'])
/** Emit End **/

/** Props Start **/
const props = withDefaults(
    defineProps<{
        province?: any
        city: any
        district: any
        width: string
        checkStrictly: boolean
        data: Array<any>
    }>(),
    {
        province: null,
        city: null,
        district: null,
        width: '340px',
        checkStrictly: true,
        data: area as any
    }
)

const props2 = {
    checkStrictly: true
}
/** Props End **/

/** Data End **/
// const options = props.data // 地区列表
/** Data Start **/

/** Computed Start **/
// 更新绑定数据
const areaValue = computed({
    get: () => {
        return [props.province, props.city, props.district]
    },
    set: (value: any) => {
        emit('update:province', value[0])
        emit('update:city', value[1])
        emit('update:district', value[2])
    }
})
/** Computed Start **/
</script>
