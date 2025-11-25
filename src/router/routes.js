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
  { path: '/ui-new/platform-documents', component: i('/ui-new/platform-documents/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/objects', component: i('/ui-new/objects/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/objects/create', component: i('/ui-new/objects/create.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/objects/create-vacancy', component: i('/ui-new/objects/create-vacancy.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/applications', component: i('/ui-new/applications/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/applications/create', component: i('/ui-new/applications/create.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/ui-new/notifications', component: i('/client/notifications/index.vue'), meta: { layout: 'EmptyLayout' } },
  
  // client routes - всегда доступны без авторизации
  { path: '/client/signin', component: i('/signin/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/client/signup', component: i('/signup/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  { path: '/client/signin-recovery', component: i('/signin-recover/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
  {
    path: '/client/organisationData',
    component: i('/organisationData/index.vue'),
    meta: { requiresAuth: false, layout: 'EmptyLayout' },
  },
  
  // redirects
  { path: '/welcome-prompt', redirect: '/ui-new/profile' },
  
  // catch-all route для 404
  { path: '/:pathMatch(.*)*', component: i('/404/index.vue'), meta: { requiresAuth: false, layout: 'EmptyLayout' } },
]
