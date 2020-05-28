import Vue from 'vue';
import './plugins/bootstrap-vue';
import './plugins/axios';
import './plugins/fontawesome';
import './plugins/websockets';
import './plugins/vue-spinners';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;
Vue.config.devtools = process.env.DEV_TOOLS === 'development';

Vue.prototype.$team = "RISK_TEAM";;

new Vue({
    router,
    render: (h) => h(App)
}).$mount('#app');
