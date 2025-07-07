import { createSSRApp } from 'vue'
import App from './App.vue'
import plugins from './plugins'
import './styles/index.scss'
import share from '@/utils/share'
import router from './router'
import { setupMixin } from './mixins'

export function createApp() {
    const app = createSSRApp(App)
    setupMixin(app)
    app.use(plugins)
    // app.mixin(share)
    app.use(router)
    return {
        app
    }
}
