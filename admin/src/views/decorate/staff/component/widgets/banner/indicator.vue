<template>
    <div class="indicator" :style="{ bottom: `${bottom}px` }">
        <div
            v-if="type === 'round' || type === 'rect'"
            class="indicator-content"
            :class="{
                fillet: type === 'round',
                circle: type === 'rect'
              }"
            :style="{ textAlign: alignMap[align] }"
        >
      <span
          class="indicator-item active"
          :style="{ backgroundColor: color }"
      ></span>
            <span class="indicator-item"></span>
            <span class="indicator-item"></span>
        </div>
        <div v-if="type === 'number'" :style="{ textAlign: alignMap[align] }">
            <span class="indicator-number">1/5</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    type: {
        type: String,
        default: 'round'
    },
    align: {
        type: String,
        default: 'bottomCenter'
    },
    color: {
        type: String,
        default: '#FF2C3C'
    },
    bottom: {
        type: Number,
        default: 10
    }
})

const alignMap: Record<string, string> = {
    'bottomLeft': 'left',
    'bottomCenter': 'center',
    'bottomRight': 'right'
}
</script>

<style lang="scss" scoped>
.indicator {
    position: absolute;
    bottom: 10px;
    z-index: 99;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .indicator-item {
        display: inline-block;
        background: rgba(0, 0, 0, 0.3);

        &:not(:last-of-type) {
            margin-right: 5px;
        }
    }

    .fillet .indicator-item {
        width: 12px;
        height: 4px;
        border-radius: 3px;
    }

    .circle .indicator-item {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }

    .indicator-number {
        display: inline-block;
        min-width: 18px;
        height: 18px;
        padding: 0 6px;
        color: #fff;
        line-height: 18px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 18px;
        font-size: 12px;
    }
}
</style>