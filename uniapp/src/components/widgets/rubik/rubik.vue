<template>
    <widget-root :styles="styles">
        <div class="rubik">
            <div class="rubik-item1" v-if="content.style == 1">
                <div
                    class="item-image overflow-hidden"
                    :style="{
                        'border': `${styles.image_gap}rpx solid transparent`
                    }"
                    v-if="imgLists[0] && imgLists[0].url"
                    @click="handleClick(imgLists[0])"
                >
                    <u-image mode="widthFix" :show-loading="false" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="getImageUrl(imgLists[0].url)"></u-image>
                </div>
                <u-image v-else style="height: 375px; width: 100%">
                    <template #error>
                        <div class="flex justify-center items-center w-full h-full">
                            <u-icon name="iicture" size="40" color="#999"></u-icon>
                        </div>
                    </template>
                </u-image>
            </div>
            <div class="rubik-item2" v-if="content.style == 2">
                <div
                    class="item-image overflow-hidden"
                    v-for="(item, index) in imgLists"
                    :key="index"
                    :style="{
                        'border': `${styles.image_gap}rpx solid transparent`
                    }"
                    @click="handleClick(item)"
                >
                    <u-image mode="widthFix" :show-loading="false" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="getImageUrl(item.url)" v-if="item && item.url"></u-image>
                </div>
            </div>
            <div class="rubik-item3" v-if="content.style == 3">
                <div
                    class="item-image overflow-hidden"
                    v-for="(item, index) in imgLists"
                    :key="index"
                    :style="{
                        'border': `${styles.image_gap}rpx solid transparent`
                    }"
                    @click="handleClick(item)"
                >
                    <u-image mode="widthFix" :show-loading="false" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="getImageUrl(item.url)" v-if="item && item.url"></u-image>
                </div>
            </div>
            <div class="rubik-item4 h-[750rpx]" v-if="content.style == 4">
                <div class="w-1/2">
                    <div
                        class="box-border overflow-hidden h-full"
                        :style="{
                            'border': `${styles.image_gap}rpx solid transparent`
                        }"
                        @click="handleClick(imgLists[0])"
                    >
                        <u-image width="100%" height="100%" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="imgLists[0] && getImageUrl(imgLists[0].url)">
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                    <Icon name="local-icon-Frame" size="50"/>
                                </div>
                            </template>
                        </u-image>
                    </div>
                </div>
                <div class="w-1/2 flex flex-col">
                    <div
                        class="box-border overflow-hidden"
                        :style="{
                            'height': '375rpx',
                            'border': `${styles.image_gap}rpx solid transparent`
                        }"
                        @click="handleClick(imgLists[1])"
                    >
                        <u-image width="100%"  height="100%" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="imgLists[1] && getImageUrl(imgLists[1].url)">
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                    <Icon name="local-icon-Frame" size="50"/>
                                </div>
                            </template>
                        </u-image>
                    </div>
                    <div
                        class="box-border overflow-hidden"
                        :style="{
                            'height': '375rpx',
                            'border': `${styles.image_gap}rpx solid transparent`
                        }"
                        @click="handleClick(imgLists[2])"
                    >
                        <u-image width="100%" height="100%" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="imgLists[2] && getImageUrl(imgLists[2].url)">
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                    <Icon name="local-icon-Frame" size="50"/>
                                </div>
                            </template>
                        </u-image>
                    </div>
                </div>
            </div>
            <div class="rubik-item5 h-[750rpx]" v-if="content.style == 5">
                <div
                    class="item-image overflow-hidden" v-for="(item, index) in imgLists"
                    :key="index"
                    :style="{
                        'border': `${styles.image_gap}rpx solid transparent`
                    }"
                    @click="handleClick(item)"
                >
                    <u-image width="100%" height="100%" fit="cover" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="item && getImageUrl(item.url)">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </u-image>
                </div>
            </div>
            <div class="rubik-item6" v-if="content.style == 6">
                <div
                    class="item-image overflow-hidden"
                    :style="{
                        'height': '188rpx',
                        'border': `${styles.image_gap}rpx solid transparent`
                    }"
                    @click="handleClick(imgLists[0])"
                >
                    <u-image width="100%" height="188" fit="cover" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="imgLists[0] && getImageUrl(imgLists[0].url)">
                        <template #error>
                            <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                <Icon name="local-icon-Frame" size="50"/>
                            </div>
                        </template>
                    </u-image>
                </div>
                <div class="flex">
                    <div
                        class="item-image overflow-hidden"
                        :style="{
                            width: '100%',
                            margin: `${styles.image_gap}rpx`
                        }"
                        @click="handleClick(imgLists[1])"
                    >
                        <u-image width="100%" height="188" fit="cover" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="imgLists[1] && getImageUrl(imgLists[1].url)">
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                    <Icon name="local-icon-Frame" size="50"/>
                                </div>
                            </template>
                        </u-image>
                    </div>
                    <div
                        class="item-image overflow-hidden"
                        :style="{
                            width: '100%',
                            margin: `${styles.image_gap}rpx`
                        }"
                        @click="handleClick(imgLists[2])"
                    >
                        <u-image width="100%" height="188" fit="cover" :border-radius="`${styles.border_top_radius}rpx ${styles.border_top_radius}rpx ${styles.border_bottom_radius}rpx ${styles.border_bottom_radius}rpx`" :src="imgLists[2] && getImageUrl(imgLists[2].url)">
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-[#F6FAFE]">
                                    <Icon name="local-icon-Frame" size="50"/>
                                </div>
                            </template>
                        </u-image>
                    </div>
                </div>
            </div>
        </div>
    </widget-root>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useAppStore} from "@/stores/app";
import {navigateTo, type Link} from "@/utils/util";

const props = defineProps({
    content: {
        type: Object,
        default: () => ({})
    },
    styles: {
        type: Object,
        default: () => ({})
    },
    isLargeScreen: {
        type: Boolean
    }
})
const {getImageUrl} = useAppStore();

const imgLists = computed(() => {
    return props.content.data
})

const handleClick = (row: { link: Link }) => {
    navigateTo(row.link)
}
</script>

<style lang="scss" scoped>
.rubik {
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
        display: flex;
        //height: 190px;

        .item-image {
            width: 100%;
        }
    }

    .rubik-item6 {
        width: 100%;

    }

    .rubik-item5 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);

        .item-image {
            flex: 1 1 auto;
        }
    }
}
</style>