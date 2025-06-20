import { createRouter } from 'vue-router';
import { createWebHashHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue'),
    },
  ],
  strict: true,
});

router.beforeEach((to, from, next) => {
  next();
});

// router.afterEach((to, from) => {});

export default router;
