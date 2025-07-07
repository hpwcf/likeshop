<template>
    <widget-root :styles="styles">
        <div class="rubik" :style="{ height: `${content.style === 4 || content.style === 5 ? '340px' : '100%' }` }">
            <div class="rubik-item1" v-if="content.style == 1">
                <div
                    class="item-image"
                    :style="{ 
                        'border': `${styles.image_gap / 2}px solid transparent`
                    }"
                    v-if="imgLists[0] && imgLists[0].url"
                >
                    <el-image
                        fit="cover"
                        :style="{
                            'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                        }"
                        :src="getImageUrl(imgLists[0].url)"></el-image
                    >
                </div>
                <el-image v-else style="height: 375px; width: 100%">
                    <template #error>
                        <div class="flex justify-center items-center w-full h-full">
                            <Icon name="el-icon-Picture" size="40" color="#999"></Icon>
                        </div>
                    </template>
                </el-image>
            </div>
            <div class="rubik-item2" v-if="content.style == 2">
                <div
                    class="item-image"
                    v-for="(item, index) in imgLists"
                    :key="index"
                    :style="{ 
                        'border': `${styles.image_gap / 2}px solid transparent`
                    }"
                >
                    <el-image
                        fit="cover"
                        :style="{
                            'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                        }"
                        :src="getImageUrl(item.url)" v-if="item && item.url"></el-image
                    >
                    <el-image v-else style="height: 188px; width: 100%">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
            <div class="rubik-item3" v-if="content.style == 3">
                <div
                    class="item-image"
                    v-for="(item, index) in imgLists"
                    :key="index"
                    :style="{ 
                        'border': `${styles.image_gap / 2}px solid transparent`
                    }"
                >
                    <el-image
                        fit="cover"
                        :style="{
                            'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                        }"
                        :src="getImageUrl(item.url)" v-if="item && item.url"></el-image
                    >
                    <el-image v-else style="height: 125px; width: 100%">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
            <div class="rubik-item4 flex h-full" v-if="content.style == 4">
                <div
                    class="item-image"
                    :style="{
                        width: '50%',
                        'border': `${styles.image_gap / 2}px solid transparent`
                    }"
                >
                    <el-image
                        fit="cover"
                        :style="{
                            'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                        }"
                        :src="imgLists[0] && getImageUrl(imgLists[0].url)"
                    >
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
                <div class="w-1/2 flex flex-col">
                    <div
                        class="item-image box-border"
                        :style="{
                            'border': `${styles.image_gap / 2}px solid transparent`
                        }"
                    >
                        <el-image
                            fit="cover"
                            :style="{
                                'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                            }"
                            :src="imgLists[1] && getImageUrl(imgLists[1].url)"
                        >
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                    <Icon name="local-icon-Frame" size="50"/>
                                </div>
                            </template>
                        </el-image>
                    </div>
                    <div
                        class="item-image box-border"
                        :style="{
                            'border': `${styles.image_gap / 2}px solid transparent`
                        }"
                    >
                        <el-image
                            fit="cover"
                            :style="{
                                'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                            }"
                            :src="imgLists[2] && getImageUrl(imgLists[2].url)"
                        >
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                    <Icon name="local-icon-Frame" size="50"/>
                                </div>
                            </template>
                        </el-image>
                    </div>
                </div>
            </div>
            <div class="rubik-item5" v-if="content.style == 5">
                <div
                    v-for="(item, index) in imgLists"
                    :key="index"
                    class="item-image"
                    :style="{
                        'border': `${styles.image_gap / 2}px solid transparent`
                    }"
                >
                    <el-image
                        fit="cover"
                        :style="{
                            'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                        }"
                        :src="item && getImageUrl(item.url)"
                    >
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
            <div class="rubik-item6" v-if="content.style == 6">
                <div
                    class="item-image"
                    :style="{
                        'height': '108px',
                        'border': `${styles.image_gap / 2}px solid transparent`
                    }"
                >
                    <el-image
                        fit="cover"
                        :style="{
                            'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                        }"
                        :src="imgLists[0] && getImageUrl(imgLists[0].url)"
                    >
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </el-image>
                </div>
                <div class="grid grid-cols-2">
                    <div
                        class="item-image h-full"
                        :style="{
                            'height': '108px',
                            
                        'border': `${styles.image_gap / 2}px solid transparent`
                                            }"
                    >
                        <el-image
                            fit="cover"
                            :style="{
                                'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                            }"
                            :src="imgLists[1] && getImageUrl(imgLists[1].url)"
                        >
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                    <Icon name="local-icon-Frame" size="50"/>
                                </div>
                            </template>
                        </el-image>
                    </div>
                    <div
                        class="item-image"
                        :style="{
                            'height': '108px',
                            
                        'border': `${styles.image_gap / 2}px solid transparent`
                                            }"
                    >
                        <el-image
                            fit="cover"
                            :style="{
                                'border-radius': `${styles.border_top_radius / 2}px ${styles.border_top_radius / 2}px ${styles.border_bottom_radius / 2}px ${styles.border_bottom_radius / 2}px`,
                            }"
                            :src="imgLists[2] && getImageUrl(imgLists[2].url)"
                        >
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                    <Icon name="local-icon-Frame" size="50"/>
                                </div>
                            </template>
                        </el-image>
                    </div>
                </div>
            </div>
        </div>
    </widget-root>
</template>
<script lang="ts" setup>
import type {PropType} from 'vue'
import type options from './options'
import useAppStore from "@/stores/modules/app";
import WidgetRoot from '../widget-root.vue'

type OptionsType = ReturnType<typeof options>
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
const {getImageUrl} = useAppStore()

const imgLists = computed(() => props.content.data || [])
</script>

<style lang="scss" scoped>
.rubik {
    .el-image {
        display: block;
    }

    .rubik-item1{
        display: flex;
        .item-image {
            flex: 1 1 auto;
        }
    }

    .rubik-item2 {
        display: flex;

        .item-image {
            flex: 1 1 auto;
            width: 50%;
        }
    }

    .rubik-item3 {
        display: flex;

        .item-image {
            flex: 1 1 auto;
            width: 33.3%;
        }
    }

    .rubik-item4 {
        position: relative;
        width: 100%;
        //height: 190px;

        .item-image {
            .el-image {
                height: 100%;
            }
        }
    }

    .rubik-item6 {
        width: 100%;

        .item-image {
            .el-image {
                height: 100%;
            }
        }
    }

    .rubik-item5 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        height: 100%;

        .item-image {
            flex: none;
            height: 165px;

            .el-image {
                height: 100%;
            }
        }
    }
}
</style>
