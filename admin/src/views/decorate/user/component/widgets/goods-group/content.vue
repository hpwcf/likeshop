<template>
    <div class="goods-group p-2">
        <div
            class="goods-lists"
            :class="{
                larger: content.goods_type == 4,
                perline: content.goods_type == 2,
                swiper: content.goods_type == 3,
                lists: content.goods_type == 1
            }"
        >
            <div class="goods-wrap mb-2" v-for="(item, index) in goods" :key="index">
                <div class="goods-item">
                    <div class="goods-image flex-none">
                        <el-image :src="item?.image" fit="cover">
                            <template #error>
                                <img class="image-error" src="@/assets/images/goods_image.png" alt=""/>
                            </template>
                        </el-image>
                    </div>
                    <div
                        class="goods-info w-full"
                        :class="{
                            'p-3': content.goods_type === 1,
                            'mt-2': content.goods_type === 2
                        }"
                    >
                        <!--    非大图样式下显示    -->
                        <template v-if="content.goods_type !== 4">
                            <div v-if="content.show_title" class="mb-1 name" :style="{ color: styles.title_color }">
                                <div :class="content.style == 3 ? 'line-clamp-2' : 'line-clamp-1'">
                                    {{ item.name || '这里是商品标题中式推拿，泰式按摩' }}
                                </div>
                            </div>
                            <div
                                v-if="content.show_server"
                                class="text-xs mb-1"
                                :style="{ color: styles.server_color }"
                                :class="{ 'mt-4': content.goods_type === 1 }"
                            >
                                服务时间：<span class="text-[#59b870] font-medium">{{ item.server_time || '60' }}</span>分钟
                            </div>
                        </template>

                        <div class="flex price-btn items-center justify-between">
                            <div class="flex-1 flex items-baseline">
                                <div
                                    v-if="content.show_price"
                                    class="price font-medium mr-1"
                                    :style="{ color: styles.price_color }"
                                >
                                    <span class="xs">￥</span>{{ parseFloat(item.sell_price) || '0' }}
                                </div>
                                <div
                                    class="line-through text-xs"
                                    :style="{ color: styles.scribing_price_color }"
                                    v-if="content.show_scribing_price"
                                >
                                    ￥{{ parseFloat(item.lineation_price) || '0' }}
                                </div>
                            </div>
                            <div v-if="content.show_sales" class="text-tx-secondary text-xs">已售200</div>
                        </div>

                        <!--    大图样式下显示    -->
                        <template v-if="content.goods_type === 4">
                            <div
                                v-if="content.show_server"
                                class="text-xs mt-3"
                                :style="{ color: styles.server_color }"
                            >
                                服务时间：<span class="text-[#59b870] font-medium">{{ item.server_time || '60' }}</span>分钟
                            </div>
                            <div class="flex justify-between items-center mt-3">
                                <div
                                    v-if="content.show_title"
                                    class="mb-1 name"
                                    style="width: 250px;"
                                    :style="{ color: styles.title_color }"
                                >
                                    <div class="line-clamp-2">
                                        {{ item.name || '这里是商品标题中式推拿，泰式按摩SPA, SPA' }}
                                    </div>
                                </div>
                                <div
                                    class="buy-btn text-xs"
                                    :style="{ 'border-radius': `${styles.btn_radius/2}px` }"
                                >
                                    {{ content.btn_text }}
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <!--    单列样式下显示    -->
                <div
                    class="flex justify-between items-center mt-2"
                    v-if="content.goods_type == 1"
                >
                    <div
                        class="text-tx-secondary text-xs"
                        v-if="content.show_sales"
                    >
                        超20人选择
                    </div>
                    <div
                        class="buy-btn text-xs"
                        :style="{ 'border-radius': `${styles.btn_radius/2}px` }"
                    >
                        {{ content.btn_text }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type options from './options'

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

const goods = computed(() => {
    const { data, style, category } = props.content
    if (style == 2) {
        return [...Array(category.num).keys()].map(() => ({}))
    }
    return data.length ? data : [{}, {}, {}, {}]
})
</script>

<style lang="scss" scoped>
.goods-group {
    overflow: hidden;
    .goods-lists {
        overflow: hidden;
        &.larger {
            padding: 10px;
            .goods-wrap {
                .goods-item {
                    .goods-info {
                        padding: 10px;
                        background-color: #ffffff;
                        border-radius: 0 0 12px 12px;
                    }
                    .goods-image {
                        padding-top: 66%;
                        overflow: hidden;
                        border-radius: 10px 10px 0 0;
                    }
                }
            }
        }

        &.perline {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            //padding: 0 10px;
            column-gap: 10px;
            .goods-wrap {
                .goods-item {
                    padding: 10px;
                    background-color: #ffffff;
                    border-radius: 12px;

                    .goods-image {
                        overflow: hidden;
                        border-radius: 10px;
                    }
                }
            }
        }
        &.swiper {
            display: flex;
            column-gap: 10px;
            .goods-wrap {
                flex: 0 0 40%;
                width: 40%;
                .goods-image {
                    overflow: hidden;
                    border-radius: 10px 10px 0 0;
                }
                .goods-info {
                    padding: 10px;
                    background-color: #ffffff;
                    border-radius: 0 0 12px 12px;
                }
            }
        }
        &.lists {
            .goods-wrap {
                padding: 10px;
                background-color: #ffffff;
                border-radius: 12px;
                .goods-item {
                    flex-direction: row;
                    .goods-image {
                        width: 120px;
                        padding-top: 120px;
                        overflow: hidden;
                        border-radius: 10px;
                    }
                    .goods-info {
                        position: relative;
                        padding: 10px;
                        .name {
                            font-size: 14px;
                            font-weight: 500;
                        }
                        .price-btn {
                            position: absolute;
                            right: 10px;
                            left: 10px;
                            bottom: 10px;
                        }
                    }
                }
            }
        }
        .goods-wrap {
            overflow: hidden;
            .goods-item {
                overflow: hidden;
                display: flex;
                flex-direction: column;
                .goods-image {
                    position: relative;
                    width: 100%;
                    padding-top: 100%;
                    .el-image {
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        .image-error {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }
            }
        }
        .buy-btn {
            flex: none;
            background: #59b870;
            height: 26px;
            padding: 2px 16px;
            color: #fff;
            border-radius: 2px;
            border: 1px solid transparent;
        }
    }
}
</style>