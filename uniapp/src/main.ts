import { createSSRApp } from 'vue'
import App from './App.vue'
import plugins from './plugins'
// import { setupRouter } from './router'
import './styles/index.scss'
import share from '@/utils/share'
import { setupMixin } from './mixins'
import router from './router'

export function createApp() {
    const app = createSSRApp(App)
    setupMixin(app)

    // Promise.resolve().then(() => {
    //     setupRouter()
    // })
    app.use(plugins)
    app.mixin(share)
    app.use(router)
    return {
        app
    }
}
