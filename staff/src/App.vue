<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useAppStore } from './stores/app'
import { useUserStore } from './stores/user'
import { getClient } from '@/utils/client'
import { useRoute, useRouter } from 'uniapp-router-next'
import { useThemeStore } from './stores/theme'

const appStore = useAppStore()
const { getUser } = useUserStore()
const { getTheme } = useThemeStore()
const router = useRouter()
const route = useRoute()

//#ifdef H5
const setH5WebIcon = () => {
    // const config = computed(() => appStore.config)
    // let favicon: HTMLLinkElement = document.querySelector('link[rel="icon"]')!
    // if (favicon) {
    //     favicon.href = config.staff_logo
    //     return
    // }
    // favicon = document.createElement('link')
    // favicon.rel = 'icon'
    // favicon.href = config.staff_logo
    // document.head.appendChild(favicon)
}
//#endif

onLaunch(async () => {
    appStore.getKefuInfo()
    await appStore.getConfig()
    //#ifdef H5
    setH5WebIcon()
    //#endif
    await getUser()
    await appStore.getLocationFunc()
    appStore.getSystemInfo()
	getTheme()
})
</script>
<style lang="scss">
//
</style>
