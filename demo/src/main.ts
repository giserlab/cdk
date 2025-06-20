import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/index';
import SvgIcon from '@/components/SvgIcon.vue';
import pinia from './store';
// @ts-ignore
import 'virtual:svg-icons-register';
// @ts-ignore
import '@/assets/styles/style.css';
// @ts-ignore
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(router);
app.use(pinia);
app.component('SvgIcon', SvgIcon);
app.mount('#app');
