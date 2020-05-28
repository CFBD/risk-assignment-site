import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Tallies from './views/Tallies.vue';
import Assignments from './views/Assignments.vue';

Vue.use(Router);

/* eslint-disable indent */

let routes = [{
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/tallies',
        name: 'tallies',
        component: Tallies
    },
    {
        path: '/assignments',
        name: 'assignments',
        component: Assignments
    }
];

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
