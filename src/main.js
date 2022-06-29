import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './registerServiceWorker'


import '@/assets/style/font.css';
const app = createApp(App);
app.use(ElementPlus);
app.use(router);

app.use(mavonEditor);

app.mount('#app');

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}