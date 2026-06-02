const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LandingPage.vue'),
      },
      {
        path: 'features',
        component: () => import('pages/FeaturesPage.vue'),
      },
      {
        path: 'security',
        component: () => import('pages/SecurityPage.vue'),
      },
      {
        path: 'pricing',
        component: () => import('pages/PricingPage.vue'),
      },
      {
        path: 'faq',
        component: () => import('pages/FAQPage.vue'),
      },
      {
        path: 'contact',
        component: () => import('pages/ContactPage.vue'),
      },
    ],
  },

  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'signup',
        component: () => import('pages/SignupPage.vue'),
      },
    ],
  },

  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard/vault',
      },
      {
        path: 'vault',
        component: () => import('pages/VaultPage.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
