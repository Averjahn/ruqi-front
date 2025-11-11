const i = (str) => () => import(`@/pages${str}`)

export const routes = [
  // ui-new routes
  { path: '/ui-new', component: i('/ui-new/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/atoms', component: i('/ui-new/atoms/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/molecules', component: i('/ui-new/molecules/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/profile', component: i('/ui-new/profile/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/FAQ', component: i('/ui-new/FAQ/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/document-templates', component: i('/ui-new/document-templates/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/organisation-data', component: i('/ui-new/organisation-data/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/notifications', component: i('/client/notifications/index.vue'), meta: { layout: 'EmptyLayout' } },
  
  // client routes
  { path: '/client/signin', component: i('/signin/index.vue'), meta: { layout: 'EmptyLayout' } },
  { path: '/client/signup', component: i('/signup/index.vue'), meta: { layout: 'EmptyLayout' } },
  { path: '/client/signin-recovery', component: i('/signin-recover/index.vue'), meta: { layout: 'EmptyLayout' } },
  {
    path: '/client/organisationData',
    component: i('/organisationData/index.vue'),
    meta: { layout: 'EmptyLayout' },
  },
  
  // redirects
  { path: '/welcome-prompt', redirect: '/ui-new/profile' },
]
