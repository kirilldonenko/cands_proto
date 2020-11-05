import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/dashboard/Index'),
      children: [
        // Tables
        {
          name: 'Managing Entities',
          path: 'entities',
          component: () => import('@/dashboard/entities/Manage'),
        },
        // Dashboard
        {
          name: 'Dashboard',
          path: '/dashboard',
          component: () => import('@/dashboard/Dashboard'),
        },
        // Maps
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/dashboard/maps/GoogleMaps'),
        },
        // Pages
        // {
        //   name: 'User Profile',
        //   path: 'pages/user',
        //   component: () => import('@/views/dashboard/pages/UserProfile'),
        // },
        // {
        //   name: 'Notifications',
        //   path: 'components/notifications',
        //   component: () => import('@/views/dashboard/component/Notifications'),
        // },
        // {
        //   name: 'Icons',
        //   path: 'components/icons',
        //   component: () => import('@/views/dashboard/component/Icons'),
        // },
        // {
        //   name: 'Typography',
        //   path: 'components/typography',
        //   component: () => import('@/views/dashboard/component/Typography'),
        // },
        // Upgrade
        // {
        //   name: 'Upgrade',
        //   path: 'upgrade',
        //   component: () => import('@/views/dashboard/Upgrade'),
        // },
      ],
    },
  ],
})
