<template>
    <div class="flex flex-col">
        <!-- 服务选择框 Start -->
        <service-popup v-model="selectData">
            <slot name="popup"></slot>
        </service-popup>
        <!-- 服务选择框 End -->

        <!-- Table Start -->
        <table-detail v-model="selectData" :disabled="disabled"></table-detail>
        <!-- Table End -->
    </div>
</template>

<script lang="ts" setup>
import { withDefaults, computed } from 'vue'
import servicePopup from './service-popup.vue'
import tableDetail from './table-detail.vue'

/** Props Start **/
const props = withDefaults(
    defineProps<{
        modelValue?: any
        selectData: any
        disabled?: boolean
    }>(),
    {
        modelValue: [],
        selectData: [],
        disabled: false
    }
)
/** Props End **/

/** Emit Start **/
const emit = defineEmits(['update:modelValue', 'update:selectData'])
/** Emit End **/

/** Computed Start **/
const selectData: any = computed({
    get: () => {
        return props.selectData || []
    },
    set: (value) => {
        emit(
            'update:modelValue',
            value.map((item: Event | any) => item.id)
        )
        emit('update:selectData', value)
    }
})
/** Computed End **/
</script>

<!-- <style lang="scss" scoped>
.move {
    @media screen and (max-width: 1536px) {
        @apply overflow-scroll;
    }
}
</style> -->
