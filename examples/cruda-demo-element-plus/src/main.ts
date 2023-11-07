import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import axios from 'axios';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import CRUD from 'cruda-element-plus';

// Cruda config
import './cruda.config.ts';
// Mock data
import './mock';

createApp(App)
  .use(ElementPlus)
  // Install Cruda
  .use(CRUD, { request: axios })
  .mount('#app');
