import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import "@/assets/fonts/iconfont.css"
import "@/assets/fonts/iconfont"
import "@/styles/index.scss"
import "./main.extra"
import {createPinia} from "pinia";

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router).mount('#app')
