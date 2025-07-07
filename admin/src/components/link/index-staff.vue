<template>
    <div class="link flex">
        <el-menu
            :default-active="activeMenu"
            class="w-[160px] min-h-[350px] link-menu"
            @select="handleSelect"
            :default-openeds="openeds"
        >
            <el-sub-menu v-for="(item, index) in menus" :index="item.type" :key="index">
                <template #title>
                    <span>{{ item?.name }}</span>
                </template>
                <el-menu-item
                    v-for="(item1, index) in item.children"
                    :key="index"
                    :index="item1.type"
                >
                    {{ item1.name }}
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
        <div class="flex-1 pl-4">
            <staff-pages v-model="activeLink" v-if="LinkTypeEnum.STAFF_PAGES == activeMenu" />
            <custom-link v-model="activeLink" v-if="LinkTypeEnum.CUSTOM_LINK == activeMenu" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { LinkTypeEnum, type Link } from '.'
import CustomLink from './custom-link.vue'
import StaffPages from './staff-pages.vue'

const props = defineProps({
    modelValue: {
        type: Object as PropType<Link>,
        required: true
    }
})
const emit = defineEmits<{
    (event: 'update:modelValue', value: any): void
}>()

const menus = ref([
    {
        name: '商城页面',
        type: 'index',
        // link:{},
        children: [
            {
                name: '基础页面',
                type: LinkTypeEnum.STAFF_PAGES,
                link: {}
            }
        ]
    },
    {
        name: '其他',
        type: 'order',
        // type: LinkTypeEnum.CUSTOM_LINK,
        // link: {},
        children: [
            {
                name: '自定义链接',
                type: LinkTypeEnum.CUSTOM_LINK,
                link: {}
            }
        ]
    }
])
// 只能展开第一级
const openeds = computed(() => menus.value.map((item) => item.type))

const activeLink = computed({
    get() {
        return menus.value
            .find((item) => item.children.find((item1) => item1.type == activeMenu.value))
            ?.children.find((item) => item.type == activeMenu.value)?.link as Link
    },
    set(value) {
        menus.value.forEach((item) => {
            item.children.forEach((item1) => {
                if (item1.type == activeMenu.value) {
                    item1.link = value
                }
            })
        })
    }
})

const activeMenu = ref<string>(LinkTypeEnum.STAFF_PAGES)

const handleSelect = (index: string) => {
    activeMenu.value = index
}

watch(activeLink, (value) => {
    if (!value.type) return
    emit('update:modelValue', value)
})

watch(
    () => props.modelValue,
    (value) => {
        activeMenu.value = value.type
        activeLink.value = value
    },
    {
        immediate: true
    }
)
</script>

<style lang="scss" scoped>
.link-menu {
    --el-menu-item-height: 40px;
    overflow-x: hidden !important;
    :deep(.el-menu-item) {
        border-color: transparent;
        min-width: 0;
        margin-left: -26px;
        &.is-active {
            border-right-width: 2px;
            border-color: var(--el-color-primary);
            background-color: var(--el-color-primary-light-9);
        }
    }
}
</style>
